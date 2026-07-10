import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button/Button';
import Input from '@/components/common/Input/Input';
import { getKakaoAuthorizeUrl } from '@/apis/auth';

const buttonSize = 'py-4 text-lg font-bold';

// 숫자만 남기고 010-1234-5678 형태로 자동 하이픈
const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'landing' | 'login'>('landing');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  if (step === 'login') {
    return (
      <div className="mx-auto flex h-dvh max-w-md flex-col overflow-hidden bg-brand-50 px-6 pb-8 pt-10">
        <div className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto">
          <img src="/characters/salpimi.png" alt="살피미" className="mx-auto w-40" />
          <h1 className="mt-4 text-center text-xl font-bold leading-8 text-gray-900">
            번호를 입력하면
            <br />
            시작할 수 있어요!
          </h1>

          <div className="mt-10 flex flex-col gap-5">
            <Input
              label="전화번호"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(formatPhone(event.target.value))}
              placeholder="전화번호를 입력해 주세요"
            />
            <Input
              label="비밀번호"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="비밀번호를 입력해 주세요"
            />
          </div>
        </div>

        {/* TODO: 로그인 API 연동 후 이동 경로 확정 */}
        <Button className={`shrink-0 ${buttonSize}`} onClick={() => navigate('/recommendation')}>
          시작하기
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col overflow-hidden bg-brand-50 px-6 pb-8 pt-10">
      <div className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto">
        <p className="text-center text-lg font-bold leading-7 text-[#613212]">
          노인 맞춤형
          <br />
          인터넷 환경 속 생활 지원 서비스
        </p>
        <img src="/assets/Logo/Name.png" alt="살핌" className="mx-auto mt-4 w-40" />
        <img src="/assets/Logo/Icon.png" alt="" className="mx-auto mt-6 w-64" />
      </div>

      <div className="flex shrink-0 flex-col gap-3">
        <Button className={buttonSize} onClick={() => setStep('login')}>
          시작하기
        </Button>
        {/* 카카오 OAuth 2.0 인가 페이지로 이동 → /oauth/kakao 콜백에서 처리 */}
        <Button
          className={`${buttonSize} gap-2`}
          onClick={() => {
            window.location.href = getKakaoAuthorizeUrl();
          }}
        >
          <img src="/icons/kakaotalk.png" alt="" className="h-5 w-5" />
          카카오로 시작하기
        </Button>
        <Button className={buttonSize} onClick={() => navigate('/onboarding')}>
          회원가입
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
