import { nameGradient, initials } from '../../utils/helpers';

export default function Avatar({ name, size = 40, fontSize = 15 }) {
  return (
    <div
      aria-label={name}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: nameGradient(name),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize,
        flexShrink: 0,
        userSelect: 'none',
        letterSpacing: 0.5,
      }}
    >
      {initials(name)}
    </div>
  );
}
