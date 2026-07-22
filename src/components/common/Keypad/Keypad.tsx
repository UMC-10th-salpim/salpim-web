interface KeypadProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  maxLength?: number;
  disabled?: boolean;
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

const Keypad = ({ value, onChange, onSubmit, maxLength = 6, disabled }: KeypadProps) => {
  const isComplete = value.length === maxLength;

  const handlePress = (digit: string) => {
    if (disabled || value.length >= maxLength) return;
    onChange(value + digit);
  };

  const handleBackspace = () => {
    if (disabled) return;
    onChange(value.slice(0, -1));
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* dot 인디케이터 */}
      <div className="flex gap-3">
        {Array.from({ length: maxLength }).map((_, index) => (
          <span
            key={index}
            className={`h-3.5 w-3.5 rounded-full border-2 border-brand-400 ${
              index < value.length ? 'bg-brand-500' : 'bg-white'
            }`}
          />
        ))}
      </div>

      {/* 숫자 키패드 */}
      <div className="grid w-full max-w-xs grid-cols-3 gap-4">
        {KEYS.map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => handlePress(digit)}
            disabled={disabled}
            className="rounded-2xl bg-brand-50 py-4 text-xl font-bold text-gray-800 transition-colors hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {digit}
          </button>
        ))}

        <button
          type="button"
          onClick={handleBackspace}
          disabled={disabled}
          aria-label="지우기"
          className="rounded-2xl bg-brand-50 py-4 text-xl font-bold text-gray-500 transition-colors hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ⌫
        </button>

        <button
          type="button"
          onClick={() => handlePress('0')}
          disabled={disabled}
          className="rounded-2xl bg-brand-50 py-4 text-xl font-bold text-gray-800 transition-colors hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          0
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || !isComplete}
          aria-label="확인"
          className="flex items-center justify-center rounded-2xl bg-brand-500 py-4 text-xl font-bold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-brand-200"
        >
          →
        </button>
      </div>
    </div>
  );
};

export default Keypad;
