import Avatar from '../ui/Avatar';
import TopNav from '../layout/TopNav';

const ROLE_LABELS = { admin: 'Administrator', caregiver: 'Caregiver', patient: 'Patient' };

function Row({ icon, label, subtitle, onClick, danger, right }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--sp-3)',
        padding: 'var(--sp-3) var(--sp-4)',
        width: '100%',
        textAlign: 'left',
        borderBottom: '1px solid var(--border)',
        transition: 'background 0.1s',
        background: 'none',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'none'}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 'var(--radius-xs)',
          background: danger ? 'var(--danger-light)' : 'var(--surface2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: danger ? 'var(--danger)' : 'var(--text3)',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-medium)', color: danger ? 'var(--danger)' : 'var(--text)' }}>
          {label}
        </div>
        {subtitle && (
          <div style={{ fontSize: 'var(--fs-caption)', color: 'var(--text4)', marginTop: 1 }}>{subtitle}</div>
        )}
      </div>
      {right || (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--border2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      )}
    </button>
  );
}

function Toggle({ label, enabled, onChange }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--sp-3) var(--sp-4)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <span style={{ fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-medium)', color: 'var(--text)' }}>
        {label}
      </span>
      <button
        role="switch"
        aria-checked={enabled}
        onClick={onChange}
        style={{
          width: 42,
          height: 24,
          borderRadius: 99,
          background: enabled ? 'var(--accent)' : 'var(--border2)',
          transition: 'background 0.2s',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 3,
            left: enabled ? 21 : 3,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            transition: 'left 0.2s var(--ease-spring)',
          }}
        />
      </button>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div
      style={{
        fontSize: 'var(--fs-caption)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text4)',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        padding: 'var(--sp-3) var(--sp-4) var(--sp-1)',
      }}
    >
      {children}
    </div>
  );
}

export default function ProfileScreen({ user, notifEnabled, onRequestNotif, onLogout }) {
  return (
    <>
      <TopNav title="Profile" />

      <div className="scroll-content">
        <div style={{ animation: 'slideUpFade 0.25s var(--ease-out)' }}>

          {/* User card */}
          <div style={{ padding: 'var(--sp-4)', paddingBottom: 'var(--sp-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
              <Avatar name={user.name} size={52} fontSize={18} />
              <div>
                <div style={{ fontSize: 'var(--fs-section)', fontWeight: 'var(--fw-semibold)', color: 'var(--text)', marginBottom: 4 }}>
                  {user.name}
                </div>
                <div style={{ fontSize: 'var(--fs-secondary)', color: 'var(--text3)', marginBottom: 6 }}>
                  {user.email}
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 'var(--fw-semibold)',
                    color: 'var(--accent)',
                    padding: '2px 8px',
                    borderRadius: 99,
                    background: 'var(--accent-light)',
                    letterSpacing: 0.2,
                  }}
                >
                  {ROLE_LABELS[user.role]}
                </span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)' }}>
            <SectionLabel>Notifications</SectionLabel>
            <div>
              <Toggle label="Dose reminders" enabled={notifEnabled} onChange={onRequestNotif} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--sp-3) var(--sp-4)', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-medium)', color: 'var(--text4)' }}>SMS alerts</span>
                <span style={{ fontSize: 11, fontWeight: 'var(--fw-semibold)', color: 'var(--warn)', padding: '2px 8px', borderRadius: 99, background: 'var(--warn-light)' }}>Soon</span>
              </div>
            </div>

            <SectionLabel>App</SectionLabel>
            <div>
              <Row
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>}
                label="Settings"
                subtitle="Theme, language"
                onClick={() => {}}
              />
              <Row
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
                label="About Dosely"
                subtitle="Version 2.0.0"
                onClick={() => {}}
              />
              <Row
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>}
                label="Sign out"
                onClick={onLogout}
                danger
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
