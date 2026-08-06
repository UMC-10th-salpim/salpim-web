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
    <BottomSheet open={open && !!group} onClose={onClose}>
      <h2 className="mb-3 text-2xl font-bold text-gray-900">{mainCategory} 선택</h2>

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
              className="flex items-center gap-3 px-1 py-3 text-left text-2xl text-gray-800"
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${
                  selected ? 'border-[#FF8A3D]' : 'border-gray-300'
                }`}
              >
                {selected && (
                  <span className="text-base font-black leading-none text-[#FF8A3D]">✓</span>
                )}
              </span>
              {option}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-4 min-h-14 w-full rounded-xl bg-[#FF8A3D] px-4 text-2xl font-semibold text-white"
      >
        선택 완료
      </button>
    </BottomSheet>
  );
};

export default CategoryFilterSheet;
