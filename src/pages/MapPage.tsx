import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FacilityCard from '@/features/map/FacilityCard';
import FilterBar from '@/features/map/FilterBar';
import MapView from '@/features/map/MapView';
import { mockFacilities } from '@/features/map/mockFacilities';
import type { Facility, FacilityCategory } from '@/features/map/types';

const MapPage = () => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<FacilityCategory[]>([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState(mockFacilities[0]?.id);

  const filteredFacilities = useMemo(() => {
    if (selectedCategories.length === 0) return mockFacilities;

    return mockFacilities.filter((facility) => selectedCategories.includes(facility.category));
  }, [selectedCategories]);

  const handleToggleCategory = (category: FacilityCategory) => {
    setSelectedCategories((currentCategories) =>
      currentCategories.includes(category)
        ? currentCategories.filter((currentCategory) => currentCategory !== category)
        : [...currentCategories, category]
    );
  };

  const handleSelectFacility = (facility: Facility) => {
    setSelectedFacilityId(facility.id);
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white px-4 py-5">
        <p className="text-sm font-medium text-[#FF8A3D]">주변시설 탐색</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">내 주변 복지시설</h1>
      </header>

      <FilterBar
        selectedCategories={selectedCategories}
        onToggleCategory={handleToggleCategory}
        onReset={() => setSelectedCategories([])}
      />

      <MapView
        facilities={filteredFacilities}
        selectedFacilityId={selectedFacilityId}
        userLocationLabel="서울 강남구 주변"
        onSelectFacility={handleSelectFacility}
      />

      <section className="px-4 py-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">주변시설 {filteredFacilities.length}곳</h2>
        </div>

        <div className="flex flex-col gap-3">
          {filteredFacilities.map((facility) => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              selected={facility.id === selectedFacilityId}
              onClick={(selectedFacility) => navigate(`/facility/${selectedFacility.id}`)}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default MapPage;
