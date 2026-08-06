import { FACILITY_MAIN_CATEGORIES } from './types';
import type { FacilityMainCategory } from './types';

interface FilterBarProps {
  selectedMainCategory: FacilityMainCategory | null;
  selectedSubCategory: string | null;
  onOpenCategory: (main: FacilityMainCategory) => void;
}

const FilterBar = ({
  selectedMainCategory,
  selectedSubCategory,
  onOpenCategory,
}: FilterBarProps) => {
  return (
    <section
      className="absolute inset-x-0 top-0 z-30 flex flex-nowrap gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="시설 카테고리 필터"
    >
      {FACILITY_MAIN_CATEGORIES.map((category) => {
        const active = selectedMainCategory === category;
        const label = active && selectedSubCategory ? selectedSubCategory : category;

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
