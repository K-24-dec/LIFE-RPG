import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { RouteOption, GISLayerState, ConflictZone, MapTileMode } from '../types';
import { GIS_LAYERS_DATA } from '../data/gisLayers';
import { GatiSenseConflictAlert } from '../utils/gatiSenseConflictDetector';
import { Layers, Globe, Mountain, Map as MapIcon, CloudRain, Flame } from 'lucide-react';

interface GISMapProps {
  sourceCoords: [number, number];
  sourceName: string;
  destCoords: [number, number];
  destName: string;
  routes: RouteOption[];
  selectedRouteId: string;
  onSelectRoute: (routeId: string) => void;
  layers: GISLayerState;
  onSelectConflict?: (conflict: ConflictZone) => void;
  waypoints?: [number, number][];
  onAddWaypoint?: (coords: [number, number]) => void;
  interactiveMode?: boolean;
  gatiSenseAlerts?: GatiSenseConflictAlert[];
}

export const GISMap: React.FC<GISMapProps> = ({
  sourceCoords,
  sourceName,
  destCoords,
  destName,
  routes,
  selectedRouteId,
  onSelectRoute,
  layers,
  onSelectConflict,
  waypoints,
  onAddWaypoint,
  interactiveMode = true,
  gatiSenseAlerts = [],
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const routeLayersRef = useRef<L.Polyline[]>([]);
  const gisLayersGroupRef = useRef<L.LayerGroup | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);

  const [tileMode, setTileMode] = useState<MapTileMode>('dark');
  const [showTileMenu, setShowTileMenu] = useState(false);

  const getTileUrl = (mode: MapTileMode) => {
    switch (mode) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'terrain':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      case 'hybrid':
        return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      case 'dark':
      default:
        return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const midLat = (sourceCoords[0] + destCoords[0]) / 2;
    const midLng = (sourceCoords[1] + destCoords[1]) / 2;

    const map = L.map(mapContainerRef.current, {
      center: [midLat, midLng],
      zoom: 6,
      zoomControl: false,
    });

    const tile = L.tileLayer(getTileUrl(tileMode), {
      attribution: '&copy; OpenStreetMap &copy; CARTO &copy; Esri',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = tile;

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    gisLayersGroupRef.current = L.layerGroup().addTo(map);
    markerGroupRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    if (interactiveMode && onAddWaypoint) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        onAddWaypoint([e.latlng.lat, e.latlng.lng]);
      });
    }

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Tile Switch
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }

    tileLayerRef.current = L.tileLayer(getTileUrl(tileMode), {
      attribution: '&copy; OpenStreetMap &copy; CARTO &copy; Esri',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);
  }, [tileMode]);

  // Update Layers & Overlays
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !gisLayersGroupRef.current) return;

    gisLayersGroupRef.current.clearLayers();

    GIS_LAYERS_DATA.forEach((shape) => {
      const showCategory =
        (shape.category === 'forest' && layers.forests) ||
        (shape.category === 'river' && layers.rivers) ||
        (shape.category === 'protected_area' && layers.protectedAreas) ||
        (shape.category === 'highway' && layers.existingHighways) ||
        (shape.category === 'railway' && layers.railwayNetwork) ||
        (shape.category === 'airport' && layers.airports) ||
        (shape.category === 'urban' && layers.urbanClusters) ||
        (shape.category === 'utility' && layers.utilityCorridors);

      if (!showCategory) return;

      if (shape.type === 'polygon') {
        const poly = L.polygon(shape.coordinates as [number, number][], {
          color: shape.color,
          fillColor: shape.fillColor || shape.color,
          fillOpacity: 0.25,
          weight: 1.5,
        });
        poly.bindTooltip(`<b>${shape.name}</b><br/>${shape.description}`);
        gisLayersGroupRef.current?.addLayer(poly);
      } else if (shape.type === 'polyline') {
        const line = L.polyline(shape.coordinates as [number, number][], {
          color: shape.color,
          weight: 3,
          dashArray: '5, 5',
          opacity: 0.7,
        });
        line.bindTooltip(`<b>${shape.name}</b><br/>${shape.description}`);
        gisLayersGroupRef.current?.addLayer(line);
      } else if (shape.type === 'circle' && shape.center && shape.radiusKm) {
        const circle = L.circle(shape.center, {
          radius: shape.radiusKm * 1000,
          color: shape.color,
          fillColor: shape.fillColor || shape.color,
          fillOpacity: 0.15,
          weight: 1,
        });
        circle.bindTooltip(`<b>${shape.name}</b><br/>${shape.description}`);
        gisLayersGroupRef.current?.addLayer(circle);
      }
    });

    // Weather Radar Heat Overlay Simulation
    if (layers.weatherRadar) {
      const weatherOverlay = L.circle([21.1702, 72.8311], {
        radius: 120000,
        color: '#f43f5e',
        fillColor: '#f43f5e',
        fillOpacity: 0.35,
        weight: 2,
      });
      weatherOverlay.bindTooltip('<b>Southwest Monsoon Cloudburst Zone</b><br/>88% Rain Probability');
      gisLayersGroupRef.current.addLayer(weatherOverlay);
    }

    // Conflict Heatmap Overlay Simulation
    if (layers.conflictHeatmap) {
      const conflictOverlay = L.circle([27.4200, 76.4500], {
        radius: 80000,
        color: '#eab308',
        fillColor: '#eab308',
        fillOpacity: 0.3,
        weight: 2,
      });
      conflictOverlay.bindTooltip('<b>High Inter-Ministry Spatial Conflict Heatmap</b>');
      gisLayersGroupRef.current.addLayer(conflictOverlay);
    }
  }, [layers]);

  // Render Routes and Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markerGroupRef.current) return;

    markerGroupRef.current.clearLayers();
    routeLayersRef.current.forEach((l) => l.remove());
    routeLayersRef.current = [];

    const sourceIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `<div class="w-7 h-7 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/50 animate-bounce">S</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const destIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `<div class="w-7 h-7 rounded-full bg-cyan-400 border-2 border-slate-950 flex items-center justify-center text-slate-950 font-black text-xs shadow-lg shadow-cyan-400/50">D</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const sMarker = L.marker(sourceCoords, { icon: sourceIcon }).bindPopup(
      `<div class="p-1"><div class="text-xs font-bold text-emerald-400">ORIGIN NODE</div><div class="text-sm font-semibold">${sourceName}</div></div>`
    );
    const dMarker = L.marker(destCoords, { icon: destIcon }).bindPopup(
      `<div class="p-1"><div class="text-xs font-bold text-cyan-400">DESTINATION TERMINAL</div><div class="text-sm font-semibold">${destName}</div></div>`
    );

    markerGroupRef.current.addLayer(sMarker);
    markerGroupRef.current.addLayer(dMarker);

    waypoints?.forEach((wp, idx) => {
      const wpIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `<div class="w-5 h-5 rounded-full bg-amber-400 border border-slate-950 flex items-center justify-center text-slate-950 font-bold text-[10px]">W${idx + 1}</div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      const wpMarker = L.marker(wp, { icon: wpIcon });
      markerGroupRef.current?.addLayer(wpMarker);
    });

    const bounds = L.latLngBounds([sourceCoords, destCoords]);

    routes.forEach((rt) => {
      const isSelected = rt.id === selectedRouteId;
      const polyline = L.polyline(rt.waypoints, {
        color: rt.color,
        weight: isSelected ? 6 : 3,
        opacity: isSelected ? 0.95 : 0.45,
        dashArray: isSelected ? undefined : '6, 6',
      });

      polyline.on('click', () => {
        onSelectRoute(rt.id);
      });

      polyline.bindTooltip(
        `<div class="text-xs font-sans">
          <strong style="color: ${rt.color}">${rt.name}</strong><br/>
          Length: ${rt.distanceKm} km | Est. Cost: ₹${rt.estimatedCostCrores} Cr
        </div>`
      );

      polyline.addTo(map);
      routeLayersRef.current.push(polyline);

      rt.waypoints.forEach((pt) => bounds.extend(pt));

      if (isSelected) {
        rt.conflicts.forEach((cf) => {
          const warningIcon = L.divIcon({
            className: 'custom-warning-pin',
            html: `<div class="w-6 h-6 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center text-white font-black text-xs shadow-md animate-pulse">!</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          const cfMarker = L.marker(cf.coordinates, { icon: warningIcon });
          cfMarker.bindPopup(`
            <div class="p-1 max-w-xs font-sans">
              <span class="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase mb-1">${cf.type} CONFLICT</span>
              <div class="text-xs font-bold text-white mb-0.5">${cf.name}</div>
              <div class="text-[11px] text-slate-300 mb-1.5">${cf.description}</div>
              <div class="text-[10px] text-emerald-400 font-medium bg-slate-900/80 p-1.5 rounded border border-slate-800">
                <strong>Mitigation:</strong> ${cf.mitigationSuggestion}
              </div>
            </div>
          `);

          if (onSelectConflict) {
            cfMarker.on('click', () => onSelectConflict(cf));
          }

          markerGroupRef.current?.addLayer(cfMarker);
        });
      }
    });

    // Render GatiSense 500m Proximity & Temporal Conflict circles
    gatiSenseAlerts.forEach((alert) => {
      const circleRadiusMeters = 500; // 500m buffer
      const conflictCircle = L.circle(alert.conflictCoordinates, {
        radius: circleRadiusMeters,
        color: alert.severity === 'CRITICAL' ? '#f43f5e' : '#f59e0b',
        fillColor: alert.severity === 'CRITICAL' ? '#f43f5e' : '#f59e0b',
        fillOpacity: 0.25,
        weight: 2,
        dashArray: '4, 4',
      });

      const alertPinIcon = L.divIcon({
        className: 'custom-gatisense-pin',
        html: `<div class="px-2 py-1 bg-rose-600 text-white font-black text-[10px] rounded-full shadow-lg border border-white flex items-center gap-1 animate-pulse">⚡ GatiSense ${alert.distanceMeters}m</div>`,
        iconSize: [110, 24],
        iconAnchor: [55, 12],
      });

      const alertMarker = L.marker(alert.conflictCoordinates, { icon: alertPinIcon });

      const popupContent = `
        <div class="p-2 max-w-xs font-sans">
          <div class="text-[10px] font-black uppercase text-amber-400 mb-1">⚡ GatiSense Auto Alert (${alert.distanceMeters}m Distance)</div>
          <div class="text-xs font-bold text-white mb-1">${alert.project1.code} ↔ ${alert.project2.code}</div>
          <div class="text-[11px] text-slate-300 mb-2">${alert.description}</div>
          <div class="text-[10px] text-emerald-300 bg-slate-900/90 p-2 rounded border border-slate-700">
            <strong>GatiSense Mitigation:</strong> ${alert.aiMitigationRecommendation}
          </div>
        </div>
      `;

      conflictCircle.bindPopup(popupContent);
      alertMarker.bindPopup(popupContent);

      markerGroupRef.current?.addLayer(conflictCircle);
      markerGroupRef.current?.addLayer(alertMarker);
      bounds.extend(alert.conflictCoordinates);
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [routes, selectedRouteId, sourceCoords, destCoords, waypoints, gatiSenseAlerts]);

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl font-['Plus_Jakarta_Sans',sans-serif]">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Top Map Tile Mode Switcher (Feature 10) */}
      <div className="absolute top-4 right-4 z-20">
        <div className="relative">
          <button
            onClick={() => setShowTileMenu(!showTileMenu)}
            className="p-2.5 bg-[#0c121d] hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-white shadow-xl flex items-center gap-2"
          >
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="capitalize">{tileMode} Map View</span>
          </button>

          {showTileMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-[#0c121d] border border-slate-800 rounded-xl shadow-2xl p-1 z-30 space-y-0.5 text-xs">
              <button
                onClick={() => {
                  setTileMode('dark');
                  setShowTileMenu(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                  tileMode === 'dark' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" /> Carto Dark
              </button>
              <button
                onClick={() => {
                  setTileMode('satellite');
                  setShowTileMenu(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                  tileMode === 'satellite' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" /> Satellite View
              </button>
              <button
                onClick={() => {
                  setTileMode('terrain');
                  setShowTileMenu(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                  tileMode === 'terrain' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Mountain className="w-3.5 h-3.5 text-amber-400" /> Terrain Vector
              </button>
              <button
                onClick={() => {
                  setTileMode('hybrid');
                  setShowTileMenu(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                  tileMode === 'hybrid' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-indigo-400" /> Voyager Hybrid
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Map Legend */}
      <div className="absolute bottom-4 left-4 z-20 bg-[#0c121d]/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-xl text-xs space-y-1.5 text-slate-300 max-w-xs shadow-xl">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          PM GS Map Layers & Routes
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>Source Node</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400" />
          <span>Destination Terminal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500 flex items-center justify-center text-[8px] font-bold text-white">!</div>
          <span>Conflict Intersection Zone</span>
        </div>
      </div>
    </div>
  );
};
