import type {QuestionOption} from '@/apis/survey';

interface QuestionCardProps {
  options: QuestionOption[];
  value: number | number[];
  onChange: (value: number | number[]) => void;
  multiple?: boolean;
  className?: string;
}

const QuestionCard = ({
  options,
  value,
  onChange,
  multiple = false,
  className = '',
}: QuestionCardProps) => {
  const isSelected = (optionValue: number) =>
    multiple ? (value as number[]).includes(optionValue) : value === optionValue;

  const handleSelect = (optionValue: number) => {
    if (!multiple) {
      onChange(value === optionValue ? 0 : optionValue);
      return;
    }

    const current = value as number[];
    const next = current.includes(optionValue)
      ? current.filter((item) => item !== optionValue)
      : [...current, optionValue];
    onChange(next);
  };

  return (
    <div className={className}>

      <div className="mt-4 flex flex-col gap-2">
        {options.map((option) => {
          const selected = isSelected(option.value);

          return (
            <button
              key={option.value}
              type="button"
              role={multiple ? 'checkbox' : 'radio'}
              aria-checked={selected}
              onClick={() => handleSelect(option.value)}
              className={`salpim-survey-option flex w-full items-center gap-3 rounded-full border px-6 py-3 font-semibold transition-colors shadow-[0_2px_2px_0_rgba(255,138,61,0.3)] ${
                selected
                  ? 'border-[#FF8A3D] bg-[#FF8A3D] text-white'
                  : 'bg-white text-[#FF8A3D] border-white'}`}
            >
              {option.icon && <img src={selected ? option.icon.replace('.png', '_choice.png') : option.icon} alt="" className='w-8 h-8 shrink-0'/>}
              <span className="flex-1 text-center font-semibold">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
