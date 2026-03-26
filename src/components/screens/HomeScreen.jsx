import Avatar from '../ui/Avatar';
import DoseCard from '../DoseCard';
import TopNav from '../layout/TopNav';
import { greetingByTime, todayLabel, stockStatus, doseKey, toMins, timeLabel } from '../../utils/helpers';

function NextDoseHero({ dose, onMark }) {
  if (!dose) return null;
  return (
    <div
      className="glass"
      style={{
        borderRadius: 'var(--radius)',
        padding: 'var(--sp-4)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Subtle teal tint overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(11,110,97,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative' }}>
        <div
          style={{
            fontSize: 'var(--fs-caption)',
            fontWeight: 'var(--fw-semibold)',
            color: 'var(--accent)',
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            marginBottom: 'var(--sp-2)',
          }}
        >
          Next dose
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--sp-3)' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 'var(--fs-title)',
                fontWeight: 'var(--fw-bold)',
                color: 'var(--text)',
                letterSpacing: -0.4,
                marginBottom: 2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {dose.medicine.name}
            </div>
            <div style={{ fontSize: 'var(--fs-secondary)', color: 'var(--text3)', marginBottom: 'var(--sp-3)' }}>
              {dose.medicine.dose}{dose.patient ? ` · ${dose.patient.name}` : ''}
            </div>

            {/* Take / Skip inline pills */}
            <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
              <button
                onClick={() => onMark(dose.key, 'taken')}
                style={{
                  height: 36,
                  padding: '0 var(--sp-4)',
                  borderRadius: 'var(--radius-xs)',
                  background: 'var(--accent)',
                  color: '#fff',
                  fontSize: 'var(--fs-secondary)',
                  fontWeight: 'var(--fw-semibold)',
                  transition: 'transform 0.1s',
                  flexShrink: 0,
                }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                Mark taken
              </button>
              <button
                onClick={() => onMark(dose.key, 'skipped')}
                style={{
                  height: 36,
                  padding: '0 var(--sp-3)',
                  borderRadius: 'var(--radius-xs)',
                  background: 'var(--surface3)',
                  color: 'var(--text3)',
                  fontSize: 'var(--fs-secondary)',
                  fontWeight: 'var(--fw-medium)',
                  transition: 'transform 0.1s',
                  flexShrink: 0,
                }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                Skip
              </button>
            </div>
          </div>

          {/* Large mono time */}
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 32,
              fontWeight: 'var(--fw-bold)',
              color: 'var(--accent)',
              letterSpacing: -1,
              lineHeight: 1,
              flexShrink: 0,
              opacity: 0.9,
            }}
          >
            {timeLabel(dose.time)}
          </div>
        </div>
      </div>
    </div>
  );
}

function AllDoneCard() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--sp-3)',
        padding: 'var(--sp-4)',
        borderRadius: 'var(--radius)',
        background: 'var(--accent2-light)',
        border: '1px solid rgba(6,95,70,0.12)',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'rgba(6,95,70,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div>
        <div style={{ fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-semibold)', color: 'var(--accent2)' }}>
          All done for today
        </div>
        <div style={{ fontSize: 'var(--fs-caption)', color: 'var(--text3)', marginTop: 2 }}>
          Great work keeping up with every dose.
        </div>
      </div>
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
        marginBottom: 'var(--sp-2)',
      }}
    >
      {children}
    </div>
  );
}

