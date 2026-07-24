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
      aria-label={`${label ?? '설정'} ${checked ? '표시 중' : '숨김 중'}`}
      onClick={() => onChange(!checked)}
      className={`flex min-h-10 min-w-14 shrink-0 items-center justify-center rounded-xl px-3 text-[16px] font-extrabold transition-colors ${
        checked
          ? 'bg-[#FF853E] text-white hover:bg-[#EB6F27]'
          : 'border-2 border-[#FFD29E] bg-[#FFF0DA] text-[#FF7A32] hover:bg-[#FFE4C2]'
      }`}
    >
      {checked ? '표시' : '숨김'}
    </button>
  );
};

export default Toggle;
