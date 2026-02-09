'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import L from 'leaflet';
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { EpochId, EmpireId, getEmpiresForEpoch, getEmpire } from '@/types';
import { LEAFLET_CONFIGS, EPOCH_BOUNDS } from '@/app/utils/mapProjection';
import { loadEpochGeoData } from '@/app/utils/geoData';
import type { GeoFeatureCollection } from '@/types';
import EmpireTooltip from './EmpireTooltip';

interface LeafletMapProps {
  epochId: EpochId;
  onSelectEmpire?: (empireId: EmpireId) => void;
  className?: string;
}

interface HoveredState {
  empireId: EmpireId;
  x: number;
  y: number;
}

// --- Legend Control ---
function LegendControl({ epochId }: { epochId: EpochId }) {
  const map = useMap();
  const empires = getEmpiresForEpoch(epochId);

  useEffect(() => {
    const legend = new L.Control({ position: 'topright' });

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'leaflet-legend');
      div.style.cssText = `
        background: linear-gradient(180deg, #FAF6F0 0%, #F0EBE3 100%);
        border: 2px solid #C9A66B;
        border-radius: 2px;
        padding: 10px 12px;
        font-family: Georgia, serif;
        box-shadow: 0 2px 8px rgba(44, 24, 16, 0.15);
        max-width: 160px;
      `;

      let html = `<div style="font-size:11px;font-weight:bold;color:#5C4033;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;border-bottom:1px solid rgba(201,166,107,0.3);padding-bottom:4px;">Empires</div>`;

      empires.forEach((empire) => {
        html += `
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
            <span style="display:inline-block;width:12px;height:12px;border-radius:1px;background:${empire.color};border:1px solid rgba(44,24,16,0.15);flex-shrink:0;"></span>
            <span style="font-size:11px;color:#5C4033;line-height:1.2;">${empire.name}</span>
          </div>
        `;
      });

      html += `<div style="margin-top:8px;padding-top:4px;border-top:1px solid rgba(201,166,107,0.3);font-size:9px;color:#8B7355;line-height:1.3;">Map tiles by <a href="https://www.esri.com" target="_blank" rel="noopener" style="color:#8B7355;text-decoration:underline;">Esri</a></div>`;

      div.innerHTML = html;

      // Prevent map interaction when hovering over legend
      L.DomEvent.disableClickPropagation(div);
      L.DomEvent.disableScrollPropagation(div);

      return div;
    };

    legend.addTo(map);
    return () => {
      legend.remove();
    };
  }, [map, epochId, empires]);

  return null;
}

// --- Compass Rose Control ---
function CompassRoseControl() {
  const map = useMap();

  useEffect(() => {
    const compass = new L.Control({ position: 'bottomright' });

    compass.onAdd = () => {
      const div = L.DomUtil.create('div', 'leaflet-compass');
      div.style.cssText = `
        width: 64px;
        height: 64px;
        position: relative;
      `;

      div.innerHTML = `
        <div style="
          width: 64px;
          height: 64px;
          position: relative;
          filter: drop-shadow(0 2px 4px rgba(44, 24, 16, 0.2));
        ">
          <!-- Outer ring -->
          <div style="
            position: absolute;
            inset: 0;
            border: 2px solid #C9A66B;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(250,246,240,0.95) 40%, rgba(240,235,227,0.9) 100%);
          "></div>
          <!-- Inner ring -->
          <div style="
            position: absolute;
            inset: 4px;
            border: 1px solid rgba(139,105,20,0.4);
            border-radius: 50%;
          "></div>
          <!-- N pointer -->
          <div style="
            position: absolute;
            left: 50%;
            top: 6px;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: 14px solid #8B0000;
          "></div>
          <!-- S pointer -->
          <div style="
            position: absolute;
            left: 50%;
            bottom: 6px;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 14px solid #5C4033;
          "></div>
          <!-- E pointer -->
          <div style="
            position: absolute;
            top: 50%;
            right: 6px;
            transform: translateY(-50%);
            width: 0;
            height: 0;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
            border-left: 14px solid #5C4033;
          "></div>
          <!-- W pointer -->
          <div style="
            position: absolute;
            top: 50%;
            left: 6px;
            transform: translateY(-50%);
            width: 0;
            height: 0;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
            border-right: 14px solid #5C4033;
          "></div>
          <!-- Center dot -->
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #C9A66B;
            border: 1px solid #8B6914;
          "></div>
          <!-- N label -->
          <div style="
            position: absolute;
            top: 2px;
            left: 50%;
            transform: translateX(-50%) translateY(-100%);
            font-family: Georgia, serif;
            font-size: 10px;
            font-weight: bold;
            color: #8B0000;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          ">N</div>
        </div>
      `;

      L.DomEvent.disableClickPropagation(div);
      L.DomEvent.disableScrollPropagation(div);

      return div;
    };

    compass.addTo(map);
    return () => {
      compass.remove();
    };
  }, [map]);

  return null;
}

