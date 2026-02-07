'use client';

/**
 * SVG filter definitions for Age of Empires-style map effects
 * Includes parchment texture, territory glow, aged stains, and hand-drawn edges
 */
export default function MapFilters() {
  return (
    <defs>
      {/* Parchment paper texture */}
      <filter id="parchment-texture" x="0" y="0" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.04"
          numOctaves="5"
          seed="15"
          stitchTiles="stitch"
          result="noise"
        />
        <feColorMatrix
          in="noise"
          type="matrix"
          values="0 0 0 0 0.96
                  0 0 0 0 0.94
                  0 0 0 0 0.88
                  0 0 0 0.15 0"
          result="coloredNoise"
        />
        <feBlend in="SourceGraphic" in2="coloredNoise" mode="multiply" />
      </filter>

      {/* Aged stain overlay for vintage look */}
      <filter id="aged-stains" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.01"
          numOctaves="3"
          seed="42"
          result="stainNoise"
        />
        <feColorMatrix
          in="stainNoise"
          type="matrix"
          values="0 0 0 0 0.55
                  0 0 0 0 0.38
                  0 0 0 0 0.22
                  0 0 0 0.08 0"
          result="brownStain"
        />
        <feComposite in="brownStain" in2="SourceGraphic" operator="atop" />
        <feBlend in="SourceGraphic" in2="brownStain" mode="multiply" />
      </filter>

      {/* Territory glow effect for hover/selected states */}
      <filter id="territory-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
        <feFlood floodColor="var(--glow-color, #C9A66B)" floodOpacity="0.6" result="color" />
        <feComposite in="color" in2="blur" operator="in" result="glow" />
        <feMerge>
          <feMergeNode in="glow" />
          <feMergeNode in="glow" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Inner glow for selected territories */}
      <filter id="territory-inner-glow" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
        <feComposite in="blur" in2="SourceGraphic" operator="in" result="inner" />
        <feFlood floodColor="#FFFFFF" floodOpacity="0.3" result="white" />
        <feComposite in="white" in2="inner" operator="in" result="innerGlow" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="innerGlow" />
        </feMerge>
      </filter>

      {/* Hand-drawn edge effect */}
      <filter id="hand-drawn-edge" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.02"
          numOctaves="2"
          seed="5"
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="2"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>

      {/* Water shimmer effect */}
      <filter id="water-shimmer" x="0" y="0" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.02 0.015"
          numOctaves="2"
          seed="20"
          result="waveNoise"
        />
        <feColorMatrix
          in="waveNoise"
          type="matrix"
          values="0 0 0 0 0.4
                  0 0 0 0 0.55
                  0 0 0 0 0.7
                  0 0 0 0.15 0"
          result="blueWaves"
        />
        <feBlend in="SourceGraphic" in2="blueWaves" mode="soft-light" />
      </filter>

      {/* Mountain shadow for depth */}
      <filter id="mountain-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="2" stdDeviation="1" floodColor="#3D2817" floodOpacity="0.4" />
      </filter>

      {/* Forest texture overlay */}
      <filter id="forest-texture" x="0" y="0" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.08"
          numOctaves="4"
          result="forestNoise"
        />
        <feColorMatrix
          in="forestNoise"
          type="matrix"
          values="0 0 0 0 0.2
                  0 0 0 0 0.35
                  0 0 0 0 0.15
                  0 0 0 0.2 0"
        />
        <feBlend in="SourceGraphic" in2="forestNoise" mode="multiply" />
      </filter>

      {/* Desert stipple pattern */}
      <filter id="desert-stipple" x="0" y="0" width="100%" height="100%">
        <feTurbulence
          type="turbulence"
          baseFrequency="0.15"
          numOctaves="1"
          seed="30"
          result="stipple"
        />
        <feColorMatrix
          in="stipple"
          type="matrix"
          values="0 0 0 0 0.85
                  0 0 0 0 0.75
                  0 0 0 0 0.55
                  0 0 0 0.15 0"
        />
        <feBlend in="SourceGraphic" in2="stipple" mode="multiply" />
      </filter>

      {/* Vignette effect for map edges */}
      <filter id="vignette" x="0" y="0" width="100%" height="100%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="50" result="blur" />
        <feComponentTransfer in="blur" result="vignette">
          <feFuncA type="linear" slope="0.7" intercept="0" />
        </feComponentTransfer>
        <feComposite in="SourceGraphic" in2="vignette" operator="in" />
      </filter>

      {/* Gradients */}
      <linearGradient id="parchment-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FAF6F0" />
        <stop offset="50%" stopColor="#F5EFE5" />
        <stop offset="100%" stopColor="#EBE3D5" />
      </linearGradient>

      <linearGradient id="water-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7BA3C9" />
        <stop offset="50%" stopColor="#5C8DB8" />
        <stop offset="100%" stopColor="#4A7AA8" />
      </linearGradient>

      <linearGradient id="land-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#E8DCC8" />
        <stop offset="100%" stopColor="#D4C4A8" />
      </linearGradient>

      <radialGradient id="city-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
        <stop offset="70%" stopColor="#FFD700" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
      </radialGradient>

      {/* Border frame gradient */}
      <linearGradient id="frame-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#C9A66B" />
        <stop offset="25%" stopColor="#A6854A" />
        <stop offset="50%" stopColor="#C9A66B" />
        <stop offset="75%" stopColor="#8B6914" />
        <stop offset="100%" stopColor="#C9A66B" />
      </linearGradient>

      {/* Wave pattern for water */}
      <pattern id="water-waves" patternUnits="userSpaceOnUse" width="30" height="15" patternTransform="rotate(0)">
        <path
          d="M0 7.5 Q7.5 0, 15 7.5 T30 7.5"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
      </pattern>

      {/* Hatched pattern for disputed territories */}
      <pattern id="disputed-hatch" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
      </pattern>

      {/* Compass needle gradients */}
      <linearGradient id="compass-north" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#722F37" />
        <stop offset="100%" stopColor="#A64D54" />
      </linearGradient>

      <linearGradient id="compass-south" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F5F0E8" />
        <stop offset="100%" stopColor="#D4C4A8" />
      </linearGradient>
    </defs>
  );
}
