import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi, getApiErrorMessage } from '@/apis/auth';
import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import Keypad from '@/components/common/Keypad/Keypad';
import Modal from '@/components/common/Modal/Modal';
import OnboardingInput from '@/features/onboarding/ui/OnboardingInput';
import { primaryButton } from '@/features/onboarding/styles';
import { SECURITY_QUESTION } from '@/apis/mypage';
import { formatPhone } from '@/utils/phone';
import useUserStore from '@/store/userStore';
import { useQueryClient } from '@tanstack/react-query';

type ResetStep = 'verify' | 'new' | 'confirm';

const PublicPasswordResetPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useUserStore((state) => state.logout);
  const location = useLocation();
  const routeState = location.state as { phoneNumber?: string; returnTo?: string } | null;
  const [phoneNumber, setPhoneNumber] = useState(() =>
    formatPhone(routeState?.phoneNumber ?? '')
  );
  const [recoveryAnswer, setRecoveryAnswer] = useState('');
  const [passwordResetToken, setPasswordResetToken] = useState('');
  const [step, setStep] = useState<ResetStep>('verify');
  const [password, setPassword] = useState('');
  const [firstPassword, setFirstPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const phoneDigits = phoneNumber.replace(/\D/g, '');
  const canVerify = phoneDigits.length === 11 && Boolean(recoveryAnswer.trim());

  const handleVerify = async () => {
    if (!canVerify || submitting) return;
    setSubmitting(true);
    setError('');

    try {
      const result = await authApi.verifyPasswordReset(phoneNumber, recoveryAnswer);
      setPasswordResetToken(result.passwordResetToken);
      setPassword('');
      setStep('new');
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          '전화번호 또는 비밀번호 복구 답변을 다시 확인해 주세요.'
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (step === 'new') {
      setFirstPassword(password);
      setPassword('');
      setError('');
      setStep('confirm');
      return;
    }

    if (password !== firstPassword) {
      setPassword('');
      setError('비밀번호가 달라요. 다시 입력해 주세요.');
      return;
    }

    if (!passwordResetToken || submitting) return;
    setSubmitting(true);
    setError('');

    try {
      await authApi.resetPassword(passwordResetToken, password);
      logout();
      queryClient.clear();
      setSaved(true);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, '비밀번호를 변경하지 못했어요.'));
    } finally {
      setSubmitting(false);
    }
  };

  const goToLanding = () => navigate('/', { replace: true });

  const handleBack = () => {
    if (step === 'confirm') {
      setPassword('');
      setError('');
      setStep('new');
      return;
    }

    if (step === 'new') {
      setPassword('');
      setPasswordResetToken('');
      setError('');
      setStep('verify');
      return;
    }

    if (routeState?.returnTo) {
      navigate(routeState.returnTo, { replace: true });
      return;
    }

    navigate('/login?step=login', { replace: true, state: { phoneNumber } });
  };

  return (
    <div className="min-h-[100svh] w-full overflow-y-auto bg-brand-50">
      <div className="mx-auto flex min-h-[788px] w-full max-w-[375px] flex-col bg-brand-50">
        <HeaderBar
          title={step === 'verify' ? '비밀번호 바꾸기' : '새 비밀번호 설정'}
          onBack={handleBack}
        />

        {step === 'verify' ? (
          <main className="flex flex-1 flex-col gap-6 px-[18px] pb-8 pt-8">
            <div className="text-center">
              <img
                src="/assets/Salpimi/Search.png"
                alt="돋보기를 든 살피미"
                className="mx-auto w-[142px]"
              />
              <h2 className="mt-3 text-[24px] font-extrabold leading-8 text-[#613212]">
                회원가입 정보를 확인하면
                <br />새 비밀번호를 만들 수 있어요!
              </h2>
            </div>

            <div className="flex flex-col gap-5 [&_input]:h-[58px] [&_input]:!text-[20px]">
              <OnboardingInput
                label="전화번호"
                type="tel"
                inputMode="tel"
                value={phoneNumber}
                onChange={(event) => {
                  setPhoneNumber(formatPhone(event.target.value));
                  setError('');
                }}
                placeholder="가입한 전화번호를 입력해 주세요"
              />
              <OnboardingInput
                label={SECURITY_QUESTION}
                value={recoveryAnswer}
                onChange={(event) => {
                  setRecoveryAnswer(event.target.value);
                  setError('');
                }}
                placeholder="가입 시 답변을 입력해주세요"
              />
            </div>

            <div aria-live="polite" className="min-h-6 text-center">
              {error && <p className="text-[16px] font-bold text-red-500">{error}</p>}
            </div>

            <button
              type="button"
              onClick={() => void handleVerify()}
              disabled={!canVerify || submitting}
              className={`${primaryButton} mt-auto !flex-none !text-[24px]`}
            >
              {submitting ? '확인 중...' : '본인 확인하기'}
            </button>
          </main>
        ) : (
          <main className="flex flex-1 flex-col gap-5 px-[18px] pb-8 pt-8">
            <h2 className="text-center text-[24px] font-extrabold leading-8 text-[#613212]">
              {step === 'new' ? (
                <>
                  새로운 비밀번호 6자리를
                  <br />입력해 주세요.
                </>
              ) : (
                '한번 더 입력해 주세요.'
              )}
            </h2>

            <div aria-live="polite" className="min-h-6 text-center">
              {error && <p className="text-[16px] font-bold text-red-500">{error}</p>}
            </div>

            <Keypad
              value={password}
              onChange={(nextValue) => {
                setPassword(nextValue);
                setError('');
              }}
              onSubmit={() => void handlePasswordSubmit()}
              disabled={submitting}
              submitLabel={submitting ? '저장 중' : '다음'}
            />
          </main>
        )}
      </div>

      <Modal
        open={saved}
        title="비밀번호가 변경되었어요!"
        confirmText="로그인하기"
        cancelText="닫기"
        onConfirm={goToLanding}
        onClose={goToLanding}
      >
        새 비밀번호로 로그인해 주세요.
      </Modal>
    </div>
  );
};

export default PublicPasswordResetPage;
