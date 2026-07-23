export interface QuestionOption {
  value: string;
  label: string;
  icon?: string;
}

interface QuestionCardProps {
  question: string;
  options: QuestionOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  className?: string;
}

const QuestionCard = ({
  question,
  options,
  value,
  onChange,
  multiple = false,
  className = '',
}: QuestionCardProps) => {
  const isSelected = (optionValue: string) =>
    multiple ? (value as string[]).includes(optionValue) : value === optionValue;

  const handleSelect = (optionValue: string) => {
    if (!multiple) {
      onChange(optionValue);
      return;
    }

    const current = value as string[];
    const next = current.includes(optionValue)
      ? current.filter((item) => item !== optionValue)
      : [...current, optionValue];
    onChange(next);
  };

  return (
    <div className={className}>
      {question && <h2 className="text-lg font-bold text-[#613212]">{question}</h2>}
      <div className="mt-4 flex flex-col gap-3">
        {options.map((option) => {
          const selected = isSelected(option.value);

          return (
            <button
              key={option.value}
              type="button"
              role={multiple ? 'checkbox' : 'radio'}
              aria-checked={selected}
              onClick={() => handleSelect(option.value)}
              className={`flex w-full items-center gap-3 rounded-full border px-4 py-3 text-left text-sm font-medium transition-colors ${
                selected
                  ? 'border-[#FF8A3D] bg-[#FF8A3D] text-white'
                  : 'border-[#FF8A3D] bg-white text-[#613212]'
              }`}
            >
              {option.icon && (
                <img
                  src={selected ? option.icon.replace('.png', '_choice.png') : option.icon}
                  alt=""
                  className="w-6 h-6"
                />
              )}
              <span className="font-semibold">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
