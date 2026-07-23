import type {QuestionOption} from '@/apis/survey';

interface QuestionCardProps {
  options: QuestionOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
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
  const isSelected = (optionValue: string) =>
    multiple ? (value as string[]).includes(optionValue) : value === optionValue;

  const handleSelect = (optionValue: string) => {
    if (!multiple) {
      onChange(value === optionValue ? '' : optionValue);
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
              className={`flex w-full items-center gap-3 rounded-full border px-4 py-3 justify-center text-[22px] font-semibold transition-colors shadow-[0_2px_2px_0_rgba(255,138,61,0.3)] ${
                selected
                  ? 'border-[#FF8A3D] bg-[#FF8A3D] text-white'
                  : 'bg-white text-[#FF8A3D] border-white'}`}
            >
              {option.icon && <img src={selected ? option.icon.replace('.png', '_choice.png') : option.icon} alt="" className='w-8 h-8'/>}
              <span className="items-center font-semibold">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
