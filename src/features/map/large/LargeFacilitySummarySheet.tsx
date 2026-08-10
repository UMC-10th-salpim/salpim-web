import FacilityIcon from '../FacilityIcon';
import { ClockIcon, PinIcon } from '../InfoIcons';
import type { Facility } from '../types';

interface LargeFacilitySummarySheetProps {
  facility: Facility;
  onClose: () => void;
  onViewDetail: (facility: Facility) => void;
}

const LargeFacilitySummarySheet = ({
  facility,
  onClose,
  onViewDetail,
}: LargeFacilitySummarySheetProps) => (
  <aside className="fixed inset-x-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-30">
    <div className="animate-slide-up mx-auto w-full max-w-[343px] rounded-[24px] border border-[#E4E7EB] bg-white p-4 shadow-[0_6px_20px_rgba(38,31,25,0.18)]">
      <div className="flex items-start gap-3">
        <FacilityIcon category={facility.mainCategory} className="h-14 w-14" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 className="truncate text-[23px] font-extrabold leading-[1.25] text-[#172033]">
                {facility.name}
              </h2>
              <p className="mt-0.5 text-[17px] font-bold text-[#FF7A32]">
                우리 집에서 {facility.distanceFromHome}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="시설 정보 닫기"
              className="flex h-8 w-8 shrink-0 items-center justify-center text-[28px] leading-none text-[#9AA1AE]"
            >
              ×
            </button>
          </div>

          <p className="mt-2 flex items-start gap-1.5 break-keep text-[17px] font-semibold leading-6 text-[#667085]">
            <PinIcon />
            <span>{facility.address}</span>
          </p>
          {facility.operatingHours && (
            <p className="mt-1 flex items-center gap-1.5 text-[17px] font-semibold text-[#667085]">
              <ClockIcon />
              {facility.operatingHours}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {facility.phone && (
          <a
            href={`tel:${facility.phone}`}
            className="flex h-11 min-w-[108px] items-center justify-center rounded-full border-2 border-[#FF8A3D] px-4 text-[18px] font-extrabold text-[#FF7A32]"
          >
            전화하기
          </a>
        )}
        <button
          type="button"
          onClick={() => onViewDetail(facility)}
          className="flex h-11 min-w-0 flex-1 items-center justify-center rounded-full bg-[#FF8A3D] px-4 text-[18px] font-extrabold text-white"
        >
          시설 자세히 보기
        </button>
      </div>
    </div>
  </aside>
);

export default LargeFacilitySummarySheet;
