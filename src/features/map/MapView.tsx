import { CustomOverlayMap, Map, useKakaoLoader } from 'react-kakao-maps-sdk';
import FacilityIcon from './FacilityIcon';
import type { Facility, MapCenter } from './types';

interface MapViewProps {
  center: MapCenter;
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

const MapView = ({ center, facilities, selectedFacilityId, onSelectFacility }: MapViewProps) => {
  const [loading, error] = useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_KEY,
    url: 'https://dapi.kakao.com/v2/maps/sdk.js',
  });

  if (error) {
    return (
      <section className="flex flex-1 items-center justify-center bg-gray-50 px-6 text-center text-sm text-gray-500">
        지도를 불러오지 못했습니다. 카카오맵 키와 등록된 도메인을 확인해주세요.
      </section>
    );
  }

  if (loading) {
    return (
      <section className="flex flex-1 items-center justify-center bg-gray-50 text-sm text-gray-400">
        지도를 불러오는 중...
      </section>
    );
  }

  return (
    <section className="relative flex-1 overflow-hidden" aria-label="주변 혜택 시설 지도">
      <Map center={center} level={5} style={{ width: '100%', height: '100%' }}>
        <CustomOverlayMap position={center} yAnchor={1}>
          <LocationPin />
        </CustomOverlayMap>

        {facilities.map((facility) => {
          const selected = facility.id === selectedFacilityId;
          const position = { lat: facility.lat, lng: facility.lng };

          return (
            <CustomOverlayMap key={facility.id} position={position} yAnchor={1} zIndex={selected ? 20 : 10}>
              <button
                type="button"
                onClick={() => onSelectFacility?.(facility)}
                className="flex flex-col items-center gap-1"
                aria-pressed={selected}
              >
                <FacilityIcon
                  category={facility.mainCategory}
                  className={selected ? 'ring-2 ring-[#FF8A3D]' : ''}
                />
                <span
                  className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold shadow-md transition-colors ${
                    selected ? 'bg-[#FF8A3D] text-white' : 'bg-white text-gray-900'
                  }`}
                >
                  {facility.name}
                </span>
              </button>
            </CustomOverlayMap>
          );
        })}
      </Map>

      {facilities.length === 0 && (
        <div className="pointer-events-none absolute inset-x-6 top-1/2 z-20 -translate-y-1/2 rounded-2xl bg-white px-5 py-4 text-center text-sm text-gray-600 shadow-sm">
          선택한 카테고리에 해당하는 주변시설이 없습니다.
        </div>
      )}
    </section>
  );
};

export default MapView;
