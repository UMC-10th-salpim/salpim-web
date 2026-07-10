import type { FacilityMainCategory } from './types';

interface FacilityIconProps {
  category: FacilityMainCategory;
  className?: string;
}

const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'white',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

const FacilityGlyph = ({ category }: { category: FacilityMainCategory }) => {
  if (category === '건강·의료') {
    return (
      <svg {...iconProps}>
        <path d="M12 4v16M4 12h16" />
      </svg>
    );
  }

  if (category === '문화') {
    return (
      <svg {...iconProps}>
        <path d="M4 19V5a2 2 0 0 1 2-2h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
        <path d="M14 3v5h5" />
      </svg>
    );
  }

  if (category === '배움·일자리') {
    return (
      <svg {...iconProps}>
        <path d="M22 10 12 5 2 10l10 5 10-5Z" />
        <path d="M6 12v5c0 1 3 2 6 2s6-1 6-2v-5" />
      </svg>
    );
  }

  return (
    <svg {...iconProps}>
      <path d="M3 11.5 12 3l9 8.5" />
      <path d="M5 10.5V20h14v-9.5" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
};

const FacilityIcon = ({ category, className = '' }: FacilityIconProps) => {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FF8A3D] ${className}`}
    >
      <FacilityGlyph category={category} />
    </span>
  );
};

export default FacilityIcon;
