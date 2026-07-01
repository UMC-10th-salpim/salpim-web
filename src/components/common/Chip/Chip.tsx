import type { ButtonHTMLAttributes } from 'react';

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  selected?: boolean;
}

const Chip = ({ label, selected = false, className = '', ...props }: ChipProps) => {
  const baseStyle =
    'inline-flex items-center justify-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50';
  const selectedStyle = selected
    ? 'border-blue-500 bg-blue-500 text-white'
    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50';

  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`${baseStyle} ${selectedStyle} ${className}`}
      {...props}
    >
      {label}
    </button>
  );
};

export default Chip;
