import { useState, useEffect } from 'react';
import { CATEGORIES, MEDICINE_COLORS, FREQUENCY_DEFAULTS } from '../../data/mockData';

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

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

function FieldLabel({ children, required }) {
  return (
    <label
      style={{
        fontSize: 'var(--fs-secondary)',
        fontWeight: 'var(--fw-semibold)',
        color: 'var(--text2)',
        display: 'block',
        marginBottom: 'var(--sp-1)',
      }}
    >
      {children}
      {required && <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>}
    </label>
  );
}

const DEFAULT_FORM = {
  name: '',
  dose: '',
  category: 'General',
  frequency: 'Once daily',
  times: ['08:00'],
  stock: 30,
  refillAt: 10,
  doctor: '',
  notes: '',
  color: '#2563EB',
};

export default function MedicineModal({ patientName, medicine, onSave, onDelete, onClose }) {
  const isEditing = !!medicine;
  const [form, setForm] = useState(isEditing ? { ...DEFAULT_FORM, ...medicine } : { ...DEFAULT_FORM });
  const [errors, setErrors] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  function set(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
  }

  useEffect(() => {
    if (!isEditing || form.frequency !== medicine?.frequency) {
      const defaults = FREQUENCY_DEFAULTS[form.frequency];
      if (defaults !== undefined) setForm(prev => ({ ...prev, times: [...defaults] }));
    }
  }, [form.frequency]);

  function addTime() {
    setForm(prev => ({ ...prev, times: [...prev.times, '12:00'] }));
  }

  function removeTime(i) {
    setForm(prev => ({ ...prev, times: prev.times.filter((_, idx) => idx !== i) }));
  }

  function updateTime(i, val) {
    const others = form.times.filter((_, idx) => idx !== i);
    if (others.includes(val)) {
      setErrors(prev => ({ ...prev, times: 'Each dose time must be unique' }));
      return;
    }
    setErrors(prev => ({ ...prev, times: '' }));
    setForm(prev => {
      const times = [...prev.times];
      times[i] = val;
      return { ...prev, times };
    });
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Medicine name is required';
    if (!form.dose.trim()) errs.dose = 'Dose is required';
    if (Number(form.stock) < 0) errs.stock = 'Cannot be negative';
    if (Number(form.refillAt) < 0) errs.refillAt = 'Cannot be negative';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    onSave({
      ...form,
      id: medicine?.id || crypto.randomUUID(),
      name: form.name.trim(),
      dose: form.dose.trim(),
      doctor: form.doctor.trim(),
      notes: form.notes.trim(),
      stock: Number(form.stock),
      refillAt: Number(form.refillAt),
    });
  }

  const showTimes = form.frequency !== 'As needed';

  const selectBase = {
    ...inputBase,
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='11' height='7' viewBox='0 0 11 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5.5 6L10 1' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    paddingRight: 32,
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 200,
          animation: 'fadeIn 0.18s ease',
        }}
      />

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 430,
          background: 'var(--surface)',
          borderRadius: '20px 20px 0 0',
          zIndex: 201,
          animation: 'slideUpFade 0.28s var(--ease-spring)',
          maxHeight: '92dvh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--sp-2) 0 0' }}>
          <div style={{ width: 32, height: 4, borderRadius: 99, background: 'var(--border2)' }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 'var(--sp-3) var(--sp-4) var(--sp-3)',
          borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <div style={{ fontSize: 'var(--fs-section)', fontWeight: 'var(--fw-semibold)', color: 'var(--text)' }}>
              {isEditing ? 'Edit medicine' : 'Add medicine'}
            </div>
            <div style={{ fontSize: 'var(--fs-caption)', color: 'var(--text4)', marginTop: 1 }}>
              for {patientName}
            </div>
          </div>
          <button
            aria-label="Close"
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: 'var(--radius-xs)',
              background: 'var(--surface2)',
              color: 'var(--text3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <XIcon />
          </button>
        </div>

        {/* Form */}
        <div style={{ overflow: 'auto', flex: 1 }}>
          <div style={{ padding: 'var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>

            <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
              <div style={{ flex: 2 }}>
                <FieldLabel required>Medicine name</FieldLabel>
                <input
                  type="text"
                  placeholder="e.g. Metformin"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  style={{ ...inputBase, borderColor: errors.name ? 'var(--danger)' : undefined }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = errors.name ? 'var(--danger)' : 'var(--border2)'}
                />
                {errors.name && <p role="alert" style={{ fontSize: 11, color: 'var(--danger)', marginTop: 3 }}>{errors.name}</p>}
              </div>
              <div style={{ flex: 1 }}>
                <FieldLabel required>Dose</FieldLabel>
                <input
                  type="text"
                  placeholder="500 mg"
                  value={form.dose}
                  onChange={e => set('dose', e.target.value)}
                  style={{ ...inputBase, borderColor: errors.dose ? 'var(--danger)' : undefined }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = errors.dose ? 'var(--danger)' : 'var(--border2)'}
                />
                {errors.dose && <p role="alert" style={{ fontSize: 11, color: 'var(--danger)', marginTop: 3 }}>{errors.dose}</p>}
              </div>
            </div>

            {/* Color */}
            <div>
              <FieldLabel>Color label</FieldLabel>
              <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                {MEDICINE_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => set('color', c)}
                    aria-pressed={form.color === c}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: c,
                      border: form.color === c ? '3px solid var(--text)' : '2px solid transparent',
                      outline: form.color === c ? `2px solid ${c}` : 'none',
                      outlineOffset: 2,
                      transition: 'transform 0.1s',
                      transform: form.color === c ? 'scale(1.15)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Category + Frequency */}
            <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
              <div style={{ flex: 1 }}>
                <FieldLabel>Category</FieldLabel>
                <select value={form.category} onChange={e => set('category', e.target.value)} style={selectBase}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <FieldLabel>Frequency</FieldLabel>
                <select value={form.frequency} onChange={e => set('frequency', e.target.value)} style={selectBase}>
                  {Object.keys(FREQUENCY_DEFAULTS).map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
            </div>

            {/* Times */}
            {showTimes && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-2)' }}>
                  <FieldLabel>Dose times</FieldLabel>
                  <button
                    onClick={addTime}
                    style={{
                      fontSize: 12,
                      fontWeight: 'var(--fw-semibold)',
                      color: 'var(--accent)',
                      padding: 'var(--sp-1) var(--sp-2)',
                      borderRadius: 'var(--radius-xs)',
                      background: 'var(--accent-light)',
                    }}
                  >
                    + Add
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                  {form.times.map((t, i) => (
                    <div key={i} style={{ display: 'flex', gap: 'var(--sp-2)', alignItems: 'center' }}>
                      <input
                        type="time"
                        value={t}
                        onChange={e => updateTime(i, e.target.value)}
                        style={{ ...inputBase, flex: 1, fontFamily: 'var(--mono)' }}
                      />
                      {form.times.length > 1 && (
                        <button
                          aria-label="Remove time"
                          onClick={() => removeTime(i)}
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 'var(--radius-xs)',
                            background: 'var(--danger-light)',
                            color: 'var(--danger)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <XIcon />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {errors.times && <p role="alert" style={{ fontSize: 11, color: 'var(--danger)', marginTop: 4 }}>{errors.times}</p>}
              </div>
            )}

            {/* Stock */}
            <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
              <div style={{ flex: 1 }}>
                <FieldLabel>Current stock</FieldLabel>
                <input type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)} style={inputBase} />
                {errors.stock && <p role="alert" style={{ fontSize: 11, color: 'var(--danger)', marginTop: 3 }}>{errors.stock}</p>}
              </div>
              <div style={{ flex: 1 }}>
                <FieldLabel>Refill at</FieldLabel>
                <input type="number" min="0" value={form.refillAt} onChange={e => set('refillAt', e.target.value)} style={inputBase} />
              </div>
            </div>

            {/* Doctor + Notes */}
            <div>
              <FieldLabel>Prescribing doctor</FieldLabel>
              <input
                type="text"
                placeholder="Dr. Name"
                value={form.doctor}
                onChange={e => set('doctor', e.target.value)}
                style={inputBase}
              />
            </div>
            <div>
              <FieldLabel>Notes</FieldLabel>
              <textarea
                placeholder="Special instructions, take with food, etc."
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                rows={2}
                style={{
                  ...inputBase,
                  height: 'auto',
                  padding: 'var(--sp-3)',
                  resize: 'none',
                  lineHeight: 1.5,
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: 'var(--sp-3) var(--sp-4)',
          paddingBottom: 'calc(var(--sp-3) + env(safe-area-inset-bottom))',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: 'var(--sp-2)',
        }}>
          {isEditing && !confirmDelete && (
            <button
              aria-label="Delete medicine"
              onClick={() => setConfirmDelete(true)}
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-xs)',
                background: 'var(--danger-light)',
                color: 'var(--danger)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <TrashIcon />
            </button>
          )}

          {isEditing && confirmDelete && (
            <button
              onClick={() => onDelete(medicine.id)}
              style={{
                flex: 1,
                height: 44,
                borderRadius: 'var(--radius-xs)',
                background: 'var(--danger)',
                color: '#fff',
                fontSize: 'var(--fs-body)',
                fontWeight: 'var(--fw-semibold)',
              }}
            >
              Confirm delete
            </button>
          )}

          {!confirmDelete && (
            <button
              onClick={handleSave}
              style={{
                flex: 1,
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
              {isEditing ? 'Save changes' : 'Add medicine'}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
