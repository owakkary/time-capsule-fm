'use client';

import { AvatarStage } from '@/types';

interface ExplorerAvatarProps {
  stage: AvatarStage;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showGlow?: boolean;
}

const SIZE_MAP = {
  sm: 48,
  md: 80,
  lg: 120,
  xl: 180,
};

export default function ExplorerAvatar({
  stage,
  size = 'md',
  className = '',
  showGlow = false,
}: ExplorerAvatarProps) {
  const dimensions = SIZE_MAP[size];

  const glowClass = showGlow ? 'explorer-avatar-glow' : '';

  return (
    <div
      className={`relative inline-flex items-center justify-center ${glowClass} ${className}`}
      style={{ width: dimensions, height: dimensions }}
    >
      <svg
        viewBox="0 0 100 100"
        width={dimensions}
        height={dimensions}
        className="drop-shadow-md"
      >
        {/* Background circle with vintage parchment feel */}
        <defs>
          <radialGradient id={`avatarBg-${stage}`} cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FAF6F0" />
            <stop offset="100%" stopColor="#F0EBE3" />
          </radialGradient>
          <filter id="avatarShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#5C4033" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Outer ring */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="#C9A66B"
          strokeWidth="2"
          opacity="0.6"
        />

        {/* Inner background */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill={`url(#avatarBg-${stage})`}
          filter="url(#avatarShadow)"
        />

        {/* Stage-specific avatar illustration */}
        {renderAvatarStage(stage)}
      </svg>

      {/* Stage label */}
      {size !== 'sm' && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-brass rounded-sm">
          <span className="text-parchment text-xs font-display font-medium capitalize">
            {stage}
          </span>
        </div>
      )}
    </div>
  );
}

function renderAvatarStage(stage: AvatarStage) {
  switch (stage) {
    case 'wanderer':
      return <WandererAvatar />;
    case 'cartographer':
      return <CartographerAvatar />;
    case 'archaeologist':
      return <ArchaeologistAvatar />;
    case 'chronicler':
      return <ChroniclerAvatar />;
    case 'antiquarian':
      return <AntiquarianAvatar />;
    case 'timekeeper':
      return <TimekeeperAvatar />;
    default:
      return <WandererAvatar />;
  }
}

// Wanderer - Young explorer with worn traveling cloak
function WandererAvatar() {
  return (
    <g>
      {/* Cloak/hood */}
      <path
        d="M35 35 Q50 20 65 35 L70 75 Q50 85 30 75 Z"
        fill="#8B7355"
        opacity="0.9"
      />
      <path
        d="M38 38 Q50 25 62 38 L65 72 Q50 80 35 72 Z"
        fill="#A08060"
      />

      {/* Face */}
      <ellipse cx="50" cy="45" rx="12" ry="14" fill="#E8D4B8" />

      {/* Simple features */}
      <ellipse cx="45" cy="43" rx="2" ry="2.5" fill="#5C4033" />
      <ellipse cx="55" cy="43" rx="2" ry="2.5" fill="#5C4033" />
      <path d="M47 52 Q50 54 53 52" stroke="#8B7355" strokeWidth="1.5" fill="none" />

      {/* Map in hand */}
      <rect x="55" y="58" width="15" height="12" rx="1" fill="#F5E6D3" transform="rotate(-15 62 64)" />
      <path d="M58 61 L68 59 M58 64 L66 62 M58 67 L64 65" stroke="#C9A66B" strokeWidth="0.8" transform="rotate(-15 62 64)" />

      {/* Satchel */}
      <ellipse cx="32" cy="65" rx="8" ry="6" fill="#6B5240" />
      <path d="M26 62 Q32 58 38 62" stroke="#5C4033" strokeWidth="1.5" fill="none" />
    </g>
  );
}

// Cartographer - With compass and scroll case
function CartographerAvatar() {
  return (
    <g>
      {/* Hat */}
      <ellipse cx="50" cy="28" rx="18" ry="4" fill="#6B5240" />
      <path d="M32 28 Q32 18 50 18 Q68 18 68 28" fill="#8B7355" />

      {/* Face */}
      <ellipse cx="50" cy="42" rx="13" ry="14" fill="#E8D4B8" />

      {/* Features */}
      <ellipse cx="45" cy="40" rx="2" ry="2.5" fill="#5C4033" />
      <ellipse cx="55" cy="40" rx="2" ry="2.5" fill="#5C4033" />
      <path d="M46 50 Q50 53 54 50" stroke="#8B7355" strokeWidth="1.5" fill="none" />

      {/* Shirt/vest */}
      <path d="M35 55 L30 78 Q50 85 70 78 L65 55 Q50 60 35 55" fill="#A08060" />
      <path d="M40 55 L38 75 Q50 80 62 75 L60 55 Q50 58 40 55" fill="#C9A66B" />

      {/* Compass on belt */}
      <circle cx="50" cy="72" r="5" fill="#B87333" stroke="#8B7355" strokeWidth="1" />
      <path d="M50 68 L50 76 M46 72 L54 72" stroke="#5C4033" strokeWidth="1" />

      {/* Scroll case */}
      <rect x="65" y="58" width="6" height="18" rx="2" fill="#6B5240" />
      <ellipse cx="68" cy="58" rx="3" ry="1.5" fill="#8B7355" />
    </g>
  );
}

