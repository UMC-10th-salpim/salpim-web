import Chip from '@/components/common/Chip/Chip';
import type { FacilityCategory } from './types';
import { FACILITY_CATEGORIES } from './types';

interface FilterBarProps {
  selectedCategories: FacilityCategory[];
  categories?: FacilityCategory[];
  onToggleCategory: (category: FacilityCategory) => void;
  onReset?: () => void;
}

const FilterBar = ({
  selectedCategories,
  categories = FACILITY_CATEGORIES,
  onToggleCategory,
  onReset,
}: FilterBarProps) => {
  const hasSelectedCategory = selectedCategories.length > 0;

  return (
    <section className="border-b border-gray-100 bg-white px-4 py-3" aria-label="시설 카테고리 필터">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-gray-900">시설 카테고리</h2>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            disabled={!hasSelectedCategory}
            className="text-sm font-medium text-[#FF8A3D] disabled:cursor-not-allowed disabled:text-gray-300"
          >
            초기화
          </button>
        )}
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            selected={selectedCategories.includes(category)}
            onClick={() => onToggleCategory(category)}
            className="shrink-0"
          />
        ))}
      </div>
    </section>
  );
};

export default FilterBar;
