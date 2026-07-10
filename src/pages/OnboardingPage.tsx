import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import Button from '@/components/common/Button/Button';

interface IntroSlide {
  character: string;
  title: ReactNode;
  description: ReactNode;
  extra?: ReactNode;
  map?: boolean;
}

const highlight = 'text-brand-500 font-bold';

const ChatBubble = ({ children }: { children: ReactNode }) => (
  <div className="flex items-end gap-2">
    <img src="/assets/Salpimi/Talk.png" alt="" className="h-9 w-9 shrink-0" />
    <div className="rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-left text-sm text-gray-700 shadow-sm">
      {children}
    </div>
  </div>
);

const slides: IntroSlide[] = [
  {
    character: '/assets/Salpimi/Dog.png',
    title: (
      <>
        <span className={highlight}>살핌</span>에 오신 걸 환영해요!
      </>
    ),
    description: (
      <>
        살핌은 어르신들을 위한
        <br />
        <span className={highlight}>복지 혜택 안내 서비스</span>예요!
        <br />
        <br />
        받을 수 있는 <span className={highlight}>혜택</span>을<br />
        쉽고 편하게 찾아드려요.
      </>
    ),
  },
  {
    character: '/assets/Salpimi/Love.png',
    title: (
      <>
        살피미가 항상
        <br />
        도와드려요!
      </>
    ),
    description: (
      <>
        상황에 맞는 답변을 선택하면
        <br />
        관련된 의료 혜택을 찾아드려요.
      </>
    ),
    extra: (
      <div className="mt-6 w-full space-y-3">
        <ChatBubble>안녕하세요 OO님! 어떤 도움이 필요하세요?</ChatBubble>
        <div className="flex justify-end">
          <img
            src="/assets/Icon/Choice/Hospital/Default.png"
            alt="의료 지원이 필요해요"
            className="h-9"
          />
        </div>
        <ChatBubble>건강·병원비가 걱정되시나요?</ChatBubble>
      </div>
    ),
  },
  {
    character: '/assets/Salpimi/Search.png',
    map: true,
    title: (
      <>
        집 주변 노인 시설들을
        <br />
        한 눈에 확인해요!
      </>
    ),
    description: (
      <>
        복지관, 주민센터, 보건소 등
        <br />
        가까운 시설을 지도에서 찾고
        <br />
        전화 연결까지 바로 할 수 있어요.
      </>
    ),
  },
];

const buttonStyle = 'py-4 text-lg font-bold';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const current = slides[step];
  const isLast = step === slides.length - 1;

  // 인트로 종료 → 회원가입(정보 입력) 흐름으로 이동
  const finish = () => navigate('/signup');
  const handleNext = () => (isLast ? finish() : setStep((prev) => prev + 1));

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col overflow-hidden bg-brand-50">
      {/* 진행 표시 */}
      <div className="flex shrink-0 items-center justify-center gap-2 px-6 pt-6">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === step ? 'w-6 bg-brand-500' : 'w-2 bg-brand-200'
            }`}
          />
        ))}
      </div>

      {current.map ? (
        // 지도 슬라이드: 상단 텍스트(고정) + 지도가 남은 공간을 채우고 버튼이 지도 위에 오버레이
        <>
          <div className="flex shrink-0 flex-col items-center px-6 pt-6 text-center">
            <img src={current.character} alt="살피미" className="w-32" />
            <h1 className="mt-5 text-2xl font-bold leading-9 text-gray-900">{current.title}</h1>
            <p className="mt-3 text-xl leading-8 text-gray-700">{current.description}</p>
          </div>
          <div className="relative mt-5 min-h-0 flex-1">
            <img
              src="/assets/Salpimi Map.png"
              alt="주변 노인 시설 지도"
              className="h-full w-full object-cover object-top"
            />
            <div className="absolute inset-x-6 bottom-6">
              <Button className={buttonStyle} onClick={finish}>
                시작하기
              </Button>
            </div>
          </div>
        </>
      ) : (
        // 일반 슬라이드: 내용은 남는 공간에서 세로 중앙 정렬(길면 스크롤) + 하단 고정 버튼
        <>
          <div className="min-h-0 flex-1 overflow-y-auto px-6">
            <div className="flex min-h-full flex-col items-center justify-center py-8 text-center">
              <img src={current.character} alt="살피미" className="w-36 shrink-0" />
              <h1 className="mt-6 text-2xl font-bold leading-9 text-gray-900">{current.title}</h1>
              <p className="mt-4 text-xl leading-8 text-gray-700">{current.description}</p>
              {current.extra}
            </div>
          </div>
          <div className="flex shrink-0 gap-3 px-6 pb-8 pt-4">
            <Button className={buttonStyle} onClick={finish}>
              건너뛰기
            </Button>
            <Button className={buttonStyle} onClick={handleNext}>
              다음
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default OnboardingPage;
