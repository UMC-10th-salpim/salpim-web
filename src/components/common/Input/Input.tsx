interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; //값이 바뀔 때
  placeholder?: string;
  disabled?: boolean;
  type?: 'text' | 'password' | 'number' | 'tel';
  label?: string;
  inputMode?: 'numeric' | 'text' | 'tel';
  maxLength?: number;
}
const Input = ({
  value,
  onChange,
  placeholder,
  disabled,
  type = 'text',
  label,
  inputMode,
  maxLength,
}: InputProps) => {
  return (
    <div className="w-full flex-col gap-2">
      {label && (
        <span className="text-[clamp(20px,3.05vh,24px)] font-medium text-grap-700">{label}</span>
      )}
      <input
        className="
          w-full px-4 py-3
          rounded-4xl border-[3px] border-[#FF8A3D]/60
          text-[clamp(20px,3.05vh,24px)] text-gray-700
          placeholder:text-gray-300
          outline-none
          disabled:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed
        "
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
};

export default Input;
