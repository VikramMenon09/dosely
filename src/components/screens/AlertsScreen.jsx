import TopNav from '../layout/TopNav';
import { timeLabel, toMins, stockStatus, formatRelativeTime } from '../../utils/helpers';

function SectionLabel({ children, count, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-2)' }}>
      <span style={{ fontSize: 'var(--fs-secondary)', fontWeight: 'var(--fw-semibold)', color: 'var(--text2)' }}>
        {children}
      </span>
      <span
        style={{
          fontSize: 11,
          fontWeight: 'var(--fw-semibold)',
          background: color || 'var(--danger)',
          color: '#fff',
          borderRadius: 99,
          padding: '1px 7px',
        }}
      >
        {count}
      </span>
    </div>
  );
}

function AlertRow({ left, title, subtitle, right, borderColor }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--sp-3)',
        padding: 'var(--sp-3) var(--sp-4)',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        borderLeft: `3px solid ${borderColor}`,
      }}
    >
      {left}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-semibold)', color: 'var(--text)' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 'var(--fs-caption)', color: 'var(--text4)', marginTop: 2 }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}

export default function AlertsScreen({ patients, doseLog }) {
  const now     = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();

  const overdue  = [];
  const upcoming = [];
  const lowStock = [];

  patients.forEach(p => {
    p.medicines.forEach(m => {
      m.times.forEach((t, i) => {
        const key  = `${p.id}-${m.id}-${t}-${i}`;
        const mins = toMins(t);
        if (!doseLog[key]) {
          const item = { patient: p, medicine: m, time: t, mins, key };
          if (mins < nowMins - 5) overdue.push(item);
          else upcoming.push(item);
        }
      });

      const status = stockStatus(m);
      if (status !== 'ok') lowStock.push({ patient: p, medicine: m, status });
    });
  });

  overdue.sort((a, b) => b.mins - a.mins);
  upcoming.sort((a, b) => a.mins - b.mins);

  const hasAlerts = overdue.length > 0 || lowStock.length > 0;

  return (
    <>
      <TopNav
        title="Alerts"
        subtitle={hasAlerts ? `${overdue.length + lowStock.length} need attention` : 'All clear'}
      />

      <div className="scroll-content">
        <div style={{ padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>

          {!hasAlerts && upcoming.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'var(--sp-8) var(--sp-6)', animation: 'fadeIn 0.25s' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'var(--accent2-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--sp-4)',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p style={{ fontSize: 'var(--fs-section)', fontWeight: 'var(--fw-semibold)', color: 'var(--text2)' }}>
                All clear
              </p>
              <p style={{ fontSize: 'var(--fs-secondary)', color: 'var(--text3)', marginTop: 'var(--sp-1)' }}>
                No alerts right now. Everything is on track.
              </p>
            </div>
          )}

          {/* Overdue */}
          {overdue.length > 0 && (
            <div style={{ animation: 'slideUpFade 0.25s var(--ease-out)' }}>
              <SectionLabel count={overdue.length} color="var(--danger)">Overdue</SectionLabel>
              <div style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                {overdue.map((item, i) => (
                  <AlertRow
                    key={item.key}
                    borderColor="var(--danger)"
                    title={item.medicine.name}
                    subtitle={`${item.patient.name} · ${item.medicine.dose}`}
                    right={
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 'var(--fs-caption)', fontFamily: 'var(--mono)', fontWeight: 'var(--fw-semibold)', color: 'var(--danger)' }}>
                          {timeLabel(item.time)}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text4)', marginTop: 2 }}>
                          {formatRelativeTime(item.mins)}
                        </div>
                      </div>
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div style={{ animation: 'slideUpFade 0.25s 0.04s var(--ease-out) both' }}>
              <SectionLabel count={Math.min(upcoming.length, 8)} color="var(--accent)">Upcoming</SectionLabel>
              <div style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                {upcoming.slice(0, 8).map(item => (
                  <AlertRow
                    key={item.key}
                    borderColor="var(--accent)"
                    title={item.medicine.name}
                    subtitle={`${item.patient.name} · ${item.medicine.dose}`}
                    right={
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 'var(--fs-caption)', fontFamily: 'var(--mono)', fontWeight: 'var(--fw-semibold)', color: 'var(--accent)' }}>
                          {timeLabel(item.time)}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text4)', marginTop: 2 }}>
                          {formatRelativeTime(item.mins)}
                        </div>
                      </div>
                    }
                  />
                ))}
              </div>
              {upcoming.length > 8 && (
                <p style={{ fontSize: 'var(--fs-caption)', color: 'var(--text4)', textAlign: 'center', marginTop: 'var(--sp-2)' }}>
                  +{upcoming.length - 8} more
                </p>
              )}
            </div>
          )}

          {/* Low stock */}
          {lowStock.length > 0 && (
            <div style={{ animation: 'slideUpFade 0.25s 0.08s var(--ease-out) both' }}>
              <SectionLabel count={lowStock.length} color="var(--warn)">Low stock</SectionLabel>
              <div style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                {lowStock.map(({ patient, medicine, status }, i) => (
                  <AlertRow
                    key={`${patient.id}-${medicine.id}`}
                    borderColor={status === 'empty' ? 'var(--danger)' : 'var(--warn)'}
                    title={medicine.name}
                    subtitle={`${patient.name} · ${medicine.dose}`}
                    right={
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 'var(--fw-semibold)',
                          color: status === 'empty' ? 'var(--danger)' : 'var(--warn)',
                          background: status === 'empty' ? 'var(--danger-light)' : 'var(--warn-light)',
                          padding: '2px 8px',
                          borderRadius: 99,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {medicine.stock} left
                      </span>
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
