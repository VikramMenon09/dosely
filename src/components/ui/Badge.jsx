export default function Badge({ children, color = 'var(--text3)', bg = 'var(--surface3)', style = {} }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--sp-1)',
        padding: '2px 8px',
        borderRadius: 99,
        fontSize: 'var(--fs-caption)',
        fontWeight: 'var(--fw-medium)',
        color,
        background: bg,
        letterSpacing: 0.1,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  );
}
