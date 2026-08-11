import { useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { benefitApi, updateFavorite } from '@/apis/benefit';
import { getDeadlineText } from '@/utils/benefitText';
import useUserStore from '@/store/userStore';
import useBenefitStore from '@/store/benefitStore';

const LikedBenefits = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const accessToken = useUserStore((state) => state.accessToken);
  const setLiked = useBenefitStore((state) => state.setLiked);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [removeError, setRemoveError] = useState('');

  const favoritesQuery = useInfiniteQuery({
    queryKey: ['favorite-benefits', 'list', accessToken],
    queryFn: ({ pageParam }) =>
      benefitApi.getFavoriteBenefits({ pageNumber: pageParam, pageSize: 10 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => (lastPage.hasNext ? pages.length : undefined),
    enabled: Boolean(accessToken),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const likedBenefits = favoritesQuery.data?.pages.flatMap((page) => page.data) ?? [];
  const totalCount = favoritesQuery.data?.pages[0]?.totalCount ?? likedBenefits.length;

  const handleRemoveFavorite = async (benefitId: number) => {
    if (removingId !== null) return;
    setRemovingId(benefitId);
    setRemoveError('');

    try {
      await updateFavorite(benefitId, false);
      setLiked(benefitId, false);
      await queryClient.invalidateQueries({ queryKey: ['favorite-benefits'] });
    } catch {
      setRemoveError('찜을 해제하지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setRemovingId(null);
    }
  };

  if (favoritesQuery.isLoading) {
    return (
      <main className="mypage-content items-center justify-center">
        <p className="text-[18px] font-extrabold text-[#613212]">찜한 혜택을 불러오는 중...</p>
      </main>
    );
  }

  if (favoritesQuery.isError) {
    return (
      <main className="mypage-content items-center justify-center gap-4 text-center">
        <p className="text-[18px] font-extrabold leading-7 text-[#613212]">
          찜한 혜택을 불러오지 못했어요.
        </p>
        <button
          type="button"
          onClick={() => void favoritesQuery.refetch()}
          className="min-h-12 rounded-full bg-[#FF843D] px-6 text-[18px] font-extrabold text-white"
        >
          다시 시도
        </button>
      </main>
    );
  }

  return (
    <main className="mypage-content gap-5">
      {removeError && (
        <p role="alert" className="rounded-2xl bg-[#FFF1E3] px-4 py-3 text-[16px] font-bold text-red-500">
          {removeError}
        </p>
      )}

      {likedBenefits.length === 0 ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="mypage-card flex items-center gap-3 px-4 py-3">
            <img
              src="/characters/salpimi_Dog.png"
              alt="아쉬워하는 살피미"
              className="w-[76px] shrink-0"
            />
            <p className="text-[18px] font-extrabold leading-6 text-[#613212]">
              아직 찜한 혜택이 없어요.
              <br />
              마음에 드는 혜택을 찜해두면
              <br />
              한곳에서 모아볼 수 있어요.
            </p>
          </div>

          <div className="mt-auto pt-8">
            <button type="button" onClick={() => navigate('/benefits')} className="mypage-primary-action">
              혜택 둘러보기
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mypage-card flex items-center gap-4 px-4 py-3.5">
            <img
              src="/characters/salpimi_Love.png"
              alt="하트를 들고 있는 살피미"
              className="h-[70px] w-[70px] shrink-0 object-contain"
            />
            <p className="text-[19px] font-extrabold leading-7 text-[#613212]">
              찜해 둔 혜택 {totalCount}개예요!
              <br />
              마감일을 놓치지 마세요.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {likedBenefits.map((benefit) => (
              <article
                key={benefit.benefitId}
                className="flex flex-col gap-3 rounded-[20px] border-2 border-[#F4C78F] bg-[#FFE9CA] p-4 shadow-[0_3px_10px_rgba(97,50,18,0.06)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/benefits/${benefit.benefitId}`)}
                    className="min-h-11 rounded-xl px-2 text-[15px] font-bold text-[#6F6258]"
                  >
                    자세히 보기 {'>'}
                  </button>
                  <button
                    type="button"
                    aria-label="찜 해제"
                    onClick={() => void handleRemoveFavorite(benefit.benefitId)}
                    disabled={removingId === benefit.benefitId}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white disabled:opacity-50"
                  >
                    <img src="/icons/heart_fill.png" alt="" className="h-7 w-7" />
                  </button>
                </div>

                <h2 className="text-[21px] font-extrabold leading-7 text-[#613212]">
                  {benefit.title}
                </h2>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-xl bg-[#FFB700] px-3 py-1.5 text-sm font-extrabold text-[#2B2B2B]">
                    {getDeadlineText(benefit.applicationEndDate)}
                  </span>
                  <span className="rounded-xl bg-[#FFB700] px-3 py-1.5 text-sm font-extrabold text-[#2B2B2B]">
                    {benefit.minAge !== null ? `만 ${benefit.minAge}세 이상` : '나이 조건 확인 필요'}
                  </span>
                </div>
              </article>
            ))}
          </div>

          {favoritesQuery.hasNextPage && (
            <button
              type="button"
              onClick={() => void favoritesQuery.fetchNextPage()}
              disabled={favoritesQuery.isFetchingNextPage}
              className="mypage-primary-action"
            >
              {favoritesQuery.isFetchingNextPage ? '더 불러오는 중...' : '찜한 혜택 더 보기'}
            </button>
          )}
        </>
      )}
    </main>
  );
};

export default LikedBenefits;
