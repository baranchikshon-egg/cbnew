interface CaseIconProps {
  name: string;
  accentColor: string;
  size?: number;
  className?: string;
}

/**
 * 3D isometric CS-style weapon case rendered in SVG.
 * Uses the accent color for the rim/seal glow and metallic gradients
 * for the body. Pure SVG so it scales crisply at any size.
 */
export default function CaseIcon({ name, accentColor, size = 90, className = '' }: CaseIconProps) {
  const slug = name.replace(/[^a-z0-9]/gi, '');
  const initial = name.slice(0, 1).toUpperCase();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      style={{ filter: `drop-shadow(0 4px 14px ${accentColor}40)` }}
    >
      <defs>
        {/* Top face — brightest, lit from upper-left */}
        <linearGradient id={`top-${slug}`} x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%" stopColor="#3a3a3a" />
          <stop offset="55%" stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#181818" />
        </linearGradient>
        {/* Left face — mid tone */}
        <linearGradient id={`left-${slug}`} x1="0%" y1="0%" x2="100%" y2="20%">
          <stop offset="0%" stopColor="#222" />
          <stop offset="100%" stopColor="#0e0e0e" />
        </linearGradient>
        {/* Right face — darkest */}
        <linearGradient id={`right-${slug}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#070707" />
        </linearGradient>
        {/* Accent rim gradient */}
        <linearGradient id={`rim-${slug}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accentColor} />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.55" />
        </linearGradient>
        {/* Radial glow for the seal */}
        <radialGradient id={`seal-${slug}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.95" />
          <stop offset="60%" stopColor={accentColor} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
        </radialGradient>
        {/* Subtle scanline texture for the top face */}
        <pattern id={`lines-${slug}`} width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="none" />
          <line x1="0" y1="2" x2="4" y2="2" stroke="#ffffff" strokeWidth="0.3" opacity="0.04" />
        </pattern>
      </defs>

      {/* Ground shadow ellipse */}
      <ellipse cx="60" cy="104" rx="34" ry="6" fill="#000" opacity="0.5" />

      {/* === Isometric box === */}
      {/* Geometry: top center (60,32), top-left (24,52), top-right (96,52),
          bottom-left (24,92), bottom-right (96,92), front-bottom (60,112) */}

      {/* Right face */}
      <path d="M60 32 L96 52 L96 92 L60 112 Z" fill={`url(#right-${slug})`} stroke={`url(#rim-${slug})`} strokeWidth="1" />

      {/* Left face */}
      <path d="M60 32 L24 52 L24 92 L60 112 Z" fill={`url(#left-${slug})`} stroke={`url(#rim-${slug})`} strokeWidth="1" />

      {/* Bottom front edge — dark wedge */}
      <path d="M24 92 L60 112 L96 92" fill="none" stroke="#000" strokeWidth="1.5" opacity="0.6" />

      {/* Top face */}
      <path d="M60 32 L24 52 L60 72 L96 52 Z" fill={`url(#top-${slug})`} stroke={`url(#rim-${slug})`} strokeWidth="1.6" />
      <path d="M60 32 L24 52 L60 72 L96 52 Z" fill={`url(#lines-${slug})`} />

      {/* Accent rim strip along the top face front edge */}
      <line x1="24" y1="52" x2="60" y2="72" stroke={accentColor} strokeWidth="2" opacity="0.85" />
      <line x1="60" y1="72" x2="96" y2="52" stroke={accentColor} strokeWidth="2" opacity="0.6" />
      <line x1="60" y1="32" x2="24" y2="52" stroke={accentColor} strokeWidth="1.5" opacity="0.5" />
      <line x1="60" y1="32" x2="96" y2="52" stroke={accentColor} strokeWidth="1.5" opacity="0.35" />

      {/* Central seal on top face — glowing accent medallion */}
      <g transform="translate(60 52)">
        <circle r="14" fill={`url(#seal-${slug})`} />
        <circle r="9" fill="#111" stroke={accentColor} strokeWidth="1.5" />
        <circle r="6.5" fill="none" stroke={accentColor} strokeWidth="0.6" opacity="0.5" />
        <text
          x="0"
          y="3.5"
          textAnchor="middle"
          fontSize="9"
          fontWeight="700"
          fill={accentColor}
          fontFamily="Oswald, sans-serif"
          opacity="0.95"
        >
          {initial}
        </text>
      </g>

      {/* Corner rivets on the top face */}
      <circle cx="60" cy="32" r="1.8" fill={accentColor} opacity="0.7" />
      <circle cx="24" cy="52" r="1.5" fill={accentColor} opacity="0.45" />
      <circle cx="96" cy="52" r="1.5" fill={accentColor} opacity="0.45" />
      <circle cx="60" cy="72" r="1.5" fill={accentColor} opacity="0.55" />

      {/* Vertical accent strip on the left face */}
      <rect x="39" y="56" width="2" height="30" fill={accentColor} opacity="0.25" transform="skewY(-26)" />
      <rect x="76" y="56" width="2" height="30" fill={accentColor} opacity="0.18" transform="skewY(26)" />
    </svg>
  );
}
