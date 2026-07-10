import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const TOTAL_STEPS = 4; // 진행 표시 점 개수 (약관 동의/요약 화면 제외)

const SignUpPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const [info, setInfo] = useState<OnboardingInfo>({
    name: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    gender: '',
    phone: '',
  });
  const [address, setAddress] = useState<AddressInfo>({ roadAddress: '', detail: '' });
  const [password, setPassword] = useState<PasswordData>({ password: '', confirm: '' });
  const [security, setSecurity] = useState<SecurityData>({ question: '', answer: '' });
  const [terms, setTerms] = useState<TermsData>({
    service: false,
    privacy: false,
    sensitive: false,
    location: false,
  });

  const next = () => setStep((prev) => prev + 1);

  const finish = () => {
    // TODO: 회원가입 API 연동 후 이동 경로 확정
    navigate('/recommendation');
  };

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col overflow-hidden bg-brand-50 px-6 pb-8 pt-6">
      {step < TOTAL_STEPS && <ProgressDots total={TOTAL_STEPS} current={step} />}

      {step === 0 && (
        <OnboardingForm
          value={info}
          onChange={setInfo}
          onNext={next}
          onBack={() => navigate(-1)}
        />
      )}
      {step === 1 && <AddressSelector value={address} onChange={setAddress} onNext={next} />}
      {step === 2 && <PasswordStep value={password} onChange={setPassword} onNext={next} />}
      {step === 3 && (
        <SecurityQuestionStep value={security} onChange={setSecurity} onNext={next} />
      )}
      {step === 4 && <TermsAgreement value={terms} onChange={setTerms} onSubmit={next} />}
      {step === 5 && <SummaryStep info={info} address={address} onStart={finish} />}
    </div>
  );
};

export default SignUpPage;
