'use client';

import { EpochId, getEmpiresForEpoch, getEpoch } from '@/types';

interface CompassRoseProps {
  x: number;
  y: number;
  size?: number;
}

/**
 * Ornate compass rose in vintage cartographic style
 */
export function CompassRose({ x, y, size = 60 }: CompassRoseProps) {
  const s = size;
  const innerRadius = s * 0.15;
  const outerRadius = s * 0.45;
  const pointerLength = s * 0.5;

  return (
    <g className="compass-rose" transform={`translate(${x}, ${y})`}>
      {/* Outer decorative ring */}
      <circle
        cx="0"
        cy="0"
        r={s * 0.48}
        fill="none"
        stroke="#C9A66B"
        strokeWidth="2"
      />
      <circle
        cx="0"
        cy="0"
        r={s * 0.44}
        fill="none"
        stroke="#8B6914"
        strokeWidth="1"
      />

      {/* 8-point star background */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const len = angle % 90 === 0 ? outerRadius : outerRadius * 0.7;
        return (
          <line
            key={angle}
            x1={Math.cos(rad) * innerRadius}
            y1={Math.sin(rad) * innerRadius}
            x2={Math.cos(rad) * len}
            y2={Math.sin(rad) * len}
            stroke="#D4C4A8"
            strokeWidth="1.5"
          />
        );
      })}

      {/* North pointer (red/burgundy) */}
      <polygon
        points={`0,${-pointerLength} ${innerRadius * 0.6},${-innerRadius} ${-innerRadius * 0.6},${-innerRadius}`}
        fill="url(#compass-north)"
        stroke="#5C2525"
        strokeWidth="0.5"
      />

      {/* South pointer (cream/white) */}
      <polygon
        points={`0,${pointerLength} ${innerRadius * 0.6},${innerRadius} ${-innerRadius * 0.6},${innerRadius}`}
        fill="url(#compass-south)"
        stroke="#8B7355"
        strokeWidth="0.5"
      />

      {/* East pointer */}
      <polygon
        points={`${pointerLength * 0.8},0 ${innerRadius},${innerRadius * 0.5} ${innerRadius},${-innerRadius * 0.5}`}
        fill="#E8DCC8"
        stroke="#8B7355"
        strokeWidth="0.5"
      />

      {/* West pointer */}
      <polygon
        points={`${-pointerLength * 0.8},0 ${-innerRadius},${innerRadius * 0.5} ${-innerRadius},${-innerRadius * 0.5}`}
        fill="#E8DCC8"
        stroke="#8B7355"
        strokeWidth="0.5"
      />

      {/* Center circle */}
      <circle
        cx="0"
        cy="0"
        r={innerRadius}
        fill="#C9A66B"
        stroke="#8B6914"
        strokeWidth="1"
      />
      <circle
        cx="0"
        cy="0"
        r={innerRadius * 0.5}
        fill="#5C4033"
      />

      {/* Cardinal direction labels */}
      <text
        y={-pointerLength - 6}
        textAnchor="middle"
        className="compass-label"
        fontSize="10"
        fontWeight="700"
        fill="#722F37"
      >
        N
      </text>
      <text
        y={pointerLength + 12}
        textAnchor="middle"
        className="compass-label"
        fontSize="9"
        fill="#5C4033"
      >
        S
      </text>
      <text
        x={pointerLength * 0.8 + 8}
        y={4}
        textAnchor="middle"
        className="compass-label"
        fontSize="9"
        fill="#5C4033"
      >
        E
      </text>
      <text
        x={-pointerLength * 0.8 - 8}
        y={4}
        textAnchor="middle"
        className="compass-label"
        fontSize="9"
        fill="#5C4033"
      >
        W
      </text>
    </g>
  );
}

interface ScaleBarProps {
  x: number;
  y: number;
  width?: number;
  label?: string;
}

/**
 * Period-appropriate scale bar
 */
export function ScaleBar({ x, y, width = 100, label = "100 leagues" }: ScaleBarProps) {
  const segments = 4;
  const segmentWidth = width / segments;

  return (
    <g className="scale-bar" transform={`translate(${x}, ${y})`}>
      {/* Background line */}
      <line
        x1="0"
        y1="0"
        x2={width}
        y2="0"
        stroke="#8B7355"
        strokeWidth="1"
      />

      {/* Alternating segments */}
      {[...Array(segments)].map((_, i) => (
        <rect
          key={i}
          x={i * segmentWidth}
          y="-4"
          width={segmentWidth}
          height="8"
          fill={i % 2 === 0 ? '#5C4033' : '#F5F0E8'}
          stroke="#8B7355"
          strokeWidth="0.5"
        />
      ))}

      {/* End caps */}
      <line x1="0" y1="-8" x2="0" y2="8" stroke="#5C4033" strokeWidth="2" />
      <line x1={width} y1="-8" x2={width} y2="8" stroke="#5C4033" strokeWidth="2" />

      {/* Label */}
      <text
        x={width / 2}
        y="20"
        textAnchor="middle"
        className="scale-label"
        fontSize="9"
        fill="#5C4033"
        fontStyle="italic"
      >
        {label}
      </text>
    </g>
  );
}

interface MapLegendProps {
  x: number;
  y: number;
  epochId: EpochId;
  width?: number;
}

/**
 * Empire legend with color swatches
 */
