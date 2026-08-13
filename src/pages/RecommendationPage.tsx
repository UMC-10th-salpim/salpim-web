import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import ScrollMoreIndicator from '@/components/common/ScrollMoreIndicator/ScrollMoreIndicator';
import useSettingsStore from '@/store/settingsStore';
import useUserStore from '@/store/userStore';
import { mypageApi } from '@/apis/mypage';
import { benefitApi } from '@/apis/benefit';
import type { DeadlineSoonBenefit } from '@/apis/benefit';

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-brand-500">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-brand-500">
    <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
    <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="14" r="2.4" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 12.4V14l1 .8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const ChevronRight = ({ className = 'h-5 w-5 text-gray-400' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M9 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface DeadlineCardProps {
  benefit?: DeadlineSoonBenefit;
  activeIndex: number;
  totalCards: number;
  onDetail: () => void;
  expanded?: boolean;
  showPagination?: boolean;
}

const DeadlineCard = ({
  benefit,
  activeIndex,
  totalCards,
  onDetail,
  expanded = false,
  showPagination = true,
}: DeadlineCardProps) => (
  <article
    className={`${expanded ? 'h-fit' : 'min-h-[222px] snap-start'} w-full shrink-0 rounded-lg border border-gray-100 bg-white p-4 shadow-sm`}
  >
    <div className="flex gap-2">
      <span className="flex h-8 min-w-[58px] items-center justify-center rounded-full bg-brand-500 px-2.5 text-base font-bold text-white">
        {benefit ? '찜한 혜택' : '복지 혜택'}
      </span>
      <span className="flex h-8 min-w-[86px] items-center justify-center rounded-full bg-brand-100 px-2.5 text-base font-bold text-brand-600">
        신청 가능
      </span>
    </div>

    <div className="mt-2 flex min-h-[82px] items-start gap-2">
      <div className="flex size-[60px] shrink-0 items-center justify-center rounded-full bg-[#FFF5E8]">
        <CalendarIcon />
      </div>
      <div>
        {benefit ? (
          <p
            className={`${expanded ? 'text-[21px]' : 'salpim-home-card-title'} font-bold leading-[1.3] text-gray-900`}
          >
            <span className="line-clamp-2 break-keep">{benefit.title}</span>
            <span className="block text-[#FF8A3D]">
              {benefit.dDay === 0
                ? '오늘 마감이에요!'
                : benefit.dDay !== null
                  ? `마감 ${benefit.dDay}일 전이에요!`
                  : benefit.applicationEndDate
                    ? `${benefit.applicationEndDate.replace(/-/g, '.')} 마감이에요!`
                    : '마감일을 확인해 보세요!'}
            </span>
          </p>
        ) : (
          <p
            className={`${expanded ? 'text-[21px]' : 'salpim-home-card-title'} font-bold leading-[1.3] text-gray-900`}
          >
            놓치기 전에 <span className="text-[#FF8A3D]">혜택</span>을
            <br />
            확인해 보세요!
          </p>
        )}
        <p className="salpim-deadline-card-description mt-1 whitespace-nowrap text-[#8A5A34]">
          지금 신청하면 놓치지 않아요.
        </p>
      </div>
    </div>

    <div className="border-b border-gray-200 pb-3" />

    <div className={`mt-2 flex items-center ${showPagination ? 'justify-between' : 'justify-end'}`}>
      {showPagination && (
        <div className="flex items-center gap-2" aria-hidden>
          {Array.from({ length: totalCards }).map((_, index) => (
            <span
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === activeIndex ? 'w-6 bg-brand-500' : 'w-2 bg-brand-200'
              }`}
            />
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={onDetail}
        className="flex h-[33px] min-w-[115px] items-center justify-center gap-0.5 rounded-full bg-gray-200/80 px-3 text-base !font-semibold text-gray-500"
      >
        {benefit ? '자세히 보기' : '찜한 혜택 보기'} <ChevronRight />
      </button>
    </div>
  </article>
);

const RecommendationPage = () => {
  const navigate = useNavigate();
  const accessToken = useUserStore((state) => state.accessToken);
  const userName = useUserStore((state) => state.name);
  const setName = useUserStore((state) => state.setName);
  const isLargeFont = useSettingsStore((state) => state.fontSize === 'large');
  const favoriteAlertEnabled = useSettingsStore((state) => state.deadlineAlertEnabled);
  const [activeDeadlineIndex, setActiveDeadlineIndex] = useState(0);
  const deadlineScrollRef = useRef<HTMLDivElement>(null);
  const { data: favoriteDeadlineBenefits = [] } = useQuery({
    queryKey: ['favorite-benefits', 'deadline-soon', accessToken],
    queryFn: benefitApi.getFavoriteDeadlineSoon,
    enabled: Boolean(accessToken && favoriteAlertEnabled),
    retry: false,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  });
  const {
    data: welfareCenterInfo,
    isLoading: isWelfareCenterLoading,
    isError: isWelfareCenterError,
  } = useQuery({
    queryKey: ['mypage', 'welfare-center', accessToken],
    queryFn: mypageApi.getWelfareCenter,
    enabled: Boolean(accessToken),
    retry: false,
    refetchOnWindowFocus: false,
  });
  const welfareCenterName = welfareCenterInfo?.welfareCenter?.trim() ?? '';
  const welfareCenterDisplayName = welfareCenterName
    ? /행정복지센터$/.test(welfareCenterName)
      ? welfareCenterName
      : `${welfareCenterName} 행정복지센터`
    : '';
  const deadlineCards = [
    { id: 'guide', benefit: undefined },
    ...(favoriteAlertEnabled ? favoriteDeadlineBenefits : []).slice(0, 2).map((benefit) => ({
      id: `favorite-${benefit.benefitId}`,
      benefit,
    })),
  ];

  const scrollToDeadlineCard = (targetIndex: number) => {
    const nextIndex = Math.min(deadlineCards.length - 1, Math.max(0, targetIndex));
    const container = deadlineScrollRef.current;
    if (!container) return;

    container.scrollTo({
      left: nextIndex * (container.clientWidth + 12),
      behavior: 'smooth',
    });
    setActiveDeadlineIndex(nextIndex);
  };

  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;
    mypageApi
      .getSummary()
      .then((profile) => {
        const profileName = typeof profile.name === 'string' ? profile.name.trim() : '';
        if (!cancelled && profileName) setName(profileName);
      })
      .catch((error: unknown) => {
        if (import.meta.env.DEV) console.error('[recommendation] profile load failed', error);
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, setName]);

  return (
    <div className="flex min-h-[100svh] w-full flex-col bg-brand-50 pb-[calc(6rem+env(safe-area-inset-bottom))]">
      {/* 헤더 */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-[65px] w-full items-center justify-between border-b border-[#E8E0D8] bg-[#FAF8F3] px-6 shadow-[0_2px_5px_rgba(97,50,18,0.05)]">
        <span className="salpim-page-description font-bold text-[#613212]">살핌</span>
        <button
          type="button"
          onClick={() => navigate('/mypage/liked')}
          aria-label="찜한 혜택"
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-brand-100 active:scale-95"
        >
          <HeartIcon />
        </button>
      </header>

      <main className="flex w-full flex-col gap-[23px] px-4 pt-[85px]">
        {/* 인사 카드 */}
        <div className="relative h-[146px] w-full rounded-[31px] border-[3px] border-[#E8B16A] bg-[#FFF7ED]">
          <img
            src="/assets/Salpimi/Hi.png"
            alt="살피미"
            className="absolute -left-0.5 top-2 size-[155px] object-contain"
          />
          <div className="ml-[122px] flex h-full w-[calc(100%_-_132px)] flex-col items-center justify-center text-center">
            <p className="salpim-home-heading font-bold leading-[1.25] text-[#613212]">
              안녕하세요,
              <br />
              {userName || '회원'} 님!
            </p>
            <p className="salpim-home-card-body mt-1 text-[#FF8A3D]">오늘도 살피미가 함께 해요</p>
          </div>
        </div>

        {/* 찜한 혜택 알림 카드 */}
        {favoriteAlertEnabled && (
          <section aria-label="찜한 혜택 알림" className="relative w-full">
            <div
              ref={deadlineScrollRef}
              onScroll={(event) => {
                const { scrollLeft, clientWidth } = event.currentTarget;
                const index = Math.round(scrollLeft / (clientWidth + 12));
                setActiveDeadlineIndex(Math.min(deadlineCards.length - 1, Math.max(0, index)));
              }}
              className="flex w-full snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {deadlineCards.map((card) => (
                <DeadlineCard
                  key={card.id}
                  benefit={card.benefit}
                  activeIndex={activeDeadlineIndex}
                  totalCards={deadlineCards.length}
                  expanded={isLargeFont}
                  onDetail={() =>
                    navigate(
                      card.benefit ? `/benefits/${card.benefit.benefitId}` : '/mypage/liked'
                    )
                  }
                />
              ))}
            </div>

            {activeDeadlineIndex > 0 && (
              <button
                type="button"
                onClick={() => scrollToDeadlineCard(activeDeadlineIndex - 1)}
                aria-label="이전 혜택 보기"
                className="absolute -left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#EEE5DC] bg-white text-[#FF843D] shadow-[0_3px_10px_rgba(97,50,18,0.16)]"
              >
                <ChevronRight className="h-7 w-7 rotate-180 text-[#FF843D]" />
              </button>
            )}

            {activeDeadlineIndex < deadlineCards.length - 1 && (
              <button
                type="button"
                onClick={() => scrollToDeadlineCard(activeDeadlineIndex + 1)}
                aria-label="다음 혜택 보기"
                className="absolute -right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#EEE5DC] bg-white text-[#FF843D] shadow-[0_3px_10px_rgba(97,50,18,0.16)]"
              >
                <ChevronRight className="h-7 w-7 text-[#FF843D]" />
              </button>
            )}
          </section>
        )}

        {/* 살피미 추천 혜택 */}
        <section className="w-full">
          <h2 className="salpim-home-heading mb-3 font-bold text-[#613212]">살피미 추천 혜택</h2>
          <div className="relative h-[197px] rounded-[23px] border-[3px] border-brand-300 bg-brand-100/60">
            <div className="flex h-28 items-center px-3">
              <img src="/assets/Salpimi/Wall.png" alt="살피미" className="size-28 shrink-0" />
              <p className="salpim-home-card-title flex-1 text-center font-bold leading-[1.4] text-gray-900">
                필요한 혜택을
                <br />
                같이 찾아볼까요?
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/survey')}
              className="salpim-home-card-title absolute inset-x-3 bottom-2.5 h-16 rounded-full bg-[#FF843D] py-0 !font-semibold text-white transition-colors hover:bg-[#FF843D]"
            >
              살피미에게 바로 물어보기
            </button>
          </div>
        </section>

        {/* 내 근처 혜택 시설 */}
        <section className="w-full">
          <h2 className="salpim-home-heading mb-3 font-bold text-[#613212]">내 근처 혜택 시설</h2>
          <button
            type="button"
            onClick={() =>
              navigate('/map', {
                state: welfareCenterName ? { focusFacilityName: welfareCenterName } : undefined,
              })
            }
            className="flex h-[106px] w-full items-center justify-between rounded-[32px] bg-[#FCE7D6] px-5 py-4 !font-semibold shadow-sm"
          >
            <span className="min-w-0 text-left">
              <span className="salpim-home-card-title block font-semibold text-gray-900">
                {isWelfareCenterLoading
                  ? '내 근처 행정복지센터를 찾고 있어요'
                  : welfareCenterDisplayName || '지도에서 가까운 시설 찾기'}
              </span>
              <span className="salpim-home-card-body mt-1 block font-medium text-gray-500">
                {welfareCenterName
                  ? '회원님의 지역 담당 행정복지센터예요. 지도에서 위치를 확인해 보세요.'
                  : isWelfareCenterError
                    ? '행정복지센터 정보를 불러오지 못했어요. 지도에서 주변 시설을 확인해 보세요.'
                    : '현재 위치 주변의 행정복지센터, 주민센터, 병원을 확인해 보세요.'}
              </span>
            </span>
            <ChevronRight className="ml-3 h-5 w-5 shrink-0 text-gray-400" />
          </button>
        </section>
      </main>

      <ScrollMoreIndicator className="!bottom-[calc(72px+max(12px,env(safe-area-inset-bottom)))] !h-10 !w-10 [&_svg]:!h-6 [&_svg]:!w-6" />
      <BottomNavigation className="[&>div]:max-w-none" />
    </div>
  );
};

export default RecommendationPage;
