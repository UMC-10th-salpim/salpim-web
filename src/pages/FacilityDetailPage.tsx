import { useNavigate, useParams } from 'react-router-dom';
import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import FacilityDetail from '@/features/map/FacilityDetail';
import { mockFacilities } from '@/features/map/mockFacilities';

const FacilityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const facility = mockFacilities.find((currentFacility) => currentFacility.id === id);

  if (!facility) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4 text-center">
        <h1 className="text-xl font-bold text-gray-900">시설 정보를 찾을 수 없습니다</h1>
        <p className="text-sm text-gray-600">목록에서 다시 시설을 선택해주세요.</p>
        <button
          type="button"
          onClick={() => navigate('/map')}
          className="rounded-xl bg-[#FF8A3D] px-5 py-3 text-sm font-semibold text-white"
        >
          지도로 돌아가기
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <HeaderBar title="시설 자세히 보기" />
      <FacilityDetail facility={facility} />
      <BottomNavigation />
    </main>
  );
};

export default FacilityDetailPage;
