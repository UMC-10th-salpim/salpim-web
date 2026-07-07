import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import Button from '@/components/common/Button/Button';

interface IntroSlide {
  title: ReactNode;
  description: ReactNode;
  extra?: ReactNode;
}

const highlight = 'text-brand-500';

const slides: IntroSlide[] = [
  {
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
      <div className="mt-6 w-full rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-700">안녕하세요 OO님! 어떤 도움이 필요하세요?</p>
        <span className="mt-3 inline-block rounded-full bg-brand-500 px-4 py-1.5 text-sm font-medium text-white">
          의료 지원이 필요해요
        </span>
      </div>
    ),
  },
  {
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
    extra: (
      <div className="mt-6 flex w-full flex-wrap gap-2 rounded-2xl bg-white p-4 shadow-sm">
        {['00병원', '00복지관', '우리집', '00약국'].map((place) => (
          <span
            key={place}
            className="rounded-full border border-brand-200 px-3 py-1 text-xs font-medium text-gray-700"
          >
            📍 {place}
          </span>
        ))}
      </div>
    ),
  },
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const current = slides[step];
  const isLast = step === slides.length - 1;

  // TODO: 온보딩 완료 후 이동 경로 확정 (회원가입/기본 정보 입력 흐름)
  const finish = () => navigate('/');
  const handleNext = () => (isLast ? finish() : setStep((prev) => prev + 1));

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-brand-50 px-6 pb-8 pt-6">
      {/* 진행 표시 */}
      <div className="flex items-center justify-center gap-2">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === step ? 'w-6 bg-brand-500' : 'w-2 bg-brand-200'
            }`}
          />
        ))}
      </div>

      <div className="mt-10 flex flex-1 flex-col items-center text-center">
        <img src="/characters/salpimi.png" alt="살피미" className="w-44" />
        <h1 className="mt-6 text-2xl font-bold leading-9 text-gray-900">{current.title}</h1>
        <p className="mt-4 text-base leading-7 text-gray-500">{current.description}</p>
        {current.extra}
      </div>

      {isLast ? (
        <Button className="py-4 text-base font-semibold" onClick={finish}>
          시작하기
        </Button>
      ) : (
        <div className="flex gap-3">
          <Button className="py-4 text-base font-semibold" onClick={finish}>
            건너뛰기
          </Button>
          <Button className="py-4 text-base font-semibold" onClick={handleNext}>
            다음
          </Button>
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;