// --- Darken hex color helper ---
function darkenHex(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.round(((num >> 16) & 0xff) * (1 - amount)));
  const g = Math.max(0, Math.round(((num >> 8) & 0xff) * (1 - amount)));
  const b = Math.max(0, Math.round((num & 0xff) * (1 - amount)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// --- Empire Labels Control ---
function EmpireLabelsControl({ geoData }: { geoData: GeoFeatureCollection }) {
  const map = useMap();

  useEffect(() => {
    const markers: L.Marker[] = [];

    geoData.features.forEach((feature) => {
      const props = feature.properties;
      if (!props?.labelPosition || !props?.name) return;

      const [lng, lat] = props.labelPosition as [number, number];
      const icon = L.divIcon({
        className: 'empire-label',
        html: props.name,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([lat, lng], {
        icon,
        interactive: false,
      });
      marker.addTo(map);
      markers.push(marker);
    });

    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [map, geoData]);

  return null;
}

// --- Main LeafletMap Component ---
export default function LeafletMap({
  epochId,
  onSelectEmpire,
  className = '',
}: LeafletMapProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [geoData, setGeoData] = useState<GeoFeatureCollection | null>(null);
  const [hoveredEmpire, setHoveredEmpire] = useState<HoveredState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [containerDims, setContainerDims] = useState({ width: 800, height: 500 });

  const empires = getEmpiresForEpoch(epochId);
  const config = LEAFLET_CONFIGS[epochId];
  const bounds = EPOCH_BOUNDS[epochId];

  // Convert EPOCH_BOUNDS to Leaflet LatLngBounds
  const maxBounds = useMemo((): L.LatLngBoundsExpression => {
    const padding = 10;
    return [
      [bounds.minLat - padding, bounds.minLon - padding],
      [bounds.maxLat + padding, bounds.maxLon + padding],
    ];
  }, [bounds]);

  // Load geo data
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    loadEpochGeoData(epochId)
      .then((geo) => {
        setGeoData(geo);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load map data:', err);
        setError('Failed to load map data');
        setIsLoading(false);
      });
  }, [epochId]);

  // Track container dimensions for tooltip positioning
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDims = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerDims({ width: rect.width, height: rect.height });
      }
    };

    updateDims();
    window.addEventListener('resize', updateDims);
    return () => window.removeEventListener('resize', updateDims);
  }, []);

  // Handle territory click
  const handleTerritoryClick = useCallback(
    (empireId: EmpireId) => {
      if (onSelectEmpire) {
        onSelectEmpire(empireId);
      }
      router.push(`/empire/${empireId}`);
    },
    [onSelectEmpire, router]
  );

  // Filter for interactive empire features only
  const filteredGeoData = useMemo(() => {
    if (!geoData) return null;
    return {
      ...geoData,
      features: geoData.features.filter((feature) => {
        const props = feature.properties;
        return props?.type === 'empire' && props?.interactive !== false;
      }),
    };
  }, [geoData]);

  // Style function for GeoJSON features
  const featureStyle = useCallback((feature: GeoJSON.Feature | undefined) => {
    if (!feature?.properties) return {};
    const color = feature.properties.color || '#888888';
    return {
      fillColor: color,
      fillOpacity: 0.7,
      color: darkenHex(color, 0.3),
      weight: 3,
      opacity: 1,
    };
  }, []);

  // Bind events to each feature
  const onEachFeature = useCallback(
    (feature: GeoJSON.Feature, layer: L.Layer) => {
      const empireId = feature.properties?.id as EmpireId;
      if (!empireId) return;

      layer.on({
        mouseover: (e: L.LeafletMouseEvent) => {
          const pathLayer = e.target as L.Path;
          pathLayer.setStyle({
            fillOpacity: 0.85,
            weight: 4,
          });
          pathLayer.bringToFront();

          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setHoveredEmpire({
              empireId,
              x: e.originalEvent.clientX - rect.left,
              y: e.originalEvent.clientY - rect.top,
            });
          }
        },
        mousemove: (e: L.LeafletMouseEvent) => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setHoveredEmpire({
              empireId,
              x: e.originalEvent.clientX - rect.left,
              y: e.originalEvent.clientY - rect.top,
            });
          }
        },
        mouseout: (e: L.LeafletMouseEvent) => {
          const pathLayer = e.target as L.Path;
          pathLayer.setStyle({
            fillOpacity: 0.7,
            weight: 3,
          });
          setHoveredEmpire(null);
        },
        click: () => {
          handleTerritoryClick(empireId);
        },
      });
    },
    [handleTerritoryClick]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className={`map-container w-full aspect-[5/3] flex items-center justify-center ${className}`}>
        <div className="loading-vintage" />
      </div>
    );
  }

  // Error state
  if (error || !filteredGeoData) {
    return (
      <div className={`map-container w-full aspect-[5/3] flex items-center justify-center ${className}`}>
        <p className="text-sepia-light">{error || 'Failed to load map'}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Map Container */}
      <div
        ref={containerRef}
        className={`map-container w-full overflow-hidden animate-map-reveal ${className}`}
        style={{ aspectRatio: '5/3' }}
      >
        <MapContainer
          center={config.center}
          zoom={config.zoom}
          minZoom={config.minZoom}
          maxZoom={config.maxZoom}
          maxBounds={maxBounds}
          maxBoundsViscosity={0.8}
          zoomControl={false}
          style={{ width: '100%', height: '100%' }}
          attributionControl={false}
        >
          <ZoomControl position="topleft" />

          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; Esri'
          />

          <GeoJSON
            key={epochId}
            data={filteredGeoData}
            style={featureStyle}
            onEachFeature={onEachFeature}
          />

          <EmpireLabelsControl geoData={filteredGeoData} />
          <LegendControl epochId={epochId} />
          <CompassRoseControl />
        </MapContainer>
      </div>

      {/* Empire Tooltip */}
      {hoveredEmpire && (
        <EmpireTooltip
          empireId={hoveredEmpire.empireId}
          x={hoveredEmpire.x}
          y={hoveredEmpire.y}
          containerWidth={containerDims.width}
          containerHeight={containerDims.height}
        />
      )}

      {/* Mobile fallback - Empire buttons */}
      <div className="md:hidden mt-6 grid grid-cols-2 gap-3">
        {empires.map((empire) => (
          <button
            key={empire.id}
            onClick={() => handleTerritoryClick(empire.id)}
            className="empire-mobile-btn p-4 text-left"
            style={{ borderLeftColor: empire.color }}
          >
            <span className="font-display font-semibold text-sm text-ink block">
              {empire.name}
            </span>
            <span className="text-xs text-sepia-light font-body">
              {empire.years}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
