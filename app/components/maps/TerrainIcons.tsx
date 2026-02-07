'use client';

import { TerrainFeature, TerrainType } from '@/types';

interface TerrainIconProps {
  x: number;
  y: number;
  scale?: number;
  type: TerrainType;
  name?: string;
  showLabel?: boolean;
}

/**
 * Mountain icon - triangular peaks with shading
 */
export function MountainIcon({ x, y, scale = 1, name, showLabel = false }: Omit<TerrainIconProps, 'type'>) {
  const s = scale * 12;
  return (
    <g className="terrain-icon mountain" transform={`translate(${x}, ${y})`}>
      {/* Main peak */}
      <path
        d={`M0 ${-s} L${s * 0.8} ${s * 0.4} L${-s * 0.8} ${s * 0.4} Z`}
        fill="#8B7355"
        stroke="#5C4033"
        strokeWidth="0.5"
      />
      {/* Snow cap */}
      <path
        d={`M0 ${-s} L${s * 0.25} ${-s * 0.4} L${-s * 0.25} ${-s * 0.4} Z`}
        fill="#F5F0E8"
        stroke="none"
      />
      {/* Shading */}
      <path
        d={`M0 ${-s} L${s * 0.8} ${s * 0.4} L${s * 0.1} ${s * 0.4} Z`}
        fill="rgba(0,0,0,0.15)"
      />
      {/* Secondary peak */}
      <path
        d={`M${s * 0.5} ${s * 0.1} L${s * 1.1} ${s * 0.4} L${s * 0.2} ${s * 0.4} Z`}
        fill="#9E8B73"
        stroke="#5C4033"
        strokeWidth="0.3"
      />
      {showLabel && name && (
        <text
          y={s * 0.8}
          textAnchor="middle"
          className="terrain-label"
          fontSize="8"
          fill="#5C4033"
        >
          {name}
        </text>
      )}
    </g>
  );
}

/**
 * Forest icon - clustered tree symbols
 */
export function ForestIcon({ x, y, scale = 1, name, showLabel = false }: Omit<TerrainIconProps, 'type'>) {
  const s = scale * 10;
  return (
    <g className="terrain-icon forest" transform={`translate(${x}, ${y})`}>
      {/* Tree cluster - central tree */}
      <path
        d={`M0 ${-s} L${s * 0.4} ${s * 0.2} L${s * 0.15} ${s * 0.2} L${s * 0.15} ${s * 0.5} L${-s * 0.15} ${s * 0.5} L${-s * 0.15} ${s * 0.2} L${-s * 0.4} ${s * 0.2} Z`}
        fill="#4A6B35"
        stroke="#2D4420"
        strokeWidth="0.5"
      />
      {/* Left tree */}
      <path
        d={`M${-s * 0.5} ${-s * 0.6} L${-s * 0.2} ${s * 0.1} L${-s * 0.8} ${s * 0.1} Z`}
        fill="#5A7B45"
        stroke="#2D4420"
        strokeWidth="0.3"
        opacity="0.9"
      />
      {/* Right tree */}
      <path
        d={`M${s * 0.5} ${-s * 0.5} L${s * 0.8} ${s * 0.15} L${s * 0.2} ${s * 0.15} Z`}
        fill="#3D5A2C"
        stroke="#2D4420"
        strokeWidth="0.3"
        opacity="0.9"
      />
      {/* Background tree */}
      <path
        d={`M${s * 0.1} ${-s * 0.8} L${s * 0.35} ${-s * 0.1} L${-s * 0.15} ${-s * 0.1} Z`}
        fill="#6B8B55"
        stroke="#2D4420"
        strokeWidth="0.2"
        opacity="0.7"
      />
      {showLabel && name && (
        <text
          y={s * 0.9}
          textAnchor="middle"
          className="terrain-label"
          fontSize="7"
          fill="#2D4420"
        >
          {name}
        </text>
      )}
    </g>
  );
}

/**
 * Desert icon - stippled dune pattern
 */
export function DesertIcon({ x, y, scale = 1, name, showLabel = false }: Omit<TerrainIconProps, 'type'>) {
  const s = scale * 15;
  return (
    <g className="terrain-icon desert" transform={`translate(${x}, ${y})`}>
      {/* Dune shapes */}
      <ellipse
        cx="0"
        cy={s * 0.1}
        rx={s * 0.9}
        ry={s * 0.3}
        fill="#E8D5A8"
        stroke="#C9A66B"
        strokeWidth="0.5"
        opacity="0.6"
      />
      <ellipse
        cx={s * 0.4}
        cy={-s * 0.1}
        rx={s * 0.5}
        ry={s * 0.2}
        fill="#D4C090"
        stroke="#B89B5A"
        strokeWidth="0.3"
        opacity="0.5"
      />
      {/* Stipple dots */}
      {[...Array(8)].map((_, i) => (
        <circle
          key={i}
          cx={(Math.random() - 0.5) * s * 1.4}
          cy={(Math.random() - 0.5) * s * 0.6}
          r={0.8}
          fill="#B89B5A"
          opacity="0.4"
        />
      ))}
      {showLabel && name && (
        <text
          y={s * 0.7}
          textAnchor="middle"
          className="terrain-label"
          fontSize="7"
          fill="#8B6914"
        >
          {name}
        </text>
      )}
    </g>
  );
}

