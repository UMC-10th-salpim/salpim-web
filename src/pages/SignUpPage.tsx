import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, getApiErrorMessage, getKakaoAuthorizeUrl } from '@/apis/auth';
import useUserStore from '@/store/userStore';
import ProgressDots from '@/features/onboarding/ProgressDots';
import OnboardingForm from '@/features/onboarding/OnboardingForm';
import type { OnboardingInfo } from '@/features/onboarding/OnboardingForm';
import AddressSelector from '@/features/onboarding/AddressSelector';
import type { AddressInfo } from '@/features/onboarding/AddressSelector';
import PasswordStep from '@/features/onboarding/PasswordStep';
import type { PasswordData } from '@/features/onboarding/PasswordStep';
import SecurityQuestionStep from '@/features/onboarding/SecurityQuestionStep';
import type { SecurityData } from '@/features/onboarding/SecurityQuestionStep';
import TermsAgreement from '@/features/onboarding/TermsAgreement';
import type { TermsData } from '@/features/onboarding/TermsAgreement';
import SummaryStep from '@/features/onboarding/SummaryStep';

const LOCAL_TOTAL_STEPS = 4; // 진행 표시 점 개수 (약관 동의/요약 화면 제외)
const KAKAO_TOTAL_STEPS = 2;
const KAKAO_SIGNUP_TOKEN_KEY = 'salpim-kakao-signup-token';

const SignUpPage = () => {
  const navigate = useNavigate();
  const setTokens = useUserStore((state) => state.setTokens);
  const [step, setStep] = useState(0);
  const [kakaoSignupToken] = useState(() => sessionStorage.getItem(KAKAO_SIGNUP_TOKEN_KEY));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [info, setInfo] = useState<OnboardingInfo>({
    name: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    gender: '',
    phone: '',
    phoneVerified: false,
  });
  const [address, setAddress] = useState<AddressInfo>({
    roadAddress: '',
    detail: '',
    city: '',
    district: '',
    eupMyeonDong: '',
  });
  const [password, setPassword] = useState<PasswordData>({ password: '', confirm: '' });
  const [security, setSecurity] = useState<SecurityData>({ question: '', answer: '' });
  const [terms, setTerms] = useState<TermsData>({
    service: false,
    privacy: false,
    sensitive: false,
    location: false,
  });

  const isKakaoSignup = Boolean(kakaoSignupToken);
  const next = () => setStep((previous) => (isKakaoSignup && previous === 1 ? 4 : previous + 1));

  const finish = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const birthDate = `${info.birthYear}-${info.birthMonth.padStart(2, '0')}-${info.birthDay.padStart(2, '0')}`;
      const [coordinates, region] = await Promise.all([
        authApi.geocodeAddress(address.roadAddress),
        authApi.resolveRegion({
          city: address.city || null,
          district: address.district || null,
          eupMyeonDong: address.eupMyeonDong,
        }),
      ]);

      const signupProfile = {
        name: info.name.trim(),
        birthDate,
        gender: info.gender === 'male' ? ('MALE' as const) : ('FEMALE' as const),
        phoneNumber: info.phone,
        roadAddress: coordinates.roadAddress,
        detailAddress: address.detail.trim(),
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        regionId: region.regionId,
      };
      if (kakaoSignupToken) {
        await authApi.signupKakao(kakaoSignupToken, signupProfile);
        sessionStorage.removeItem(KAKAO_SIGNUP_TOKEN_KEY);
        window.location.href = getKakaoAuthorizeUrl();
        return;
      }

      await authApi.signupLocal({
        ...signupProfile,
        password: password.password,
        passwordAnswer: security.answer.trim(),
      });

      const tokens = await authApi.loginLocal(info.phone, password.password);
      setTokens(tokens.accessToken, tokens.refreshToken);
      navigate('/recommendation', { replace: true });
    } catch (error) {
      setSubmitError(
        getApiErrorMessage(error, '회원가입을 완료하지 못했어요. 다시 시도해 주세요.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-dvh w-full bg-brand-50">
      <div className="mx-auto flex h-dvh max-w-md flex-col overflow-hidden bg-brand-50 px-6 pb-8 pt-6">
        {step < (isKakaoSignup ? KAKAO_TOTAL_STEPS : LOCAL_TOTAL_STEPS) && (
          <ProgressDots
            total={isKakaoSignup ? KAKAO_TOTAL_STEPS : LOCAL_TOTAL_STEPS}
            current={step}
          />
        )}

        {step === 0 && (
          <OnboardingForm
            value={info}
            onChange={setInfo}
            onNext={next}
            onBack={() => navigate(-1)}
          />
        )}
        {step === 1 && (
          <AddressSelector
            value={address}
            onChange={setAddress}
            onBack={() => setStep((prev) => prev - 1)}
            onNext={next}
          />
        )}
        {step === 2 && <PasswordStep value={password} onChange={setPassword} onNext={next} />}
        {step === 3 && (
          <SecurityQuestionStep value={security} onChange={setSecurity} onNext={next} />
        )}
        {step === 4 && <TermsAgreement value={terms} onChange={setTerms} onSubmit={next} />}
        {step === 5 && (
          <SummaryStep
            info={info}
            address={address}
            onStart={() => void finish()}
            isSubmitting={isSubmitting}
            errorMessage={submitError}
          />
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
