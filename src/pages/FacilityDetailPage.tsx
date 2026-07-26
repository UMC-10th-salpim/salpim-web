import { useLocation, useNavigate } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { facilityApi, getMemberIdFromAccessToken } from '@/apis/facility';
import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import FacilityDetail from '@/features/map/FacilityDetail';
import type { Facility } from '@/features/map/types';
import useUserStore from '@/store/userStore';

const FacilityDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const facility = (location.state as { facility?: Facility } | null)?.facility;
  const accessToken = useUserStore((state) => state.accessToken);
  const memberId = getMemberIdFromAccessToken(accessToken);

  const detailsQuery = useInfiniteQuery({
    queryKey: ['facility-details', memberId, facility?.id],
    queryFn: ({ pageParam }) => {
      if (!facility || !memberId) throw new Error('시설 상세 조회에 필요한 정보가 없습니다.');

      return facilityApi.getDetails({
        memberId,
        facilityName: facility.name,
        address: facility.address,
        latitude: facility.lat,
        longitude: facility.lng,
        cursor: pageParam,
        size: 10,
      });
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.benefits.hasNext ? (lastPage.benefits.nextCursor ?? undefined) : undefined,
    enabled: Boolean(facility && memberId),
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

  const firstPage = detailsQuery.data?.pages[0];
  const benefits = detailsQuery.data?.pages.flatMap((page) => page.benefits.data) ?? [];
  const loadError =
    memberId === null
      ? '로그인 정보를 확인할 수 없어 시설 상세 정보를 불러오지 못했어요.'
      : detailsQuery.isError
        ? '시설 상세 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'
        : null;

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <HeaderBar title="시설 자세히 보기" />
      <FacilityDetail
        facility={facility}
        details={firstPage}
        benefits={benefits}
        isLoading={detailsQuery.isLoading}
        errorMessage={loadError}
        onRetry={() => {
          void detailsQuery.refetch();
        }}
        hasNextPage={detailsQuery.hasNextPage}
        isFetchingNextPage={detailsQuery.isFetchingNextPage}
        onLoadMore={() => {
          void detailsQuery.fetchNextPage();
        }}
      />
      <BottomNavigation />
    </main>
  );
};

export default FacilityDetailPage;
