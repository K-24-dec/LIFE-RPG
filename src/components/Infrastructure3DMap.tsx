import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  InfrastructureProject3D,
  Infrastructure3DLayerState,
  DEMO_CENTRAL_CORRIDOR_PROJECTS,
  DEMO_BEFORE_SEQUENCE,
  DEMO_AI_OPTIMIZED_SEQUENCE,
} from '../data/infrastructure3DData';
import {
  Layers,
  Eye,
  Maximize2,
  Minimize2,
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
  Search,
  Filter,
  Building2,
  Flame,
  X,
  Check,
  RefreshCw,
} from 'lucide-react';

interface Infrastructure3DMapProps {
  initialProjects?: InfrastructureProject3D[];
  onSelectProject?: (proj: InfrastructureProject3D) => void;
}

export const Infrastructure3DMap: React.FC<Infrastructure3DMapProps> = ({
  initialProjects = DEMO_CENTRAL_CORRIDOR_PROJECTS,
  onSelectProject,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Group references
  const buildingsGroupRef = useRef<THREE.Group | null>(null);
  const roadsGroupRef = useRef<THREE.Group | null>(null);
  const utilitiesGroupRef = useRef<THREE.Group | null>(null);
  const markersGroupRef = useRef<THREE.Group | null>(null);
  const conflictsGroupRef = useRef<THREE.Group | null>(null);
  const heatmapGroupRef = useRef<THREE.Group | null>(null);
  const laserBeamRef = useRef<THREE.Mesh | null>(null);
  const metroTrainRef = useRef<THREE.Mesh | null>(null);
  const trafficGroupRef = useRef<THREE.Group | null>(null);

  // UI States
  const [projectsList, setProjectsList] = useState<InfrastructureProject3D[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<InfrastructureProject3D | null>(initialProjects[0] || null);
  const [hoveredProject, setHoveredProject] = useState<InfrastructureProject3D | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  // Map view controls
  const [cameraPreset, setCameraPreset] = useState<'iso' | 'top' | 'cross' | 'drone'>('iso');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [groundOpacity, setGroundOpacity] = useState<number>(0.85);

  // Feature toggles
  const [layers, setLayers] = useState<Infrastructure3DLayerState>({
    roads: true,
    water: true,
    power: true,
    telecom: true,
    drainage: true,
    rail: true,
    buildings: true,
    construction: true,
    riskHeatmap: false,
    subterraneanView: true,
  });

  // Analysis & Simulation
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanAnalysisComplete, setScanAnalysisComplete] = useState<boolean>(true);
  const [showConflictsOnly, setShowConflictsOnly] = useState<boolean>(false);
  const [simulationActive, setSimulationActive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'info' | 'conflicts' | 'simulation'>('info');

  // Filtered projects
  const filteredProjects = projectsList.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'all' || p.departmentCode === departmentFilter;
    const matchesRisk = riskFilter === 'all' || p.riskLevel.toLowerCase() === riskFilter.toLowerCase();
    const matchesConflict = !showConflictsOnly || (p.conflictingProjectIds && p.conflictingProjectIds.length > 0);
    return matchesSearch && matchesDept && matchesRisk && matchesConflict;
  });

  // 1. Initialize WebGL Scene
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 600;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d); // Obsidian Command-Center Dark
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.005);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(45, 35, 55);
    camera.lookAt(0, -2, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.12; // Allow sub-surface inspection
    controls.minDistance = 12;
    controls.maxDistance = 220;
    controls.target.set(0, -3, 0);
    controls.update();
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight1.position.set(40, 60, 50);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.6);
    dirLight2.position.set(-40, -20, -40);
    scene.add(dirLight2);

    const pointGlow = new THREE.PointLight(0x10b981, 2, 70);
    pointGlow.position.set(0, -2, 0);
    scene.add(pointGlow);

    // Ground Grid & Asphalt Surface
    const gridHelper = new THREE.GridHelper(120, 60, 0x1e293b, 0x0f172a);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // 3D Groups
    const buildingsGroup = new THREE.Group();
    scene.add(buildingsGroup);
    buildingsGroupRef.current = buildingsGroup;

    const roadsGroup = new THREE.Group();
    scene.add(roadsGroup);
    roadsGroupRef.current = roadsGroup;

    const utilitiesGroup = new THREE.Group();
    scene.add(utilitiesGroup);
    utilitiesGroupRef.current = utilitiesGroup;

    const markersGroup = new THREE.Group();
    scene.add(markersGroup);
    markersGroupRef.current = markersGroup;

    const conflictsGroup = new THREE.Group();
    scene.add(conflictsGroup);
    conflictsGroupRef.current = conflictsGroup;

    const heatmapGroup = new THREE.Group();
    scene.add(heatmapGroup);
    heatmapGroupRef.current = heatmapGroup;

    const trafficGroup = new THREE.Group();
    scene.add(trafficGroup);
    trafficGroupRef.current = trafficGroup;

    // Build 3D City Buildings
    const createBuilding = (x: number, z: number, w: number, d: number, h: number, color = 0x1e293b) => {
      const bGeo = new THREE.BoxGeometry(w, h, d);
      const bMat = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.9,
      });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.set(x, h / 2, z);
      bMesh.castShadow = true;
      bMesh.receiveShadow = true;
      buildingsGroup.add(bMesh);

      // Windows
      const windowEdges = new THREE.EdgesGeometry(bGeo);
      const windowMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.3 });
      const windowLines = new THREE.LineSegments(windowEdges, windowMat);
      bMesh.add(windowLines);
    };

    // Cluster of 3D Buildings along Central Corridor
    createBuilding(-25, -20, 8, 8, 32, 0x1e293b);
    createBuilding(-35, -15, 10, 10, 45, 0x0f172a);
    createBuilding(-28, 20, 9, 9, 28, 0x1e293b);
    createBuilding(28, -25, 10, 8, 38, 0x1e293b);
    createBuilding(36, -18, 12, 10, 52, 0x0f172a);
    createBuilding(30, 22, 10, 10, 30, 0x1e293b);

    // Build 3D Road Network (Surface)
    const roadGeo = new THREE.BoxGeometry(100, 0.1, 14);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x171f2d,
      roughness: 0.9,
      metalness: 0.1,
    });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.position.set(0, 0.05, 0);
    roadsGroup.add(roadMesh);

    // Road White Center Lines
    for (let x = -45; x <= 45; x += 8) {
      const lineGeo = new THREE.BoxGeometry(4, 0.12, 0.4);
      const lineMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
      const lineMesh = new THREE.Mesh(lineGeo, lineMat);
      lineMesh.position.set(x, 0.08, 0);
      roadsGroup.add(lineMesh);
    }

    // Moving Traffic Vehicles
    for (let i = 0; i < 6; i++) {
      const carGeo = new THREE.BoxGeometry(2.4, 1.0, 1.2);
      const carMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x38bdf8 : 0x10b981,
        emissive: i % 2 === 0 ? 0x0284c7 : 0x047857,
        emissiveIntensity: 0.5,
      });
      const carMesh = new THREE.Mesh(carGeo, carMat);
      carMesh.position.set(-40 + i * 16, 0.6, i % 2 === 0 ? 3.5 : -3.5);
      carMesh.userData = { speed: (i % 2 === 0 ? 1 : -1) * (0.15 + Math.random() * 0.1) };
      trafficGroup.add(carMesh);
    }

    // 3D LiDAR Scanning Laser Plane
    const laserGeo = new THREE.PlaneGeometry(110, 110);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
    });
    const laserMesh = new THREE.Mesh(laserGeo, laserMat);
    laserMesh.rotation.x = -Math.PI / 2;
    laserMesh.position.y = 0;
    scene.add(laserMesh);
    laserBeamRef.current = laserMesh;

    // Raycasting for Mouse Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      if (!mountRef.current || !cameraRef.current || !markersGroupRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(markersGroupRef.current.children, true);

      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && !obj.userData?.projectId && obj.parent) {
          obj = obj.parent;
        }
        if (obj && obj.userData?.projectId) {
          const matched = projectsList.find((p) => p.id === obj?.userData.projectId);
          if (matched) {
            setHoveredProject(matched);
            mountRef.current.style.cursor = 'pointer';
            return;
          }
        }
      }
      setHoveredProject(null);
      if (mountRef.current) mountRef.current.style.cursor = 'grab';
    };

    const handlePointerClick = (e: MouseEvent) => {
      if (!mountRef.current || !cameraRef.current || !markersGroupRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(markersGroupRef.current.children, true);

      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && !obj.userData?.projectId && obj.parent) {
          obj = obj.parent;
        }
        if (obj && obj.userData?.projectId) {
          const matched = projectsList.find((p) => p.id === obj?.userData.projectId);
          if (matched) {
            setSelectedProject(matched);
            if (onSelectProject) onSelectProject(matched);
          }
        }
      }
    };

    const domElem = mountRef.current;
    domElem.addEventListener('mousemove', handlePointerMove);
    domElem.addEventListener('click', handlePointerClick);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();
    let laserDir = -1;
    let laserY = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (controlsRef.current) {
        controlsRef.current.autoRotate = isAutoRotating;
        controlsRef.current.autoRotateSpeed = 1.5;
        controlsRef.current.update();
      }

      // Animate Traffic
      if (trafficGroupRef.current) {
        trafficGroupRef.current.children.forEach((car) => {
          car.position.x += car.userData.speed || 0.1;
          if (car.position.x > 48) car.position.x = -48;
          if (car.position.x < -48) car.position.x = 48;
        });
      }

      // Animate Laser Sweep during Scanning
      if (laserBeamRef.current && isScanning) {
        laserY += laserDir * 0.12;
        if (laserY < -20) laserDir = 1;
        if (laserY > 5) laserDir = -1;
        laserBeamRef.current.position.y = laserY;
      } else if (laserBeamRef.current) {
        laserBeamRef.current.position.y = -999;
      }

      // Pulsing 3D Conflict Wireframes
      scene.traverse((obj) => {
        if (obj.name === 'conflict_pulse_box') {
          const mat = (obj as THREE.Mesh).material as THREE.MeshBasicMaterial;
          if (mat) {
            mat.opacity = 0.3 + Math.sin(elapsed * 7) * 0.4;
          }
        }
        if (obj.name === 'project_beacon_ring') {
          obj.rotation.z = elapsed * 1.2;
        }
      });

      // Metro Train Motion
      if (metroTrainRef.current) {
        metroTrainRef.current.position.x = Math.sin(elapsed * 0.6) * 35;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Window Resize
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 600;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('mousemove', handlePointerMove);
      domElem.removeEventListener('click', handlePointerClick);
      cancelAnimationFrame(animId);
      if (rendererRef.current?.domElement) {
        rendererRef.current.domElement.remove();
      }
    };
  }, []);

  // 2. Render 3D Infrastructure Utilities & Markers when layers/projects change
  useEffect(() => {
    if (!sceneRef.current || !utilitiesGroupRef.current || !markersGroupRef.current || !conflictsGroupRef.current || !heatmapGroupRef.current) return;

    const utilsGrp = utilitiesGroupRef.current;
    const mrkGrp = markersGroupRef.current;
    const cflGrp = conflictsGroupRef.current;
    const htmGrp = heatmapGroupRef.current;

    // Clear previous
    const clearGroup = (grp: THREE.Group) => {
      while (grp.children.length > 0) grp.remove(grp.children[0]);
    };
    clearGroup(utilsGrp);
    clearGroup(mrkGrp);
    clearGroup(cflGrp);
    clearGroup(htmGrp);

    // Render 3D Subterranean Utilities
    filteredProjects.forEach((proj) => {
      const isSelected = selectedProject?.id === proj.id;
      const isHovered = hoveredProject?.id === proj.id;

      // Color mapping
      let pipeColor = 0x38bdf8;
      if (proj.type === 'road') pipeColor = 0x94a3b8;
      if (proj.type === 'water') pipeColor = 0x0284c7;
      if (proj.type === 'power') pipeColor = 0xeab308;
      if (proj.type === 'telecom') pipeColor = 0xa855f7;
      if (proj.type === 'drainage') pipeColor = 0x06b6d4;
      if (proj.type === 'rail') pipeColor = 0x14b8a6;

      // Check Layer visibility
      const isLayerVisible =
        (proj.type === 'road' && layers.roads) ||
        (proj.type === 'water' && layers.water) ||
        (proj.type === 'power' && layers.power) ||
        (proj.type === 'telecom' && layers.telecom) ||
        (proj.type === 'drainage' && layers.drainage) ||
        (proj.type === 'rail' && layers.rail) ||
        (proj.type === 'construction' && layers.construction);

      if (!isLayerVisible) return;

      // If simulation is active and project is Jal Shakti Water Pipe (proj 2), lower depth to -5.5m and offset
      let renderDepth = proj.depthMeters;
      let renderX = proj.coords3D[0];
      let renderZ = proj.coords3D[2];

      if (simulationActive && proj.id === 'cc-proj-2') {
        renderDepth = -5.5; // Deeper safe bypass depth
        renderZ += 4; // Shifted southwards
      }

      // Create 3D Pipe / Tunnel Curve
      const p1 = new THREE.Vector3(-45, renderDepth, renderZ - 10);
      const p2 = new THREE.Vector3(renderX, renderDepth, renderZ);
      const p3 = new THREE.Vector3(45, renderDepth, renderZ + 10);

      const curve = new THREE.CatmullRomCurve3([p1, p2, p3]);
      const radius = proj.type === 'rail' ? 2.2 : proj.type === 'drainage' ? 1.2 : 0.6;
      const tubeGeo = new THREE.TubeGeometry(curve, 30, radius, 12, false);

      const tubeMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0xffffff : pipeColor,
        emissive: isSelected ? pipeColor : isHovered ? 0x38bdf8 : 0x000000,
        emissiveIntensity: isSelected ? 0.9 : isHovered ? 0.6 : 0.15,
        transparent: proj.type === 'rail',
        opacity: proj.type === 'rail' ? 0.7 : 1.0,
        roughness: 0.3,
        metalness: 0.6,
      });

      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      tubeMesh.userData = { projectId: proj.id };
      utilsGrp.add(tubeMesh);

      // Render Subterranean Metro Train if Rail
      if (proj.type === 'rail') {
        const trainGeo = new THREE.CapsuleGeometry(1.6, 5, 8, 16);
        const trainMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.8 });
        const trainMesh = new THREE.Mesh(trainGeo, trainMat);
        trainMesh.rotation.z = Math.PI / 2;
        trainMesh.position.set(0, renderDepth, renderZ);
        utilsGrp.add(trainMesh);
        metroTrainRef.current = trainMesh;
      }

      // 3D Interactive Project Markers (Beacons) Above Ground
      let riskColor = 0x10b981; // Low - Emerald
      if (proj.riskLevel === 'Medium') riskColor = 0xf59e0b; // Amber
      if (proj.riskLevel === 'High') riskColor = 0xf97316; // Orange
      if (proj.riskLevel === 'Critical') riskColor = 0xf43f5e; // Crimson

      const markerPinGroup = new THREE.Group();
      markerPinGroup.position.set(renderX, 1.2, renderZ);
      markerPinGroup.userData = { projectId: proj.id };

      // Pin Stem
      const stemGeo = new THREE.CylinderGeometry(0.15, 0.15, 4.5, 8);
      const stemMat = new THREE.MeshBasicMaterial({ color: riskColor });
      const stemMesh = new THREE.Mesh(stemGeo, stemMat);
      stemMesh.position.y = 2.25;
      markerPinGroup.add(stemMesh);

      // Diamond Head Marker
      const headGeo = new THREE.OctahedronGeometry(1.4, 0);
      const headMat = new THREE.MeshStandardMaterial({
        color: riskColor,
        emissive: riskColor,
        emissiveIntensity: isSelected ? 0.9 : 0.4,
        metalness: 0.8,
      });
      const headMesh = new THREE.Mesh(headGeo, headMat);
      headMesh.position.y = 4.8;
      markerPinGroup.add(headMesh);

      // Rotating Halo Ring
      const ringGeo = new THREE.RingGeometry(1.8, 2.2, 16);
      const ringMat = new THREE.MeshBasicMaterial({ color: riskColor, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.y = 0.2;
      ringMesh.name = 'project_beacon_ring';
      markerPinGroup.add(ringMesh);

      mrkGrp.add(markerPinGroup);

      // Render 3D Conflict Zone Pulsing Wireframe Box if project has conflicts (unless simulation resolved it)
      if (proj.conflictingProjectIds && proj.conflictingProjectIds.length > 0 && !simulationActive) {
        const conflictBoxGeo = new THREE.BoxGeometry(6, 6, 6);
        const conflictBoxMat = new THREE.MeshBasicMaterial({
          color: 0xf43f5e,
          wireframe: true,
          transparent: true,
          opacity: 0.8,
        });
        const conflictMesh = new THREE.Mesh(conflictBoxGeo, conflictBoxMat);
        conflictMesh.position.set(renderX, renderDepth, renderZ);
        conflictMesh.name = 'conflict_pulse_box';
        cflGrp.add(conflictMesh);

        // Glowing Laser Link to Conflicting Projects
        proj.conflictingProjectIds.forEach((targetId) => {
          const targetProj = projectsList.find((tp) => tp.id === targetId);
          if (targetProj) {
            const linkPoints = [
              new THREE.Vector3(renderX, renderDepth, renderZ),
              new THREE.Vector3(targetProj.coords3D[0], targetProj.depthMeters, targetProj.coords3D[2]),
            ];
            const linkGeo = new THREE.BufferGeometry().setFromPoints(linkPoints);
            const linkMat = new THREE.LineDashedMaterial({ color: 0xf43f5e, dashSize: 0.8, gapSize: 0.4, linewidth: 2 });
            const linkLine = new THREE.Line(linkGeo, linkMat);
            linkLine.computeLineDistances();
            cflGrp.add(linkLine);
          }
        });
      }
    });

    // Render 3D Risk Heatmap Grid Overlay if enabled
    if (layers.riskHeatmap) {
      const heatmapGeo = new THREE.PlaneGeometry(100, 80, 20, 16);
      const heatmapMat = new THREE.MeshBasicMaterial({
        color: 0xf43f5e,
        transparent: true,
        opacity: 0.25,
        wireframe: true,
        side: THREE.DoubleSide,
      });
      const heatmapMesh = new THREE.Mesh(heatmapGeo, heatmapMat);
      heatmapMesh.rotation.x = -Math.PI / 2;
      heatmapMesh.position.y = 0.15;
      htmGrp.add(heatmapMesh);
    }
  }, [projectsList, filteredProjects, selectedProject, hoveredProject, layers, simulationActive]);

  // Apply Camera Presets
  const applyCameraPreset = (preset: 'iso' | 'top' | 'cross' | 'drone') => {
    setCameraPreset(preset);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    if (preset === 'top') {
      camera.position.set(0, 75, 0.1);
      controls.target.set(0, -3, 0);
    } else if (preset === 'cross') {
      camera.position.set(45, -2, 35);
      controls.target.set(0, -3, 0);
    } else if (preset === 'drone') {
      camera.position.set(-35, 12, 35);
      controls.target.set(0, 0, 0);
    } else {
      camera.position.set(45, 35, 55);
      controls.target.set(0, -3, 0);
    }
    controls.update();
  };

  // Run GatiAI 3D Scan & Conflict Detection Demo
  const handleRunGatiAIScan = () => {
    setIsScanning(true);
    setScanAnalysisComplete(false);

    setTimeout(() => {
      setIsScanning(false);
      setScanAnalysisComplete(true);
      setShowConflictsOnly(true);

      // Focus camera on the Central Corridor conflict point
      if (cameraRef.current && controlsRef.current) {
        cameraRef.current.position.set(20, 18, 25);
        controlsRef.current.target.set(2, -3, 0);
        controlsRef.current.update();
      }
    }, 2200);
  };

  // Toggle Fullscreen
  const toggleFullscreenMode = () => {
    if (!mountRef.current) return;
    if (!document.fullscreenElement) {
      mountRef.current.requestFullscreen().catch((err) => console.warn(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.warn(err));
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-6rem)] min-h-[680px] bg-[#0a0f1d] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-slate-200 select-none">
      {/* TOP HEADER COMMAND CENTER BAR */}
      <div className="bg-[#080b12]/95 backdrop-blur-md px-5 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 z-30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-indigo-600 via-teal-600 to-emerald-500 rounded-2xl text-white font-black shadow-lg shadow-indigo-600/30">
            <Scan className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-base text-white">GatiAI 3D Infrastructure Map</h2>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-extrabold uppercase tracking-wider">
                Command Center 3D
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive 3D Sub-surface Digital Twin & Multi-Ministry Conflict Detector
            </p>
          </div>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Run GatiAI Analysis Button */}
          <button
            onClick={handleRunGatiAIScan}
            disabled={isScanning}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer border border-emerald-400/40"
          >
            <Sparkles className={`w-4 h-4 text-amber-300 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning 3D Spatial Grid...' : 'Run GatiAI Analysis'}</span>
          </button>

          {/* Simulate What-If Toggle */}
          <button
            onClick={() => setSimulationActive(!simulationActive)}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-all flex items-center gap-1.5 cursor-pointer ${
              simulationActive
                ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-400/50 shadow-md'
                : 'bg-[#0c121d] text-amber-300 border-amber-500/40 hover:bg-amber-950/30'
            }`}
          >
            <Split className="w-4 h-4" />
            <span>{simulationActive ? 'Simulating AI Plan' : 'Simulate What-If'}</span>
          </button>

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

          {/* Auto Rotate Button */}
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-2 rounded-xl border text-xs transition-all cursor-pointer ${
              isAutoRotating ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-[#0c121d] text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle 360 Spin"
          >
            <RotateCcw className={`w-4 h-4 ${isAutoRotating ? 'animate-spin' : ''}`} />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreenMode}
            className="p-2 rounded-xl bg-[#0c121d] text-slate-400 border border-slate-800 hover:text-white transition-all cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* FILTER & LAYER CONTROL SUB-BAR */}
      <div className="bg-[#080b12]/80 border-b border-slate-800 px-5 py-2 flex flex-wrap items-center justify-between gap-3 text-xs z-20">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Dadri Corridor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0c121d] border border-slate-800 text-slate-200 text-xs pl-8 pr-3 py-1 rounded-xl focus:outline-none focus:border-indigo-500 w-44"
            />
          </div>

          {/* Department Filter Dropdown */}
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-[#0c121d] border border-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-xl focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Departments</option>
            <option value="MoRTH">Road Transport (MoRTH)</option>
            <option value="JAL">Jal Shakti Water</option>
            <option value="POWER">Ministry of Power</option>
            <option value="DOT">Department of Telecom</option>
            <option value="MOR">Indian Railways & Metro</option>
          </select>

          {/* Risk Level Filter Dropdown */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-[#0c121d] border border-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-xl focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Risk Levels</option>
            <option value="critical">🔴 Critical Risk</option>
            <option value="high">🟠 High Risk</option>
            <option value="medium">🟡 Medium Risk</option>
            <option value="low">🟢 Low Risk</option>
          </select>

          {/* Conflicts Only Filter Button */}
          <button
            onClick={() => setShowConflictsOnly(!showConflictsOnly)}
            className={`px-3 py-1 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              showConflictsOnly
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                : 'bg-[#0c121d] text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Show Conflicts Only
          </button>
        </div>

        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
          <span className="text-emerald-400 font-bold">
            Showing {filteredProjects.length} of {projectsList.length} Projects
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Demonstration Infrastructure Data</span>
        </div>
      </div>

      {/* MAIN WORKSPACE SPLIT: 3D CANVAS + SIDE PANEL */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* LEFT FLOATING LAYER TOGGLE TOOLBAR */}
        <div className="absolute top-4 left-4 z-20 bg-[#080b12]/90 backdrop-blur-md border border-slate-800 p-3 rounded-2xl text-xs space-y-2 max-w-xs shadow-2xl">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span>Toggle 3D Layers</span>
            <span className="text-emerald-400 font-mono font-bold">8 Active</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
              <input
                type="checkbox"
                checked={layers.roads}
                onChange={() => setLayers((prev) => ({ ...prev, roads: !prev.roads }))}
                className="rounded border-slate-700 text-slate-400 focus:ring-0"
              />
              <span className="truncate">🛣️ Surface Roads</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
              <input
                type="checkbox"
                checked={layers.water}
                onChange={() => setLayers((prev) => ({ ...prev, water: !prev.water }))}
                className="rounded border-slate-700 text-sky-500 focus:ring-0"
              />
              <span className="truncate">💧 Water Pipes</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
              <input
                type="checkbox"
                checked={layers.power}
                onChange={() => setLayers((prev) => ({ ...prev, power: !prev.power }))}
                className="rounded border-slate-700 text-amber-500 focus:ring-0"
              />
              <span className="truncate">⚡ Power Cables</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
              <input
                type="checkbox"
                checked={layers.telecom}
                onChange={() => setLayers((prev) => ({ ...prev, telecom: !prev.telecom }))}
                className="rounded border-slate-700 text-purple-500 focus:ring-0"
              />
              <span className="truncate">🌐 Telecom Fiber</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
              <input
                type="checkbox"
                checked={layers.drainage}
                onChange={() => setLayers((prev) => ({ ...prev, drainage: !prev.drainage }))}
                className="rounded border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span className="truncate">🚰 Drainage</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
              <input
                type="checkbox"
                checked={layers.rail}
                onChange={() => setLayers((prev) => ({ ...prev, rail: !prev.rail }))}
                className="rounded border-slate-700 text-teal-500 focus:ring-0"
              />
              <span className="truncate">🚇 Rail / Metro</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
              <input
                type="checkbox"
                checked={layers.buildings}
                onChange={() => setLayers((prev) => ({ ...prev, buildings: !prev.buildings }))}
                className="rounded border-slate-700 text-slate-400 focus:ring-0"
              />
              <span className="truncate">🏢 3D Buildings</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-white text-slate-300">
              <input
                type="checkbox"
                checked={layers.riskHeatmap}
                onChange={() => setLayers((prev) => ({ ...prev, riskHeatmap: !prev.riskHeatmap }))}
                className="rounded border-slate-700 text-rose-500 focus:ring-0"
              />
              <span className="truncate text-rose-400 font-bold">🔴 Risk Heatmap</span>
            </label>
          </div>
        </div>

        {/* 3D CANVAS VIEWPORT */}
        <div className="flex-1 relative bg-[#0a0f1d] min-h-full">
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Hovered Tooltip Overlay */}
          {hoveredProject && !selectedProject && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-[#080b12]/95 backdrop-blur-md border border-sky-500/50 px-4 py-2 rounded-xl text-xs text-white shadow-2xl flex items-center gap-3 pointer-events-none">
              <div
                className={`w-3 h-3 rounded-full shrink-0 ${
                  hoveredProject.riskLevel === 'Critical'
                    ? 'bg-rose-500'
                    : hoveredProject.riskLevel === 'High'
                    ? 'bg-orange-500'
                    : 'bg-emerald-500'
                }`}
              />
              <div>
                <div className="font-extrabold text-sky-300">{hoveredProject.name}</div>
                <div className="text-[10px] text-slate-400">
                  {hoveredProject.department} | Budget: ₹{hoveredProject.budgetCrores} Cr
                </div>
              </div>
            </div>
          )}

          {/* CONFLICT ALERT BANNER OVERLAY */}
          {scanAnalysisComplete && !simulationActive && (
            <div className="absolute bottom-4 left-4 z-20 bg-rose-950/90 backdrop-blur-md border border-rose-500/60 p-4 rounded-2xl max-w-md text-xs space-y-2 text-rose-100 shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-rose-500/40 pb-1.5">
                <span className="font-black text-rose-300 uppercase tracking-wider flex items-center gap-1.5 text-xs">
                  <ShieldAlert className="w-4 h-4 text-rose-400 animate-bounce" /> 🚨 INFRASTRUCTURE CONFLICT
                </span>
                <span className="bg-rose-500 text-white font-extrabold px-2 py-0.5 rounded text-[10px]">
                  Conflict Score: 91/100
                </span>
              </div>

              <div className="font-extrabold text-white text-sm">Road Expansion ↔ Water Pipeline & Power Duct</div>
              <p className="text-[11px] text-rose-200">
                Planned asphalt road compaction directly overlaps with 450mm feeder pipe trenching & 33kV power cable laying.
              </p>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
                <div className="bg-rose-900/60 p-1.5 rounded border border-rose-500/30">
                  Potential Delay: <strong className="text-white">18 days</strong>
                </div>
                <div className="bg-rose-900/60 p-1.5 rounded border border-rose-500/30">
                  Cost Impact: <strong className="text-white">₹98 Lakh</strong>
                </div>
              </div>
            </div>
          )}

          {/* SIMULATION ACTIVE BANNER OVERLAY */}
          {simulationActive && (
            <div className="absolute bottom-4 left-4 z-20 bg-emerald-950/90 backdrop-blur-md border border-emerald-500/60 p-4 rounded-2xl max-w-md text-xs space-y-2 text-emerald-100 shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-emerald-500/40 pb-1.5">
                <span className="font-black text-emerald-300 uppercase tracking-wider flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 220 IQ AI-OPTIMIZED PLAN ACTIVE
                </span>
                <span className="bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded text-[10px]">
                  Savings: ₹98 Lakh
                </span>
              </div>

              <div className="font-extrabold text-white text-sm">Synchronized Joint Corridor Alignment</div>
              <p className="text-[11px] text-emerald-200">
                Feeder water pipe shifted south by 2.2m and lowered to -5.5m depth. Single joint trench eliminates double digging and saves 18 days!
              </p>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: PROJECT INFORMATION & SIMULATION PANEL */}
        <div className="w-96 bg-[#080b12] border-l border-slate-800 flex flex-col justify-between shrink-0 z-20 shadow-2xl">
          {/* Panel Header Tabs */}
          <div className="p-3 border-b border-slate-800 bg-[#0c121d] flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'info' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Project Info
              </button>
              <button
                onClick={() => setActiveTab('conflicts')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  activeTab === 'conflicts' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Conflicts <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-200 font-mono text-[9px]">3</span>
              </button>
              <button
                onClick={() => setActiveTab('simulation')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'simulation' ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Simulation
              </button>
            </div>
          </div>

          {/* Panel Content Body */}
          <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
            {activeTab === 'info' && selectedProject && (
              <div className="space-y-4">
                {/* Title & Badge */}
                <div>
                  <span className="font-mono text-[10px] font-bold text-sky-400 bg-sky-950/60 px-2.5 py-0.5 rounded border border-sky-500/30">
                    {selectedProject.code}
                  </span>
                  <h3 className="font-black text-white text-base mt-1.5 leading-snug">{selectedProject.name}</h3>
                  <div className="text-xs text-slate-400 font-medium">{selectedProject.department}</div>
                </div>

                {/* Progress & Risk Status Cards */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-[#0c121d] p-3 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Budget Allocated</div>
                    <div className="font-black text-emerald-400 text-sm mt-0.5">₹{selectedProject.budgetCrores} Cr</div>
                  </div>

                  <div className="bg-[#0c121d] p-3 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Progress</div>
                    <div className="font-black text-sky-400 text-sm mt-0.5">{selectedProject.progressPercent}%</div>
                  </div>

                  <div className="bg-[#0c121d] p-3 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Timeline</div>
                    <div className="font-bold text-slate-200 text-xs mt-0.5">{selectedProject.startDate}</div>
                  </div>

                  <div className="bg-[#0c121d] p-3 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Risk Score</div>
                    <div
                      className={`font-black text-sm mt-0.5 ${
                        selectedProject.riskScore > 75
                          ? 'text-rose-400'
                          : selectedProject.riskScore > 40
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {selectedProject.riskScore}/100 ({selectedProject.riskLevel})
                    </div>
                  </div>
                </div>

                {/* AI Recommendation Box */}
                <div className="p-3.5 bg-indigo-950/50 rounded-2xl border border-indigo-500/40 space-y-1 text-indigo-100">
                  <div className="font-extrabold flex items-center gap-1.5 text-indigo-300">
                    <Sparkles className="w-4 h-4 text-amber-300" /> GatiAI Strategic Recommendation:
                  </div>
                  <p className="text-[11px] text-indigo-200 leading-relaxed">{selectedProject.aiRecommendation}</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => setActiveTab('simulation')}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Split className="w-4 h-4" /> View AI Recommendation & What-If Plan
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'conflicts' && (
              <div className="space-y-3">
                <div className="text-xs font-extrabold text-white flex items-center justify-between">
                  <span>Detected Multi-Agency Conflicts</span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono text-[10px]">
                    3 Active
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-2 text-rose-100">
                  <div className="font-extrabold text-white text-xs">1. Central Corridor Expansion ↔ Water Feeder</div>
                  <div className="text-[11px] text-rose-200">
                    MoRTH asphalt road compaction collides with Jal Shakti 450mm water trunk laying.
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-rose-300">
                    <span>Delay: 18 days</span>
                    <span>Cost Impact: ₹98 Lakh</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-2 text-amber-100">
                  <div className="font-extrabold text-white text-xs">2. Water Feeder Trunk ↔ Telecom Fiber</div>
                  <div className="text-[11px] text-amber-200">
                    Water pipe path crosses optical fiber duct bank at Ch. 14+200.
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-amber-300">
                    <span>Delay: 14 days</span>
                    <span>Cost Impact: ₹65 Lakh</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-2 text-amber-100">
                  <div className="font-extrabold text-white text-xs">3. 33kV Power Duct ↔ Road Sub-Base</div>
                  <div className="text-[11px] text-amber-200">
                    Power cable trenching scheduled after road compaction would ruin newly laid sub-base.
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-amber-300">
                    <span>Delay: 10 days</span>
                    <span>Cost Impact: ₹42 Lakh</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'simulation' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-extrabold text-white text-xs">What-If Execution Sequence</span>
                  <button
                    onClick={() => setSimulationActive(!simulationActive)}
                    className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-[10px]"
                  >
                    {simulationActive ? 'Reset to Original' : 'Apply AI Plan'}
                  </button>
                </div>

                {/* Compare Before vs AI Plan */}
                {!simulationActive ? (
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-rose-400">Current Plan Sequence (Unsynchronized):</div>
                    {DEMO_BEFORE_SEQUENCE.map((step) => (
                      <div key={step.stepNumber} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between font-bold text-white text-xs">
                          <span>{step.stepNumber}. {step.title}</span>
                          <span className="text-[10px] font-mono text-rose-400">{step.durationWeeks} wks</span>
                        </div>
                        <div className="text-[10px] text-slate-400">{step.notes}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-emerald-400">AI-Optimized Sequence (Synchronized):</div>
                    {DEMO_AI_OPTIMIZED_SEQUENCE.map((step) => (
                      <div key={step.stepNumber} className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-1">
                        <div className="flex items-center justify-between font-bold text-white text-xs">
                          <span className="text-emerald-300">{step.stepNumber}. {step.title}</span>
                          <span className="text-[10px] font-mono text-emerald-400">{step.durationWeeks} wks</span>
                        </div>
                        <div className="text-[10px] text-emerald-200">{step.notes}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Panel Footer */}
          <div className="p-3 bg-[#0c121d] border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Central Corridor Demo Scenario</span>
            <span className="font-mono text-emerald-400 font-bold">GatiAI 3.6 Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
