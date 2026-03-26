import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import TopNav from '../layout/TopNav';
import { stockStatus, doseKey, toMins } from '../../utils/helpers';

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function PatientsScreen({ patients, onSelect, onAdd, doseLog }) {
  return (
    <>
      <TopNav
        title="Patients"
        subtitle={`${patients.length} registered`}
        actions={
          <button
            aria-label="Add patient"
            onClick={onAdd}
            style={{
              height: 32,
              padding: '0 var(--sp-3)',
              borderRadius: 'var(--radius-xs)',
              background: 'var(--accent)',
              color: '#fff',
              fontSize: 'var(--fs-caption)',
              fontWeight: 'var(--fw-semibold)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--sp-1)',
              transition: 'transform 0.1s',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <PlusIcon />
            Add
          </button>
        }
      />

      <div className="scroll-content">
        <div style={{ padding: 'var(--sp-4)' }}>
          {patients.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--sp-8) var(--sp-6)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--border2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 12px' }}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
              <p style={{ fontSize: 'var(--fs-secondary)', fontWeight: 'var(--fw-semibold)', color: 'var(--text2)' }}>
                No patients yet
              </p>
              <p style={{ fontSize: 'var(--fs-caption)', color: 'var(--text3)', marginTop: 4 }}>
                Add your first patient to start tracking doses
              </p>
            </div>
          ) : (
            <div
              style={{
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow)',
                animation: 'slideUpFade 0.25s var(--ease-out) both',
              }}
            >
              {patients.map((patient, i) => {
                const lowStock   = patient.medicines.filter(m => stockStatus(m) !== 'ok').length;
                const totalMeds  = patient.medicines.length;
                const nowMins    = new Date().getHours() * 60 + new Date().getMinutes();
                const pendingCount = patient.medicines.flatMap(m =>
                  m.times.map((t, idx) => ({ key: `${patient.id}-${m.id}-${t}-${idx}`, mins: toMins(t) }))
                ).filter(d => !doseLog[d.key] && d.mins >= nowMins - 5).length;

                return (
                  <button
                    key={patient.id}
                    onClick={() => onSelect(patient.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--sp-3)',
                      padding: 'var(--sp-3) var(--sp-4)',
                      borderBottom: i < patients.length - 1 ? '1px solid var(--border)' : 'none',
                      background: 'var(--surface)',
                      width: '100%',
                      textAlign: 'left',
                      transition: 'background 0.12s, transform 0.1s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.99)'}
                    onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'var(--surface2)'; }}
                  >
                    <Avatar name={patient.name} size={44} fontSize={15} />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 4 }}>
                        <span style={{ fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-semibold)', color: 'var(--text)' }}>
                          {patient.name}
                        </span>
                        <span style={{ fontSize: 'var(--fs-caption)', color: 'var(--text4)' }}>
                          {patient.age}y
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                        {patient.conditions.map(c => (
                          <Badge key={c}>{c}</Badge>
                        ))}
                      </div>
                      {(pendingCount > 0 || lowStock > 0) && (
                        <div style={{ display: 'flex', gap: 'var(--sp-3)', marginTop: 6 }}>
                          {pendingCount > 0 && (
                            <span style={{ fontSize: 'var(--fs-caption)', fontWeight: 'var(--fw-medium)', color: 'var(--accent)' }}>
                              {pendingCount} pending
                            </span>
                          )}
                          {lowStock > 0 && (
                            <span style={{ fontSize: 'var(--fs-caption)', fontWeight: 'var(--fw-medium)', color: 'var(--warn)' }}>
                              {lowStock} low stock
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <span style={{ color: 'var(--text4)', flexShrink: 0 }}>
                      <ChevronRight />
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