// Archaeologist - With vest, lantern, and tools
function ArchaeologistAvatar() {
  return (
    <g>
      {/* Fedora hat */}
      <ellipse cx="50" cy="25" rx="20" ry="5" fill="#5C4033" />
      <path d="M30 25 Q30 12 50 12 Q70 12 70 25" fill="#6B5240" />
      <path d="M35 25 Q35 18 50 18 Q65 18 65 25" fill="#8B7355" />

      {/* Face */}
      <ellipse cx="50" cy="40" rx="13" ry="13" fill="#E8D4B8" />

      {/* Features with slight stubble */}
      <ellipse cx="44" cy="38" rx="2.5" ry="2.5" fill="#5C4033" />
      <ellipse cx="56" cy="38" rx="2.5" ry="2.5" fill="#5C4033" />
      <path d="M45 48 Q50 51 55 48" stroke="#8B7355" strokeWidth="1.5" fill="none" />

      {/* Vest with pockets */}
      <path d="M33 52 L28 80 Q50 88 72 80 L67 52 Q50 58 33 52" fill="#8B7355" />
      <path d="M38 52 L35 78 Q50 84 65 78 L62 52 Q50 56 38 52" fill="#C9A66B" />
      {/* Pockets */}
      <rect x="38" y="62" width="8" height="6" rx="1" fill="#A08060" />
      <rect x="54" y="62" width="8" height="6" rx="1" fill="#A08060" />

      {/* Lantern */}
      <rect x="70" y="55" width="8" height="12" rx="1" fill="#C9A66B" stroke="#8B7355" strokeWidth="1" />
      <ellipse cx="74" cy="61" rx="2" ry="3" fill="#FFD700" opacity="0.6" />

      {/* Brush tool */}
      <rect x="22" y="60" width="3" height="12" fill="#6B5240" />
      <path d="M20 72 L27 72 L23.5 78 Z" fill="#A08060" />
    </g>
  );
}

// Chronicler - Academic robes with quill
function ChroniclerAvatar() {
  return (
    <g>
      {/* Academic cap */}
      <rect x="35" y="15" width="30" height="8" fill="#5C4033" />
      <polygon points="50,10 35,18 65,18" fill="#6B5240" />

      {/* Face with glasses */}
      <ellipse cx="50" cy="38" rx="12" ry="13" fill="#E8D4B8" />

      {/* Spectacles */}
      <circle cx="44" cy="36" r="5" fill="none" stroke="#B87333" strokeWidth="1" />
      <circle cx="56" cy="36" r="5" fill="none" stroke="#B87333" strokeWidth="1" />
      <path d="M49 36 L51 36" stroke="#B87333" strokeWidth="1" />
      <path d="M39 36 L32 34" stroke="#B87333" strokeWidth="1" />
      <path d="M61 36 L68 34" stroke="#B87333" strokeWidth="1" />

      {/* Eyes behind glasses */}
      <ellipse cx="44" cy="36" rx="1.5" ry="2" fill="#5C4033" />
      <ellipse cx="56" cy="36" rx="1.5" ry="2" fill="#5C4033" />

      <path d="M46 46 Q50 49 54 46" stroke="#8B7355" strokeWidth="1.5" fill="none" />

      {/* Academic robes */}
      <path d="M30 50 L25 82 Q50 90 75 82 L70 50 Q50 58 30 50" fill="#722F37" />
      <path d="M35 52 L32 78 Q50 85 68 78 L65 52 Q50 56 35 52" fill="#8B2332" />

      {/* Quill behind ear */}
      <path d="M68 30 Q72 25 75 15" stroke="#F5E6D3" strokeWidth="2" fill="none" />
      <path d="M75 15 L73 20 L77 18 Z" fill="#F5E6D3" />

      {/* Journal/book */}
      <rect x="58" y="60" width="12" height="15" rx="1" fill="#6B5240" />
      <rect x="60" y="62" width="8" height="11" fill="#F5E6D3" />
    </g>
  );
}

