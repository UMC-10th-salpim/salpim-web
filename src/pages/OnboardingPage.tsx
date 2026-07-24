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

const highlight = 'text-[#F97316] font-bold';

const ChatBubble = ({
  children,
  greeting = false,
}: {
  children: ReactNode;
  greeting?: boolean;
}) => (
  <div className="-ml-[clamp(10px,3.6vw,13.5px)] flex items-start gap-[clamp(6px,1.87vw,7px)]">
    <img
      src="/assets/Salpimi/Dog.png"
      alt=""
      className="h-[clamp(72px,10.84vh,88px)] w-[clamp(72px,10.84vh,88px)] shrink-0 scale-x-[-1] object-contain"
    />
    <div
      className={`${
        greeting ? 'h-[clamp(58px,8.62vh,70px)] w-[clamp(194px,62.4vw,234px)] shrink-0' : 'flex-1'
      } rounded-[20px] rounded-bl-none border border-[#FF843D] bg-[#FFF8F3] px-3 py-2 text-left font-[Pretendard] text-[clamp(20px,6.4vw,24px)] leading-[1.1] tracking-[-0.06em] text-[#613212]`}
    >
      {greeting ? <div className="w-[112%] origin-left scale-x-90">{children}</div> : children}
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
    title: <>살피미가 항상 도와드려요!</>,
    description: (
      <>
        상황에 맞는 답변을 선택하면
        <br />
        관련된 의료 혜택을 찾아드려요.
      </>
    ),
    extra: (
      <div className="mt-[clamp(30px,4.68vh,38px)] w-[calc(100%+16px)] self-start">
        <ChatBubble greeting>
          안녕하세요 ㅇㅇ님!
          <br />
          어떤 도움이 필요하세요?
        </ChatBubble>
        <div className="mt-[clamp(8px,1.23vh,10px)] flex justify-end">
          <img
            src="/assets/Icon/Choice/Hospital/Default-1.png"
            alt="의료 지원이 필요해요"
            className="h-auto w-[clamp(220px,69.33vw,260px)]"
          />
        </div>
        <div className="mt-[clamp(18px,2.96vh,24px)]">
          <ChatBubble>
            건강·병원비가
            <br />
            걱정되시나요?
          </ChatBubble>
        </div>
        <div className="mt-4 flex justify-end">
          <div className="flex h-[clamp(42px,5.91vh,48px)] w-[clamp(220px,69.33vw,260px)] items-center justify-center rounded-full bg-[#FFD9BF] text-[clamp(20px,6.4vw,24px)] font-semibold text-white">
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

const buttonStyle = 'py-4 text-2xl font-bold';
const introButtonStyle = 'h-[clamp(68px,9.85vh,80px)] max-w-[157px] flex-1 py-0 text-2xl font-bold';
const helpButtonStyle =
  'h-[clamp(68px,9.85vh,80px)] max-w-[157px] flex-1 py-0 text-[clamp(28px,3.69vh,30px)] font-bold';
const introButtonGap = 'gap-[clamp(12px,1.97vh,16px)]';
const welcomeCharacterSize =
  'h-[clamp(160px,24.63vh,200px)] w-[clamp(160px,24.63vh,200px)] object-contain';
const welcomeContentSpacing =
  'justify-start pb-[clamp(76px,11.7vh,95px)] pt-[clamp(52px,7.88vh,64px)]';
const progressWrapperSize = 'h-[clamp(16px,2.46vh,20px)] w-[clamp(80px,26.67vw,100px)]';
const progressGap = 'gap-[clamp(10px,3.2vw,12px)]';
const activeProgressDot = 'h-[clamp(13px,1.97vh,16px)] w-[clamp(35px,11.73vw,44px)]';
const inactiveProgressDot = 'h-[clamp(13px,1.97vh,16px)] w-[clamp(13px,4.27vw,16px)]';
const helpProgressDot = 'h-[clamp(16px,2.46vh,20px)] w-[clamp(16px,2.46vh,20px)]';
const helpCharacterSize =
  'h-[clamp(170px,24.63vh,200px)] w-[clamp(170px,24.63vh,200px)] object-contain';
const helpContentSpacing = 'justify-start pb-48 pt-[clamp(38px,5.91vh,48px)]';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const current = slides[step];
  const isLast = step === slides.length - 1;

  // 인트로 종료 → 회원가입(정보 입력) 흐름으로 이동
  const finish = () => navigate('/signup');
  const handleNext = () => (isLast ? finish() : setStep((prev) => prev + 1));

  return (
    <div className="h-dvh w-full bg-brand-50">
      <div className="relative mx-auto flex h-dvh max-w-md flex-col overflow-hidden bg-brand-50">
        {/* 진행 표시 */}
        <div
          className={`flex shrink-0 justify-center px-6 ${
            step === 1 ? 'pt-[clamp(32px,4.93vh,40px)]' : 'pt-6'
          }`}
        >
          <div
            className={`flex items-center justify-center ${
              step === 1 ? 'gap-[clamp(16px,5.33vw,20px)]' : `${progressWrapperSize} ${progressGap}`
            }`}
          >
            {slides.map((_, index) => (
              <span
                key={index}
                className={`rounded-full transition-all ${
                  step === 1
                    ? `${helpProgressDot} ${index === step ? 'bg-[#FFB800]' : 'bg-[#DEDEDE]'}`
                    : index === step
                      ? `${activeProgressDot} bg-brand-500`
                      : `${inactiveProgressDot} bg-brand-200`
                }`}
              />
            ))}
          </div>
        </div>

        {current.map ? (
          // 지도 슬라이드: 상단 텍스트(고정) + 지도가 남은 공간을 채우고 버튼이 지도 위에 오버레이
          <>
            <div className="relative z-10 flex shrink-0 flex-col items-center px-6 pt-6 text-center">
              <img
                src={current.character}
                alt="살피미"
                className="h-[clamp(160px,25.38vh,200px)] w-[clamp(160px,25.38vh,200px)] object-contain"
              />
              <h1 className="mt-5 text-3xl font-bold leading-10 text-gray-900">{current.title}</h1>
              <p className="relative z-20 mt-3 text-[clamp(22px,3.05vh,24px)] font-semibold leading-8 text-[#FF8A3D]">
                {current.description}
              </p>
            </div>
            <div className="relative mt-auto aspect-[375/350] w-full shrink-0">
              <img
                src="/assets/Salpimi Map.png"
                alt="주변 노인 시설 지도"
                className="absolute bottom-0 left-1/2 h-auto w-full -translate-x-1/2 -translate-y-[clamp(8px,1.27vh,10px)] object-contain"
              />
            </div>
            <div className="absolute inset-x-6 bottom-[clamp(20px,3.05vh,24px)] z-10">
              <Button className={buttonStyle} onClick={finish}>
                시작하기
              </Button>
            </div>
          </>
        ) : (
          // 일반 슬라이드: 내용은 남는 공간에서 세로 중앙 정렬(길면 스크롤) + 하단 고정 버튼
          <>
            <div
              className={`min-h-0 flex-1 ${
                step === 1 ? 'overflow-hidden px-8' : 'overflow-y-auto px-6'
              }`}
            >
              <div
                className={`flex min-h-full flex-col items-center text-center ${
                  step === 0
                    ? welcomeContentSpacing
                    : step === 1
                      ? helpContentSpacing
                      : 'justify-center py-8'
                }`}
              >
                <img
                  src={current.character}
                  alt="살피미"
                  className={`${
                    step === 0 ? welcomeCharacterSize : step === 1 ? helpCharacterSize : 'w-36'
                  } ${step === 1 ? 'scale-x-[-1]' : ''} shrink-0`}
                />
                <h1
                  className={`${
                    step === 0
                      ? 'mt-[clamp(32px,4.93vh,40px)] text-[clamp(22px,2.96vh,24px)] font-normal leading-[1.5] text-[#613212]'
                      : step === 1
                        ? 'mt-[clamp(12px,1.97vh,16px)] whitespace-nowrap text-[clamp(26px,3.69vh,30px)] font-bold leading-[1.3] text-[#613212]'
                        : 'mt-6 text-3xl font-bold leading-10 text-gray-900'
                  }`}
                >
                  {current.title}
                </h1>
                <p
                  className={`${step === 1 ? 'mt-1' : 'mt-4'} ${
                    step === 0
                      ? 'text-[clamp(22px,2.96vh,24px)] leading-[1.5] text-[#613212]'
                      : step === 1
                        ? 'text-[clamp(21px,2.96vh,24px)] font-medium leading-[1.35] text-[#FF843D]'
                        : 'text-xl leading-8 text-gray-700'
                  }`}
                >
                  {current.description}
                </p>
                {current.extra}
              </div>
            </div>
            <div
              className={`flex shrink-0 justify-center ${introButtonGap} px-6 ${
                step === 1
                  ? 'absolute inset-x-0 bottom-[clamp(35px,5.79vh,47px)] z-10'
                  : 'pb-8 pt-4'
              }`}
            >
              <Button className={step === 1 ? helpButtonStyle : introButtonStyle} onClick={finish}>
                건너뛰기
              </Button>
              <Button
                className={step === 1 ? helpButtonStyle : introButtonStyle}
                onClick={handleNext}
              >
                다음
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
