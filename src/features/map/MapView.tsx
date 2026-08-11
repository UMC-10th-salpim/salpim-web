import { useEffect, useRef } from 'react';
import { CustomOverlayMap, Map, useKakaoLoader } from 'react-kakao-maps-sdk';
import FacilityIcon from './FacilityIcon';
import type { Facility, MapCenter } from './types';

const kakaoMapKey = import.meta.env.VITE_KAKAO_MAP_KEY?.trim() ?? '';

interface MapViewProps {
  center: MapCenter;
  centerType?: 'home' | 'current';
  facilities: Facility[];
  hasCategorySelected: boolean;
  selectedFacilityId?: string | null;
  focusFacilityId?: string | null;
  onSelectFacility?: (facility: Facility) => void;
  large?: boolean;
}

// 두 좌표 사이의 직선 거리를 미터 단위로 계산 (Haversine)
const getDistanceMeters = (a: MapCenter, b: MapCenter) => {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

const HomePin = () => (
  <svg width="28" height="36" viewBox="0 0 24 32" aria-hidden>
    <path
      d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0Z"
      fill="#FF5A3C"
    />
    <circle cx="12" cy="12" r="5" fill="white" />
  </svg>
);

const CurrentLocationPin = () => (
  <div
    className="flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-white bg-[#2F80ED] shadow-[0_2px_8px_rgba(47,128,237,0.45)]"
    aria-hidden
  >
    <span className="h-2.5 w-2.5 rounded-full bg-white" />
  </div>
);

const MapView = ({
  center,
  centerType = 'home',
  facilities,
  hasCategorySelected,
  selectedFacilityId,
  focusFacilityId,
  onSelectFacility,
  large = false,
}: MapViewProps) => {
  const [loading, error] = useKakaoLoader({
    appkey: kakaoMapKey,
    libraries: ['services'],
  });

  const mapRef = useRef<kakao.maps.Map | null>(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || facilities.length === 0) return;

    const focusedFacility = facilities.find((facility) => facility.id === focusFacilityId);
    if (focusedFacility) {
      map.setCenter(new kakao.maps.LatLng(focusedFacility.lat, focusedFacility.lng));
      map.setLevel(3);
      return;
    }

    const nearest = facilities.reduce((closest, facility) =>
      getDistanceMeters(center, facility) < getDistanceMeters(center, closest) ? facility : closest
    );

    const bounds = new kakao.maps.LatLngBounds();
    bounds.extend(new kakao.maps.LatLng(center.lat, center.lng));
    bounds.extend(new kakao.maps.LatLng(nearest.lat, nearest.lng));
    map.setBounds(bounds, 80);
  }, [facilities, center, focusFacilityId]);

  if (!kakaoMapKey) {
    return (
      <section className="flex flex-1 items-center justify-center bg-gray-50 px-6 text-center text-sm text-gray-500">
        지도 설정값이 없습니다. Vercel 환경 변수에 VITE_KAKAO_MAP_KEY를 등록한 뒤 다시 배포해주세요.
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-1 items-center justify-center bg-gray-50 px-6 text-center text-sm text-gray-500">
        지도를 불러오지 못했습니다. 카카오 Developers의 JavaScript 키와 Web 플랫폼 사이트 도메인을
        확인해주세요.
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
      <Map
        center={center}
        level={5}
        onCreate={(map) => {
          mapRef.current = map;
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <CustomOverlayMap position={center} yAnchor={1}>
          {centerType === 'current' ? <CurrentLocationPin /> : <HomePin />}
        </CustomOverlayMap>

        {facilities.map((facility) => {
          const selected = facility.id === selectedFacilityId;
          const position = { lat: facility.lat, lng: facility.lng };

          return (
            <CustomOverlayMap
              key={facility.id}
              position={position}
              yAnchor={1}
              zIndex={selected ? 20 : 10}
            >
              <button
                type="button"
                onClick={() => onSelectFacility?.(facility)}
                className="flex flex-col items-center gap-0.5"
                aria-pressed={selected}
              >
                <FacilityIcon
                  category={facility.mainCategory}
                  className={`${large ? 'h-14 w-14' : ''} ${
                    selected ? 'ring-4 ring-[#FF8A3D] ring-offset-2' : ''
                  }`}
                />
                <span
                  className={`whitespace-nowrap rounded-full border-2 bg-white px-3 py-1 font-bold text-gray-900 shadow-md ${
                    large ? 'text-[16px] leading-none' : 'text-xs'
                  } ${selected ? 'border-[#FF8A3D]' : 'border-transparent'}`}
                >
                  {facility.name}
                </span>
              </button>
            </CustomOverlayMap>
          );
        })}
      </Map>

      {hasCategorySelected && facilities.length === 0 && (
        <div className="pointer-events-none absolute inset-x-6 top-1/2 z-20 -translate-y-1/2 rounded-2xl bg-white px-5 py-4 text-center text-sm text-gray-600 shadow-sm">
          선택한 카테고리에 해당하는 주변시설이 없습니다.
        </div>
      )}
    </section>
  );
};

export default MapView;
