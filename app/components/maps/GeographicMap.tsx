'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import * as d3Geo from 'd3-geo';
import { EpochId, EmpireId, getEmpiresForEpoch, getEmpire, GeoFeatureCollection } from '@/types';
import { createProjection, createPathGenerator, createGraticule, EPOCH_BOUNDS } from '@/app/utils/mapProjection';
import {
  loadEpochGeoData,
  loadTerrainFeatures,
  loadBaseGeography,
  getEmpireFeatures,
  getLandmassFeatures,
  getWaterFeatures,
  getNonInteractiveFeatures,
  getInteractiveEmpireFeatures,
  TerrainData,
  BaseGeography,
} from '@/app/utils/geoData';
import MapFilters from './MapFilters';
import { MapDecorations } from './MapDecorations';
import { TerrainLayer, MountainIcon, ForestIcon, DesertIcon, CityIcon, CapitalIcon } from './TerrainIcons';
import EmpireTooltip from './EmpireTooltip';

interface GeographicMapProps {
  epochId: EpochId;
  onSelectEmpire?: (empireId: EmpireId) => void;
  showDecorations?: boolean;
  showTerrain?: boolean;
  className?: string;
}

interface HoveredState {
  empireId: EmpireId;
  x: number;
  y: number;
}

export default function GeographicMap({
  epochId,
  onSelectEmpire,
  showDecorations = true,
  showTerrain = true,
  className = '',
}: GeographicMapProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [geoData, setGeoData] = useState<GeoFeatureCollection | null>(null);
  const [baseGeo, setBaseGeo] = useState<BaseGeography | null>(null);
  const [terrainData, setTerrainData] = useState<TerrainData | null>(null);
  const [hoveredEmpire, setHoveredEmpire] = useState<HoveredState | null>(null);
  const [selectedEmpire, setSelectedEmpire] = useState<EmpireId | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNonInteractive, setShowNonInteractive] = useState(true);

  const empires = getEmpiresForEpoch(epochId);

  // Load geo data (epoch data, base geography, terrain)
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    Promise.all([
      loadEpochGeoData(epochId),
      showTerrain ? loadTerrainFeatures(epochId) : Promise.resolve(null),
      loadBaseGeography('50m'), // Load Natural Earth base geography
    ])
      .then(([geo, terrain, base]) => {
        setGeoData(geo);
        setTerrainData(terrain);
        setBaseGeo(base);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load map data:', err);
        setError('Failed to load map data');
        setIsLoading(false);
      });
  }, [epochId, showTerrain]);

  // Handle container resize
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        // Different aspect ratios for different eras
        const aspectRatios: Record<EpochId, number> = {
          'bronze-age': 1.4,
          'classical': 1.4,
          'hellenistic-roman': 1.6,
          'revolutionary': 1.8,
        };
        const aspectRatio = aspectRatios[epochId];
        setDimensions({
          width,
          height: width / aspectRatio,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [epochId]);

  // Create projection and path generator
  const { projection, pathGenerator } = useMemo(() => {
    const proj = createProjection(epochId, dimensions.width, dimensions.height);
    const path = createPathGenerator(proj);
    return { projection: proj, pathGenerator: path };
  }, [epochId, dimensions]);

  // Project a coordinate
  const projectPoint = useCallback(
    (lon: number, lat: number): [number, number] | null => {
      return projection([lon, lat]);
    },
    [projection]
  );

  // Handle territory hover
  const handleTerritoryHover = useCallback(
    (empireId: EmpireId | null, event?: React.MouseEvent) => {
      if (!empireId || !containerRef.current) {
        setHoveredEmpire(null);
        return;
      }

      if (event) {
        const rect = containerRef.current.getBoundingClientRect();
        setHoveredEmpire({
          empireId,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    },
    []
  );

  // Handle territory click
  const handleTerritoryClick = useCallback(
    (empireId: EmpireId) => {
      setSelectedEmpire(empireId);
      if (onSelectEmpire) {
        onSelectEmpire(empireId);
      }
      router.push(`/empire/${empireId}`);
    },
    [onSelectEmpire, router]
  );

  // Graticule (grid lines)
  const graticule = useMemo(() => createGraticule(), []);
  const graticulePath = useMemo(() => {
    return pathGenerator(graticule() as unknown as d3Geo.GeoPermissibleObjects);
  }, [pathGenerator, graticule]);

  // Render loading state
  if (isLoading) {
    return (
      <div className={`map-container w-full aspect-[5/3] flex items-center justify-center ${className}`}>
        <div className="loading-vintage" />
      </div>
    );
  }

  // Render error state
  if (error || !geoData) {
    return (
      <div className={`map-container w-full aspect-[5/3] flex items-center justify-center ${className}`}>
        <p className="text-sepia-light">{error || 'Failed to load map'}</p>
      </div>
    );
  }

  const landmassFeatures = getLandmassFeatures(geoData);
  const waterFeatures = getWaterFeatures(geoData);
  const empireFeatures = getInteractiveEmpireFeatures(geoData);
  const nonInteractiveFeatures = getNonInteractiveFeatures(geoData);

  return (
    <div className="relative">
      {/* Map Container */}
      <div
        ref={containerRef}
        className={`map-container w-full overflow-hidden animate-map-reveal ${className}`}
      >
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className="geographic-map"
        >
          {/* SVG Filters and Gradients */}
          <MapFilters />

          {/* Background */}
          <rect
            x="0"
            y="0"
            width={dimensions.width}
            height={dimensions.height}
            fill="url(#parchment-gradient)"
            filter="url(#parchment-texture)"
          />

          {/* Graticule (grid lines) */}
          <path
            d={graticulePath || ''}
            fill="none"
            stroke="#D4C4A8"
            strokeWidth="0.5"
            strokeDasharray="4,4"
            opacity="0.4"
          />

          {/* Water features */}
          <g className="water-layer">
            {waterFeatures.map((feature, i) => (
              <path
                key={feature.properties?.id || i}
                d={pathGenerator(feature as d3Geo.GeoPermissibleObjects) || ''}
                fill="url(#water-gradient)"
                stroke="#5C8DB8"
                strokeWidth="0.5"
                opacity="0.6"
                filter="url(#water-shimmer)"
              />
            ))}
          </g>

          {/* Landmass features */}
          <g className="landmass-layer">
            {landmassFeatures.map((feature, i) => (
              <path
                key={feature.properties?.id || i}
                d={pathGenerator(feature as d3Geo.GeoPermissibleObjects) || ''}
                fill="url(#land-gradient)"
                stroke="#C9A66B"
                strokeWidth="1"
                opacity="0.8"
              />
            ))}
          </g>

          {/* Non-interactive regions (neighboring states, tribal territories) */}
          {/* Rendered with border-only styling, not clickable */}
          {showNonInteractive && nonInteractiveFeatures.length > 0 && (
            <g className="non-interactive-layer">
              {nonInteractiveFeatures.map((feature, i) => {
                const props = feature.properties;
                const borderColor = props?.color || '#888888';

                return (
                  <g key={props?.id || `non-interactive-${i}`}>
                    {/* Border-only path (no fill, just outline) */}
                    <path
                      d={pathGenerator(feature as d3Geo.GeoPermissibleObjects) || ''}
                      fill="none"
                      stroke={borderColor}
                      strokeWidth={1}
                      strokeDasharray={props?.strokeDasharray || '4,2'}
                      strokeOpacity={0.6}
                      className="pointer-events-none"
                    />
                    {/* Optional label for non-interactive regions */}
                    {props?.labelPosition && props?.name && (
                      <text
                        x={projectPoint(props.labelPosition[0], props.labelPosition[1])?.[0] || 0}
                        y={projectPoint(props.labelPosition[0], props.labelPosition[1])?.[1] || 0}
                        textAnchor="middle"
                        className="non-interactive-label pointer-events-none"
                        fontSize="9"
                        fontStyle="italic"
                        fill="#888888"
                        fillOpacity={0.7}
                      >
                        {props.name}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* Empire territories */}
          <g className="empire-layer">
            {empireFeatures.map((feature) => {
              const empireId = feature.properties?.id as EmpireId;
              const empire = getEmpire(empireId);
              if (!empire) return null;

              const isHovered = hoveredEmpire?.empireId === empireId;
              const isSelected = selectedEmpire === empireId;

              return (
                <g key={empireId} className="empire-territory">
                  <path
                    d={pathGenerator(feature as d3Geo.GeoPermissibleObjects) || ''}
                    fill={empire.color}
                    fillOpacity={isHovered || isSelected ? 0.6 : 0.4}
                    stroke={empire.color}
                    strokeWidth={isHovered || isSelected ? 3 : 2}
                    strokeOpacity="0.8"
                    className="territory cursor-pointer transition-all duration-300"
                    style={{
                      filter: isHovered || isSelected ? 'url(#territory-glow)' : 'none',
                      ['--glow-color' as string]: empire.color,
                    }}
                    onMouseEnter={(e) => handleTerritoryHover(empireId, e)}
                    onMouseMove={(e) => handleTerritoryHover(empireId, e)}
                    onMouseLeave={() => handleTerritoryHover(null)}
                    onClick={() => handleTerritoryClick(empireId)}
                  />

                  {/* Empire label */}
                  {feature.properties?.labelPosition && (
                    <text
                      x={projectPoint(
                        feature.properties.labelPosition[0],
                        feature.properties.labelPosition[1]
                      )?.[0] || 0}
                      y={projectPoint(
                        feature.properties.labelPosition[0],
                        feature.properties.labelPosition[1]
                      )?.[1] || 0}
                      textAnchor="middle"
                      className="empire-label pointer-events-none"
                      fontSize="11"
                      fontWeight="600"
                      fill="#5C4033"
                      stroke="#FAF6F0"
                      strokeWidth="2"
                      paintOrder="stroke"
                    >
                      {empire.name}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Terrain features */}
          {showTerrain && terrainData && (
            <g className="terrain-features">
              {/* Deserts first (background) */}
              <TerrainLayer
                features={terrainData.deserts}
                projectPoint={projectPoint}
                showLabels={false}
              />

              {/* Forests */}
              <TerrainLayer
                features={terrainData.forests}
                projectPoint={projectPoint}
                showLabels={false}
              />

              {/* Mountains */}
              <TerrainLayer
                features={terrainData.mountains}
                projectPoint={projectPoint}
                showLabels={false}
              />

              {/* Rivers */}
              <g className="rivers-layer">
                {terrainData.rivers.map((river) => {
                  const points = river.path
                    .map(([lon, lat]) => {
                      const p = projectPoint(lon, lat);
                      return p ? `${p[0]},${p[1]}` : null;
                    })
                    .filter(Boolean)
                    .join(' L');

                  if (!points) return null;

                  return (
                    <path
                      key={river.id}
                      d={`M${points}`}
                      fill="none"
                      stroke="#7BA3C9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.7"
                    />
                  );
                })}
              </g>

              {/* Cities (on top) */}
              {terrainData.cities.map((city) => {
                const p = projectPoint(city.position.longitude, city.position.latitude);
                if (!p) return null;

                return city.type === 'capital' ? (
                  <CapitalIcon
                    key={city.id}
                    x={p[0]}
                    y={p[1]}
                    name={city.name}
                    showLabel={true}
                  />
                ) : (
                  <CityIcon
                    key={city.id}
                    x={p[0]}
                    y={p[1]}
                    name={city.name}
                    showLabel={true}
                  />
                );
              })}
            </g>
          )}

          {/* Map decorations */}
          {showDecorations && (
            <MapDecorations
              epochId={epochId}
              width={dimensions.width}
              height={dimensions.height}
              showCompass={true}
              showScale={true}
              showLegend={true}
              showTitle={true}
            />
          )}

          {/* Border frame */}
          <rect
            x="2"
            y="2"
            width={dimensions.width - 4}
            height={dimensions.height - 4}
            fill="none"
            stroke="url(#frame-gradient)"
            strokeWidth="4"
          />
        </svg>
      </div>

      {/* Empire Tooltip */}
      {hoveredEmpire && (
        <EmpireTooltip
          empireId={hoveredEmpire.empireId}
          x={hoveredEmpire.x}
          y={hoveredEmpire.y}
          containerWidth={dimensions.width}
          containerHeight={dimensions.height}
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
            <span className="text-xl mr-2">{empire.emoji}</span>
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