// Antiquarian - Distinguished elder with artifacts
function AntiquarianAvatar() {
  return (
    <g>
      {/* Distinguished gray hair */}
      <path d="M32 35 Q25 25 35 18 Q50 12 65 18 Q75 25 68 35" fill="#A0A0A0" />

      {/* Face - slightly aged */}
      <ellipse cx="50" cy="40" rx="13" ry="14" fill="#E8D4B8" />

      {/* Wise eyes */}
      <ellipse cx="44" cy="38" rx="2" ry="2" fill="#5C4033" />
      <ellipse cx="56" cy="38" rx="2" ry="2" fill="#5C4033" />
      {/* Crow's feet */}
      <path d="M38 38 L35 36 M38 40 L35 42" stroke="#C9A66B" strokeWidth="0.5" />
      <path d="M62 38 L65 36 M62 40 L65 42" stroke="#C9A66B" strokeWidth="0.5" />

      <path d="M46 48 Q50 50 54 48" stroke="#8B7355" strokeWidth="1.5" fill="none" />

      {/* Scholarly cape */}
      <path d="M25 48 L20 85 Q50 95 80 85 L75 48 Q50 60 25 48" fill="#2C1810" />
      <path d="M30 50 L27 82 Q50 90 73 82 L70 50 Q50 58 30 50" fill="#4A3728" />

      {/* Gold trim */}
      <path d="M30 50 Q50 58 70 50" stroke="#C9A66B" strokeWidth="2" fill="none" />

      {/* Floating artifact - small compass */}
      <circle cx="22" cy="35" r="6" fill="#B87333" opacity="0.8" />
      <circle cx="22" cy="35" r="4" fill="#C9A66B" />

      {/* Floating artifact - scroll */}
      <rect x="72" cy="30" width="8" height="12" rx="2" fill="#F5E6D3" opacity="0.8" />

      {/* Brass monocle */}
      <circle cx="56" cy="38" r="6" fill="none" stroke="#C9A66B" strokeWidth="1.5" />
      <path d="M62 38 L70 45" stroke="#C9A66B" strokeWidth="1" />
    </g>
  );
}

// Timekeeper - Mystical with hourglass motif
function TimekeeperAvatar() {
  return (
    <g>
      {/* Ethereal glow effect */}
      <defs>
        <radialGradient id="timekeeperGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C9A66B" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#C9A66B" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill="url(#timekeeperGlow)" />

      {/* Mystical hood/cowl */}
      <path d="M28 40 Q25 20 50 15 Q75 20 72 40 L75 80 Q50 90 25 80 Z" fill="#2C1810" />
      <path d="M32 42 Q30 25 50 20 Q70 25 68 42 L70 78 Q50 85 30 78 Z" fill="#4A3728" />

      {/* Face with slight glow */}
      <ellipse cx="50" cy="42" rx="12" ry="13" fill="#E8D4B8" />

      {/* Ancient, knowing eyes */}
      <ellipse cx="45" cy="40" rx="2" ry="2.5" fill="#C9A66B" />
      <ellipse cx="55" cy="40" rx="2" ry="2.5" fill="#C9A66B" />
      <ellipse cx="45" cy="40" rx="1" ry="1.5" fill="#5C4033" />
      <ellipse cx="55" cy="40" rx="1" ry="1.5" fill="#5C4033" />

      <path d="M46 50 Q50 52 54 50" stroke="#8B7355" strokeWidth="1.5" fill="none" />

      {/* Hourglass medallion */}
      <path d="M45 62 L55 62 L52 68 L55 74 L45 74 L48 68 Z" fill="#C9A66B" stroke="#B87333" strokeWidth="1" />
      {/* Sand in hourglass */}
      <path d="M47 64 L53 64 L50 67 Z" fill="#F5E6D3" />
      <path d="M47 72 L53 72 L50 69 Z" fill="#D4A574" />

      {/* Floating star particles */}
      <circle cx="25" cy="30" r="1.5" fill="#C9A66B" opacity="0.7" />
      <circle cx="75" cy="35" r="1" fill="#C9A66B" opacity="0.6" />
      <circle cx="30" cy="55" r="1" fill="#C9A66B" opacity="0.5" />
      <circle cx="70" cy="60" r="1.5" fill="#C9A66B" opacity="0.7" />
      <circle cx="22" cy="70" r="1" fill="#C9A66B" opacity="0.4" />
      <circle cx="78" cy="25" r="1" fill="#C9A66B" opacity="0.5" />

      {/* Astronomical instrument hint */}
      <circle cx="75" cy="50" r="8" fill="none" stroke="#C9A66B" strokeWidth="0.5" opacity="0.6" />
      <path d="M75 43 L75 57 M68 50 L82 50" stroke="#C9A66B" strokeWidth="0.5" opacity="0.6" />
    </g>
  );
}
