export function timeLabel(t) {
  const [h, m] = t.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function toMins(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export function isPast(time) {
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  return toMins(time) < nowMins;
}

export function stockStatus(medicine) {
  if (medicine.stock === 0) return 'empty';
  if (medicine.stock <= medicine.refillAt) return 'low';
  return 'ok';
}

export function stockColor(status) {
  if (status === 'empty') return 'var(--danger)';
  if (status === 'low') return 'var(--warn)';
  return 'var(--accent2)';
}

export function todayLabel() {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export function greetingByTime() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// Generate a stable gradient from a name string
export function nameGradient(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const palettes = [
    ['#667eea', '#764ba2'],
    ['#f093fb', '#f5576c'],
    ['#4facfe', '#00f2fe'],
    ['#43e97b', '#38f9d7'],
    ['#fa709a', '#fee140'],
    ['#a18cd1', '#fbc2eb'],
    ['#fccb90', '#d57eeb'],
    ['#84fab0', '#8fd3f4'],
    ['#a1c4fd', '#c2e9fb'],
    ['#fd7043', '#ffb74d'],
  ];
  const idx = Math.abs(hash) % palettes.length;
  return `linear-gradient(135deg, ${palettes[idx][0]}, ${palettes[idx][1]})`;
}

export function initials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function doseKey(patientId, medId, time, idx) {
  return `${patientId}-${medId}-${time}-${idx}`;
}

export function formatRelativeTime(timeMins) {
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const diff = timeMins - nowMins;

  if (diff < 0) {
    const abs = Math.abs(diff);
    if (abs < 60) return `${abs}m ago`;
    return `${Math.floor(abs / 60)}h ${abs % 60}m ago`;
  }
  if (diff < 60) return `in ${diff}m`;
  return `in ${Math.floor(diff / 60)}h ${diff % 60}m`;
}
