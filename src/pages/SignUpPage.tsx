import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  authApi,
  getKakaoAuthorizeUrl,
  getSignupErrorMessage,
  getSignupTermsErrorMessage,
} from '@/apis/auth';
import type { SignupTerm } from '@/apis/auth';
import { getApiErrorCode } from '@/apis/errorMessage';
import {
  ensureAddressRegion,
  normalizeLocationCoordinates,
  normalizeRoadAddress,
  reverseGeocodeAddress,
  toRegionResolvePayload,
} from '@/apis/address';
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
import { validateBirthDate } from '@/utils/birthDate';
import useSettingsStore, { toServerWordSize } from '@/store/settingsStore';
import LargeTermsAgreement from '@/features/onboarding/large/LargeTermsAgreement';

const LOCAL_TOTAL_STEPS = 4; // 진행 표시 점 개수 (약관 동의/요약 화면 제외)
const KAKAO_TOTAL_STEPS = 2;
const KAKAO_SIGNUP_TOKEN_KEY = 'salpim-kakao-signup-token';

const SignUpPage = () => {
  const navigate = useNavigate();
  const setTokens = useUserStore((state) => state.setTokens);
  const setName = useUserStore((state) => state.setName);
  const setHomeLocation = useUserStore((state) => state.setHomeLocation);
  const fontSize = useSettingsStore((state) => state.fontSize);
  const isLarge = fontSize === 'large';
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
  const [terms, setTerms] = useState<TermsData>({});
  const [signupTerms, setSignupTerms] = useState<SignupTerm[]>([]);
  const [isTermsLoading, setIsTermsLoading] = useState(false);
  const [isTermsSubmitting, setIsTermsSubmitting] = useState(false);
  const [termsError, setTermsError] = useState('');
  const [phoneFlowError, setPhoneFlowError] = useState('');

  const isKakaoSignup = Boolean(kakaoSignupToken);
  const previous = () =>
    setStep((current) => {
      // 카카오 가입은 비밀번호와 복구 질문을 사용하지 않으므로 약관에서 주소 단계로 돌아간다.
      if (isKakaoSignup && current === 4) return 1;
      return Math.max(0, current - 1);
    });
  const next = () =>
    setStep((previous) => {
      // 카카오 계정은 카카오 인증이 비밀번호를 대신하므로
      // 비밀번호 설정(2)과 비밀번호 복구 질문(3) 단계를 거치지 않는다.
      if (isKakaoSignup && previous === 1) return 4;
      return previous + 1;
    });

  // 카카오 가입 화면을 벗어날 때(성공 소비 전 이탈) 남은 가입 토큰을 정리해 노출 시간을 최소화한다.
  // - 정상 완료: 리다이렉트 전에 이미 removeItem 되므로 여기서는 no-op.
  // - 실패(catch): 컴포넌트가 언마운트되지 않아 cleanup이 실행되지 않으므로 재시도용 토큰이 유지된다.
  // 토큰은 이미 마운트 시 state로 읽어두므로(StrictMode 이중 마운트 포함) 진행 중 흐름에는 영향이 없다.
  useEffect(() => {
    return () => {
      sessionStorage.removeItem(KAKAO_SIGNUP_TOKEN_KEY);
    };
  }, []);

  useEffect(() => {
    if (step !== 4) return;

    let isActive = true;
    setIsTermsLoading(true);

    void authApi
      .getSignupTerms()
      .then((loadedTerms) => {
        if (!isActive) return;
        setSignupTerms(loadedTerms);
        setTerms((previousTerms) =>
          Object.fromEntries(
            loadedTerms.map(({ termsVersionId }) => [
              termsVersionId,
              previousTerms[termsVersionId] ?? false,
            ])
          )
        );
      })
      .catch((error) => {
        if (!isActive) return;
        setTermsError(
          getSignupTermsErrorMessage(error, '약관 정보를 불러오지 못했어요. 다시 시도해 주세요.')
        );
      })
      .finally(() => {
        if (isActive) setIsTermsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [step]);

  const submitTerms = async () => {
    if (isTermsLoading || isTermsSubmitting || signupTerms.length === 0) return;

    setIsTermsSubmitting(true);
    setTermsError('');

    try {
      await authApi.submitSignupTerms(
        info.phone,
        signupTerms.map(({ termsVersionId }) => ({
          termsVersionId,
          agreed: Boolean(terms[termsVersionId]),
        }))
      );
      next();
    } catch (error) {
      if (getApiErrorCode(error) === 'AUTH400_VERIFICATION_EXPIRED') {
        setInfo((previousInfo) => ({ ...previousInfo, phoneVerified: false }));
        setPhoneFlowError(
          getSignupTermsErrorMessage(
            error,
            '인증번호가 만료되었습니다. 휴대폰 인증을 다시 진행해 주세요.'
          )
        );
        setStep(0);
        return;
      }

      setTermsError(
        getSignupTermsErrorMessage(error, '약관 동의를 제출하지 못했어요. 다시 시도해 주세요.')
      );
    } finally {
      setIsTermsSubmitting(false);
    }
  };

  const finish = async () => {
    if (isSubmitting) return;

    if (validateBirthDate(info.birthYear, info.birthMonth, info.birthDay) !== 'valid') {
      setStep(0);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const birthDate = `${info.birthYear}-${info.birthMonth.padStart(2, '0')}-${info.birthDay.padStart(2, '0')}`;
      const completeAddress = await ensureAddressRegion(address);
      const location = await authApi.geocodeAddress(address.roadAddress);
      const region = await authApi.resolveRegion(toRegionResolvePayload(completeAddress));
      const coordinates = normalizeLocationCoordinates(
        location.latitude,
        location.longitude
      );

      const signupProfile = {
        name: info.name.trim(),
        birthDate,
        gender: info.gender === 'male' ? ('MALE' as const) : ('FEMALE' as const),
        phoneNumber: info.phone,
        roadAddress: normalizeRoadAddress(address.roadAddress || location.roadAddress),
        detailAddress: address.detail.trim(),
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        regionId: region.regionId,
        wordSize: toServerWordSize(fontSize),
      };

      if (kakaoSignupToken) {
        await authApi.signupKakao(kakaoSignupToken, signupProfile);
        setName(signupProfile.name);
        sessionStorage.setItem(
          'salpim-pending-home-location',
          JSON.stringify({ latitude: signupProfile.latitude, longitude: signupProfile.longitude })
        );
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
      setTokens(tokens.accessToken, tokens.refreshToken, 'LOCAL');
      setName(signupProfile.name);
      setHomeLocation(signupProfile.latitude, signupProfile.longitude);
      navigate('/recommendation', { replace: true });
    } catch (error) {
      const errorCode = getApiErrorCode(error);
      if (
        errorCode === 'AUTH400_VERIFICATION_EXPIRED' ||
        errorCode === 'EXPIRED_VERIFICATION_CODE'
      ) {
        setSubmitError('');
        setInfo((previousInfo) => ({ ...previousInfo, phoneVerified: false }));
        setPhoneFlowError(
          getSignupErrorMessage(
            error,
            '인증번호가 만료되었습니다. 휴대폰 인증을 다시 진행해 주세요.'
          )
        );
        setStep(0);
        return;
      }

      if (
        errorCode === 'AUTH400_TERMS_AGREEMENT_NOT_SUBMITTED' ||
        errorCode === 'AUTH400_TERMS_AGREEMENT_EXPIRED' ||
        errorCode === 'AUTH400_TERMS_AGREEMENT_VERIFICATION'
      ) {
        setSubmitError('');
        setTermsError(getSignupErrorMessage(error, '약관 동의를 다시 확인해 주세요.'));
        setStep(4);
        return;
      }

      setSubmitError(
        getSignupErrorMessage(error, '회원가입을 완료하지 못했어요. 다시 시도해 주세요.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100svh] w-full bg-brand-50">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-[375px] flex-col bg-brand-50 px-6 pb-[max(3rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))]">
        {step < (isKakaoSignup ? KAKAO_TOTAL_STEPS : LOCAL_TOTAL_STEPS) && (
          <ProgressDots
            total={isKakaoSignup ? KAKAO_TOTAL_STEPS : LOCAL_TOTAL_STEPS}
            current={step}
          />
        )}

        {step === 0 && (
          <OnboardingForm
            value={info}
            onChange={(nextInfo) => {
              setInfo(nextInfo);
              if (nextInfo.phoneVerified) setPhoneFlowError('');
            }}
            onNext={next}
            onBack={() => navigate(-1)}
            externalErrorMessage={phoneFlowError}
          />
        )}
        {step === 1 && (
          <AddressSelector
            value={address}
            onChange={setAddress}
            onBack={() => setStep((prev) => prev - 1)}
            onNext={next}
            onUseCurrentLocation={reverseGeocodeAddress}
          />
        )}
        {!isKakaoSignup && step === 2 && (
          <PasswordStep value={password} onChange={setPassword} onBack={previous} onNext={next} />
        )}
        {!isKakaoSignup && step === 3 && (
          <SecurityQuestionStep
            value={security}
            onChange={setSecurity}
            onBack={previous}
            onNext={next}
          />
        )}
        {step === 4 &&
          (isLarge ? (
            <LargeTermsAgreement
              value={terms}
              terms={signupTerms}
              onChange={setTerms}
              onBack={previous}
              onSubmit={() => void submitTerms()}
              isLoading={isTermsLoading}
              isSubmitting={isTermsSubmitting}
              errorMessage={termsError}
            />
          ) : (
            <TermsAgreement
              value={terms}
              terms={signupTerms}
              onChange={setTerms}
              onBack={previous}
              onSubmit={() => void submitTerms()}
              isLoading={isTermsLoading}
              isSubmitting={isTermsSubmitting}
              errorMessage={termsError}
            />
          ))}
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