export function MapLegend({ x, y, epochId, width = 150 }: MapLegendProps) {
  const epoch = getEpoch(epochId);
  const empires = getEmpiresForEpoch(epochId);
  const itemHeight = 22;
  const padding = 12;
  const totalHeight = empires.length * itemHeight + padding * 2 + 30;

  return (
    <g className="map-legend" transform={`translate(${x}, ${y})`}>
      {/* Background panel */}
      <rect
        x="0"
        y="0"
        width={width}
        height={totalHeight}
        fill="#FAF6F0"
        stroke="#C9A66B"
        strokeWidth="2"
        rx="2"
      />

      {/* Inner border */}
      <rect
        x="3"
        y="3"
        width={width - 6}
        height={totalHeight - 6}
        fill="none"
        stroke="#E8DCC8"
        strokeWidth="1"
        rx="1"
      />

      {/* Title cartouche */}
      <rect
        x={padding}
        y={padding - 2}
        width={width - padding * 2}
        height="20"
        fill="#E8DCC8"
        stroke="#C9A66B"
        strokeWidth="1"
      />
      <text
        x={width / 2}
        y={padding + 13}
        textAnchor="middle"
        className="legend-title"
        fontSize="10"
        fontWeight="700"
        fill="#5C4033"
      >
        {epoch?.name || 'Empires'}
      </text>

      {/* Empire entries */}
      {empires.map((empire, i) => (
        <g key={empire.id} transform={`translate(${padding}, ${padding + 28 + i * itemHeight})`}>
          {/* Color swatch */}
          <rect
            x="0"
            y="0"
            width="16"
            height="14"
            fill={empire.color}
            stroke="#5C4033"
            strokeWidth="0.5"
            rx="1"
          />
          {/* Empire name */}
          <text
            x="22"
            y="11"
            className="legend-item"
            fontSize="9"
            fill="#5C4033"
          >
            {empire.name}
          </text>
        </g>
      ))}
    </g>
  );
}

interface TitleCartoucheProps {
  x: number;
  y: number;
  title: string;
  subtitle?: string;
  width?: number;
}

/**
 * Ornamental title banner/cartouche
 */
export function TitleCartouche({ x, y, title, subtitle, width = 250 }: TitleCartoucheProps) {
  const height = subtitle ? 55 : 40;

  return (
    <g className="title-cartouche" transform={`translate(${x}, ${y})`}>
      {/* Scroll/banner shape */}
      <path
        d={`
          M10 0
          Q0 0, 0 10
          L0 ${height - 10}
          Q0 ${height}, 10 ${height}
          L${width - 10} ${height}
          Q${width} ${height}, ${width} ${height - 10}
          L${width} 10
          Q${width} 0, ${width - 10} 0
          Z
        `}
        fill="#FAF6F0"
        stroke="#C9A66B"
        strokeWidth="2"
      />

      {/* Inner decorative border */}
      <rect
        x="6"
        y="6"
        width={width - 12}
        height={height - 12}
        fill="none"
        stroke="#E8DCC8"
        strokeWidth="1"
        rx="2"
      />

      {/* Decorative corners */}
      {[[8, 8], [width - 8, 8], [8, height - 8], [width - 8, height - 8]].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="3"
          fill="#C9A66B"
        />
      ))}

      {/* Title text */}
      <text
        x={width / 2}
        y={subtitle ? 25 : height / 2 + 5}
        textAnchor="middle"
        className="cartouche-title"
        fontSize="14"
        fontWeight="700"
        fill="#5C4033"
        letterSpacing="1"
      >
        {title}
      </text>

      {/* Subtitle if provided */}
      {subtitle && (
        <text
          x={width / 2}
          y="42"
          textAnchor="middle"
          className="cartouche-subtitle"
          fontSize="10"
          fontStyle="italic"
          fill="#8B7355"
        >
          {subtitle}
        </text>
      )}
    </g>
  );
}

interface MapDecorationsProps {
  epochId: EpochId;
  width: number;
  height: number;
  showCompass?: boolean;
  showScale?: boolean;
  showLegend?: boolean;
  showTitle?: boolean;
}

/**
 * Combined map decorations component
 */
export function MapDecorations({
  epochId,
  width,
  height,
  showCompass = true,
  showScale = true,
  showLegend = true,
  showTitle = true,
}: MapDecorationsProps) {
  const epoch = getEpoch(epochId);

  return (
    <g className="map-decorations">
      {/* Title cartouche - top center */}
      {showTitle && epoch && (
        <TitleCartouche
          x={(width - 250) / 2}
          y={15}
          title={epoch.name}
          subtitle={epoch.years}
          width={250}
        />
      )}

      {/* Compass rose - bottom right */}
      {showCompass && (
        <CompassRose
          x={width - 55}
          y={height - 55}
          size={50}
        />
      )}

      {/* Scale bar - bottom center */}
      {showScale && (
        <ScaleBar
          x={(width - 100) / 2}
          y={height - 25}
          width={100}
          label={epochId === 'revolutionary' ? '1000 miles' : '500 stadia'}
        />
      )}

      {/* Legend - top right */}
      {showLegend && (
        <MapLegend
          x={width - 165}
          y={showTitle ? 85 : 15}
          epochId={epochId}
          width={150}
        />
      )}
    </g>
  );
}

export default MapDecorations;
