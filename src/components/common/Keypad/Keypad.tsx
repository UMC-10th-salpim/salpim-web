interface KeypadProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  maxLength?: number;
  disabled?: boolean;
  submitLabel?: string;
  backspaceLabel?: string;
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

const Keypad = ({
  value,
  onChange,
  onSubmit,
  maxLength = 6,
  disabled,
  submitLabel = '다음',
  backspaceLabel = '지우기',
}: KeypadProps) => {
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
    <div className="flex w-full flex-col items-center gap-6">
      <div className="flex w-full max-w-[330px] justify-center gap-2">
        {Array.from({ length: maxLength }).map((_, index) => (
          <span
            key={index}
            className="flex aspect-square min-w-0 flex-1 items-center justify-center rounded-lg bg-[#FFEBD1] text-[#9A816A]"
            aria-hidden
          >
            {index < value.length && (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3.5v17M4.65 7.75l14.7 8.5M19.35 7.75l-14.7 8.5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </span>
        ))}
      </div>

      <div className="grid w-full max-w-[300px] grid-cols-3 justify-items-center gap-x-5 gap-y-3.5">
        {KEYS.map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => handlePress(digit)}
            disabled={disabled}
            className="flex h-[60px] w-[60px] items-center justify-center rounded-full border border-[#F3EEE8] bg-white text-[26px] font-bold text-[#613212] shadow-[0_3px_8px_rgba(73,45,24,0.10)] transition-colors hover:bg-[#FFF3E4] active:bg-[#FFE7C6] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {digit}
          </button>
        ))}

        <button
          type="button"
          onClick={handleBackspace}
          disabled={disabled}
          aria-label="지우기"
          className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#F3F3F1] text-[19px] font-extrabold text-[#34302D] shadow-[0_3px_8px_rgba(73,45,24,0.08)] transition-colors hover:bg-[#EAE8E5] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {backspaceLabel}
        </button>

        <button
          type="button"
          onClick={() => handlePress('0')}
          disabled={disabled}
          className="flex h-[60px] w-[60px] items-center justify-center rounded-full border border-[#F3EEE8] bg-white text-[26px] font-bold text-[#613212] shadow-[0_3px_8px_rgba(73,45,24,0.10)] transition-colors hover:bg-[#FFF3E4] active:bg-[#FFE7C6] disabled:cursor-not-allowed disabled:opacity-50"
        >
          0
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || !isComplete}
          aria-label="확인"
          className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#FF6F12] text-[20px] font-extrabold text-white shadow-[0_3px_8px_rgba(255,111,18,0.22)] transition-colors hover:bg-[#ED650D] disabled:cursor-not-allowed disabled:bg-[#F8C59F]"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
};

export default Keypad;
