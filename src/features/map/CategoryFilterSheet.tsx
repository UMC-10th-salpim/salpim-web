import BottomSheet from '@/components/common/BottomSheet/BottomSheet';
import { FACILITY_CATEGORY_GROUPS } from './types';
import type { FacilityMainCategory } from './types';

interface CategoryFilterSheetProps {
  open: boolean;
  mainCategory: FacilityMainCategory | null;
  selectedSubCategory: string | null;
  onSelect: (subCategory: string) => void;
  onClose: () => void;
}

const CategoryFilterSheet = ({
  open,
  mainCategory,
  selectedSubCategory,
  onSelect,
  onClose,
}: CategoryFilterSheetProps) => {
  const group = FACILITY_CATEGORY_GROUPS.find((currentGroup) => currentGroup.main === mainCategory);

  return (
    <BottomSheet open={open && !!group} onClose={onClose}>
      <h2 className="mb-3 text-base font-bold text-gray-900">{mainCategory} 선택</h2>

      <div role="radiogroup" aria-label={`${mainCategory} 세부 시설`} className="flex flex-col">
        {group?.options.map((option) => {
          const selected = option === selectedSubCategory;

          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(option)}
              className="flex items-center gap-3 px-1 py-3 text-left text-sm text-gray-800"
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  selected ? 'border-[#FF8A3D]' : 'border-gray-300'
                }`}
              >
                {selected && <span className="h-2.5 w-2.5 rounded-full bg-[#FF8A3D]" />}
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
