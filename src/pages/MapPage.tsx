import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import CategoryFilterSheet from '@/features/map/CategoryFilterSheet';
import FacilitySummarySheet from '@/features/map/FacilitySummarySheet';
import FilterBar from '@/features/map/FilterBar';
import MapView from '@/features/map/MapView';
import { mockFacilities } from '@/features/map/mockFacilities';
import type { Facility, FacilityMainCategory } from '@/features/map/types';

const MapPage = () => {
  const navigate = useNavigate();
  const [selectedMainCategory, setSelectedMainCategory] = useState<FacilityMainCategory | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [openCategorySheet, setOpenCategorySheet] = useState<FacilityMainCategory | null>(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);

  const filteredFacilities = useMemo(() => {
    if (!selectedSubCategory) return mockFacilities;

    return mockFacilities.filter((facility) => facility.subCategory === selectedSubCategory);
  }, [selectedSubCategory]);

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

      <FilterBar
        selectedMainCategory={selectedMainCategory}
        selectedSubCategory={selectedSubCategory}
        onSelectAll={handleSelectAll}
        onOpenCategory={handleOpenCategory}
      />

      <div className="relative flex flex-1 flex-col overflow-hidden pb-16">
        <MapView
          facilities={filteredFacilities}
          selectedFacilityId={selectedFacilityId}
          onSelectFacility={handleSelectFacility}
        />

        {selectedFacility && (
          <FacilitySummarySheet
            facility={selectedFacility}
            onClose={() => setSelectedFacilityId(null)}
            onViewDetail={(facility) => navigate(`/facility/${facility.id}`)}
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
