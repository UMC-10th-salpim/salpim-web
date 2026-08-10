import { FACILITY_CATEGORY_GROUPS } from '../types';
import type { FacilityMainCategory } from '../types';

interface LargeFilterBarProps {
  selectedSubCategories: string[];
  onOpenCategory: (main: FacilityMainCategory) => void;
}

const LargeFilterBar = ({ selectedSubCategories, onOpenCategory }: LargeFilterBarProps) => {
  return (
    <section
      className="absolute inset-x-0 top-0 z-30 flex flex-nowrap gap-1.5 overflow-x-auto overscroll-x-contain px-3 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="시설 카테고리 필터"
    >
      {FACILITY_CATEGORY_GROUPS.map(({ main: category, options }) => {
        const active = options.some((option) => selectedSubCategories.includes(option));

        return (
          <button
            key={category}
            type="button"
            onClick={() => onOpenCategory(category)}
            aria-pressed={active}
            className={`flex h-11 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border-2 border-[#FF8A3D] px-3 text-[20px] font-bold leading-none shadow-sm ${
              active ? 'bg-[#FF8A3D] text-white' : 'bg-white text-[#43230F]'
            }`}
          >
            <span>{category}</span>
            <span aria-hidden className={active ? 'text-white' : 'text-[#FF8A3D]'}>
              ▾
            </span>
          </button>
        );
      })}
    </section>
  );
};

export default LargeFilterBar;
