import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import CurrentPasswordStep from '@/features/mypage/password/CurrentPasswordStep';
import NewPasswordStep from '@/features/mypage/password/NewPasswordStep';

const PasswordChangePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const skipToNew = Boolean((location.state as { skipToNew?: boolean } | null)?.skipToNew);
  const [step, setStep] = useState<'current' | 'new'>(skipToNew ? 'new' : 'current');

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-[#FAF8F3] pb-24">
      <HeaderBar title="비밀번호 변경" />

      {step === 'current' ? (
        <CurrentPasswordStep onVerified={() => setStep('new')} />
      ) : (
        <NewPasswordStep onSaved={() => navigate('/mypage')} />
      )}

      <BottomNavigation />
    </div>
  );
};

export default PasswordChangePage;