/**
 * City marker - small dot with name
 */
export function CityIcon({ x, y, scale = 1, name, showLabel = true }: Omit<TerrainIconProps, 'type'>) {
  const s = scale * 4;
  return (
    <g className="terrain-icon city" transform={`translate(${x}, ${y})`}>
      <circle
        cx="0"
        cy="0"
        r={s}
        fill="#5C4033"
        stroke="#C9A66B"
        strokeWidth="1"
      />
      <circle
        cx="0"
        cy="0"
        r={s * 0.4}
        fill="#C9A66B"
      />
      {showLabel && name && (
        <text
          x={s * 2}
          y={s * 0.5}
          className="city-label"
          fontSize="9"
          fill="#5C4033"
          fontWeight="500"
        >
          {name}
        </text>
      )}
    </g>
  );
}

/**
 * Capital city marker - star or castle symbol
 */
export function CapitalIcon({ x, y, scale = 1, name, showLabel = true }: Omit<TerrainIconProps, 'type'>) {
  const s = scale * 6;
  // Generate star points
  const starPoints = [];
  for (let i = 0; i < 5; i++) {
    const outerAngle = (i * 72 - 90) * (Math.PI / 180);
    const innerAngle = ((i * 72) + 36 - 90) * (Math.PI / 180);
    starPoints.push(`${Math.cos(outerAngle) * s},${Math.sin(outerAngle) * s}`);
    starPoints.push(`${Math.cos(innerAngle) * s * 0.4},${Math.sin(innerAngle) * s * 0.4}`);
  }

  return (
    <g className="terrain-icon capital" transform={`translate(${x}, ${y})`}>
      {/* Glow effect */}
      <circle
        cx="0"
        cy="0"
        r={s * 1.8}
        fill="url(#city-glow)"
      />
      {/* Star shape */}
      <polygon
        points={starPoints.join(' ')}
        fill="#FFD700"
        stroke="#A6854A"
        strokeWidth="1"
      />
      {/* Inner highlight */}
      <circle
        cx="0"
        cy="0"
        r={s * 0.25}
        fill="#FFF5CC"
      />
      {showLabel && name && (
        <text
          x={s * 2.5}
          y={s * 0.5}
          className="capital-label"
          fontSize="10"
          fill="#5C4033"
          fontWeight="700"
        >
          {name}
        </text>
      )}
    </g>
  );
}

/**
 * Water/wave pattern indicator
 */
export function WaterIcon({ x, y, scale = 1 }: Omit<TerrainIconProps, 'type' | 'name' | 'showLabel'>) {
  const s = scale * 12;
  return (
    <g className="terrain-icon water" transform={`translate(${x}, ${y})`}>
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M${-s} ${i * s * 0.4 - s * 0.4} Q${-s * 0.5} ${i * s * 0.4 - s * 0.6}, 0 ${i * s * 0.4 - s * 0.4} T${s} ${i * s * 0.4 - s * 0.4}`}
          fill="none"
          stroke="#7BA3C9"
          strokeWidth="1.5"
          opacity={0.6 - i * 0.15}
        />
      ))}
    </g>
  );
}

/**
 * Renders the appropriate terrain icon based on type
 */
export function TerrainIcon({ type, ...props }: TerrainIconProps) {
  switch (type) {
    case 'mountain':
      return <MountainIcon {...props} />;
    case 'forest':
      return <ForestIcon {...props} />;
    case 'desert':
      return <DesertIcon {...props} />;
    case 'city':
      return <CityIcon {...props} />;
    case 'capital':
      return <CapitalIcon {...props} />;
    case 'water':
      return <WaterIcon {...props} />;
    default:
      return null;
  }
}

/**
 * Renders a collection of terrain features
 */
interface TerrainLayerProps {
  features: TerrainFeature[];
  projectPoint: (lon: number, lat: number) => [number, number] | null;
  showLabels?: boolean;
}

export function TerrainLayer({ features, projectPoint, showLabels = false }: TerrainLayerProps) {
  return (
    <g className="terrain-layer">
      {features.map((feature) => {
        const projected = projectPoint(feature.position.longitude, feature.position.latitude);
        if (!projected) return null;

        return (
          <TerrainIcon
            key={feature.id}
            type={feature.type}
            x={projected[0]}
            y={projected[1]}
            scale={feature.scale}
            name={feature.name}
            showLabel={showLabels}
          />
        );
      })}
    </g>
  );
}

export default TerrainIcon;
