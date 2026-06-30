import type { ReactNode } from 'react';
import Card from '@/components/common/Card/Card';

export interface QuestionOption {
  value: string;
  label: string;
  icon?: ReactNode;
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
    <Card className={`bg-brand-50 ${className}`}>
      <h2 className="text-lg font-bold leading-7 text-gray-900">{question}</h2>

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
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                selected
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-brand-200 bg-white text-gray-800 hover:border-brand-400 hover:bg-brand-50'
              }`}
            >
              {option.icon && <span className="shrink-0 text-base">{option.icon}</span>}
              <span className="flex-1">{option.label}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default QuestionCard;
