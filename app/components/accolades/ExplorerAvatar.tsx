'use client';

import { AvatarStage } from '@/types';
import Image from 'next/image';

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

const AVATAR_IMAGES: Record<AvatarStage, string> = {
  wanderer: '/avatars/wanderer.png',
  cartographer: '/avatars/cartographer.png',
  archaeologist: '/avatars/archaeologist.png',
  chronicler: '/avatars/chronicler.png',
  antiquarian: '/avatars/antiquarian.png',
  timekeeper: '/avatars/timekeeper.png',
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
      <div
        className="relative rounded-full overflow-hidden border-2 border-brass/60 shadow-md"
        style={{ width: dimensions, height: dimensions }}
      >
        <Image
          src={AVATAR_IMAGES[stage]}
          alt={`${stage} avatar`}
          width={dimensions}
          height={dimensions}
          className="object-cover"
          priority={size === 'xl' || size === 'lg'}
        />
      </div>

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
