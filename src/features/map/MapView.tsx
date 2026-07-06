import type { Facility } from './types';

interface MapViewProps {
  facilities: Facility[];
  selectedFacilityId?: string;
  userLocationLabel?: string;
  onSelectFacility?: (facility: Facility) => void;
}

const getMarkerPosition = (facility: Facility, index: number) => {
  if (facility.lat !== undefined && facility.lng !== undefined) {
    const left = 16 + Math.abs(facility.lng * 13) % 68;
    const top = 18 + Math.abs(facility.lat * 17) % 58;

    return { left: `${left}%`, top: `${top}%` };
  }

  return {
    left: `${18 + (index * 23) % 64}%`,
    top: `${20 + (index * 17) % 56}%`,
  };
};

const MapView = ({
  facilities,
  selectedFacilityId,
  userLocationLabel = '내 주변',
  onSelectFacility,
}: MapViewProps) => {
  return (
    <section className="relative h-[360px] overflow-hidden bg-[#F4F7F5]" aria-label="주변시설 지도">
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

      <div className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm">
        {userLocationLabel}
      </div>

      <div className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1">
        <div className="h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-md" />
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-gray-700 shadow-sm">현재 위치</span>
      </div>

      {facilities.map((facility, index) => {
        const selected = facility.id === selectedFacilityId;

        return (
          <button
            key={facility.id}
            type="button"
            onClick={() => onSelectFacility?.(facility)}
            className={`absolute z-20 -translate-x-1/2 -translate-y-full rounded-full px-3 py-2 text-xs font-semibold shadow-md transition-transform hover:scale-105 ${
              selected ? 'bg-[#FF8A3D] text-white' : 'bg-white text-gray-900'
            }`}
            style={getMarkerPosition(facility, index)}
            aria-pressed={selected}
          >
            {facility.name}
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
