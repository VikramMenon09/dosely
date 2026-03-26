import { useState } from 'react';

export default function Card({ children, style = {}, onClick, hoverable = false, padding = '16px' }) {
  const [pressed, setPressed] = useState(false);

  const isClickable = !!onClick || hoverable;

  return (
    <div
      onClick={onClick}
      onMouseDown={() => isClickable && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => isClickable && setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        padding,
        transition: 'box-shadow 0.15s ease, transform 0.1s ease',
        cursor: onClick ? 'pointer' : 'default',
        transform: pressed ? 'scale(0.975)' : 'scale(1)',
        ...(isClickable && !pressed ? {
          ':hover': { boxShadow: 'var(--shadow)', transform: 'translateY(-1px)' },
        } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
