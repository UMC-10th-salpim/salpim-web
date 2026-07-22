import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import { searchAllFacilities, sendFacilitiesToBackend } from '@/apis/facility';
import CategoryFilterSheet from '@/features/map/CategoryFilterSheet';
import FacilitySummarySheet from '@/features/map/FacilitySummarySheet';
import FilterBar from '@/features/map/FilterBar';
import MapView from '@/features/map/MapView';
import { getMockFacilitiesNear } from '@/features/map/mockFacilities';
import type { Facility, FacilityMainCategory, MapCenter } from '@/features/map/types';

// 위치 권한이 없거나 거부됐을 때 사용하는 기본 중심 좌표 (서울시청)
const DEFAULT_CENTER: MapCenter = { lat: 37.5665, lng: 126.978 };

const MapPage = () => {
  const navigate = useNavigate();
  const [selectedMainCategory, setSelectedMainCategory] = useState<FacilityMainCategory | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [openCategorySheet, setOpenCategorySheet] = useState<FacilityMainCategory | null>(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);

  const [center, setCenter] = useState<MapCenter>(DEFAULT_CENTER);
  const [centerReady, setCenterReady] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setCenterReady(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
        setCenterReady(true);
      },
      () => setCenterReady(true)
    );
  }, []);

  const { data: facilities = [] } = useQuery({
    queryKey: ['facilities', center.lat, center.lng],
    queryFn: async () => {
      const realFacilities = await searchAllFacilities(center);
      const result = realFacilities.length > 0 ? realFacilities : getMockFacilitiesNear(center);

      void sendFacilitiesToBackend(result);

      return result;
    },
    enabled: centerReady,
  });

  const filteredFacilities = useMemo(() => {
    if (!selectedSubCategory) return facilities;

    return facilities.filter((facility) => facility.subCategory === selectedSubCategory);
  }, [facilities, selectedSubCategory]);

  const selectedFacility = filteredFacilities.find((facility) => facility.id === selectedFacilityId) ?? null;

  const handleSelectAll = () => {
    setSelectedMainCategory(null);
    setSelectedSubCategory(null);
    setSelectedFacilityId(null);
  };

  const handleOpenCategory = (category: FacilityMainCategory) => {
    setOpenCategorySheet(category);
  };

  const handleSelectSubCategory = (subCategory: string) => {
    if (subCategory === selectedSubCategory) {
      setSelectedMainCategory(null);
      setSelectedSubCategory(null);
    } else {
      setSelectedMainCategory(openCategorySheet);
      setSelectedSubCategory(subCategory);
    }
    setSelectedFacilityId(null);
    setOpenCategorySheet(null);
  };

  const handleSelectFacility = (facility: Facility) => {
    setSelectedFacilityId((currentId) => (currentId === facility.id ? null : facility.id));
  };

  return (
    <main className="flex h-screen flex-col bg-gray-50">
      <HeaderBar title="주변 혜택 시설" />

      <div className="relative flex flex-1 flex-col overflow-hidden pb-16">
        <MapView
          center={center}
          facilities={filteredFacilities}
          selectedFacilityId={selectedFacilityId}
          onSelectFacility={handleSelectFacility}
        />

        <FilterBar
          selectedMainCategory={selectedMainCategory}
          selectedSubCategory={selectedSubCategory}
          onSelectAll={handleSelectAll}
          onOpenCategory={handleOpenCategory}
        />

        {selectedFacility && (
          <FacilitySummarySheet
            facility={selectedFacility}
            onClose={() => setSelectedFacilityId(null)}
            onViewDetail={(facility) => navigate(`/facility/${facility.id}`, { state: { facility } })}
          />
        )}
      </div>

      <CategoryFilterSheet
        open={openCategorySheet !== null}
        mainCategory={openCategorySheet}
        selectedSubCategory={selectedSubCategory}
        onSelect={handleSelectSubCategory}
        onClose={() => setOpenCategorySheet(null)}
      />

      <BottomNavigation />
    </main>
  );
};

export default MapPage;
