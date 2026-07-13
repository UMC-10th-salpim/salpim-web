import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import FindPasswordQuestion from '@/features/mypage/password/FindPasswordQuestion';
import FindPasswordResult from '@/features/mypage/password/FindPasswordResult';

const PasswordFindPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'question' | 'result'>('question');

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-[#FAF8F3] pb-24">
      <HeaderBar title="비밀번호 찾기" />

      {step === 'question' ? (
        <FindPasswordQuestion onVerified={() => setStep('result')} />
      ) : (
        <FindPasswordResult
          onChangePassword={() => navigate('/mypage/password', { state: { skipToNew: true } })}
        />
      )}

      <BottomNavigation />
    </div>
  );
};

export default PasswordFindPage;
