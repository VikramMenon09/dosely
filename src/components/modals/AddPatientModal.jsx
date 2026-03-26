import { useState } from 'react';

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const CONDITIONS_LIST = [
  'Diabetes', 'Hypertension', 'Cardiac', 'Osteoporosis',
  'Thyroid', 'Asthma', 'Anxiety', 'Arthritis', 'Kidney', 'Other',
];

const inputBase = {
  height: 44,
  padding: '0 var(--sp-3)',
  borderRadius: 'var(--radius-xs)',
  border: '1.5px solid var(--border2)',
  fontSize: 'var(--fs-body)',
  color: 'var(--text)',
  background: 'var(--surface2)',
  width: '100%',
  transition: 'border-color 0.15s',
};

export default function AddPatientModal({ onSave, onClose }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [conditions, setConditions] = useState([]);
  const [customCond, setCustomCond] = useState('');
  const [errors, setErrors] = useState({});

  function toggleCondition(c) {
    setConditions(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  }

  function validate() {
    const errs = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!age || isNaN(Number(age)) || Number(age) < 1 || Number(age) > 120) errs.age = 'Valid age required';
    if (conditions.length === 0 && !customCond.trim()) errs.conditions = 'At least one condition required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    const allConditions = customCond.trim() ? [...conditions, customCond.trim()] : conditions;
    onSave({ id: crypto.randomUUID(), name: name.trim(), age: Number(age), conditions: allConditions, medicines: [] });
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 200, animation: 'fadeIn 0.18s' }} />
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: 'var(--surface)', borderRadius: '20px 20px 0 0', zIndex: 201, animation: 'slideUpFade 0.28s var(--ease-spring)', maxHeight: '88dvh', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg)' }}>

        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--sp-2) 0 0' }}>
          <div style={{ width: 32, height: 4, borderRadius: 99, background: 'var(--border2)' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--sp-3) var(--sp-4)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 'var(--fs-section)', fontWeight: 'var(--fw-semibold)', color: 'var(--text)' }}>Add patient</div>
          <button aria-label="Close" onClick={onClose} style={{ width: 30, height: 30, borderRadius: 'var(--radius-xs)', background: 'var(--surface2)', color: 'var(--text3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <XIcon />
          </button>
        </div>

        <div style={{ overflow: 'auto', flex: 1 }}>
          <div style={{ padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>

            <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
              <div style={{ flex: 2 }}>
                <label style={{ fontSize: 'var(--fs-secondary)', fontWeight: 'var(--fw-semibold)', color: 'var(--text2)', display: 'block', marginBottom: 'var(--sp-1)' }}>
                  Full name <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Patient name"
                  value={name}
                  onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }}
                  style={{ ...inputBase, borderColor: errors.name ? 'var(--danger)' : undefined }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = errors.name ? 'var(--danger)' : 'var(--border2)'}
                />
                {errors.name && <p role="alert" style={{ fontSize: 11, color: 'var(--danger)', marginTop: 3 }}>{errors.name}</p>}
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 'var(--fs-secondary)', fontWeight: 'var(--fw-semibold)', color: 'var(--text2)', display: 'block', marginBottom: 'var(--sp-1)' }}>
                  Age <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  placeholder="65"
                  value={age}
                  onChange={e => { setAge(e.target.value); setErrors(p => ({ ...p, age: '' })); }}
                  style={{ ...inputBase, borderColor: errors.age ? 'var(--danger)' : undefined }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = errors.age ? 'var(--danger)' : 'var(--border2)'}
                />
                {errors.age && <p role="alert" style={{ fontSize: 11, color: 'var(--danger)', marginTop: 3 }}>{errors.age}</p>}
              </div>
            </div>

            <div>
              <label style={{ fontSize: 'var(--fs-secondary)', fontWeight: 'var(--fw-semibold)', color: 'var(--text2)', display: 'block', marginBottom: 'var(--sp-2)' }}>
                Conditions <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
                {CONDITIONS_LIST.map(c => (
                  <button
                    key={c}
                    onClick={() => toggleCondition(c)}
                    style={{
                      padding: 'var(--sp-1) var(--sp-3)',
                      borderRadius: 99,
                      fontSize: 'var(--fs-secondary)',
                      fontWeight: 'var(--fw-medium)',
                      border: `1.5px solid ${conditions.includes(c) ? 'var(--accent)' : 'var(--border2)'}`,
                      color: conditions.includes(c) ? 'var(--accent)' : 'var(--text3)',
                      background: conditions.includes(c) ? 'var(--accent-light)' : 'var(--surface2)',
                      transition: 'all 0.12s',
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
              {errors.conditions && <p role="alert" style={{ fontSize: 11, color: 'var(--danger)', marginTop: 6 }}>{errors.conditions}</p>}
            </div>

            <div>
              <label style={{ fontSize: 'var(--fs-secondary)', fontWeight: 'var(--fw-semibold)', color: 'var(--text2)', display: 'block', marginBottom: 'var(--sp-1)' }}>
                Other condition
              </label>
              <input
                type="text"
                placeholder="e.g. Migraine"
                value={customCond}
                onChange={e => setCustomCond(e.target.value)}
                style={inputBase}
              />
            </div>
          </div>
        </div>

        <div style={{ padding: 'var(--sp-3) var(--sp-4)', paddingBottom: 'calc(var(--sp-3) + env(safe-area-inset-bottom))', borderTop: '1px solid var(--border)' }}>
          <button
            onClick={handleSave}
            style={{
              width: '100%',
              height: 44,
              borderRadius: 'var(--radius-xs)',
              background: 'var(--accent)',
              color: '#fff',
              fontSize: 'var(--fs-body)',
              fontWeight: 'var(--fw-semibold)',
              transition: 'transform 0.1s',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Add patient
          </button>
        </div>
      </div>
    </>
  );
}
