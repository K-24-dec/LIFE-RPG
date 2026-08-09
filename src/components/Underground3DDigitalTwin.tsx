import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { UndergroundAsset, UndergroundUtilityType } from '../types/underground';
import { UTILITY_COLORS, UTILITY_NAMES } from '../data/undergroundData';
import {
  Layers,
  Eye,
  Maximize2,
  Compass,
  AlertTriangle,
  Info,
  Sliders,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
  RotateCcw,
  Scan,
  ShieldAlert,
  Play,
  Pause,
  ArrowRight,
  Split,
  MousePointer,
  HelpCircle,
} from 'lucide-react';

interface Underground3DDigitalTwinProps {
  assets: UndergroundAsset[];
  selectedAssetId?: string;
  onSelectAsset?: (asset: UndergroundAsset) => void;
  highlightClashes?: boolean;
  activeDepthFilter?: number; // Cutoff depth in meters (0 to 25)
}

export const Underground3DDigitalTwin: React.FC<Underground3DDigitalTwinProps> = ({
  assets,
  selectedAssetId,
  onSelectAsset,
  highlightClashes = true,
  activeDepthFilter = 25,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const meshesGroupRef = useRef<THREE.Group | null>(null);
  const laserBeamRef = useRef<THREE.Mesh | null>(null);
  const flowParticlesGroupRef = useRef<THREE.Group | null>(null);
  const metroTrainRef = useRef<THREE.Mesh | null>(null);
  const aiBypassMeshGroupRef = useRef<THREE.Group | null>(null);

  const [activeAsset, setActiveAsset] = useState<UndergroundAsset | null>(
    assets.find((a) => a.id === selectedAssetId) || assets[0] || null
  );
  const [hoveredAsset, setHoveredAsset] = useState<UndergroundAsset | null>(null);
  const [cameraPreset, setCameraPreset] = useState<'iso' | 'top' | 'front' | 'cross'>('iso');
  const [depthCutoff, setDepthCutoff] = useState<number>(activeDepthFilter);
  const [showLaserScanner, setShowLaserScanner] = useState<boolean>(true);
  const [showStrataPlanes, setShowStrataPlanes] = useState<boolean>(true);
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [aiBypassActive, setAiBypassActive] = useState<boolean>(false);
  const [aiScanStatus, setAiScanStatus] = useState<string>('Sub-surface 3D Mesh Ready. 0 Critical Structural Collisions detected.');
  const [clashCount, setClashCount] = useState<number>(0);
  const [laserYPosition, setLaserYPosition] = useState<number>(0);

  // Initialize Three.js Scene with OrbitControls and Raycaster
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 550;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d); // High-contrast dark blueprint navy canvas
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.008);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(38, 28, 48);
    camera.lookAt(0, -5, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Orbit Controls (Smooth mouse drag, pan, zoom)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // Limit below ground flipping
    controls.minDistance = 10;
    controls.maxDistance = 180;
    controls.target.set(0, -5, 0);
    controls.update();
    controlsRef.current = controls;

    // 5. Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight1.position.set(30, 50, 40);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.6);
    dirLight2.position.set(-30, -20, -30);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x10b981, 1.5, 60);
    pointLight.position.set(0, -2, 0);
    scene.add(pointLight);

    // 6. Ground Surface & Asphalt Road Network Grid
    const gridHelper = new THREE.GridHelper(90, 45, 0x1e293b, 0x0f172a);
    gridHelper.position.y = 0; // Ground Surface Level
    scene.add(gridHelper);

    // Asphalt Surface Mesh
    const roadGeo = new THREE.PlaneGeometry(90, 90);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x131a28,
      transparent: true,
      opacity: 0.85,
      roughness: 0.8,
      side: THREE.DoubleSide,
    });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.position.y = 0.01;
    scene.add(roadMesh);

    // 7. Subterranean Strata Layers
    const strataGroup = new THREE.Group();
    strataGroup.name = 'strata_group';

    const createStrataLayer = (y: number, color: number, opacity: number, label: string) => {
      const pGeo = new THREE.PlaneGeometry(90, 90);
      const pMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: opacity,
        side: THREE.DoubleSide,
        wireframe: true,
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.rotation.x = -Math.PI / 2;
      pMesh.position.y = y;
      pMesh.name = `strata_${y}`;
      strataGroup.add(pMesh);
    };

    createStrataLayer(-2, 0x0284c7, 0.12, '-2m Topsoil & Drainage');
    createStrataLayer(-6, 0x9333ea, 0.08, '-6m Clay & Utility Duct Strata');
    createStrataLayer(-12, 0x334155, 0.06, '-12m Gravel & Metro Tunnel Level');
    createStrataLayer(-20, 0x0f172a, 0.04, '-20m Deep Bedrock Foundation');

    scene.add(strataGroup);

    // 8. Animated Sub-surface Laser Scanner Beam Plane
    const laserGeo = new THREE.PlaneGeometry(90, 90);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
      wireframe: false,
    });
    const laserMesh = new THREE.Mesh(laserGeo, laserMat);
    laserMesh.rotation.x = -Math.PI / 2;
    laserMesh.position.y = 0;
    scene.add(laserMesh);
    laserBeamRef.current = laserMesh;

    // Laser border line ring
    const laserEdges = new THREE.EdgesGeometry(laserGeo);
    const laserLineMat = new THREE.LineBasicMaterial({ color: 0x34d399, linewidth: 2 });
    const laserLine = new THREE.LineSegments(laserEdges, laserLineMat);
    laserMesh.add(laserLine);

    // 9. Group for Asset Meshes
    const meshesGroup = new THREE.Group();
    meshesGroup.name = 'asset_meshes';
    scene.add(meshesGroup);
    meshesGroupRef.current = meshesGroup;

    // 10. Group for AI Bypass Reroute Meshes
    const aiBypassGroup = new THREE.Group();
    aiBypassGroup.name = 'ai_bypass_group';
    scene.add(aiBypassGroup);
    aiBypassMeshGroupRef.current = aiBypassGroup;

    // 11. Flow Particles Group
    const flowGroup = new THREE.Group();
    scene.add(flowGroup);
    flowParticlesGroupRef.current = flowGroup;

    // 12. Raycasting Mouse Selection Setup
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      if (!mountRef.current || !cameraRef.current || !meshesGroupRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(meshesGroupRef.current.children, true);

      if (intersects.length > 0) {
        let foundObj = intersects[0].object;
        while (foundObj && !foundObj.userData?.assetId && foundObj.parent) {
          foundObj = foundObj.parent as THREE.Object3D;
        }

        if (foundObj && foundObj.userData?.assetId) {
          const matched = assets.find((a) => a.id === foundObj.userData.assetId);
          if (matched) {
            setHoveredAsset(matched);
            mountRef.current.style.cursor = 'pointer';
            return;
          }
        }
      }

      setHoveredAsset(null);
      if (mountRef.current) mountRef.current.style.cursor = 'grab';
    };

    const handlePointerClick = (e: MouseEvent) => {
      if (!mountRef.current || !cameraRef.current || !meshesGroupRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(meshesGroupRef.current.children, true);

      if (intersects.length > 0) {
        let foundObj = intersects[0].object;
        while (foundObj && !foundObj.userData?.assetId && foundObj.parent) {
          foundObj = foundObj.parent as THREE.Object3D;
        }

        if (foundObj && foundObj.userData?.assetId) {
          const matched = assets.find((a) => a.id === foundObj.userData.assetId);
          if (matched) {
            setActiveAsset(matched);
            if (onSelectAsset) onSelectAsset(matched);
          }
        }
      }
    };

    const domElem = mountRef.current;
    domElem.addEventListener('mousemove', handlePointerMove);
    domElem.addEventListener('click', handlePointerClick);

    // 13. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    let laserDir = -1; // Sweeping down
    let laserY = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Update OrbitControls
      if (controlsRef.current) {
        controlsRef.current.autoRotate = isRotating;
        controlsRef.current.autoRotateSpeed = 2.0;
        controlsRef.current.update();
      }

      // Animate Laser Scanner Beam Sweep
      if (laserBeamRef.current && showLaserScanner) {
        laserY += laserDir * 0.08;
        if (laserY < -22) laserDir = 1;
        if (laserY > 0) laserDir = -1;
        laserBeamRef.current.position.y = laserY;
        setLaserYPosition(Math.abs(Math.round(laserY * 10) / 10));
      } else if (laserBeamRef.current) {
        laserBeamRef.current.position.y = -999;
      }

      // Pulse Animated Clash Wireframes & Glowing Rings
      scene.traverse((obj) => {
        if (obj.name === 'clash_box') {
          const mat = (obj as THREE.Mesh).material as THREE.MeshBasicMaterial;
          if (mat) {
            mat.opacity = 0.4 + Math.sin(elapsedTime * 8) * 0.35;
          }
        }
        if (obj.name === 'flow_pulse') {
          obj.position.x += Math.sin(elapsedTime * 2) * 0.05;
        }
      });

      // Animate Metro Train if present
      if (metroTrainRef.current) {
        metroTrainRef.current.position.x = Math.sin(elapsedTime * 0.8) * 25;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 550;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('mousemove', handlePointerMove);
      domElem.removeEventListener('click', handlePointerClick);
      cancelAnimationFrame(animationFrameId);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.remove();
      }
    };
  }, []);

  // Update Strata visibility
  useEffect(() => {
    if (!sceneRef.current) return;
    const strata = sceneRef.current.getObjectByName('strata_group');
    if (strata) {
      strata.visible = showStrataPlanes;
    }
  }, [showStrataPlanes]);

  // Render Asset Meshes into 3D Space whenever assets, depthCutoff, selectedAssetId, or aiBypassActive changes
  useEffect(() => {
    if (!sceneRef.current || !meshesGroupRef.current) return;

    const group = meshesGroupRef.current;
    const bypassGroup = aiBypassMeshGroupRef.current;

    // Clear existing meshes
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    if (bypassGroup) {
      while (bypassGroup.children.length > 0) {
        bypassGroup.remove(bypassGroup.children[0]);
      }
    }

    // Map latitude/longitude offsets to 3D X/Z coordinates
    let avgLat = 28.537;
    let avgLng = 77.391;

    if (assets.length > 0) {
      avgLat = assets.reduce((sum, a) => sum + a.gpsCoordinates[0], 0) / assets.length;
      avgLng = assets.reduce((sum, a) => sum + a.gpsCoordinates[1], 0) / assets.length;
    }

    const latLngTo3D = (lat: number, lng: number): [number, number] => {
      const x = (lng - avgLng) * 2800; // scale factor
      const z = -(lat - avgLat) * 2800;
      return [x, z];
    };

    let detectedClashes = 0;

    // Render each asset tube/pipe
    assets.forEach((asset) => {
      // Depth filter cutoff
      if (asset.depthMeters > depthCutoff) return;

      const hexColor = UTILITY_COLORS[asset.utilityType] || '#38bdf8';
      const isSelected = activeAsset?.id === asset.id;
      const isHovered = hoveredAsset?.id === asset.id;

      // Pipe / Cable radius scaled for 3D visual density
      let radius = Math.max(0.25, (asset.diameterMm || 200) / 1000 * 0.85);
      if (asset.utilityType === 'metro_tunnel') radius = 2.4; // metro tunnel enlarged

      // Build 3D curve from polyline
      const points: THREE.Vector3[] = [];

      if (asset.polylineGeometry && asset.polylineGeometry.length > 1) {
        asset.polylineGeometry.forEach((pt) => {
          const [x, z] = latLngTo3D(pt[0], pt[1]);
          points.push(new THREE.Vector3(x, -asset.depthMeters, z));
        });
      } else {
        const [x, z] = latLngTo3D(asset.gpsCoordinates[0], asset.gpsCoordinates[1]);
        points.push(new THREE.Vector3(x - 20, -asset.depthMeters, z - 12));
        points.push(new THREE.Vector3(x, -asset.depthMeters, z));
        points.push(new THREE.Vector3(x + 20, -asset.depthMeters, z + 12));
      }

      if (points.length < 2) return;

      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 40, radius, 14, false);

      const tubeMat = new THREE.MeshStandardMaterial({
        color: isHovered ? new THREE.Color(0x38bdf8) : new THREE.Color(hexColor),
        roughness: 0.25,
        metalness: asset.utilityType.includes('power') || asset.utilityType.includes('gas') ? 0.7 : 0.2,
        emissive: isSelected ? new THREE.Color(hexColor) : isHovered ? new THREE.Color(0x38bdf8) : new THREE.Color(0x000000),
        emissiveIntensity: isSelected ? 0.8 : isHovered ? 0.6 : 0.1,
        transparent: asset.utilityType === 'metro_tunnel',
        opacity: asset.utilityType === 'metro_tunnel' ? 0.65 : 1.0,
      });

      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      tubeMesh.userData = { assetId: asset.id };
      group.add(tubeMesh);

      // Render Metro Tunnel Track & Moving Train Capsule if Metro
      if (asset.utilityType === 'metro_tunnel') {
        const trainGeo = new THREE.CapsuleGeometry(1.8, 6, 8, 16);
        const trainMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.9,
          metalness: 0.9,
        });
        const trainMesh = new THREE.Mesh(trainGeo, trainMat);
        trainMesh.rotation.z = Math.PI / 2;
        trainMesh.position.set(0, -asset.depthMeters, 0);
        group.add(trainMesh);
        metroTrainRef.current = trainMesh;
      }

      // Add joint valves/nodes along pipe
      const curvePoints = curve.getSpacedPoints(5);
      curvePoints.forEach((p) => {
        const nodeGeo = new THREE.SphereGeometry(radius * 1.6, 14, 14);
        const nodeMat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0xffffff : new THREE.Color(hexColor),
          emissive: isSelected ? new THREE.Color(0x38bdf8) : new THREE.Color(0x000000),
          emissiveIntensity: isSelected ? 0.9 : 0.2,
        });
        const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
        nodeMesh.position.copy(p);
        nodeMesh.userData = { assetId: asset.id };
        group.add(nodeMesh);
      });

      // Highlight Risk / Clash Zones with 3D Bounding Wireframes
      if (highlightClashes && (asset.aiRiskScore > 70 || asset.currentStatus === 'maintenance_due')) {
        detectedClashes++;
        const midPt = curve.getPoint(0.5);

        // 3D Wireframe Bounding Box
        const boxGeo = new THREE.BoxGeometry(radius * 6, radius * 6, radius * 6);
        const boxMat = new THREE.MeshBasicMaterial({
          color: 0xf43f5e,
          wireframe: true,
          transparent: true,
          opacity: 0.8,
        });
        const clashBox = new THREE.Mesh(boxGeo, boxMat);
        clashBox.name = 'clash_box';
        clashBox.position.copy(midPt);
        group.add(clashBox);

        // Pulsing Warning Sphere Halo
        const sphereGeo = new THREE.SphereGeometry(radius * 4, 16, 16);
        const sphereMat = new THREE.MeshBasicMaterial({
          color: 0xf43f5e,
          wireframe: false,
          transparent: true,
          opacity: 0.2,
        });
        const clashSphere = new THREE.Mesh(sphereGeo, sphereMat);
        clashSphere.position.copy(midPt);
        group.add(clashSphere);

        // 220 IQ AI Reroute Spline Calculation
        if (aiBypassActive && bypassGroup) {
          const p1 = curve.getPoint(0.2);
          const p2 = curve.getPoint(0.8);

          // Calculate bypass curve diving deeper (-3.5m offset) to avoid clash
          const bypassPoints = [
            p1,
            new THREE.Vector3(p1.x + 3, p1.y - 3.5, p1.z + 2),
            new THREE.Vector3(midPt.x, midPt.y - 4.5, midPt.z),
            new THREE.Vector3(p2.x - 3, p2.y - 3.5, p2.z - 2),
            p2,
          ];

          const bypassCurve = new THREE.CatmullRomCurve3(bypassPoints);
          const bypassGeo = new THREE.TubeGeometry(bypassCurve, 32, radius * 1.1, 12, false);
          const bypassMat = new THREE.MeshStandardMaterial({
            color: 0x10b981, // Glowing emerald green
            emissive: 0x10b981,
            emissiveIntensity: 0.9,
            metalness: 0.8,
          });
          const bypassMesh = new THREE.Mesh(bypassGeo, bypassMat);
          bypassGroup.add(bypassMesh);

          // Add glowing bypass markers
          bypassPoints.forEach((bp) => {
            const bpGeo = new THREE.OctahedronGeometry(radius * 1.5);
            const bpMat = new THREE.MeshBasicMaterial({ color: 0x34d399, wireframe: true });
            const bpMesh = new THREE.Mesh(bpGeo, bpMat);
            bpMesh.position.copy(bp);
            bypassGroup.add(bpMesh);
          });
        }
      }
    });

    setClashCount(detectedClashes);
    if (aiBypassActive) {
      setAiScanStatus(`220 IQ AI Reroute Applied: Resolved ${detectedClashes} 3D clashes with +3.5m vertical depth buffer.`);
    } else if (detectedClashes > 0) {
      setAiScanStatus(`AI Alert: ${detectedClashes} Sub-surface 3D Structural Collisions detected along execution corridor!`);
    } else {
      setAiScanStatus('Sub-surface 3D Mesh Clear. 0 Structural Collisions detected.');
    }
  }, [assets, depthCutoff, activeAsset, hoveredAsset, highlightClashes, aiBypassActive]);

  // Apply Camera Presets
  const applyCameraPreset = (preset: 'iso' | 'top' | 'front' | 'cross') => {
    setCameraPreset(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    if (preset === 'top') {
      camera.position.set(0, 60, 0.1);
      controls.target.set(0, -5, 0);
    } else if (preset === 'front') {
      camera.position.set(0, -4, 55);
      controls.target.set(0, -4, 0);
    } else if (preset === 'cross') {
      camera.position.set(35, -3, 35);
      controls.target.set(0, -3, 0);
    } else {
      camera.position.set(38, 28, 48);
      controls.target.set(0, -5, 0);
    }
    controls.update();
  };

  return (
    <div className="relative w-full h-full min-h-[550px] bg-[#0a0f1d] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header Controls Bar */}
      <div className="bg-[#080b12]/95 backdrop-blur-md px-5 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 z-20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-indigo-600 via-teal-600 to-emerald-500 rounded-2xl text-white font-black shadow-lg shadow-indigo-600/30">
            <Scan className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              Sub-Surface 3D Spatial Digital Twin Engine
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                220 IQ AI Spatial Scan
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Real-time WebGL LiDAR & Ground Penetrating Radar (GPR) subterranean mesh rendering
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* AI 3D Reroute Resolver Toggle */}
          <button
            onClick={() => setAiBypassActive(!aiBypassActive)}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
              aiBypassActive
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400 ring-2 ring-emerald-500/30'
                : 'bg-[#0c121d] text-emerald-400 border-emerald-500/40 hover:bg-emerald-950/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{aiBypassActive ? 'AI Reroute Active' : '220 IQ AI Reroute Clash'}</span>
          </button>

          {/* Depth Cutoff Slider */}
          <div className="flex items-center gap-2 bg-[#0c121d] border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold">Depth Slicing:</span>
            <input
              type="range"
              min="2"
              max="25"
              step="0.5"
              value={depthCutoff}
              onChange={(e) => setDepthCutoff(parseFloat(e.target.value))}
              className="w-24 accent-indigo-500 cursor-pointer"
            />
            <span className="font-mono text-indigo-400 font-bold">-{depthCutoff}m</span>
          </div>

          {/* Camera View Presets */}
          <div className="flex items-center bg-[#0c121d] border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => applyCameraPreset('iso')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                cameraPreset === 'iso' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              3D Iso
            </button>
            <button
              onClick={() => applyCameraPreset('top')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                cameraPreset === 'top' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Top Plan
            </button>
            <button
              onClick={() => applyCameraPreset('cross')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                cameraPreset === 'cross' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cross-Section
            </button>
          </div>

          {/* Laser Scanner Beam Toggle */}
          <button
            onClick={() => setShowLaserScanner(!showLaserScanner)}
            className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              showLaserScanner
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                : 'bg-[#0c121d] text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle GPR Laser Scan Beam"
          >
            <Scan className="w-4 h-4" />
          </button>

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isRotating
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                : 'bg-[#0c121d] text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle Orbit Auto-360 Spin"
          >
            <RotateCcw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* AI Intelligence Status Bar Banner */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs z-10">
        <div className="flex items-center gap-2 text-slate-300">
          <Activity className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
          <span className="font-semibold text-emerald-300 truncate">{aiScanStatus}</span>
        </div>

        <div className="flex items-center gap-3 shrink-0 font-mono text-[11px]">
          {showLaserScanner && (
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              GPR Beam: -{laserYPosition}m
            </span>
          )}
          {clashCount > 0 && (
            <span className="text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> {clashCount} Clashes Detected
            </span>
          )}
          <span className="text-slate-400">Mouse: Drag to Orbit | Scroll to Zoom</span>
        </div>
      </div>

      {/* 3D Canvas Mounting Container */}
      <div className="relative flex-1 min-h-[460px] w-full bg-[#0a0f1d]">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Hovered Asset Tooltip overlay floating in canvas */}
        {hoveredAsset && !activeAsset && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-slate-900/95 backdrop-blur-md border border-sky-500/50 px-4 py-2 rounded-xl text-xs text-white shadow-2xl flex items-center gap-3 pointer-events-none animate-fade-in">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: UTILITY_COLORS[hoveredAsset.utilityType] }}
            />
            <div>
              <div className="font-extrabold text-sky-300">{hoveredAsset.assetName}</div>
              <div className="text-[10px] text-slate-400">
                Depth: <strong className="text-white">-{hoveredAsset.depthMeters}m</strong> | Diameter: {hoveredAsset.diameterMm}mm
              </div>
            </div>
            <div className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
              Click to Inspect 3D
            </div>
          </div>
        )}

        {/* Floating Utility Color Legend */}
        <div className="absolute top-4 left-4 z-10 bg-[#080b12]/90 backdrop-blur-md border border-slate-800 p-3.5 rounded-2xl text-xs space-y-2 text-slate-300 max-w-xs shadow-2xl">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center justify-between">
            <span>ISRO GIS Sub-surface Codes</span>
            <span className="text-emerald-400 font-mono">3D Mesh</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
            {Object.entries(UTILITY_COLORS).slice(0, 8).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: color }} />
                <span className="truncate text-slate-300 font-medium">{UTILITY_NAMES[type as UndergroundUtilityType] || type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Selected Asset 3D Inspector Card */}
        {activeAsset && (
          <div className="absolute bottom-4 right-4 z-10 bg-[#080b12]/95 backdrop-blur-md border border-slate-800 p-4 rounded-2xl max-w-sm text-xs space-y-3 text-slate-200 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-800 pb-2.5">
              <div>
                <span
                  className="inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase mb-1"
                  style={{
                    backgroundColor: `${UTILITY_COLORS[activeAsset.utilityType]}25`,
                    color: UTILITY_COLORS[activeAsset.utilityType],
                    border: `1px solid ${UTILITY_COLORS[activeAsset.utilityType]}50`,
                  }}
                >
                  {UTILITY_NAMES[activeAsset.utilityType]}
                </span>
                <h4 className="font-extrabold text-white text-base leading-snug">{activeAsset.assetName}</h4>
                <div className="text-[10px] text-slate-400 font-semibold">{activeAsset.department}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-bold">3D Clash Risk</div>
                <div
                  className={`text-base font-black ${
                    activeAsset.aiRiskScore > 70
                      ? 'text-rose-400'
                      : activeAsset.aiRiskScore > 40
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {activeAsset.aiRiskScore}/100
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-[#0c121d] p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Sub-surface Depth</div>
                <div className="font-bold text-sky-400 text-xs">-{activeAsset.depthMeters} meters</div>
              </div>
              <div className="bg-[#0c121d] p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Pipe/Tunnel Outer Dia</div>
                <div className="font-bold text-emerald-400 text-xs">{activeAsset.diameterMm} mm</div>
              </div>
              <div className="bg-[#0c121d] p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Material Specification</div>
                <div className="font-bold text-slate-200 text-xs truncate">{activeAsset.material}</div>
              </div>
              <div className="bg-[#0c121d] p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Structural Lifespan</div>
                <div className="font-bold text-indigo-300 text-xs">{activeAsset.remainingLifeYears} Years</div>
              </div>
            </div>

            {activeAsset.nearestShutoffValve && (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-300">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Nearest Isolation Shutoff / Valve:
                </div>
                <div className="font-mono text-[10px]">{activeAsset.nearestShutoffValve}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Horizontal Asset Quick Switcher */}
      <div className="bg-[#080b12] border-t border-slate-800 p-2.5 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
        <span className="text-slate-400 font-extrabold px-2 shrink-0 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-emerald-400" /> Sub-surface Assets:
        </span>
        {assets.map((asset) => {
          const isSelected = activeAsset?.id === asset.id;
          return (
            <button
              key={asset.id}
              onClick={() => {
                setActiveAsset(asset);
                if (onSelectAsset) onSelectAsset(asset);
              }}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl border font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md ring-2 ring-indigo-500/30'
                  : 'bg-[#0c121d] text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <div
                className="w-2.5 h-2.5 rounded-full shadow-xs"
                style={{ backgroundColor: UTILITY_COLORS[asset.utilityType] }}
              />
              <span>{asset.assetName}</span>
              <span className="text-[10px] font-mono text-slate-400 font-bold">-{asset.depthMeters}m</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
