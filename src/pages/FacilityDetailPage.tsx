import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import { getFacilityDetails } from '@/apis/facility';
import FacilityDetail from '@/features/map/FacilityDetail';
import type { Facility } from '@/features/map/types';
import useUserStore from '@/store/userStore';
import { getMemberIdFromAccessToken } from '@/utils/jwt';

const FacilityDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const facility = (location.state as { facility?: Facility } | null)?.facility;
  const accessToken = useUserStore((state) => state.accessToken);
  const memberId = getMemberIdFromAccessToken(accessToken);
  const {
    data: facilityDetails,
    error: facilityDetailsError,
    isLoading: facilityDetailsLoading,
  } = useQuery({
    queryKey: ['facility-details', memberId, facility?.id],
    queryFn: () =>
      getFacilityDetails({
        memberId: memberId ?? 0,
        facilityName: facility?.name ?? '',
        address: facility?.address ?? '',
        latitude: facility?.lat ?? 0,
        longitude: facility?.lng ?? 0,
      }),
    enabled: Boolean(facility && memberId),
    retry: false,
  });

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

  const resolvedFacility: Facility = facilityDetails
    ? {
        ...facility,
        name: facilityDetails.name,
        address: facilityDetails.address,
        operatingHours: facilityDetails.hour,
        distanceFromHome: facilityDetails.distanceText,
      }
    : facility;

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <HeaderBar title="시설 자세히 보기" />
      {facilityDetailsLoading && (
        <p role="status" className="bg-gray-50 px-4 pt-4 text-sm text-gray-500">
          시설 정보를 불러오고 있어요...
        </p>
      )}
      {facilityDetailsError && (
        <p role="alert" className="bg-gray-50 px-4 pt-4 text-sm text-red-500">
          시설 상세 정보를 불러오지 못해 지도 검색 정보를 표시합니다.
        </p>
      )}
      <FacilityDetail facility={resolvedFacility} benefits={facilityDetails?.benefits.data} />
      <BottomNavigation />
    </main>
  );
};

export default FacilityDetailPage;
