import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi, getLoginErrorMessage } from '@/apis/auth';
import OnboardingButton from '@/features/onboarding/ui/OnboardingButton';
import OnboardingInput from '@/features/onboarding/ui/OnboardingInput';
import useUserStore from '@/store/userStore';
import { formatPhone } from '@/utils/phone';

// 버튼 높이/간격을 뷰포트 높이에 맞춰 동적으로 (최소값 보장)
const buttonSize = 'py-[max(1rem,1.9vh)] !text-2xl !font-semibold';
const landingButtonBase = 'aspect-[310/80] py-0 !font-semibold';
const landingButtonSize = `${landingButtonBase} !text-[32px]`;
const kakaoButtonSize = `${landingButtonBase} !text-[clamp(28px,3.69vh,30px)]`;
const kakaoLogoSize = 'h-[clamp(36px,4.93vh,40px)] w-[clamp(36px,4.93vh,40px)]';

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const step: 'landing' | 'login' = searchParams.get('step') === 'login' ? 'login' : 'landing';
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const setTokens = useUserStore((state) => state.setTokens);
  const isPasswordValid = /^\d{6}$/.test(password);
  const isLoginFormFilled = phone.replace(/\D/g, '').length === 11 && isPasswordValid;

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
      <div className="mx-auto flex h-dvh max-w-md flex-col overflow-hidden bg-brand-50 px-6 pb-8 pt-[clamp(16px,2.54vh,20px)]">
        <div className="flex min-h-0 flex-1 flex-col justify-start overflow-y-auto">
          <img
            src="/assets/Salpimi/Notebook.png"
            alt="살피미"
            className="mx-auto size-[clamp(150px,49.07vw,184px)] scale-x-[-1] object-contain"
          />
          <h1 className="mt-[clamp(6px,1.02vh,8px)] text-center text-[clamp(22px,3.05vh,24px)] font-bold leading-[1.35] text-[#613212]">
            번호를 입력하면
            <br />
            시작할 수 있어요!
          </h1>

          <div className="mt-10 flex flex-col gap-5">
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
          <div className="mt-10 flex shrink-0 gap-3">
            <OnboardingButton
              className={`flex-1 !bg-brand-500 !text-white ${buttonSize}`}
              onClick={() => navigate('/', { replace: true })}
            >
              이전
            </OnboardingButton>
            <OnboardingButton
              className={`flex-1 !text-white ${buttonSize}`}
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
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col overflow-hidden bg-brand-50 px-6 pb-8 pt-8">
      {/* 부제 + 로고·캐릭터 통합 이미지 (한 그룹, 세로 중앙) */}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
        <p className="text-[clamp(22px,2.96vh,24px)] font-semibold leading-[1.5] text-[#613212]">
          노인 맞춤형
          <br />
          인터넷 환경 속 생활 지원 서비스
        </p>
        <img
          src="/assets/Logo/Landing.png"
          alt="살핌"
          className="mt-4 w-full max-w-[300px] object-contain"
        />
      </div>

      {/* 하단: 버튼 (뷰포트에 따라 동적) */}
      <div className="flex shrink-0 flex-col gap-[1.6vh]">
        <OnboardingButton
          className={landingButtonSize}
          onClick={() => navigate('/font-size?next=login')}
        >
          시작하기
        </OnboardingButton>
        <OnboardingButton
          className={`${kakaoButtonSize} gap-2`}
          onClick={() => navigate('/font-size?next=kakao')}
        >
          <img src="/icons/kakaotalk.png" alt="" className={kakaoLogoSize} />
          카카오로 시작하기
        </OnboardingButton>
        <OnboardingButton
          className={landingButtonSize}
          onClick={() => navigate('/font-size?next=signup')}
        >
          회원가입
        </OnboardingButton>
      </div>
    </div>
  );
};

export default LoginPage;
