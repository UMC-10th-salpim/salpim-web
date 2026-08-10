import { ClockIcon, HomeIcon, PinIcon } from '../InfoIcons';
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
  <aside className="fixed inset-x-0 bottom-24 z-30 px-4">
    <div className="animate-slide-up mx-auto max-w-screen-sm rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="break-words text-[25px] font-extrabold leading-tight text-gray-900">
            {facility.name}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-[19px] font-bold text-[#FF8A3D]">
            {facility.distanceFromHome}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="시설 정보 닫기"
            className="text-[28px] leading-none text-gray-400"
          >
            ×
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 text-[19px] font-semibold leading-7 text-gray-600">
        <p className="flex items-start gap-2">
          <PinIcon />
          <span>
            {facility.address} {facility.detailAddress}
          </span>
        </p>
        {facility.operatingHours && (
          <p className="flex items-center gap-2">
            <ClockIcon />
            {facility.operatingHours}
          </p>
        )}
        <p className="flex items-center gap-2">
          <HomeIcon />
          우리 집에서 {facility.distanceFromHome}
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {facility.phone && (
          <a
            href={`tel:${facility.phone}`}
            className="flex h-14 items-center justify-center rounded-xl border-2 border-[#FF8A3D] text-[21px] font-extrabold text-[#FF8A3D]"
          >
            전화하기
          </a>
        )}
        <button
          type="button"
          onClick={() => onViewDetail(facility)}
          className="flex h-14 items-center justify-center rounded-xl bg-[#FF8A3D] text-[21px] font-extrabold text-white"
        >
          시설 자세히 보기
        </button>
      </div>
    </div>
  </aside>
);

export default LargeFacilitySummarySheet;
