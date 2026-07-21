import Button from '@/components/common/Button/Button';
import { ClockIcon, HomeIcon, PinIcon } from './InfoIcons';
import type { Facility } from './types';

interface FacilitySummarySheetProps {
  facility: Facility;
  onClose: () => void;
  onViewDetail: (facility: Facility) => void;
}

const FacilitySummarySheet = ({ facility, onClose, onViewDetail }: FacilitySummarySheetProps) => {
  return (
    <div className="fixed inset-x-0 bottom-24 z-30 px-4">
      <div className="animate-slide-up mx-auto max-w-screen-sm rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{facility.name}</h3>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-2xl font-semibold text-[#FF8A3D]">{facility.distanceFromHome}</span>
            <button type="button" onClick={onClose} aria-label="닫기" className="text-2xl leading-none text-gray-400">
              ×
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-1.5 text-2xl text-gray-600">
          <p className="flex items-center gap-1.5">
            <PinIcon />
            {facility.address} {facility.detailAddress}
          </p>
          {facility.operatingHours && (
            <p className="flex items-center gap-1.5">
              <ClockIcon />
              {facility.operatingHours}
            </p>
          )}
          <p className="flex items-center gap-1.5">
            <HomeIcon />
            우리 집에서 {facility.distanceFromHome}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {facility.phone && (
            <a
              href={`tel:${facility.phone}`}
              className="flex h-14 items-center justify-center rounded-xl border border-[#FF8A3D] text-2xl font-semibold text-[#FF8A3D]"
            >
              전화하기
            </a>
          )}
          <Button rounded="xl" className="h-14 text-2xl" onClick={() => onViewDetail(facility)}>
            시설 자세히 보기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FacilitySummarySheet;
