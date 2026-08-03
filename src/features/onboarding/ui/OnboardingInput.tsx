import type { ChangeEvent } from 'react';

interface OnboardingInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: 'text' | 'password' | 'number' | 'tel';
  label?: string;
  inputMode?: 'numeric' | 'text' | 'tel';
  maxLength?: number;
}

const OnboardingInput = ({
  value,
  onChange,
  placeholder,
  disabled,
  type = 'text',
  label,
  inputMode,
  maxLength,
}: OnboardingInputProps) => {
  return (
    <div className="w-full flex-col gap-2">
      {label && <span className="salpim-field-label font-medium text-grap-700">{label}</span>}
      <input
        className="salpim-input-control salpim-field-text w-full rounded-4xl border-[3px] border-[#FF8A3D]/60 px-4 py-3 text-gray-700 outline-none placeholder:text-gray-300 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-100"
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

export default OnboardingInput;
