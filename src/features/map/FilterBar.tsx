import { FACILITY_MAIN_CATEGORIES } from './types';
import type { FacilityMainCategory } from './types';

interface FilterBarProps {
  selectedMainCategory: FacilityMainCategory | null;
  selectedSubCategory: string | null;
  onSelectAll: () => void;
  onOpenCategory: (main: FacilityMainCategory) => void;
}

const FilterBar = ({
  selectedMainCategory,
  selectedSubCategory,
  onSelectAll,
  onOpenCategory,
}: FilterBarProps) => {
  const isAllSelected = selectedMainCategory === null;

  return (
    <section className="flex flex-wrap gap-2 border-b border-gray-100 bg-white px-4 py-3" aria-label="시설 카테고리 필터">
      <button
        type="button"
        onClick={onSelectAll}
        className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
          isAllSelected
            ? 'border-[#FF8A3D] bg-[#FF8A3D] text-white'
            : 'border-gray-300 bg-white text-gray-700'
        }`}
      >
        전체
      </button>

      {FACILITY_MAIN_CATEGORIES.map((category) => {
        const active = selectedMainCategory === category;
        const label = active && selectedSubCategory ? selectedSubCategory : category;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onOpenCategory(category)}
            className={`flex items-center gap-1 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
              active
                ? 'border-[#FF8A3D] bg-[#FF8A3D] text-white'
                : 'border-gray-300 bg-white text-gray-700'
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
