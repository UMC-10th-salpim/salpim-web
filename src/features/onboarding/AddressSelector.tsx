import { useState } from 'react';
import type { AddressResult } from '@/apis/address';
import RoadAddressSearchPage from './RoadAddressSearchPage';
import { inputStyle, labelStyle, primaryButton, secondaryButton } from './styles';

export interface AddressInfo {
  roadAddress: string;
  detail: string;
  city: string;
  district: string;
  eupMyeonDong: string;
}

interface AddressSelectorProps {
  value: AddressInfo;
  onChange: (address: AddressInfo) => void;
  onBack: () => void;
  onNext: () => void;
  onUseCurrentLocation?: (latitude: number, longitude: number) => Promise<AddressResult>;
}

interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

interface CachedLocation extends LocationCoordinates {
  savedAt: number;
}

const LOCATION_CACHE_KEY = 'salpim-last-location';
const LOCATION_CACHE_MAX_AGE_MS = 30 * 60 * 1000;

const readCachedLocation = (): LocationCoordinates | null => {
  try {
    const stored = localStorage.getItem(LOCATION_CACHE_KEY);
    if (!stored) return null;

    const cached = JSON.parse(stored) as CachedLocation;
    const isValid =
      Number.isFinite(cached.latitude) &&
      Number.isFinite(cached.longitude) &&
      Number.isFinite(cached.savedAt) &&
      Date.now() - cached.savedAt <= LOCATION_CACHE_MAX_AGE_MS;

    return isValid ? { latitude: cached.latitude, longitude: cached.longitude } : null;
  } catch {
    return null;
  }
};

const saveCachedLocation = (coordinates: LocationCoordinates) => {
  try {
    localStorage.setItem(
      LOCATION_CACHE_KEY,
      JSON.stringify({ ...coordinates, savedAt: Date.now() } satisfies CachedLocation)
    );
  } catch {
    // 저장 공간을 사용할 수 없어도 현재 위치 설정은 계속 진행한다.
  }
};

const SearchIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
    <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const LocationIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="4" fill="currentColor" />
    <path
      d="M12 1v3M12 20v3M1 12h3M20 12h3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const AddressSelector = ({
  value,
  onChange,
  onBack,
  onNext,
  onUseCurrentLocation,
}: AddressSelectorProps) => {
  const [query, setQuery] = useState(value.roadAddress);
  const [isSearchPageOpen, setIsSearchPageOpen] = useState(false);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const isValid = value.roadAddress.trim() !== '' && value.detail.trim() !== '';

  const getCurrentPosition = (options: PositionOptions) =>
    new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });

  const requestLocationCoordinates = async (): Promise<LocationCoordinates> => {
    try {
      // 데스크톱과 Safari에서 빠르게 잡히는 네트워크 기반 위치를 먼저 사용한다.
      const position = await getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 20_000,
        maximumAge: LOCATION_CACHE_MAX_AGE_MS,
      });
      const coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      saveCachedLocation(coordinates);
      return coordinates;
    } catch (firstError) {
      if (
        (firstError as GeolocationPositionError).code === GeolocationPositionError.PERMISSION_DENIED
      ) {
        throw firstError;
      }

      try {
        // 일반 위치가 없을 때만 새 고정밀 좌표를 한 번 더 요청한다.
        const position = await getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 30_000,
          maximumAge: 0,
        });
        const coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        saveCachedLocation(coordinates);
        return coordinates;
      } catch (secondError) {
        if (
          (secondError as GeolocationPositionError).code ===
          GeolocationPositionError.PERMISSION_DENIED
        ) {
          throw secondError;
        }

        // 브라우저 위치 서비스가 잠시 불안정하면 마지막 정상 좌표를 재사용한다.
        const cachedLocation = readCachedLocation();
        if (cachedLocation) return cachedLocation;
        throw secondError;
      }
    }
  };

  const handleUseCurrentLocation = async () => {
    setLocationPermissionDenied(false);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('현재 기기에서는 위치 정보를 사용할 수 없어요. 직접 주소를 입력해 주세요.');
      return;
    }

    setIsLocating(true);
    let coordinates: LocationCoordinates;
    try {
      coordinates = await requestLocationCoordinates();
    } catch (error) {
      if ((error as GeolocationPositionError).code === GeolocationPositionError.PERMISSION_DENIED) {
        setLocationPermissionDenied(true);
      } else if (!window.isSecureContext) {
        setLocationError('현재 위치는 HTTPS 주소에서만 사용할 수 있어요. HTTPS로 접속해 주세요.');
      } else {
        console.error('[address] current location setup failed', error);
        setLocationError('현재 위치를 확인하지 못했어요. 위치 서비스와 네트워크를 확인해 주세요.');
      }
      setIsLocating(false);
      return;
    }

    try {
      if (!onUseCurrentLocation) return;
      const currentAddress = await onUseCurrentLocation(
        coordinates.latitude,
        coordinates.longitude
      );
      onChange({ ...currentAddress, detail: '' });
      setQuery(currentAddress.roadAddress);
    } catch (error) {
      console.error('[address] reverse geocoding failed', error);
      setLocationError('현재 위치의 주소를 변환하지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsLocating(false);
    }
  };

  const openSearchPage = () => {
    if (!query.trim()) return;
    setIsSearchPageOpen(true);
  };

  const confirmAddress = (address: AddressResult) => {
    onChange({
      roadAddress: address.roadAddress,
      detail: address.roadAddress === value.roadAddress ? value.detail : '',
      city: address.city,
      district: address.district,
      eupMyeonDong: address.eupMyeonDong,
    });
    setQuery(address.roadAddress);
    setIsSearchPageOpen(false);
  };

  if (isSearchPageOpen) {
    return (
      <RoadAddressSearchPage
        initialQuery={query}
        initialSelectedAddress={value.roadAddress}
        onBack={() => setIsSearchPageOpen(false)}
        onConfirm={confirmAddress}
      />
    );
  }

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-col pb-2 pt-[clamp(6px,1.02vh,8px)]">
          <h1 className="salpim-page-title mb-6 text-center font-bold text-[#613212]">
            우리집을 설정해 주세요!
          </h1>

          {/* 안내 */}
          <div className="relative mx-auto mb-1.5 h-24 w-[310px] translate-y-[50px]">
            <img
              src="/assets/Salpimi/Search.png"
              alt="살피미"
              className="absolute -left-[25px] top-[-52px] z-10 size-28 scale-x-[-1] object-contain"
            />
            <div className="flex h-24 w-[310px] items-center rounded-2xl bg-brand-100 pl-[68px] pr-4 font-[Pretendard] text-xl font-medium leading-[1.35] text-black">
              주소로 내 지역 혜택과
              <br />
              근처 복지 시설을 찾아 드려요.
            </div>
          </div>

          {/* 현재 위치 자동 설정 */}
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="salpim-field-text mx-auto flex h-[68px] w-[308px] translate-y-[50px] items-center justify-center gap-2 rounded-[15px] border-2 border-[#FFB86B] bg-[#FFE3C2] py-0 font-[Pretendard] !font-semibold text-[#8B5A2B] transition-colors hover:bg-[#FFDBB2]"
          >
            <LocationIcon className="h-6 w-6 shrink-0 text-[#8B5A2B]" />
            {isLocating ? '현재 위치 확인 중...' : '현재 위치로 자동 설정'}
          </button>
          {locationPermissionDenied && (
            <p
              role="alert"
              className="mt-2.5 flex w-full translate-y-[50px] items-start justify-center gap-2 font-[Pretendard] text-xl font-semibold leading-[1.35] text-[#FF4545]"
            >
              <span
                aria-hidden
                className="mt-0.5 flex size-[clamp(24px,3.55vh,28px)] shrink-0 items-center justify-center rounded-full bg-[#FF4545] text-lg font-bold leading-none text-white"
              >
                ×
              </span>
              <span>
                위치 권한이 거부되었어요.
                <br />
                직접 주소를 입력해 주세요.
              </span>
            </p>
          )}
          {locationError && (
            <p
              role="alert"
              className="mt-2.5 flex w-full translate-y-[50px] justify-center text-center font-[Pretendard] text-lg font-semibold leading-[1.35] text-[#FF4545]"
            >
              {locationError}
            </p>
          )}
          <p
            className={`mb-20 flex w-full translate-y-[50px] justify-center text-center font-[Pretendard] text-xl font-semibold text-black ${
              locationPermissionDenied || locationError ? 'mt-1' : 'mt-2.5'
            }`}
          >
            또는 직접 입력하기
          </p>

          {/* 도로명 주소 검색 */}
          <div className="mx-auto w-[306px]">
            <label className={labelStyle}>도로명 주소</label>
            <div className="flex h-[52px] items-center gap-2 rounded-[14px] border-4 border-[#FED7AA] bg-white px-4 py-0 focus-within:border-[#FED7AA]">
              <SearchIcon className="h-[clamp(30px,4.57vh,36px)] w-[clamp(30px,4.57vh,36px)] shrink-0 text-[#613212]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') openSearchPage();
                }}
                placeholder="도로명 주소 입력"
                className="salpim-field-text min-w-0 flex-1 text-gray-900 outline-none placeholder:text-gray-400"
                aria-label="도로명 주소 검색"
              />
              <button
                type="button"
                onClick={openSearchPage}
                disabled={!query.trim()}
                className="salpim-field-text flex h-[clamp(30px,4.57vh,36px)] shrink-0 items-center !font-semibold text-[#613212]"
              >
                검색
              </button>
            </div>

            {/* 상세 주소 (주소 선택 후 노출) */}
            {value.roadAddress && (
              <div className="mt-5">
                <label htmlFor="detail" className={labelStyle}>
                  상세 주소
                </label>
                <textarea
                  id="detail"
                  rows={2}
                  className={`${inputStyle} box-border h-[78px] min-h-[78px] resize-none overflow-y-hidden !border-4 !border-[#FED7AA] !py-[5px] !font-[Inter] !font-medium !leading-[30px] focus:!border-[#FED7AA] placeholder:!font-[Inter] placeholder:!font-medium placeholder:!text-[#613212] placeholder:!opacity-40`}
                  value={value.detail}
                  onChange={(event) => onChange({ ...value, detail: event.target.value })}
                  placeholder={'건물명, 동/호수 등\n상세 주소를 입력해주세요.'}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="-mx-0.5 flex shrink-0 gap-4 pt-4">
        <button type="button" onClick={onBack} className={secondaryButton}>
          이전
        </button>
        <button type="button" onClick={onNext} disabled={!isValid} className={primaryButton}>
          다음
        </button>
      </div>
    </>
  );
};

export default AddressSelector;
