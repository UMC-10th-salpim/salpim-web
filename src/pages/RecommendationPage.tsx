import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';

// TODO: 로그인 사용자 이름 연동 (스토어/회원 API)
const USER_NAME = 'OOO';
const DEADLINE_BENEFITS = [
  { id: 1, title: 'OOO 지원금 신청', daysLeft: 2, progress: 5 },
  { id: 2, title: 'OOO 생활비 지원', daysLeft: 5, progress: 3 },
  { id: 3, title: 'OOO 의료비 지원', daysLeft: 7, progress: 1 },
];

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
  title: string;
  daysLeft: number;
  progress: number;
  activeIndex: number;
  onDetail: () => void;
}

const DeadlineCard = ({ title, daysLeft, progress, activeIndex, onDetail }: DeadlineCardProps) => (
  <article className="w-full shrink-0 snap-start rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
    <div className="flex gap-2">
      <span className="rounded-full bg-brand-500 px-2.5 py-0.5 text-xs font-bold text-white">
        D-{daysLeft}
      </span>
      <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-bold text-brand-600">
        신청 가능
      </span>
    </div>

    <div className="mt-3 flex items-center gap-3">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-100">
        <CalendarIcon />
      </div>
      <div>
        <p className="text-[clamp(16px,2.28vh,18px)] font-bold leading-[1.5] text-gray-900">
          {title}
          <br />
          <span className="text-[#FF8A3D]">마감 {daysLeft}일 전</span>이에요!
        </p>
        <p className="mt-1 text-sm text-gray-500">지금 신청하면 놓치지 않아요.</p>
      </div>
    </div>

    <div className="mt-3 flex items-center justify-between border-b border-gray-200 pb-3">
      <div className="flex flex-1 gap-1 pr-3">
        {Array.from({ length: 7 }).map((_, index) => (
          <span
            key={index}
            className={`h-1.5 flex-1 rounded-full ${index < progress ? 'bg-brand-400' : 'bg-gray-200'}`}
          />
        ))}
      </div>
      <span className="shrink-0 text-xs font-medium text-gray-400">{daysLeft}일 남음</span>
    </div>

    <div className="mt-2 flex items-center justify-between">
      <div className="flex items-center gap-2" aria-hidden>
        {DEADLINE_BENEFITS.map((benefit, index) => (
          <span
            key={benefit.id}
            className={`h-2 rounded-full transition-all ${
              index === activeIndex ? 'w-6 bg-brand-500' : 'w-2 bg-brand-200'
            }`}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={onDetail}
        className="flex items-center gap-0.5 text-sm text-gray-500"
      >
        자세히 보기 <ChevronRight />
      </button>
    </div>
  </article>
);

const RecommendationPage = () => {
  const navigate = useNavigate();
  const [activeDeadlineIndex, setActiveDeadlineIndex] = useState(0);

  return (
    <div className="ml-[calc(50%_-_50dvw)] flex min-h-dvh w-dvw flex-col bg-brand-50 pb-24">
      {/* 헤더 */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-brand-50 px-5 py-4">
        <span className="text-2xl font-bold text-brand-600">살핌</span>
        <button
          type="button"
          onClick={() => navigate('/mypage/liked')}
          aria-label="찜한 혜택"
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-brand-100 active:scale-95"
        >
          <HeartIcon />
        </button>
      </header>

      <main className="flex flex-col gap-6 px-5">
        {/* 인사 카드 */}
        <div className="mx-auto flex h-[clamp(96px,13.45vh,106px)] w-[clamp(280px,82.67vw,310px)] items-center gap-3 rounded-2xl border-2 border-brand-200 bg-[#FFF7ED] px-4">
          <img
            src="/assets/Salpimi/Hi.png"
            alt="살피미"
            className="size-[clamp(96px,29.87vw,112px)] shrink-0 -translate-x-[clamp(8px,2.67vw,10px)] translate-y-[clamp(8px,1.27vh,10px)] object-contain"
          />
          <div className="min-w-0 flex-1 text-center">
            <p className="text-[clamp(22px,3.05vh,24px)] font-bold leading-[1.25] text-[#613212]">
              안녕하세요,
              <br />
              {USER_NAME} 님!
            </p>
            <p className="mt-1 text-[clamp(14px,1.9vh,15px)] text-[#FF8A3D]">
              오늘도 살피미가 함께 해요
            </p>
          </div>
        </div>

        {/* 마감 임박 카드 */}
        <section aria-label="마감 임박 지원금">
          <div
            onScroll={(event) => {
              const { scrollLeft, clientWidth } = event.currentTarget;
              const index = Math.round(scrollLeft / (clientWidth + 12));
              setActiveDeadlineIndex(Math.min(DEADLINE_BENEFITS.length - 1, Math.max(0, index)));
            }}
            className="flex w-full snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {DEADLINE_BENEFITS.map((benefit) => (
              <DeadlineCard
                key={benefit.id}
                title={benefit.title}
                daysLeft={benefit.daysLeft}
                progress={benefit.progress}
                activeIndex={activeDeadlineIndex}
                onDetail={() => navigate('/benefits')}
              />
            ))}
          </div>
        </section>

        {/* 살피미 추천 혜택 */}
        <section>
          <h2 className="mb-3 text-[clamp(22px,3.05vh,24px)] font-bold text-[#613212]">
            살피미 추천 혜택
          </h2>
          <div className="rounded-2xl border-2 border-brand-300 bg-brand-100/60 p-4">
            <div className="flex items-center gap-2">
              <img src="/assets/Salpimi/Wall.png" alt="살피미" className="w-24 shrink-0" />
              <p className="flex-1 text-center text-[clamp(18px,2.54vh,20px)] font-bold leading-[1.4] text-gray-900">
                필요한 혜택을
                <br />
                같이 찾아볼까요?
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/benefits/search')}
              className="mt-3 w-full rounded-full bg-brand-500 py-3.5 text-[clamp(18px,2.54vh,20px)] font-bold text-white transition-colors hover:bg-brand-600"
            >
              살피미에게 바로 물어보기
            </button>
          </div>
        </section>

        {/* 내 근처 혜택 시설 */}
        <section>
          <h2 className="mb-3 text-[clamp(22px,3.05vh,24px)] font-bold text-[#613212]">
            내 근처 혜택 시설
          </h2>
          <button
            type="button"
            onClick={() => navigate('/map')}
            className="flex w-full items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-sm"
          >
            <span className="text-left">
              <span className="block text-base font-bold text-gray-900">00 복지관</span>
              <span className="block text-sm text-gray-400">혜택 n개</span>
            </span>
            <ChevronRight />
          </button>
        </section>
      </main>

      <BottomNavigation className="[&>div]:max-w-none" />
    </div>
  );
};

export default RecommendationPage;
