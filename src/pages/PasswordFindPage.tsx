import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import FindPasswordQuestion from '@/features/mypage/password/FindPasswordQuestion';
import FindPasswordResult from '@/features/mypage/password/FindPasswordResult';
import useUserStore from '@/store/userStore';

const PasswordFindPage = () => {
  const navigate = useNavigate();
  const loginType = useUserStore((state) => state.loginType);
  const [step, setStep] = useState<'question' | 'result'>('question');
  const [recoveryAnswer, setRecoveryAnswer] = useState('');

  useEffect(() => {
    if (loginType === 'KAKAO') {
      navigate('/mypage', { replace: true });
    }
  }, [loginType, navigate]);

  if (loginType === 'KAKAO') return null;

  return (
    <div className="mypage-screen mx-auto max-w-md">
      <HeaderBar title="비밀번호 바꾸기" className="[&_h1]:!text-[26px]" />

      {step === 'question' ? (
        <FindPasswordQuestion
          onVerified={(verifiedAnswer) => {
            setRecoveryAnswer(verifiedAnswer);
            setStep('result');
          }}
        />
      ) : (
        <FindPasswordResult
          onChangePassword={() =>
            navigate('/mypage/password', { state: { skipToNew: true, recoveryAnswer } })
          }
        />
      )}

      <BottomNavigation />
    </div>
  );
};

export default PasswordFindPage;
