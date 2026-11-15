import { useEffect, useState, useCallback } from 'react';

export default function Toast({ message, type = 'success', onDismiss }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setExiting(true), 3000);
    const t2 = setTimeout(() => onDismiss(), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDismiss]);

  const colors = {
    success: { bg: 'var(--accent2)', icon: '✓' },
    error:   { bg: 'var(--danger)',  icon: '✕' },
    warn:    { bg: 'var(--warn)',    icon: '!' },
    info:    { bg: 'var(--accent)',  icon: 'i' },
  };
  const { bg, icon } = colors[type] || colors.info;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 'calc(var(--bottom-h) + 16px)',
        left: 0,
        right: 0,
        margin: '0 auto',
        zIndex: 1000,
        animation: exiting
          ? 'toastOut 0.35s var(--ease-in) forwards'
          : 'toastIn 0.3s var(--ease-spring) forwards',
        maxWidth: 340,
        width: 'calc(100% - 32px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'var(--text)',
          color: '#fff',
          borderRadius: 14,
          padding: '12px 16px',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.4 }}>{message}</span>
      </div>
    </div>
  );
}

// Toast manager hook
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, showToast, dismissToast };
}
