import { useState, useRef, useLayoutEffect } from 'react';
import { USERS } from '../../data/mockData';
import DoselyLogo from '../ui/DoselyLogo';

const DEMO_ACCOUNTS = [
  { label: 'Admin',     email: 'admin@example.com',  password: 'admin123',  role: 'Administrator' },
  { label: 'Caregiver', email: 'caregiver@example.com', password: 'caregiver123',  role: 'Caregiver' },
  { label: 'Patient',   email: 'patient@example.com', password: 'patient123', role: 'Patient view' },
];

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

const inputStyle = {
  height: 48,
  padding: '0 16px',
  borderRadius: 'var(--radius-xs)',
  border: '1.5px solid var(--border2)',
  fontSize: 'var(--fs-body)',
  color: 'var(--text)',
  background: 'var(--surface)',
  width: '100%',
  transition: 'border-color 0.15s',
};

export default function LoginScreen({ onLogin, onDemo }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const cardRef = useRef(null);
  const [cardH, setCardH] = useState(0);
  const touchStartY = useRef(0);
  const touchStartScrollTop = useRef(0);

  // Measure card height synchronously before first paint
  useLayoutEffect(() => {
    if (cardRef.current) {
      setCardH(cardRef.current.scrollHeight);
    }
  }, []);

  function submit(em, pw) {
    setError('');
    setLoading(true);
    setTimeout(() => {
      const user = USERS.find(
        u => u.email.toLowerCase() === em.toLowerCase().trim() && u.password === pw
      );
      if (user) {
        onLogin(user);
      } else {
        setError('Incorrect email or password');
        setLoading(false);
      }
    }, 400);
  }

  function handleSubmit(e) {
    e.preventDefault();
    submit(email, password);
  }

  function continueAs(acc) {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
    submit(acc.email, acc.password);
  }

  // ── Gesture handlers ──────────────────────────────────────────
  function handleTouchStart(e) {
    touchStartY.current = e.touches[0].clientY;
    touchStartScrollTop.current = cardRef.current?.scrollTop ?? 0;
  }

  function handleTouchMove(e) {
    const dy = touchStartY.current - e.touches[0].clientY; // positive = finger moved up
    if (!expanded && dy > 40) {
      setExpanded(true);
    } else if (expanded && dy < -50 && touchStartScrollTop.current === 0) {
      setExpanded(false);
    }
  }

  function handleWheel(e) {
    if (!expanded && e.deltaY < 0) {
      setExpanded(true);                                          // scroll up → expand
    } else if (expanded && e.deltaY > 0 && (cardRef.current?.scrollTop ?? 0) === 0) {
      setExpanded(false);                                         // scroll down at top → collapse
    }
  }

  return (
    <div
      style={{
        height: '100dvh',
        overflow: 'hidden',
        background: 'var(--bg)',
        position: 'relative',
        isolation: 'isolate',
      }}
    >
      {/* ── Hero area ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: cardH ? `min(${cardH}px, 62dvh)` : '62dvh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: 'var(--sp-8) var(--sp-6) var(--sp-6)',
          opacity: expanded ? 0 : 1,
          transform: expanded ? 'scale(0.96) translateY(-12px)' : 'scale(1) translateY(0)',
          transition: 'opacity 0.38s ease, transform 0.42s cubic-bezier(0.32, 0.72, 0, 1)',
          pointerEvents: expanded ? 'none' : 'auto',
          animation: 'slideUpFade 0.35s var(--ease-out) both',
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: 'var(--sp-6)' }}>
          <DoselyLogo size={36} />
        </div>

        {/* Editorial heading */}
        <h1
          style={{
            fontSize: 'var(--fs-hero)',
            fontWeight: 'var(--fw-bold)',
            color: 'var(--text)',
            lineHeight: 1.18,
            letterSpacing: -0.8,
            marginBottom: 'var(--sp-3)',
            maxWidth: 280,
          }}
        >
          Every dose,<br />on time.
        </h1>
        <p
          style={{
            fontSize: 'var(--fs-body)',
            color: 'var(--text3)',
            fontWeight: 'var(--fw-regular)',
            lineHeight: 1.55,
            maxWidth: 260,
          }}
        >
          Medicine management for caregivers and families.
        </p>
      </div>

      {/* ── Form card (bottom sheet) ── */}
      <div
        ref={cardRef}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: expanded
            ? '100dvh'
            : cardH
            ? `min(${cardH}px, 62dvh)`
            : '62dvh',
          overflowY: expanded ? 'auto' : 'hidden',
          background: 'var(--surface)',
          borderRadius: '12px 12px 0 0',
          boxShadow: '0 -4px 32px rgba(0,0,0,0.07), 0 -1px 0 var(--border)',
          transition: 'height 0.48s cubic-bezier(0.32, 0.72, 0, 1), border-radius 0.32s ease',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sp-4)',
          padding: 'var(--sp-6)',
          paddingTop: expanded
            ? 'calc(env(safe-area-inset-top, 16px) + 20px)'
            : 'var(--sp-6)',
          paddingBottom: 'calc(var(--sp-6) + env(safe-area-inset-bottom))',
          animation: 'slideUpFade 0.4s 0.08s var(--ease-spring) both',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Drag handle pill */}
        <div
          style={{
            width: 36,
            height: 4,
            background: 'var(--border2)',
            borderRadius: 2,
            alignSelf: 'center',
            marginBottom: 4,
            flexShrink: 0,
            opacity: 0.55,
            cursor: 'grab',
          }}
        />

        {/* Logo inside card — only when expanded */}
        {expanded && (
          <div style={{ animation: 'slideUpFade 0.28s ease both', marginBottom: 4 }}>
            <DoselyLogo size={28} />
          </div>
        )}

        {/* ── Try the demo (no account needed) ── */}
        <button
          type="button"
          onClick={onDemo}
          style={{
            flexShrink: 0,
            height: 56,
            borderRadius: 'var(--radius-xs)',
            background: 'var(--accent)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            transition: 'transform 0.1s, filter 0.15s',
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'none'; }}
          onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.08)'}
        >
          <span style={{ fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-semibold)', display: 'flex', alignItems: 'center', gap: 8 }}>
            Try the demo <ArrowRight />
          </span>
          <span style={{ fontSize: 'var(--fs-caption)', opacity: 0.85 }}>
            No account needed · loads sample patients
          </span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', flexShrink: 0 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 'var(--fs-caption)', color: 'var(--text4)', fontWeight: 'var(--fw-medium)' }}>or sign in</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          <div>
            <label
              htmlFor="email"
              style={{ fontSize: 'var(--fs-secondary)', fontWeight: 'var(--fw-semibold)', color: 'var(--text2)', display: 'block', marginBottom: 'var(--sp-1)' }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              required
              style={{ ...inputStyle, borderColor: error ? 'var(--danger)' : undefined }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border2)'}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{ fontSize: 'var(--fs-secondary)', fontWeight: 'var(--fw-semibold)', color: 'var(--text2)', display: 'block', marginBottom: 'var(--sp-1)' }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                required
                style={{ ...inputStyle, paddingRight: 56, borderColor: error ? 'var(--danger)' : undefined }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border2)'}
              />
              <button
                type="button"
                aria-label={showPass ? 'Hide password' : 'Show password'}
                onClick={() => setShowPass(v => !v)}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 10,
                  fontWeight: 'var(--fw-semibold)',
                  color: 'var(--text4)',
                  letterSpacing: 0.6,
                  textTransform: 'uppercase',
                }}
              >
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
            {error && (
              <span role="alert" style={{ fontSize: 'var(--fs-caption)', color: 'var(--danger)', fontWeight: 'var(--fw-medium)', display: 'block', marginTop: 4, animation: 'fadeIn 0.15s' }}>
                {error}
              </span>
            )}
          </div>

          {/* Sign in button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              height: 52,
              borderRadius: 'var(--radius-xs)',
              background: loading ? 'var(--text3)' : 'var(--text)',
              color: '#fff',
              fontSize: 'var(--fs-body)',
              fontWeight: 'var(--fw-semibold)',
              letterSpacing: 0.1,
              transition: 'background 0.15s, transform 0.1s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 'var(--sp-1)',
            }}
            onMouseDown={e => !loading && (e.currentTarget.style.transform = 'scale(0.98)')}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {loading ? (
              <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            ) : 'Sign in'}
          </button>
        </form>

        {/* Divider before demo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 'var(--fs-caption)', color: 'var(--text4)', fontWeight: 'var(--fw-medium)', whiteSpace: 'nowrap' }}>
            Or pick a demo role
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        {/* Demo accounts */}
        <div
          style={{
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            overflow: 'hidden',
            background: 'var(--surface)',
          }}
        >
          {DEMO_ACCOUNTS.map((acc, i) => (
            <button
              key={acc.label}
              onClick={() => continueAs(acc)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--sp-3) var(--sp-4)',
                borderBottom: i < DEMO_ACCOUNTS.length - 1 ? '1px solid var(--border)' : 'none',
                background: 'transparent',
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              onMouseDown={e => e.currentTarget.style.background = 'var(--surface3)'}
              onMouseUp={e => e.currentTarget.style.background = 'var(--surface2)'}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-semibold)', color: 'var(--text)' }}>
                  Continue as {acc.label}
                </div>
                <div style={{ fontSize: 'var(--fs-caption)', color: 'var(--text4)', marginTop: 2 }}>
                  {acc.role}
                </div>
              </div>
              <span style={{ color: 'var(--text4)' }}>
                <ArrowRight />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
