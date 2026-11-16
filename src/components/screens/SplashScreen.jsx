import { useEffect } from 'react';
import DoselyLogo from '../ui/DoselyLogo';

const LETTERS = ['D', 'O', 'S', 'E', 'L', 'Y'];

// Total timeline:
//   0–0.7s  : letters fade+slide in (staggered 80ms each)
//   0.85s   : letters start fading out (scale down)
//   1.1s    : icon starts fading in
//   1.6s    : icon fully visible, hold
//   2.1s    : whole splash fades out
//   2.5s    : onDone() called

export default function SplashScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <>
      <style>{`
        @keyframes dosely-letter-in {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dosely-letter-out {
          0%   { opacity: 1; transform: scale(1) translateY(0); }
          100% { opacity: 0; transform: scale(0.3) translateY(6px); }
        }
        @keyframes dosely-icon-in {
          0%   { opacity: 0; transform: scale(0.55); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes dosely-splash-out {
          from { opacity: 1; }
          to   { opacity: 0; }
        }

        .dosely-letter {
          display: inline-block;
          opacity: 0;
          animation-name: dosely-letter-in, dosely-letter-out;
          animation-duration: 0.42s, 0.32s;
          animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1), ease-in;
          animation-fill-mode: both, forwards;
        }

        .dosely-icon-wrap {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          animation: dosely-icon-in 0.55s 1.05s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .dosely-splash-wrap {
          animation: dosely-splash-out 0.4s 2.1s ease-in forwards;
        }
      `}</style>

      <div
        className="dosely-splash-wrap"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        {/* Letters row */}
        <div
          style={{
            display: 'flex',
            gap: 1,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              className="dosely-letter"
              style={{
                fontSize: 52,
                fontWeight: 700,
                color: 'var(--text)',
                letterSpacing: -1,
                lineHeight: 1,
                fontFamily: 'DM Sans, system-ui, sans-serif',
                // letter-in delay: staggered 80ms each
                animationDelay: `${i * 0.08}s, 0.82s`,
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Icon — fades in as letters fade out */}
        <div className="dosely-icon-wrap">
          <DoselyLogo size={64} variant="icon" />
        </div>
      </div>
    </>
  );
}
