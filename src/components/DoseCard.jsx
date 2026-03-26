import { useState } from 'react';
import { timeLabel, isPast } from '../utils/helpers';

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SkipIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function UndoIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-4.21" />
    </svg>
  );
}

export default function DoseCard({ medicine, time, doseKey, status, onMark }) {
  const [pressed, setPressed] = useState(null);

  const isTaken  = status === 'taken';
  const isSkipped = status === 'skipped';
  const isMissed = status === 'missed';
  const isMarked = isTaken || isSkipped;
  const past     = isPast(time);

  function mark(s) {
    onMark(doseKey, s);
  }

  // Left accent border color
  let borderLeft = '3px solid transparent';
  if (isTaken)  borderLeft = '3px solid var(--accent2)';
  if (isMissed) borderLeft = '3px solid var(--warn)';
  if (isSkipped) borderLeft = '3px solid var(--border2)';

  // Card background
  let bg = 'var(--surface)';
  if (isMissed) bg = 'var(--warn-light)';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--sp-3)',
        padding: 'var(--sp-3) var(--sp-4)',
        borderRadius: 'var(--radius-xs)',
        background: bg,
        border: '1px solid var(--border)',
        borderLeft,
        transition: 'background 0.2s, border-left-color 0.2s, transform 0.1s',
        transform: pressed ? 'scale(0.98)' : 'scale(1)',
      }}
    >
      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 'var(--fs-body)',
            fontWeight: 'var(--fw-semibold)',
            color: isSkipped ? 'var(--text4)' : 'var(--text)',
            textDecoration: isSkipped ? 'line-through' : 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginBottom: 2,
          }}
        >
          {medicine.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: 'var(--fs-caption)',
              color: isTaken ? 'var(--accent2)' : isMissed ? 'var(--warn)' : 'var(--text3)',
              fontWeight: 'var(--fw-medium)',
            }}
          >
            {timeLabel(time)}
          </span>
          <span style={{ color: 'var(--border2)', fontSize: 10 }}>·</span>
          <span style={{ fontSize: 'var(--fs-caption)', color: 'var(--text4)', fontWeight: 'var(--fw-regular)' }}>
            {medicine.dose}
          </span>
          {isMissed && (
            <>
              <span style={{ color: 'var(--border2)', fontSize: 10 }}>·</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 'var(--fw-semibold)',
                  color: 'var(--warn)',
                  background: 'var(--warn-light)',
                  padding: '1px 6px',
                  borderRadius: 99,
                }}
              >
                Missed
              </span>
            </>
          )}
        </div>
      </div>

      {/* Status / Actions */}
      {isTaken && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--accent2)',
              background: 'var(--accent2-light)',
              padding: '2px 8px',
              borderRadius: 99,
            }}
          >
            Taken
          </span>
          <button
            aria-label="Undo taken"
            onClick={() => mark(null)}
            style={{
              width: 28,
              height: 28,
              borderRadius: 'var(--radius-xs)',
              background: 'var(--surface3)',
              color: 'var(--text4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <UndoIcon />
          </button>
        </div>
      )}

      {isSkipped && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 'var(--fw-medium)',
              color: 'var(--text4)',
              background: 'var(--surface3)',
              padding: '2px 8px',
              borderRadius: 99,
            }}
          >
            Skipped
          </span>
          <button
            aria-label="Undo skip"
            onClick={() => mark(null)}
            style={{
              width: 28,
              height: 28,
              borderRadius: 'var(--radius-xs)',
              background: 'var(--surface3)',
              color: 'var(--text4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <UndoIcon />
          </button>
        </div>
      )}

      {isMissed && (
        <button
          onClick={() => mark('taken')}
          style={{
            fontSize: 12,
            fontWeight: 'var(--fw-semibold)',
            color: 'var(--accent)',
            padding: 'var(--sp-1) var(--sp-2)',
            borderRadius: 'var(--radius-xs)',
            background: 'var(--accent-light)',
            whiteSpace: 'nowrap',
          }}
        >
          Take now
        </button>
      )}

      {!isMarked && !isMissed && (
        <div style={{ display: 'flex', gap: 'var(--sp-1)' }}>
          <button
            aria-label={`Mark ${medicine.name} as taken`}
            onClick={() => mark('taken')}
            onMouseDown={() => setPressed('take')}
            onMouseUp={() => setPressed(null)}
            onMouseLeave={() => setPressed(null)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-xs)',
              background: past ? 'var(--accent2)' : 'var(--accent2-light)',
              color: past ? '#fff' : 'var(--accent2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s, transform 0.1s',
              transform: pressed === 'take' ? 'scale(0.9)' : 'scale(1)',
            }}
          >
            <CheckIcon />
          </button>
          <button
            aria-label={`Skip ${medicine.name}`}
            onClick={() => mark('skipped')}
            onMouseDown={() => setPressed('skip')}
            onMouseUp={() => setPressed(null)}
            onMouseLeave={() => setPressed(null)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-xs)',
              background: 'var(--surface2)',
              color: 'var(--text4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s, transform 0.1s',
              transform: pressed === 'skip' ? 'scale(0.9)' : 'scale(1)',
            }}
          >
            <SkipIcon />
          </button>
        </div>
      )}
    </div>
  );
}
