import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import FindPasswordQuestion from '@/features/mypage/password/FindPasswordQuestion';
import FindPasswordResult from '@/features/mypage/password/FindPasswordResult';

const PasswordFindPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'question' | 'result'>('question');
  const [recoveryAnswer, setRecoveryAnswer] = useState('');

  return (
    <div className="mypage-screen mx-auto max-w-md">
      <HeaderBar title="비밀번호 찾기" />

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
