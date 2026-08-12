import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import {
  isFacilityNameMatch,
  searchAllFacilities,
  searchFacilityByName,
} from '@/apis/facility';
import { mypageApi } from '@/apis/mypage';
import { authApi } from '@/apis/auth';
import CategoryFilterSheet from '@/features/map/CategoryFilterSheet';
import FacilitySummarySheet from '@/features/map/FacilitySummarySheet';
import FilterBar from '@/features/map/FilterBar';
import MapView from '@/features/map/MapView';
import { getMockFacilitiesNear } from '@/features/map/mockFacilities';
import { FACILITY_CATEGORY_GROUPS } from '@/features/map/types';
import type { Facility, FacilityMainCategory, MapCenter } from '@/features/map/types';
import useUserStore from '@/store/userStore';
import useSettingsStore from '@/store/settingsStore';
import LargeCategoryFilterSheet from '@/features/map/large/LargeCategoryFilterSheet';
import LargeFacilitySummarySheet from '@/features/map/large/LargeFacilitySummarySheet';
import LargeFilterBar from '@/features/map/large/LargeFilterBar';

// 저장된 집 좌표를 확인하지 못했을 때만 사용하는 기본 중심 좌표 (서울시청)
const DEFAULT_CENTER: MapCenter = { lat: 37.5665, lng: 126.978 };

const isValidCoordinate = (latitude?: number | null, longitude?: number | null) =>
  typeof latitude === 'number' &&
  Number.isFinite(latitude) &&
  typeof longitude === 'number' &&
  Number.isFinite(longitude);

const toMapCenter = (latitude?: number | null, longitude?: number | null): MapCenter | null =>
  isValidCoordinate(latitude, longitude)
    ? { lat: latitude as number, lng: longitude as number }
    : null;

const MapPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const focusFacilityName = (
    location.state as { focusFacilityName?: string } | null
  )?.focusFacilityName?.trim();
  const isLarge = useSettingsStore((state) => state.fontSize === 'large');
  const accessToken = useUserStore((state) => state.accessToken);
  const homeLatitude = useUserStore((state) => state.homeLatitude);
  const homeLongitude = useUserStore((state) => state.homeLongitude);
  const setHomeLocation = useUserStore((state) => state.setHomeLocation);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
  const [openCategorySheet, setOpenCategorySheet] = useState<FacilityMainCategory | null>(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [currentLocationCenter, setCurrentLocationCenter] = useState<MapCenter | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const { data: profile, isPending: isProfilePending } = useQuery({
    queryKey: ['mypage-summary', accessToken],
    queryFn: mypageApi.getSummary,
    enabled: Boolean(accessToken),
    retry: false,
  });

  const profileCenter = toMapCenter(profile?.latitude, profile?.longitude);
  const storedHomeCenter = toMapCenter(homeLatitude, homeLongitude);
  const needsAddressGeocoding = Boolean(
    profile?.roadAddress && !profileCenter && !storedHomeCenter
  );
  const { data: geocodedHome, isPending: isGeocodingPending } = useQuery({
    queryKey: ['home-location', profile?.roadAddress],
    queryFn: () => authApi.geocodeAddress(profile?.roadAddress ?? ''),
    enabled: needsAddressGeocoding,
    retry: false,
  });
  const geocodedCenter = toMapCenter(geocodedHome?.latitude, geocodedHome?.longitude);

  useEffect(() => {
    const resolvedLatitude = profileCenter?.lat ?? geocodedCenter?.lat;
    const resolvedLongitude = profileCenter?.lng ?? geocodedCenter?.lng;
    if (isValidCoordinate(resolvedLatitude, resolvedLongitude)) {
      setHomeLocation(resolvedLatitude as number, resolvedLongitude as number);
    }
  }, [
    geocodedCenter?.lat,
    geocodedCenter?.lng,
    profileCenter?.lat,
    profileCenter?.lng,
    setHomeLocation,
  ]);

  const homeCenter = profileCenter ?? geocodedCenter ?? storedHomeCenter ?? DEFAULT_CENTER;
  const center = currentLocationCenter ?? homeCenter;

  const centerReady =
    storedHomeCenter !== null ||
    !accessToken ||
    (!isProfilePending && (!needsAddressGeocoding || !isGeocodingPending));

  const { data: nearbyFacilities = [] } = useQuery({
    queryKey: ['facilities', 'home', center.lat, center.lng],
    queryFn: async () => {
      const realFacilities = await searchAllFacilities(center);
      return realFacilities.length > 0 ? realFacilities : getMockFacilitiesNear(center);
    },
    enabled: centerReady,
  });

  const {
    data: searchedFacility = null,
    isError: isFacilitySearchError,
    isFetched: isFacilitySearchFetched,
  } = useQuery({
    queryKey: ['facility', 'by-name', focusFacilityName, homeCenter.lat, homeCenter.lng],
    queryFn: () => searchFacilityByName(focusFacilityName ?? '', homeCenter),
    enabled: centerReady && Boolean(focusFacilityName),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const fallbackFacility = useMemo(() => {
    if (!focusFacilityName) return null;
    return (
      nearbyFacilities.find((facility) =>
        isFacilityNameMatch(facility.name, focusFacilityName)
      ) ?? null
    );
  }, [focusFacilityName, nearbyFacilities]);
  const focusedFacility = searchedFacility ?? fallbackFacility;

  const facilities = useMemo(() => {
    if (!focusedFacility) return nearbyFacilities;

    return [
      focusedFacility,
      ...nearbyFacilities.filter((facility) => facility.id !== focusedFacility.id),
    ];
  }, [focusedFacility, nearbyFacilities]);

  useEffect(() => {
    if (!focusedFacility) return;

    setSelectedSubCategories((current) =>
      current.includes(focusedFacility.subCategory)
        ? current
        : [...current, focusedFacility.subCategory]
    );
    setSelectedFacilityId(focusedFacility.id);
  }, [focusedFacility]);

  useEffect(() => {
    if (
      !focusFacilityName ||
      focusedFacility ||
      (!isFacilitySearchError && !isFacilitySearchFetched)
    ) {
      return;
    }
    setLocationError('해당 기관의 위치를 찾지 못했어요. 카테고리에서 주변 시설을 확인해 주세요.');
  }, [focusFacilityName, focusedFacility, isFacilitySearchError, isFacilitySearchFetched]);

  const filteredFacilities = useMemo(() => {
    if (selectedSubCategories.length === 0) return [];

    const selected = new Set(selectedSubCategories);
    return facilities.filter((facility) => selected.has(facility.subCategory));
  }, [facilities, selectedSubCategories]);

  const visibleFacilities = filteredFacilities;
  const selectedFacility =
    visibleFacilities.find((facility) => facility.id === selectedFacilityId) ?? null;

  const handleOpenCategory = (category: FacilityMainCategory) => {
    setOpenCategorySheet(category);
  };

  const handleSelectSubCategory = (subCategory: string) => {
    const group = FACILITY_CATEGORY_GROUPS.find(({ options }) => options.includes(subCategory));
    if (!group) return;

    setSelectedSubCategories((current) => {
      const selectionsInGroup = current.filter((category) => group.options.includes(category));

      return current.includes(subCategory)
        ? selectionsInGroup.filter((category) => category !== subCategory)
        : [...selectionsInGroup, subCategory];
    });
    setSelectedFacilityId(null);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('이 기기에서는 현재 위치를 확인할 수 없어요.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCurrentLocationCenter({ lat: coords.latitude, lng: coords.longitude });
        setSelectedFacilityId(null);
        setIsLocating(false);
      },
      () => {
        setLocationError('현재 위치를 확인하지 못했어요. 위치 권한을 확인해 주세요.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  const handleLocationToggle = () => {
    if (currentLocationCenter) {
      setCurrentLocationCenter(null);
      setSelectedFacilityId(null);
      setLocationError(null);
      return;
    }

    handleUseCurrentLocation();
  };

  const handleSelectFacility = (facility: Facility) => {
    setSelectedFacilityId((currentId) => (currentId === facility.id ? null : facility.id));
  };

  return (
    <main className="flex h-[100svh] flex-col bg-gray-50">
      <HeaderBar title="주변 혜택 시설" className={isLarge ? '!h-14 [&_h1]:!text-[25px]' : ''} />

      <div className="relative flex flex-1 flex-col overflow-hidden pb-16">
        <MapView
          center={center}
          centerType={currentLocationCenter ? 'current' : 'home'}
          facilities={visibleFacilities}
          hasCategorySelected={selectedSubCategories.length > 0}
          selectedFacilityId={selectedFacilityId}
          focusFacilityId={focusedFacility?.id}
          onSelectFacility={handleSelectFacility}
          large={isLarge}
        />

        {isLarge ? (
          <LargeFilterBar
            selectedSubCategories={selectedSubCategories}
            onOpenCategory={handleOpenCategory}
          />
        ) : (
          <FilterBar
            selectedSubCategories={selectedSubCategories}
            onOpenCategory={handleOpenCategory}
          />
        )}

        <button
          type="button"
          onClick={handleLocationToggle}
          disabled={isLocating}
          aria-label={currentLocationCenter ? '집 위치로 돌아가기' : '현재 위치에서 주변 시설 찾기'}
          className="absolute bottom-20 left-4 z-40 flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-[#FF8A3D] bg-white text-[#FF6B00] shadow-[0_4px_12px_rgba(47,36,27,0.2)] disabled:opacity-60"
        >
          {isLocating ? (
            <span className="h-6 w-6 animate-spin rounded-full border-[3px] border-[#FFD29E] border-t-[#FF6B00]" />
          ) : currentLocationCenter ? (
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden>
              <path
                d="M2.75 10.25 12 2.5l9.25 7.75v9.25A2.5 2.5 0 0 1 18.75 22H5.25a2.5 2.5 0 0 1-2.5-2.5v-9.25Z"
                fill="currentColor"
              />
              <path
                d="M9 22v-7h6v7"
                stroke="white"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="4" fill="currentColor" />
              <path
                d="M12 2v3M12 19v3M2 12h3M19 12h3"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
            </svg>
          )}
        </button>

        {locationError && (
          <button
            type="button"
            role="alert"
            onClick={() => setLocationError(null)}
            className="absolute inset-x-4 bottom-36 z-40 rounded-2xl bg-[#613212] px-4 py-3 text-left text-base font-semibold text-white shadow-lg"
          >
            {locationError}
          </button>
        )}

        {selectedFacility &&
          (isLarge ? (
            <LargeFacilitySummarySheet
              facility={selectedFacility}
              onClose={() => setSelectedFacilityId(null)}
              onViewDetail={(facility) =>
                navigate(`/facility/${facility.id}`, { state: { facility } })
              }
            />
          ) : (
            <FacilitySummarySheet
              facility={selectedFacility}
              onClose={() => setSelectedFacilityId(null)}
              onViewDetail={(facility) =>
                navigate(`/facility/${facility.id}`, { state: { facility } })
              }
            />
          ))}
      </div>

      {isLarge ? (
        <LargeCategoryFilterSheet
          open={openCategorySheet !== null}
          mainCategory={openCategorySheet}
          selectedSubCategories={selectedSubCategories}
          onSelect={handleSelectSubCategory}
          onClose={() => setOpenCategorySheet(null)}
        />
      ) : (
        <CategoryFilterSheet
          open={openCategorySheet !== null}
          mainCategory={openCategorySheet}
          selectedSubCategories={selectedSubCategories}
          onSelect={handleSelectSubCategory}
          onClose={() => setOpenCategorySheet(null)}
        />
      )}

      <BottomNavigation />
    </main>
  );
};

export default MapPage;
