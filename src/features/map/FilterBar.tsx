import { FACILITY_CATEGORY_GROUPS } from './types';
import type { FacilityMainCategory } from './types';

interface FilterBarProps {
  selectedSubCategories: string[];
  onOpenCategory: (main: FacilityMainCategory) => void;
}

const FilterBar = ({ selectedSubCategories, onOpenCategory }: FilterBarProps) => {
  return (
    <section
      className="absolute inset-x-0 top-0 z-30 flex flex-nowrap gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="시설 카테고리 필터"
    >
      {FACILITY_CATEGORY_GROUPS.map(({ main: category, options }) => {
        const selections = options.filter((option) => selectedSubCategories.includes(option));
        const active = selections.length > 0;
        const label =
          selections.length === 1
            ? selections[0]
            : selections.length > 1
              ? `${category} ${selections.length}`
              : category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onOpenCategory(category)}
            className={`flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border-2 border-[#FF8A3D] px-3 py-1.5 text-2xl font-semibold shadow-sm transition-colors ${
              active ? 'bg-[#FF8A3D] text-white' : 'bg-white text-gray-700'
            }`}
          >
            <span>{label}</span>
            <span>▾</span>
          </button>
        );
      })}
    </section>
  );
};

export default FilterBar;
