import BottomSheet from '@/components/common/BottomSheet/BottomSheet';
import { FACILITY_CATEGORY_GROUPS } from './types';
import type { FacilityMainCategory } from './types';

interface CategoryFilterSheetProps {
  open: boolean;
  mainCategory: FacilityMainCategory | null;
  selectedSubCategories: string[];
  onSelect: (subCategory: string) => void;
  onClose: () => void;
}

const CategoryFilterSheet = ({
  open,
  mainCategory,
  selectedSubCategories,
  onSelect,
  onClose,
}: CategoryFilterSheetProps) => {
  const group = FACILITY_CATEGORY_GROUPS.find((currentGroup) => currentGroup.main === mainCategory);

  return (
    <BottomSheet open={open && !!group} onClose={onClose} className="map-font-scope">
      <h2 className="mb-3 text-xl font-bold text-gray-900">{mainCategory} 선택</h2>

      <div role="group" aria-label={`${mainCategory} 세부 시설`} className="flex flex-col">
        {group?.options.map((option) => {
          const selected = selectedSubCategories.includes(option);

          return (
            <button
              key={option}
              type="button"
              role="checkbox"
              aria-checked={selected}
              onClick={() => onSelect(option)}
              className="flex items-center gap-3 border-b border-gray-200 px-1 py-3 text-left text-lg text-gray-800 last:border-b-0"
            >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-[#FF6B00] bg-white"
                aria-hidden
              >
                {selected && <span className="h-3 w-3 rounded-full bg-[#FF6B00]" />}
              </span>
              {option}
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
};

export default CategoryFilterSheet;
