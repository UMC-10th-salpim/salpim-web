import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import CurrentPasswordStep from '@/features/mypage/password/CurrentPasswordStep';
import NewPasswordStep from '@/features/mypage/password/NewPasswordStep';
import useUserStore from '@/store/userStore';
import { useQueryClient } from '@tanstack/react-query';

const PasswordChangePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useUserStore((state) => state.logout);
  const loginType = useUserStore((state) => state.loginType);
  const location = useLocation();
  const routeState = location.state as
    | { skipToNew?: boolean; recoveryAnswer?: string }
    | null;
  const skipToNew = Boolean(routeState?.skipToNew && routeState.recoveryAnswer);
  const [step, setStep] = useState<'current' | 'new'>(skipToNew ? 'new' : 'current');
  const [currentPassword, setCurrentPassword] = useState('');

  useEffect(() => {
    if (loginType === 'KAKAO') {
      navigate('/mypage', { replace: true });
    }
  }, [loginType, navigate]);

  if (loginType === 'KAKAO') return null;

  return (
    <div className="mypage-screen mx-auto max-w-md">
      <HeaderBar title="비밀번호 변경" className="[&_h1]:!text-[26px]" />

      {step === 'current' ? (
        <CurrentPasswordStep
          onVerified={(verifiedPassword) => {
            setCurrentPassword(verifiedPassword);
            setStep('new');
          }}
        />
      ) : (
        <NewPasswordStep
          verificationMethod={skipToNew ? 'RECOVERY_ANSWER' : 'CURRENT_PASSWORD'}
          currentPassword={skipToNew ? undefined : currentPassword}
          recoveryAnswer={skipToNew ? routeState?.recoveryAnswer : undefined}
          onSaved={() => {
            logout();
            queryClient.clear();
            navigate('/', { replace: true });
          }}
        />
      )}

      <BottomNavigation />
    </div>
  );
};

export default PasswordChangePage;
