import { useState } from 'react';

const TABS = [
  {
    id: 'home',
    label: 'Home',
    iconFilled: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M10.55 2.533a2 2 0 0 1 2.9 0l7 7.467A2 2 0 0 1 21 11.467V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8.533a2 2 0 0 1 .55-1.367l7-7.467ZM9 22h6v-6a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v6Z"/>
      </svg>
    ),
    iconOutline: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'patients',
    label: 'Patients',
    iconFilled: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" fill="currentColor" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    iconOutline: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'alerts',
    label: 'Alerts',
    iconFilled: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" fill="currentColor" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    iconOutline: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Profile',
    iconFilled: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" fill="currentColor" />
      </svg>
    ),
    iconOutline: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function BottomNav({ tab, setTab, alertCount = 0 }) {
  const [pressedId, setPressedId] = useState(null);

  return (
    <nav
      aria-label="Main navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        height: 'var(--bottom-h)',
        background: 'rgba(247,246,242,0.92)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderTop: '1px solid var(--border)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'stretch',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {TABS.map(t => {
        const isActive = t.id === tab;
        const hasAlert = t.id === 'alerts' && alertCount > 0;

        return (
          <button
            key={t.id}
            aria-label={t.label}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => setTab(t.id)}
            onMouseDown={() => setPressedId(t.id)}
            onMouseUp={() => setPressedId(null)}
            onMouseLeave={() => setPressedId(null)}
            onTouchStart={() => setPressedId(t.id)}
            onTouchEnd={() => setPressedId(null)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              color: isActive ? 'var(--accent)' : 'var(--text4)',
              background: 'none',
              border: 'none',
              transition: 'color 0.15s',
              transform: pressedId === t.id ? 'scale(0.88)' : 'scale(1)',
              transitionProperty: 'color, transform',
              position: 'relative',
              paddingTop: 6,
              paddingBottom: 2,
            }}
          >
            {/* Active indicator pill at top */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: isActive ? 20 : 0,
                height: 3,
                borderRadius: 99,
                background: 'var(--accent)',
                transition: 'width 0.25s var(--ease-spring)',
              }}
            />

            <div style={{ position: 'relative' }}>
              {isActive ? t.iconFilled : t.iconOutline}
              {hasAlert && (
                <span
                  style={{
                    position: 'absolute',
                    top: -3,
                    right: -4,
                    background: 'var(--danger)',
                    color: '#fff',
                    borderRadius: 99,
                    minWidth: 15,
                    height: 15,
                    fontSize: 9,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 3px',
                    border: '1.5px solid var(--surface)',
                  }}
                >
                  {alertCount > 9 ? '9+' : alertCount}
                </span>
              )}
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 'var(--fw-semibold)' : 'var(--fw-medium)',
                letterSpacing: isActive ? 0.1 : 0,
              }}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
