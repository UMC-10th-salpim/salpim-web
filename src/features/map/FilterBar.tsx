import { FACILITY_CATEGORY_GROUPS } from './types';
import type { FacilityMainCategory } from './types';

interface FilterBarProps {
  selectedSubCategories: string[];
  onOpenCategory: (main: FacilityMainCategory) => void;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
}

const FilterBar = ({
  selectedSubCategories,
  onOpenCategory,
  onUseCurrentLocation,
  isLocating,
}: FilterBarProps) => {
  return (
    <section
      className="absolute inset-x-0 top-0 z-30 flex flex-wrap items-center gap-2 px-4 py-3"
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
            className={`flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border-2 border-[#FF8A3D] bg-white px-3 py-1.5 text-2xl font-semibold shadow-sm transition-colors ${
              active ? 'text-[#E85D04]' : 'text-gray-700'
            }`}
          >
            <span>{category}</span>
            <span className="text-[#FF6B00]">▾</span>
          </button>
        );
      })}

      <button
        type="button"
        onClick={onUseCurrentLocation}
        disabled={isLocating}
        aria-label="현재 위치에서 주변 시설 찾기"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[#FF8A3D] bg-white text-[#FF6B00] shadow-sm disabled:opacity-60"
      >
        {isLocating ? (
          <span className="h-5 w-5 animate-spin rounded-full border-[3px] border-[#FFD29E] border-t-[#FF6B00]" />
        ) : (
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="4" fill="currentColor" />
            <path
              d="M12 2v3M12 19v3M2 12h3M19 12h3"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
          </svg>
        )}
      </button>
    </section>
  );
};

export default FilterBar;
