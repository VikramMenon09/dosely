import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { MOCK_PATIENTS } from './data/mockData';
import { toMins, doseKey } from './utils/helpers';

import SplashScreen from './components/screens/SplashScreen';
import LoginScreen from './components/screens/LoginScreen';
import HomeScreen from './components/screens/HomeScreen';
import PatientsScreen from './components/screens/PatientsScreen';
import PatientDetail from './components/screens/PatientDetail';
import AlertsScreen from './components/screens/AlertsScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import BottomNav from './components/layout/BottomNav';
import MedicineModal from './components/modals/MedicineModal';
import AddPatientModal from './components/modals/AddPatientModal';
import Toast, { useToast } from './components/ui/Toast';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useLocalStorage('dosely_user', null);
  const [patients, setPatients] = useLocalStorage('dosely_patients', MOCK_PATIENTS);
  const [doseLog, setDoseLog] = useLocalStorage('dosely_doselog', {});
  const [notifEnabled, setNotifEnabled] = useLocalStorage('dosely_notif', false);

  const [tab, setTab] = useState('home');
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [medicineModal, setMedicineModal] = useState(null); // { patientId, medicine? }
  const [showAddPatient, setShowAddPatient] = useState(false);

  const { toasts, showToast, dismissToast } = useToast();
  const notifiedRef = useRef(new Set());

  // ── Mark dose ──────────────────────────────────────────────
  const markDose = useCallback((key, status) => {
    setDoseLog(prev => {
      const next = { ...prev };
      if (status === null) {
        delete next[key];
      } else {
        next[key] = status;
      }
      return next;
    });

    if (status === 'taken') showToast('Dose marked as taken', 'success');
    if (status === 'skipped') showToast('Dose skipped', 'info');
  }, [setDoseLog, showToast]);

  // ── Restock ────────────────────────────────────────────────
  const restockMedicine = useCallback((patientId, medId) => {
    setPatients(prev => prev.map(p => {
      if (p.id !== patientId) return p;
      return {
        ...p,
        medicines: p.medicines.map(m => {
          if (m.id !== medId) return m;
          return { ...m, stock: m.stock + 30 };
        }),
      };
    }));
    showToast('Restocked +30 doses', 'success');
  }, [setPatients, showToast]);

  // ── Save medicine ──────────────────────────────────────────
  const saveMedicine = useCallback((form) => {
    const { patientId, medicine } = medicineModal;
    setPatients(prev => prev.map(p => {
      if (p.id !== patientId) return p;
      const medicines = medicine
        ? p.medicines.map(m => m.id === form.id ? form : m)
        : [...p.medicines, form];
      return { ...p, medicines };
    }));
    setMedicineModal(null);
    showToast(medicine ? 'Medicine updated' : 'Medicine added', 'success');
  }, [medicineModal, setPatients, showToast]);

  // ── Delete medicine ────────────────────────────────────────
  const deleteMedicine = useCallback((medId) => {
    const { patientId } = medicineModal;
    setPatients(prev => prev.map(p => {
      if (p.id !== patientId) return p;
      return { ...p, medicines: p.medicines.filter(m => m.id !== medId) };
    }));
    setMedicineModal(null);
    showToast('Medicine removed', 'error');
  }, [medicineModal, setPatients, showToast]);

  // ── Add patient ────────────────────────────────────────────
  const addPatient = useCallback((patientData) => {
    setPatients(prev => [...prev, patientData]);
    setShowAddPatient(false);
    showToast('Patient added', 'success');
  }, [setPatients, showToast]);

  // ── Notification & missed dose interval ───────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const nowMins = now.getHours() * 60 + now.getMinutes();

      patients.forEach(p => {
        p.medicines.forEach(m => {
          m.times.forEach((t, i) => {
            const key = doseKey(p.id, m.id, t, i);
            const doseMins = toMins(t);

            // Auto-mark missed (> 30 min past and still unlogged)
            if (doseMins < nowMins - 30 && !doseLog[key]) {
              setDoseLog(prev => {
                if (prev[key]) return prev;
                return { ...prev, [key]: 'missed' };
              });
            }

            // Browser notification (within ±1 minute window)
            if (
              notifEnabled &&
              Math.abs(nowMins - doseMins) <= 1 &&
              !doseLog[key] &&
              !notifiedRef.current.has(key)
            ) {
              notifiedRef.current.add(key);
              try {
                new Notification(`Time for ${m.name}`, {
                  body: `${m.dose} for ${p.name} at ${t}`,
                  icon: '/favicon.svg',
                });
              } catch (_) {}
            }
          });
        });
      });
    }, 60_000);

    return () => clearInterval(interval);
  }, [patients, doseLog, notifEnabled]);

  // ── Request notification permission ───────────────────────
  const requestNotif = useCallback(async () => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      setNotifEnabled(v => !v);
      return;
    }
    const perm = await Notification.requestPermission();
    setNotifEnabled(perm === 'granted');
  }, [setNotifEnabled]);

  // ── Alert count ────────────────────────────────────────────
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const alertCount = patients.reduce((acc, p) => {
    const overdue = p.medicines.flatMap(m =>
      m.times.filter((t, i) => {
        const key = doseKey(p.id, m.id, t, i);
        return toMins(t) < nowMins - 5 && !doseLog[key];
      })
    ).length;
    const lowStock = p.medicines.filter(m => m.stock <= m.refillAt).length;
    return acc + overdue + lowStock;
  }, 0);

  // ── Navigate to patient detail ─────────────────────────────
  function selectPatient(id) {
    setSelectedPatientId(id);
    setTab('patients');
  }

  // ── Splash screen ──────────────────────────────────────────
  if (showSplash) {
    return (
      <div className="app-shell">
        <div className="app-container">
          <SplashScreen onDone={() => setShowSplash(false)} />
        </div>
      </div>
    );
  }

  // ── Not logged in ──────────────────────────────────────────
  if (!user) {
    return (
      <div className="app-shell">
        <div className="app-container">
          <LoginScreen onLogin={setUser} />
        </div>
      </div>
    );
  }

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="app-shell">
      <div className="app-container">

        {/* Screen routing */}
        {tab === 'home' && (
          <HomeScreen
            user={user}
            patients={patients}
            doseLog={doseLog}
            onMark={markDose}
            onSelectPatient={selectPatient}
            onAddMedicine={(patientId) => setMedicineModal({ patientId })}
          />
        )}

        {tab === 'patients' && !selectedPatient && (
          <PatientsScreen
            patients={user.role === 'patient'
              ? patients.filter(p => p.id === user.patientId)
              : patients
            }
            doseLog={doseLog}
            onSelect={selectPatient}
            onAdd={() => setShowAddPatient(true)}
          />
        )}

        {tab === 'patients' && selectedPatient && (
          <PatientDetail
            patient={selectedPatient}
            doseLog={doseLog}
            onMark={markDose}
            onBack={() => setSelectedPatientId(null)}
            onAddMedicine={(patientId) => setMedicineModal({ patientId })}
            onEditMedicine={(patientId, medicine) => setMedicineModal({ patientId, medicine })}
            onRestock={restockMedicine}
          />
        )}

        {tab === 'alerts' && (
          <AlertsScreen patients={patients} doseLog={doseLog} />
        )}

        {tab === 'profile' && (
          <ProfileScreen
            user={user}
            notifEnabled={notifEnabled}
            onRequestNotif={requestNotif}
            onLogout={() => {
              setUser(null);
              setTab('home');
              setSelectedPatientId(null);
            }}
          />
        )}

        {/* Bottom nav */}
        <BottomNav tab={tab} setTab={(t) => { setTab(t); setSelectedPatientId(null); }} alertCount={alertCount} />

        {/* Medicine modal */}
        {medicineModal && (
          <MedicineModal
            patientName={patients.find(p => p.id === medicineModal.patientId)?.name || ''}
            medicine={medicineModal.medicine}
            onSave={saveMedicine}
            onDelete={deleteMedicine}
            onClose={() => setMedicineModal(null)}
          />
        )}

        {/* Add patient modal */}
        {showAddPatient && (
          <AddPatientModal
            onSave={addPatient}
            onClose={() => setShowAddPatient(false)}
          />
        )}

        {/* Toasts */}
        {toasts.slice(-1).map(t => (
          <Toast key={t.id} message={t.message} type={t.type} onDismiss={() => dismissToast(t.id)} />
        ))}
      </div>
    </div>
  );
}
