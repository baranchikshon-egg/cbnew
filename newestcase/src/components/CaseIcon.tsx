interface CaseIconProps {
  name: string;
  accentColor: string;
  size?: number;
  className?: string;
}

export default function CaseIcon({ name, accentColor, size = 90, className = '' }: CaseIconProps) {
  const slug = name.replace(/[^a-z0-9]/gi, '');
  const initial = name.slice(0, 1).toUpperCase();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 130"
      className={className}
      style={{ filter: `drop-shadow(0 6px 18px ${accentColor}40)` }}
    >
      <defs>
        <linearGradient id={`top-${slug}`} x1="0%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#424242" />
          <stop offset="40%" stopColor="#333" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>
        <linearGradient id={`left-${slug}`} x1="0%" y1="0%" x2="100%" y2="30%">
          <stop offset="0%" stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
        <linearGradient id={`right-${slug}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e1e1e" />
          <stop offset="100%" stopColor="#050505" />
        </linearGradient>
        <linearGradient id={`rim-${slug}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accentColor} stopOpacity="1" />
          <stop offset="50%" stopColor={accentColor} stopOpacity="0.7" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id={`topRim-${slug}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.9" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.3" />
        </linearGradient>
        <radialGradient id={`seal-${slug}`} cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor={accentColor} stopOpacity="1" />
          <stop offset="50%" stopColor={accentColor} stopOpacity="0.4" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`topGloss-${slug}`} cx="35%" cy="20%" r="80%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <pattern id={`lines-${slug}`} width="3" height="3" patternUnits="userSpaceOnUse">
          <rect width="3" height="3" fill="none" />
          <line x1="0" y1="1.5" x2="3" y2="1.5" stroke="#ffffff" strokeWidth="0.25" opacity="0.05" />
        </pattern>
        <filter id={`blur-${slug}`}>
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="60" cy="120" rx="36" ry="7" fill="#000" opacity="0.55" filter={`url(#blur-${slug})`} />

      {/* Isometric box: top center (60,34), top-left (24,54), top-right (96,54),
          bottom-left (24,96), bottom-right (96,96), front-bottom (60,116) */}

      {/* Right face */}
      <path d="M60 34 L96 54 L96 96 L60 116 Z" fill={`url(#right-${slug})`} />
      <path d="M60 34 L96 54 L96 96 L60 116 Z" fill="none" stroke={`url(#rim-${slug})`} strokeWidth="1.2" opacity="0.6" />

      {/* Left face */}
      <path d="M60 34 L24 54 L24 96 L60 116 Z" fill={`url(#left-${slug})`} />
      <path d="M60 34 L24 54 L24 96 L60 116 Z" fill="none" stroke={`url(#rim-${slug})`} strokeWidth="1.2" opacity="0.6" />

      {/* Bottom front edge — dark wedge */}
      <path d="M24 96 L60 116 L96 96" fill="#000" opacity="0.4" />

      {/* Top face */}
      <path d="M60 34 L24 54 L60 74 L96 54 Z" fill={`url(#top-${slug})`} />
      <path d="M60 34 L24 54 L60 74 L96 54 Z" fill={`url(#lines-${slug})`} />
      <path d="M60 34 L24 54 L60 74 L96 54 Z" fill={`url(#topGloss-${slug})`} />

      {/* Accent rim strips along the top face edges */}
      <line x1="24" y1="54" x2="60" y2="74" stroke={accentColor} strokeWidth="2.5" opacity="0.9" />
      <line x1="60" y1="74" x2="96" y2="54" stroke={accentColor} strokeWidth="2" opacity="0.65" />
      <line x1="60" y1="34" x2="24" y2="54" stroke={`url(#topRim-${slug})`} strokeWidth="2" />
      <line x1="60" y1="34" x2="96" y2="54" stroke={accentColor} strokeWidth="1.5" opacity="0.45" />

      {/* Inner panel border on top face — inset rectangle */}
      <path d="M60 40 L32 56 L60 72 L88 56 Z" fill="none" stroke={accentColor} strokeWidth="0.6" opacity="0.3" />

      {/* Central seal on top face — glowing accent medallion */}
      <g transform="translate(60 56)">
        <circle r="16" fill={`url(#seal-${slug})`} />
        <circle r="10" fill="#111" stroke={accentColor} strokeWidth="1.8" />
        <circle r="7.5" fill="none" stroke={accentColor} strokeWidth="0.5" opacity="0.5" />
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill={accentColor}
          fontFamily="Oswald, sans-serif"
        >
          {initial}
        </text>
      </g>

      {/* Corner rivets on the top face */}
      <circle cx="60" cy="34" r="2" fill={accentColor} opacity="0.8" />
      <circle cx="24" cy="54" r="1.6" fill={accentColor} opacity="0.5" />
      <circle cx="96" cy="54" r="1.6" fill={accentColor} opacity="0.5" />
      <circle cx="60" cy="74" r="1.6" fill={accentColor} opacity="0.6" />

      {/* Vertical accent strips on the left and right faces */}
      <rect x="40" y="58" width="1.8" height="30" fill={accentColor} opacity="0.25" transform="skewY(-26)" />
      <rect x="77" y="58" width="1.8" height="30" fill={accentColor} opacity="0.18" transform="skewY(26)" />

      {/* Highlight stripe on left face for depth */}
      <line x1="34" y1="56" x2="34" y2="96" stroke="#ffffff" strokeWidth="0.4" opacity="0.06" />
    </svg>
  );
}
