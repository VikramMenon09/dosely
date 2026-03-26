export default function MediTrackLogo({ size = 36, color = '#0B6E61', variant = 'full' }) {
  const scale = size / 36;

  // Arc geometry: center (18,18), radius 13, 270° sweep, gap at bottom
  // Start: 225° → (8.808, 27.192)   End: 315° → (27.192, 27.192)
  const cx = 18 * scale;
  const cy = 18 * scale;
  const r = 13 * scale;
  const gapRad = (45 * Math.PI) / 180;
  const startX = (cx - r * Math.sin(gapRad)).toFixed(3);
  const startY = (cy + r * Math.cos(gapRad)).toFixed(3);
  const endX = (cx + r * Math.sin(gapRad)).toFixed(3);
  const endY = startY;

  // Pill geometry: centered at (18,18), 14×6, rx=3
  const pillW = 14 * scale;
  const pillH = 6 * scale;
  const pillX = 11 * scale;
  const pillY = 15 * scale;
  const pillRx = 3 * scale;

  const strokeW = 3 * scale;
  const lineW = 1.4 * scale;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 * scale, userSelect: 'none' }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="MediTrack"
        role="img"
      >
        {/* 270° tracking arc — gap at bottom */}
        <path
          d={`M ${startX} ${startY} A ${r} ${r} 0 1 1 ${endX} ${endY}`}
          stroke={color}
          strokeWidth={strokeW}
          strokeLinecap="round"
        />
        {/* Pill capsule */}
        <rect x={pillX} y={pillY} width={pillW} height={pillH} rx={pillRx} fill={color} />
        {/* Score line through pill center */}
        <line
          x1={cx} y1={pillY + 0.5 * scale}
          x2={cx} y2={pillY + pillH - 0.5 * scale}
          stroke="white"
          strokeWidth={lineW}
          strokeLinecap="round"
        />
      </svg>

      {variant === 'full' && (
        <span style={{
          fontSize: 15 * scale,
          fontWeight: 600,
          color: 'var(--text)',
          letterSpacing: -0.2,
          lineHeight: 1,
        }}>
          MediTrack
        </span>
      )}
    </div>
  );
}
