import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import { searchAllFacilities } from '@/apis/facility';
import { mypageApi } from '@/apis/mypage';
import { authApi } from '@/apis/auth';
import CategoryFilterSheet from '@/features/map/CategoryFilterSheet';
import FacilitySummarySheet from '@/features/map/FacilitySummarySheet';
import FilterBar from '@/features/map/FilterBar';
import MapView from '@/features/map/MapView';
import { getMockFacilitiesNear } from '@/features/map/mockFacilities';
import type { Facility, FacilityMainCategory, MapCenter } from '@/features/map/types';
import useUserStore from '@/store/userStore';

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

  const { data: facilities = [] } = useQuery({
    queryKey: ['facilities', 'home', center.lat, center.lng],
    queryFn: async () => {
      const realFacilities = await searchAllFacilities(center);
      return realFacilities.length > 0 ? realFacilities : getMockFacilitiesNear(center);
    },
    enabled: centerReady,
  });

  const filteredFacilities = useMemo(() => {
    if (selectedSubCategories.length === 0) return [];

    const selected = new Set(selectedSubCategories);
    return facilities.filter((facility) => selected.has(facility.subCategory));
  }, [facilities, selectedSubCategories]);

  const selectedFacility =
    filteredFacilities.find((facility) => facility.id === selectedFacilityId) ?? null;

  const handleOpenCategory = (category: FacilityMainCategory) => {
    setOpenCategorySheet(category);
  };

  const handleSelectSubCategory = (subCategory: string) => {
    setSelectedSubCategories((current) =>
      current.includes(subCategory)
        ? current.filter((category) => category !== subCategory)
        : [...current, subCategory]
    );
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

  const handleSelectFacility = (facility: Facility) => {
    setSelectedFacilityId((currentId) => (currentId === facility.id ? null : facility.id));
  };

  return (
    <main className="map-font-scope flex h-[100svh] flex-col bg-gray-50">
      <HeaderBar title="주변 혜택 시설" />

      <div className="relative flex flex-1 flex-col overflow-hidden pb-16">
        <MapView
          center={center}
          centerType={currentLocationCenter ? 'current' : 'home'}
          facilities={filteredFacilities}
          hasCategorySelected={selectedSubCategories.length > 0}
          selectedFacilityId={selectedFacilityId}
          onSelectFacility={handleSelectFacility}
        />

        <FilterBar
          selectedSubCategories={selectedSubCategories}
          onOpenCategory={handleOpenCategory}
          onUseCurrentLocation={handleUseCurrentLocation}
          isLocating={isLocating}
        />

        {locationError && (
          <button
            type="button"
            role="alert"
            onClick={() => setLocationError(null)}
            className="absolute inset-x-4 bottom-20 z-40 rounded-2xl bg-[#613212] px-4 py-3 text-left text-base font-semibold text-white shadow-lg"
          >
            {locationError}
          </button>
        )}

        {selectedFacility && (
          <FacilitySummarySheet
            facility={selectedFacility}
            onClose={() => setSelectedFacilityId(null)}
            onViewDetail={(facility) =>
              navigate(`/facility/${facility.id}`, { state: { facility } })
            }
          />
        )}
      </div>

      <CategoryFilterSheet
        open={openCategorySheet !== null}
        mainCategory={openCategorySheet}
        selectedSubCategories={selectedSubCategories}
        onSelect={handleSelectSubCategory}
        onClose={() => setOpenCategorySheet(null)}
      />

      <BottomNavigation />
    </main>
  );
};

export default MapPage;
