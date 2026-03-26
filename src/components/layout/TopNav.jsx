import { useState } from 'react';

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export default function TopNav({ title, subtitle, onBack, actions }) {
  const [backPressed, setBackPressed] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        height: 'var(--nav-h)',
        background: 'rgba(247,246,242,0.88)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid var(--border)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        padding: '0 var(--sp-4)',
        gap: 'var(--sp-3)',
      }}
    >
      {onBack && (
        <button
          aria-label="Go back"
          onMouseDown={() => setBackPressed(true)}
          onMouseUp={() => setBackPressed(false)}
          onMouseLeave={() => setBackPressed(false)}
          onTouchStart={() => setBackPressed(true)}
          onTouchEnd={() => setBackPressed(false)}
          onClick={onBack}
          style={{
            width: 32,
            height: 32,
            borderRadius: 'var(--radius-xs)',
            background: backPressed ? 'var(--surface3)' : 'var(--surface2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text2)',
            transition: 'background 0.1s, transform 0.1s',
            transform: backPressed ? 'scale(0.93)' : 'scale(1)',
            flexShrink: 0,
          }}
        >
          <ChevronLeft />
        </button>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: subtitle ? 'var(--fs-section)' : 'var(--fs-section)',
            fontWeight: 'var(--fw-semibold)',
            color: 'var(--text)',
            letterSpacing: -0.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 1.3,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: 'var(--fs-caption)',
              color: 'var(--text4)',
              fontWeight: 'var(--fw-regular)',
              marginTop: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {actions && (
        <div style={{ display: 'flex', gap: 'var(--sp-2)', alignItems: 'center', flexShrink: 0 }}>
          {actions}
        </div>
      )}
    </div>
  );
}
