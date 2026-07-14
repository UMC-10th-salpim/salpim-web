interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const Toggle = ({ checked, onChange, label }: ToggleProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="shrink-0"
    >
      <img
        src={checked ? '/icons/mypage/on.png' : '/icons/mypage/off.png'}
        alt={checked ? 'ON' : 'OFF'}
        className="h-8 w-14 object-contain"
      />
    </button>
  );
};

export default Toggle;
