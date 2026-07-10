import FacilityIcon from './FacilityIcon';
import type { Facility } from './types';

interface MapViewProps {
  facilities: Facility[];
  selectedFacilityId?: string | null;
  onSelectFacility?: (facility: Facility) => void;
}

const LocationPin = () => (
  <svg width="28" height="36" viewBox="0 0 24 32" aria-hidden>
    <path
      d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0Z"
      fill="#FF5A3C"
    />
    <circle cx="12" cy="12" r="5" fill="white" />
  </svg>
);

const MapView = ({ facilities, selectedFacilityId, onSelectFacility }: MapViewProps) => {
  return (
    <section className="relative flex-1 overflow-hidden bg-[#F4F7F5]" aria-label="주변 혜택 시설 지도">
      <div className="absolute inset-0">
        <div className="absolute left-0 top-1/4 h-px w-full bg-white" />
        <div className="absolute left-0 top-2/4 h-px w-full bg-white" />
        <div className="absolute left-0 top-3/4 h-px w-full bg-white" />
        <div className="absolute left-1/4 top-0 h-full w-px bg-white" />
        <div className="absolute left-2/4 top-0 h-full w-px bg-white" />
        <div className="absolute left-3/4 top-0 h-full w-px bg-white" />
        <div className="absolute left-[8%] top-[58%] h-16 w-[120%] -rotate-12 bg-[#E7DED0]" />
        <div className="absolute left-[-8%] top-[32%] h-12 w-[120%] rotate-6 bg-[#DBE8DF]" />
      </div>

      <div className="absolute left-[38%] top-[30%] z-10 -translate-x-1/2 -translate-y-full">
        <LocationPin />
      </div>

      {facilities.map((facility) => {
        const selected = facility.id === selectedFacilityId;
        const { left, top } = facility.markerPosition;

        return (
          <button
            key={facility.id}
            type="button"
            onClick={() => onSelectFacility?.(facility)}
            className="absolute z-20 flex -translate-x-1/2 -translate-y-full flex-col items-center gap-1"
            style={{ left: `${left}%`, top: `${top}%` }}
            aria-pressed={selected}
          >
            <FacilityIcon
              category={facility.mainCategory}
              className={selected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#FF8A3D]' : ''}
            />
            <span
              className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold shadow-md transition-colors ${
                selected ? 'bg-[#FF8A3D] text-white' : 'bg-white text-gray-900'
              }`}
            >
              {facility.name}
            </span>
          </button>
        );
      })}

      {facilities.length === 0 && (
        <div className="absolute inset-x-6 top-1/2 z-20 -translate-y-1/2 rounded-2xl bg-white px-5 py-4 text-center text-sm text-gray-600 shadow-sm">
          선택한 카테고리에 해당하는 주변시설이 없습니다.
        </div>
      )}
    </section>
  );
};

export default MapView;