export default function HomeScreen({ user, patients, doseLog, onMark, onSelectPatient }) {
  const today    = todayLabel();
  const greeting = greetingByTime();

  const visiblePatients = user.role === 'patient'
    ? patients.filter(p => p.id === user.patientId)
    : patients;

  const allDoses = visiblePatients.flatMap(p =>
    p.medicines.flatMap(m =>
      m.frequency === 'As needed' ? [] :
      m.times.map((t, i) => ({
        patient:  p,
        medicine: m,
        time:     t,
        key:      doseKey(p.id, m.id, t, i),
        mins:     toMins(t),
      }))
    )
  ).sort((a, b) => a.mins - b.mins);

  const totalDoses = allDoses.length;
  const takenCount = allDoses.filter(d => doseLog[d.key] === 'taken').length;
  const progress   = totalDoses > 0 ? Math.round((takenCount / totalDoses) * 100) : 0;
  const allDone    = totalDoses > 0 && takenCount === totalDoses;

  const now      = new Date();
  const nowMins  = now.getHours() * 60 + now.getMinutes();
  const nextDose = allDoses.find(d => !doseLog[d.key] && d.mins >= nowMins);

  const lowStockMeds = visiblePatients.flatMap(p =>
    p.medicines.filter(m => stockStatus(m) !== 'ok').map(m => ({ ...m, patientName: p.name }))
  );

  return (
    <>
      <TopNav title={greeting} subtitle={today} />

      <div className="scroll-content">
        <div style={{ padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>

          {/* 1. Hero next dose card */}
          <div style={{ animation: 'slideUpFade 0.28s var(--ease-out) both' }}>
            {allDone
              ? <AllDoneCard />
              : nextDose
                ? <NextDoseHero dose={nextDose} onMark={onMark} />
                : null
            }
          </div>

          {/* 2. Progress */}
          {totalDoses > 0 && (
            <div style={{ animation: 'slideUpFade 0.28s 0.04s var(--ease-out) both' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 'var(--sp-2)' }}>
                <span style={{ fontSize: 'var(--fs-secondary)', fontWeight: 'var(--fw-semibold)', color: 'var(--text2)' }}>
                  Today's doses
                </span>
                <span style={{ fontSize: 'var(--fs-secondary)', fontFamily: 'var(--mono)', fontWeight: 'var(--fw-medium)', color: 'var(--text3)' }}>
                  {takenCount} / {totalDoses}
                </span>
              </div>
              <div style={{ height: 5, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: allDone ? 'var(--accent2)' : 'var(--accent)',
                    borderRadius: 99,
                    transition: 'width 0.7s var(--ease-out)',
                  }}
                />
              </div>
            </div>
          )}

          {/* 3. Low stock alerts */}
          {lowStockMeds.length > 0 && (
            <div style={{ animation: 'slideUpFade 0.28s 0.08s var(--ease-out) both' }}>
              <SectionLabel>Stock alerts</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                {lowStockMeds.map(m => (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--sp-3) var(--sp-4)',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--surface)',
                      border: `1px solid ${stockStatus(m) === 'empty' ? 'rgba(153,27,27,0.15)' : 'rgba(146,64,14,0.15)'}`,
                    }}
                  >
                    <div>
                      <span style={{ fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-semibold)', color: 'var(--text)' }}>
                        {m.name}
                      </span>
                      <span style={{ fontSize: 'var(--fs-caption)', color: 'var(--text4)', marginLeft: 6 }}>
                        {m.patientName}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 'var(--fw-semibold)',
                        fontFamily: 'var(--mono)',
                        color: stockStatus(m) === 'empty' ? 'var(--danger)' : 'var(--warn)',
                        padding: '2px 8px',
                        borderRadius: 99,
                        background: stockStatus(m) === 'empty' ? 'var(--danger-light)' : 'var(--warn-light)',
                      }}
                    >
                      {m.stock} left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Doses by patient */}
          {visiblePatients.map((patient, pi) => {
            const doses = allDoses.filter(d => d.patient.id === patient.id);
            if (doses.length === 0) return null;
            return (
              <div
                key={patient.id}
                style={{ animation: `slideUpFade 0.28s ${0.06 + pi * 0.04}s var(--ease-out) both` }}
              >
                {user.role !== 'patient' && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                      <Avatar name={patient.name} size={22} fontSize={9} />
                      <span style={{ fontSize: 'var(--fs-secondary)', fontWeight: 'var(--fw-semibold)', color: 'var(--text2)' }}>
                        {patient.name}
                      </span>
                    </div>
                    <button
                      onClick={() => onSelectPatient(patient.id)}
                      style={{
                        fontSize: 'var(--fs-caption)',
                        fontWeight: 'var(--fw-semibold)',
                        color: 'var(--accent)',
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-xs)',
                        background: 'var(--accent-light)',
                      }}
                    >
                      View all
                    </button>
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                  {doses.map(d => (
                    <DoseCard
                      key={d.key}
                      medicine={d.medicine}
                      time={d.time}
                      doseKey={d.key}
                      status={doseLog[d.key]}
                      onMark={onMark}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {totalDoses === 0 && (
            <div style={{ textAlign: 'center', padding: 'var(--sp-8) var(--sp-6)', animation: 'fadeIn 0.3s' }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: 'var(--surface2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--sp-4)',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="8" rx="2" />
                  <rect x="2" y="14" width="20" height="8" rx="2" />
                </svg>
              </div>
              <p style={{ fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-semibold)', color: 'var(--text2)' }}>
                No medicines scheduled
              </p>
              <p style={{ fontSize: 'var(--fs-secondary)', color: 'var(--text3)', marginTop: 4 }}>
                Add medicines from the Patients tab to start tracking
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
