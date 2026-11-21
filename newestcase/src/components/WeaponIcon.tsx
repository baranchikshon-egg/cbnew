import type { Rarity } from '@/lib/types';

interface WeaponIconProps {
  weapon: string;
  rarity: Rarity;
  size?: number;
  className?: string;
}

const RARITY_GRADIENTS: Record<Rarity, { from: string; to: string; glow: string }> = {
  consumer: { from: '#b0b0b0', to: '#6a6a6a', glow: 'rgba(176,176,176,0.3)' },
  milspec: { from: '#5e98d9', to: '#3a5a8a', glow: 'rgba(94,152,217,0.35)' },
  restricted: { from: '#4b69ff', to: '#2a3a9a', glow: 'rgba(75,105,255,0.4)' },
  classified: { from: '#8847ff', to: '#4a2a8a', glow: 'rgba(136,71,255,0.45)' },
  covert: { from: '#eb4b4b', to: '#8a2a2a', glow: 'rgba(235,75,75,0.5)' },
  rare_special: { from: '#ffd700', to: '#caab05', glow: 'rgba(255,215,0,0.55)' },
};

function getWeaponPath(weapon: string): string {
  const w = weapon.toLowerCase();

  // AK-47
  if (w.includes('ak-47') || w.includes('ak47'))
    return 'M10 40 L10 36 L18 36 L20 32 L20 28 L24 28 L24 24 L30 24 L30 20 L46 20 L46 24 L60 24 L60 28 L72 28 L72 32 L82 32 L82 36 L86 36 L86 40 L78 40 L78 44 L70 44 L68 48 L64 48 L64 44 L30 44 L30 48 L26 48 L24 44 L10 44 Z';

  // AWP / sniper
  if (w.includes('awp') || w.includes('ssg') || w.includes('scar') || w.includes('g3sg1'))
    return 'M4 38 L4 34 L12 34 L14 30 L14 26 L18 26 L18 22 L30 22 L30 26 L60 26 L60 30 L88 30 L88 34 L94 34 L94 38 L86 38 L86 42 L70 42 L70 46 L66 46 L66 42 L30 42 L30 46 L26 46 L26 42 L14 42 L14 46 L10 46 L10 42 L4 42 Z';

  // M4A4 / M4A1-S
  if (w.includes('m4a4') || w.includes('m4a1'))
    return 'M10 40 L10 36 L16 36 L18 32 L18 28 L22 28 L22 24 L28 24 L28 20 L44 20 L44 24 L58 24 L58 28 L72 28 L72 32 L84 32 L84 36 L88 36 L88 40 L80 40 L80 44 L72 44 L70 48 L66 48 L66 44 L28 44 L28 48 L24 48 L22 44 L10 44 Z';

  // Desert Eagle / pistol (large)
  if (w.includes('desert eagle') || w.includes('r8'))
    return 'M16 34 L16 30 L30 30 L30 26 L40 26 L40 22 L56 22 L56 26 L64 26 L64 30 L68 30 L68 34 L64 34 L64 42 L56 42 L56 38 L40 38 L40 42 L32 42 L32 38 L20 38 L20 46 L16 46 L16 38 L16 34 Z';

  // USP-S / P2000 / pistol (medium)
  if (w.includes('usp') || w.includes('p2000') || w.includes('p250') || w.includes('five-seven') || w.includes('glock') || w.includes('tec-9') || w.includes('dual berettas'))
    return 'M14 36 L14 32 L26 32 L26 28 L36 28 L36 24 L52 24 L52 28 L60 28 L60 32 L64 32 L64 36 L60 36 L60 44 L52 44 L52 40 L36 40 L36 44 L28 44 L28 40 L18 40 L18 46 L14 46 L14 40 Z';

  // P90 / SMG
  if (w.includes('p90') || w.includes('mp9') || w.includes('mp7') || w.includes('mp5') || w.includes('ump') || w.includes('mac-10'))
    return 'M12 38 L12 34 L20 34 L20 30 L26 30 L26 26 L34 26 L34 22 L50 22 L50 26 L60 26 L60 30 L72 30 L72 34 L78 34 L78 38 L70 38 L70 42 L60 42 L60 46 L56 46 L56 42 L30 42 L30 46 L26 46 L26 42 L18 42 L18 46 L14 46 L14 42 L12 42 Z';

  // FAMAS / Galil / rifle
  if (w.includes('famas') || w.includes('galil') || w.includes('sg 553') || w.includes('aug'))
    return 'M10 40 L10 36 L16 36 L18 32 L18 28 L22 28 L22 24 L28 24 L28 20 L44 20 L44 24 L58 24 L58 28 L72 28 L72 32 L82 32 L82 36 L86 36 L86 40 L78 40 L78 44 L70 44 L68 48 L64 48 L64 44 L28 44 L28 48 L24 48 L22 44 L10 44 Z';

  // Shotgun
  if (w.includes('nova') || w.includes('xm1014') || w.includes('sawed-off') || w.includes('mag-7'))
    return 'M12 38 L12 34 L22 34 L22 30 L28 30 L28 26 L40 26 L40 22 L60 22 L60 26 L76 26 L76 30 L82 30 L82 34 L86 34 L86 38 L80 38 L80 42 L70 42 L70 46 L66 46 L66 42 L30 42 L30 46 L26 46 L26 42 L16 42 L16 46 L12 46 L12 42 Z';

  // Heavy machine gun
  if (w.includes('m249') || w.includes('negev'))
    return 'M8 40 L8 36 L16 36 L18 32 L18 28 L22 28 L22 24 L30 24 L30 20 L52 20 L52 24 L66 24 L66 28 L78 28 L78 32 L86 32 L86 36 L90 36 L90 40 L82 40 L82 44 L72 44 L70 48 L66 48 L66 44 L28 44 L28 48 L24 48 L22 44 L8 44 Z';

  // Knife / blade
  if (w.includes('нож') || w.includes('knife') || w.includes('бабочка') || w.includes('керамбит') || w.includes('штык') || w.includes('перчатк'))
    return 'M20 24 L24 20 L28 22 L32 28 L38 36 L46 44 L54 50 L58 48 L56 44 L50 38 L44 32 L38 26 L34 22 L30 18 L26 16 L22 18 Z';

  // Zeus
  if (w.includes('zeus'))
    return 'M16 32 L16 28 L26 28 L26 24 L40 24 L40 20 L54 20 L54 24 L62 24 L62 28 L66 28 L66 32 L62 32 L62 40 L54 40 L54 36 L40 36 L40 40 L32 40 L32 36 L20 36 L20 44 L16 44 L16 36 Z';

  // Default fallback (generic gun)
  return 'M12 38 L12 34 L20 34 L20 30 L26 30 L26 26 L34 26 L34 22 L52 22 L52 26 L62 26 L62 30 L72 30 L72 34 L78 34 L78 38 L70 38 L70 42 L60 42 L60 46 L56 46 L56 42 L28 42 L28 46 L24 46 L24 42 L14 42 L14 46 L12 46 Z';
}

export default function WeaponIcon({ weapon, rarity, size = 80, className = '' }: WeaponIconProps) {
  const grad = RARITY_GRADIENTS[rarity];
  const path = getWeaponPath(weapon);
  const gradientId = `wpn-${rarity}-${weapon.replace(/[^a-z0-9]/gi, '')}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 56"
      className={className}
      style={{ filter: `drop-shadow(0 0 6px ${grad.glow})` }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={grad.from} />
          <stop offset="100%" stopColor={grad.to} />
        </linearGradient>
        <pattern id={`${gradientId}-pat`} x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill={`url(#${gradientId})`} />
          <path d="M0,3 L6,3 M3,0 L3,6" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <path d={path} fill={`url(#${gradientId}-pat)`} stroke={grad.from} strokeWidth="0.8" opacity="0.9" />
      <path d={path} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.4" />
    </svg>
  );
}
