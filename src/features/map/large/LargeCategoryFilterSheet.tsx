import BottomSheet from '@/components/common/BottomSheet/BottomSheet';
import { FACILITY_CATEGORY_GROUPS } from '../types';
import type { FacilityMainCategory } from '../types';

interface LargeCategoryFilterSheetProps {
  open: boolean;
  mainCategory: FacilityMainCategory | null;
  selectedSubCategories: string[];
  onSelect: (subCategory: string) => void;
  onClose: () => void;
}

const LargeCategoryFilterSheet = ({
  open,
  mainCategory,
  selectedSubCategories,
  onSelect,
  onClose,
}: LargeCategoryFilterSheetProps) => {
  const group = FACILITY_CATEGORY_GROUPS.find((item) => item.main === mainCategory);

  return (
    <BottomSheet
      open={open && !!group}
      onClose={onClose}
      className="!max-w-[375px] !rounded-t-[34px] !px-6 !pb-[max(1.5rem,env(safe-area-inset-bottom))] !pt-3"
    >
      <h2 className="mb-2 text-center text-[28px] font-extrabold leading-[1.3] text-[#172033]">
        {mainCategory} 선택
      </h2>

      <div role="group" aria-label={`${mainCategory} 세부 시설`}>
        {group?.options.map((option, index) => {
          const selected = selectedSubCategories.includes(option);

          return (
            <button
              key={option}
              type="button"
              role="checkbox"
              aria-checked={selected}
              onClick={() => onSelect(option)}
              className={`flex min-h-[62px] w-full items-center gap-4 px-2 text-left text-[23px] font-bold leading-[1.25] text-[#172033] ${
                index > 0 ? 'border-t border-[#E2E5E9]' : ''
              }`}
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[3px] border-[#FF6B00] bg-white"
              >
                {selected && <span className="h-4 w-4 rounded-full bg-[#FF6B00]" />}
              </span>
              <span className="break-keep">{option}</span>
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
};

export default LargeCategoryFilterSheet;
