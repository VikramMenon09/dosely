import { useState } from 'react';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import StockBar from '../ui/StockBar';
import DoseCard from '../DoseCard';
import TopNav from '../layout/TopNav';
import { doseKey, stockStatus, timeLabel } from '../../utils/helpers';

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

const TABS = ['Today', 'Medicines', 'Stock'];

export default function PatientDetail({ patient, doseLog, onMark, onBack, onAddMedicine, onEditMedicine, onRestock }) {
  const [activeTab, setActiveTab] = useState('Today');

  const todayDoses = patient.medicines.flatMap(m =>
    m.frequency === 'As needed' ? [] :
    m.times.map((t, i) => ({
      medicine: m,
      time: t,
      key: doseKey(patient.id, m.id, t, i),
    }))
  ).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <>
      <TopNav
        title={patient.name}
        subtitle={`${patient.age} yrs · ${patient.conditions.join(', ')}`}
        onBack={onBack}
        actions={
          <button
            aria-label="Add medicine"
            onClick={() => onAddMedicine(patient.id)}
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

      <div className="scroll-content screen-enter-right">
        <div style={{ padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>

          {/* Patient summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', paddingBottom: 'var(--sp-4)', borderBottom: '1px solid var(--border)' }}>
            <Avatar name={patient.name} size={48} fontSize={17} />
            <div>
              <div style={{ fontSize: 'var(--fs-section)', fontWeight: 'var(--fw-semibold)', color: 'var(--text)', marginBottom: 'var(--sp-1)' }}>
                {patient.name}
              </div>
              <div style={{ display: 'flex', gap: 'var(--sp-1)', flexWrap: 'wrap' }}>
                {patient.conditions.map(c => (
                  <Badge key={c}>{c}</Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Tab switcher */}
          <div
            style={{
              display: 'flex',
              background: 'var(--surface2)',
              borderRadius: 'var(--radius-xs)',
              padding: 3,
            }}
          >
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  flex: 1,
                  height: 34,
                  borderRadius: 6,
                  fontSize: 'var(--fs-secondary)',
                  fontWeight: activeTab === t ? 'var(--fw-semibold)' : 'var(--fw-medium)',
                  color: activeTab === t ? 'var(--text)' : 'var(--text4)',
                  background: activeTab === t ? 'var(--surface)' : 'transparent',
                  boxShadow: activeTab === t ? 'var(--shadow)' : 'none',
                  transition: 'all 0.18s var(--ease-out)',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Today Tab */}
          {activeTab === 'Today' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)', animation: 'fadeIn 0.18s' }}>
              {todayDoses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--sp-8)', color: 'var(--text3)' }}>
                  <p style={{ fontSize: 'var(--fs-secondary)', fontWeight: 'var(--fw-semibold)', color: 'var(--text2)' }}>
                    No doses scheduled today
                  </p>
                  <p style={{ fontSize: 'var(--fs-caption)', color: 'var(--text4)', marginTop: 4 }}>
                    Add medicines to start tracking
                  </p>
                </div>
              ) : (
                todayDoses.map(d => (
                  <DoseCard
                    key={d.key}
                    medicine={d.medicine}
                    time={d.time}
                    doseKey={d.key}
                    status={doseLog[d.key]}
                    onMark={onMark}
                  />
                ))
              )}
            </div>
          )}

          {/* Medicines Tab */}
          {activeTab === 'Medicines' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)', animation: 'fadeIn 0.18s' }}>
              {patient.medicines.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--sp-8)', color: 'var(--text3)' }}>
                  <p style={{ fontSize: 'var(--fs-secondary)', fontWeight: 'var(--fw-semibold)', color: 'var(--text2)' }}>
                    No medicines added yet
                  </p>
                  <button
                    onClick={() => onAddMedicine(patient.id)}
                    style={{
                      marginTop: 'var(--sp-3)',
                      fontSize: 'var(--fs-secondary)',
                      fontWeight: 'var(--fw-semibold)',
                      color: 'var(--accent)',
                      padding: 'var(--sp-2) var(--sp-4)',
                      borderRadius: 'var(--radius-xs)',
                      background: 'var(--accent-light)',
                    }}
                  >
                    Add first medicine
                  </button>
                </div>
              ) : (
                <div style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                  {patient.medicines.map((m, i) => (
                    <div
                      key={m.id}
                      style={{
                        padding: 'var(--sp-3) var(--sp-4)',
                        borderBottom: i < patient.medicines.length - 1 ? '1px solid var(--border)' : 'none',
                        background: 'var(--surface)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--sp-2)' }}>
                        <div>
                          <div style={{ fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-semibold)', color: 'var(--text)' }}>
                            {m.name}
                          </div>
                          <div style={{ fontSize: 'var(--fs-caption)', color: 'var(--text3)', marginTop: 2 }}>
                            {m.dose} · {m.frequency}
                          </div>
                        </div>
                        <button
                          aria-label={`Edit ${m.name}`}
                          onClick={() => onEditMedicine(patient.id, m)}
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 'var(--radius-xs)',
                            background: 'var(--surface2)',
                            color: 'var(--text3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <EditIcon />
                        </button>
                      </div>

                      {m.times.length > 0 && (
                        <div style={{ display: 'flex', gap: 'var(--sp-1)', flexWrap: 'wrap', marginBottom: m.doctor ? 'var(--sp-2)' : 0 }}>
                          {m.times.map(t => (
                            <span
                              key={t}
                              style={{
                                fontSize: 11,
                                fontFamily: 'var(--mono)',
                                fontWeight: 'var(--fw-medium)',
                                padding: '2px 7px',
                                borderRadius: 99,
                                background: 'var(--surface3)',
                                color: 'var(--text3)',
                              }}
                            >
                              {timeLabel(t)}
                            </span>
                          ))}
                        </div>
                      )}

                      {(m.doctor || m.notes) && (
                        <div style={{ fontSize: 'var(--fs-caption)', color: 'var(--text4)', marginTop: 2 }}>
                          {m.doctor && <span>{m.doctor}</span>}
                          {m.doctor && m.notes && <span> · </span>}
                          {m.notes && <span>{m.notes}</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Stock Tab */}
          {activeTab === 'Stock' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)', animation: 'fadeIn 0.18s' }}>
              {patient.medicines.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--sp-8)', color: 'var(--text3)' }}>
                  <p style={{ fontSize: 'var(--fs-secondary)', fontWeight: 'var(--fw-semibold)', color: 'var(--text2)' }}>
                    No medicines to track
                  </p>
                </div>
              ) : (
                <div style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                  {patient.medicines.map((m, i) => {
                    const status = stockStatus(m);
                    return (
                      <div
                        key={m.id}
                        style={{
                          padding: 'var(--sp-3) var(--sp-4)',
                          borderBottom: i < patient.medicines.length - 1 ? '1px solid var(--border)' : 'none',
                          background: 'var(--surface)',
                          borderLeft: status !== 'ok' ? `3px solid ${status === 'empty' ? 'var(--danger)' : 'var(--warn)'}` : '3px solid transparent',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-3)' }}>
                          <div>
                            <span style={{ fontSize: 'var(--fs-body)', fontWeight: 'var(--fw-semibold)', color: 'var(--text)' }}>{m.name}</span>
                            <span style={{ fontSize: 'var(--fs-caption)', color: 'var(--text4)', marginLeft: 'var(--sp-2)' }}>{m.dose}</span>
                          </div>
                          <button
                            onClick={() => onRestock(patient.id, m.id)}
                            style={{
                              fontSize: 12,
                              fontWeight: 'var(--fw-semibold)',
                              color: 'var(--accent)',
                              padding: 'var(--sp-1) var(--sp-2)',
                              borderRadius: 'var(--radius-xs)',
                              background: 'var(--accent-light)',
                              transition: 'transform 0.1s',
                            }}
                            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                          >
                            + Restock 30
                          </button>
                        </div>
                        <StockBar medicine={m} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
