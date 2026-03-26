import { useEffect, useRef, useState } from 'react';
import { stockStatus } from '../../utils/helpers';

function statusColor(status) {
  if (status === 'empty') return 'var(--danger)';
  if (status === 'low')   return 'var(--warn)';
  return 'var(--accent2)';
}

export default function StockBar({ medicine }) {
  const status = stockStatus(medicine);
  const color  = statusColor(status);
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);

  const max = Math.max(medicine.stock, medicine.refillAt * 3, 30);
  const pct = Math.min(100, Math.round((medicine.stock / max) * 100));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 'var(--fs-caption)', color: 'var(--text4)', fontWeight: 'var(--fw-medium)' }}>
          Stock remaining
        </span>
        <span style={{ fontSize: 'var(--fs-secondary)', fontFamily: 'var(--mono)', fontWeight: 'var(--fw-semibold)', color }}>
          {medicine.stock}
        </span>
      </div>
      <div style={{ height: 5, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: animated ? `${pct}%` : '0%',
            background: color,
            borderRadius: 99,
            transition: animated ? 'width 0.6s var(--ease-out)' : 'none',
          }}
        />
      </div>
      {status !== 'ok' && (
        <span
          style={{
            fontSize: 11,
            fontWeight: 'var(--fw-semibold)',
            color,
            background: status === 'empty' ? 'var(--danger-light)' : 'var(--warn-light)',
            padding: '2px 8px',
            borderRadius: 99,
            alignSelf: 'flex-start',
          }}
        >
          {status === 'empty'
            ? 'Out of stock'
            : `Refill when below ${medicine.refillAt}`}
        </span>
      )}
    </div>
  );
}
