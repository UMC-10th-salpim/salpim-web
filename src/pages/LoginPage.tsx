import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi, getLoginErrorMessage } from '@/apis/auth';
import OnboardingButton from '@/features/onboarding/ui/OnboardingButton';
import OnboardingInput from '@/features/onboarding/ui/OnboardingInput';
import useUserStore from '@/store/userStore';
import { formatPhone } from '@/utils/phone';

const landingButtonStyle =
  'h-20 w-full rounded-xl py-0 !text-[32px] !font-semibold leading-none text-white';

const LANDING_CANVAS_WIDTH = 375;
const LANDING_CANVAS_HEIGHT = 788;

const getLandingScale = () => {
  if (typeof window === 'undefined') return 1;

  const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;

  return Math.min(viewportWidth / LANDING_CANVAS_WIDTH, viewportHeight / LANDING_CANVAS_HEIGHT);
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const step: 'landing' | 'login' = searchParams.get('step') === 'login' ? 'login' : 'landing';
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [landingScale, setLandingScale] = useState(getLandingScale);
  const setTokens = useUserStore((state) => state.setTokens);
  const isPasswordValid = /^\d{6}$/.test(password);
  const isLoginFormFilled = phone.replace(/\D/g, '').length === 11 && isPasswordValid;

  useEffect(() => {
    const updateLandingScale = () => setLandingScale(getLandingScale());
    const visualViewport = window.visualViewport;

    updateLandingScale();
    window.addEventListener('resize', updateLandingScale);
    visualViewport?.addEventListener('resize', updateLandingScale);

    return () => {
      window.removeEventListener('resize', updateLandingScale);
      visualViewport?.removeEventListener('resize', updateLandingScale);
    };
  }, []);

  const handleLogin = async () => {
    if (!isLoginFormFilled || isLoggingIn) return;
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const tokens = await authApi.loginLocal(phone, password);
      setTokens(tokens.accessToken, tokens.refreshToken);
      navigate('/recommendation', { replace: true });
    } catch (error) {
      setLoginError(getLoginErrorMessage(error, '로그인하지 못했어요. 다시 확인해 주세요.'));
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (step === 'login') {
    return (
      <div className="min-h-[100svh] w-full overflow-y-auto bg-brand-50">
        <main className="relative mx-auto min-h-[788px] w-full max-w-[375px] bg-brand-50 px-[18px] pt-6">
          <img
            src="/assets/Salpimi/Notebook.png"
            alt="살피미"
            className="mx-auto size-[184px] scale-x-[-1] object-contain"
          />
          <h1 className="mt-2 text-center text-[28px] font-bold leading-[1.35] text-[#613212]">
            번호를 입력하면
            <br />
            시작할 수 있어요!
          </h1>

          <div className="mt-[30px] flex flex-col gap-3 [&>div]:flex [&>div]:gap-2 [&_input]:h-[60px] [&_input]:!border-4 [&_input]:!text-[24px] [&_span]:!text-[24px]">
            <OnboardingInput
              label="전화번호"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(formatPhone(event.target.value))}
              placeholder="전화번호를 입력해 주세요"
            />
            <OnboardingInput
              label="비밀번호"
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="숫자 6자리를 입력해 주세요"
            />
          </div>
          <div className="mx-auto mt-[62px] w-[310px]">
            <OnboardingButton
              className="h-20 w-full py-0 !text-[32px] !font-semibold text-white"
              onClick={() => void handleLogin()}
              disabled={!isLoginFormFilled || isLoggingIn}
            >
              {isLoggingIn ? '로그인 중...' : '시작하기'}
            </OnboardingButton>
          </div>
          {loginError && (
            <p role="alert" className="mt-3 text-center text-sm font-semibold text-red-500">
              {loginError}
            </p>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-brand-50">
      <div
        className="relative shrink-0"
        style={{
          width: LANDING_CANVAS_WIDTH * landingScale,
          height: LANDING_CANVAS_HEIGHT * landingScale,
        }}
      >
        <main
          className="relative h-[788px] w-[375px] origin-top-left bg-brand-50 px-8"
          style={{ transform: `scale(${landingScale})` }}
        >
          <p className="absolute inset-x-0 top-[54px] text-center text-[24px] font-semibold leading-[1.375] text-[#613212]">
            노인 맞춤형
            <br />
            인터넷 환경 속 생활 지원 서비스
          </p>
          <img
            src="/assets/Logo/Landing.png"
            alt="살핌"
            className="absolute left-[37px] top-[146px] h-[362px] w-[300px] object-contain"
          />

          <div className="absolute left-8 top-[516px] flex w-[310px] flex-col gap-2">
            <OnboardingButton
              className={landingButtonStyle}
              onClick={() => navigate('/font-size?next=login')}
            >
              시작하기
            </OnboardingButton>
            <OnboardingButton
              className={`${landingButtonStyle} gap-2`}
              onClick={() => navigate('/font-size?next=kakao')}
            >
              <img src="/icons/kakaotalk.png" alt="" className="size-10" />
              카카오로 시작하기
            </OnboardingButton>
            <OnboardingButton
              className={landingButtonStyle}
              onClick={() => navigate('/font-size?next=signup')}
            >
              회원가입
            </OnboardingButton>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LoginPage;
