import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import OnboardingButton from '@/features/onboarding/ui/OnboardingButton';

interface IntroSlide {
  character: string;
  title: ReactNode;
  description: ReactNode;
  extra?: ReactNode;
  map?: boolean;
}

const highlight = 'text-[#F97316] font-bold';

// 도움말 슬라이드 전용 말풍선입니다. 다른 화면의 공통 UI 스타일과 분리해 사용합니다.
const HelpSlideChatBubble = ({ children }: { children: ReactNode }) => (
  <div className="flex items-start pl-4">
    <img
      src="/assets/Salpimi/Dog.png"
      alt=""
      className="size-[88px] shrink-0 scale-x-[-1] object-contain"
    />
    <div className="salpim-onboarding-description salpim-help-chat-bubble flex h-[70px] w-max shrink-0 items-center whitespace-nowrap rounded-[20px] rounded-bl-none border-[3px] border-[#FF843D]/70 bg-[#FFF8F3] px-[11px] text-left font-[Pretendard] leading-[1.1] !tracking-[-0.06em] text-[#613212]">
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
      <div className="absolute inset-x-0 top-[480px]">
        <HelpSlideChatBubble>
          안녕하세요 ㅇㅇ님!
          <br />
          어떤 도움이 필요하세요?
        </HelpSlideChatBubble>
        <div className="mt-[10px] flex justify-end pr-4">
          <img
            src="/assets/Icon/Choice/Hospital/Default-1.png"
            alt="의료 지원이 필요해요"
            className="h-12 w-[260px] object-fill"
          />
        </div>
        <div className="mt-6">
          <HelpSlideChatBubble>
            건강·병원비가
            <br />
            걱정되시나요?
          </HelpSlideChatBubble>
        </div>
        <div className="mt-[10px] flex justify-end pr-4">
          <div className="salpim-onboarding-description flex h-12 w-[260px] items-center justify-center rounded-full bg-[#FFD9BF] font-semibold text-white">
            병원비가 걱정돼요
          </div>
        </div>
      </div>
    ),
  },
  {
    character: '/assets/Salpimi/Search.png',
    map: true,
    title: (
      <>
        집 주변 노인 시설들을
        <br />한 눈에 확인해요!
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

const splitButtonStyle =
  'salpim-action-button salpim-onboarding-action h-20 w-[157px] py-0 !font-semibold leading-none';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const current = slides[step];
  const isLast = step === slides.length - 1;

  // 인트로 종료 → 회원가입(정보 입력) 흐름으로 이동
  const finish = () => navigate('/signup');
  const handleNext = () => (isLast ? finish() : setStep((prev) => prev + 1));
  const handleBack = () => {
    if (step === 0) {
      navigate('/font-size?next=signup');
      return;
    }

    setStep((previous) => previous - 1);
  };

  return (
    <div className="min-h-[100svh] w-full overflow-y-auto bg-brand-50">
      <div
        className={`relative mx-auto h-[100svh] w-full overflow-hidden bg-brand-50 ${
          current.map ? 'max-w-none' : 'min-h-[788px] max-w-[375px]'
        }`}
      >
        <button
          type="button"
          onClick={handleBack}
          className="absolute left-6 top-[26px] z-40 flex h-12 min-w-[88px] items-center justify-center rounded-full bg-[#FFB700] px-4 text-[28px] font-bold leading-none text-white transition-colors hover:bg-[#F5A900] active:scale-95"
        >
          이전
        </button>

        {/* 진행 표시 */}
        <div className="absolute inset-x-0 top-10 z-30 flex justify-center">
          <div className="flex items-center justify-center gap-5">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`size-5 rounded-full ${index === step ? 'bg-[#FFB700]' : 'bg-[#DDDDDD]'}`}
              />
            ))}
          </div>
        </div>

        {current.map ? (
          <>
            <div className="absolute inset-x-0 top-[76px] z-10 flex flex-col items-center px-6 text-center">
              <img src={current.character} alt="살피미" className="size-[200px] object-contain" />
              <h1 className="salpim-onboarding-title mt-2 font-bold leading-10 text-gray-900">
                {current.title}
              </h1>
              <p className="salpim-onboarding-description relative z-20 mt-3 font-semibold leading-8 text-[#FF8A3D]">
                {current.description}
              </p>
            </div>
            <div className="absolute inset-x-0 bottom-0 top-[clamp(420px,calc(57svh_+_10px),472px)] overflow-hidden">
              <img
                src="/assets/Salpimi Map.png"
                alt="주변 노인 시설 지도"
                className="absolute inset-0 h-full w-full object-fill"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-[linear-gradient(to_bottom,#FAF8F3_0%,rgba(250,248,243,0.82)_45%,transparent_100%)]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[clamp(72px,12svh,112px)] bg-[linear-gradient(to_bottom,transparent_0%,rgba(250,248,243,0.82)_55%,#FAF8F3_100%)]"
              />
            </div>
            <OnboardingButton
              className="salpim-action-button salpim-onboarding-action absolute inset-x-8 bottom-[max(40px,calc(20px+env(safe-area-inset-bottom)))] z-20 h-20 w-auto py-0 !font-semibold leading-none"
              onClick={finish}
            >
              시작하기
            </OnboardingButton>
          </>
        ) : (
          <>
            <div className="absolute inset-0">
              <div
                className={`flex flex-col items-center text-center ${step === 0 ? 'pt-[124px]' : 'pt-[76px]'}`}
              >
                <img
                  src={current.character}
                  alt="살피미"
                  className={`size-[200px] shrink-0 object-contain ${step === 1 ? 'scale-x-[-1]' : ''}`}
                />
                <h1
                  className={`${
                    step === 0
                      ? 'salpim-onboarding-title mt-10 whitespace-nowrap text-center font-medium leading-none tracking-[-0.06em] text-[#613212]'
                      : 'salpim-onboarding-title mt-2 font-bold leading-10 text-[#613212]'
                  }`}
                >
                  {current.title}
                </h1>
                <p
                  className={`salpim-onboarding-description ${step === 1 ? 'mt-3' : 'mt-7'} ${
                    step === 0
                      ? 'leading-[1.4] text-[#613212]'
                      : 'font-medium leading-[1.35] text-[#FF843D]'
                  }`}
                >
                  {current.description}
                </p>
                {current.extra}
              </div>
            </div>
            {step === 1 && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-[linear-gradient(to_bottom,transparent_0%,#FAF8F3_100%)]"
              />
            )}
            <div className="absolute bottom-[max(40px,calc(20px+env(safe-area-inset-bottom)))] left-[22px] z-20 flex gap-4">
              <OnboardingButton className={splitButtonStyle} onClick={finish}>
                건너뛰기
              </OnboardingButton>
              <OnboardingButton className={splitButtonStyle} onClick={handleNext}>
                다음
              </OnboardingButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
