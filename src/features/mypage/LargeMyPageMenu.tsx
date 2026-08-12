import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Modal from '@/components/common/Modal/Modal';
import ScrollMoreIndicator from '@/components/common/ScrollMoreIndicator/ScrollMoreIndicator';
import Toggle from '@/components/common/Toggle/Toggle';
import TermsDetail from '@/features/onboarding/TermsDetail';
import useSettingsStore from '@/store/settingsStore';
import useUserStore from '@/store/userStore';
import { MOCK_PROFILE, mypageApi } from '@/apis/mypage';
import { getApiErrorMessage } from '@/apis/auth';

interface LargeMenuRowProps {
  icon: string;
  title: string;
  description?: string;
  variant?: 'filled' | 'outline';
  onClick: () => void;
}

const LargeMenuRow = ({
  icon,
  title,
  description,
  variant = 'filled',
  onClick,
}: LargeMenuRowProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex min-h-[82px] w-full items-center gap-3 rounded-[22px] border-[3px] px-4 py-3 text-left shadow-[0_3px_10px_rgba(97,50,18,0.06)] ${
      variant === 'filled' ? 'border-[#F2BD76] bg-[#FFE8C7]' : 'border-[#F2BD76] bg-white'
    }`}
  >
    <img
      src={icon}
      alt=""
      className="h-12 w-12 shrink-0 rounded-full bg-white object-contain p-2"
    />
    <div className="min-w-0 flex-1">
      <p className="break-keep text-[22px] font-extrabold leading-[1.2] text-[#613212]">{title}</p>
      {description && (
        <p className="mt-1 break-keep text-[16px] font-bold leading-5 text-[#81746A]">
          {description}
        </p>
      )}
    </div>
    <img src="/icons/mypage/arrow.png" alt="" className="h-6 w-6 shrink-0" />
  </button>
);

const LargeSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="flex flex-col gap-3">
    <h2 className="px-1 text-[27px] font-extrabold leading-[1.25] text-[#613212]">{title}</h2>
    {children}
  </section>
);

const LargeMyPageMenu = () => {
  const navigate = useNavigate();
  const logout = useUserStore((state) => state.logout);
  const accessToken = useUserStore((state) => state.accessToken);
  const loginType = useUserStore((state) => state.loginType);
  const fontSize = useSettingsStore((state) => state.fontSize);
  const deadlineAlertEnabled = useSettingsStore((state) => state.deadlineAlertEnabled);
  const toggleDeadlineAlert = useSettingsStore((state) => state.toggleDeadlineAlert);
  const [showTerms, setShowTerms] = useState(false);
  const [confirmModal, setConfirmModal] = useState<'logout' | 'withdraw' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionError, setActionError] = useState('');

  const {
    data: profileSummary,
    error: profileError,
    isFetching: isProfileFetching,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ['mypage-summary', accessToken],
    queryFn: mypageApi.getSummary,
    enabled: Boolean(accessToken),
    retry: false,
  });

  const displayName = profileSummary?.name || MOCK_PROFILE.name;
  const displayRegion =
    [profileSummary?.sido, profileSummary?.sigungu].filter(Boolean).join(' ') ||
    MOCK_PROFILE.region;
  const profileErrorMessage = profileError
    ? getApiErrorMessage(
        profileError,
        '내 정보를 서버에서 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'
      )
    : '';

  const openConfirmModal = (type: 'logout' | 'withdraw') => {
    setActionError('');
    setConfirmModal(type);
  };

  const handleConfirm = async () => {
    if (!confirmModal || isProcessing) return;
    if (confirmModal === 'logout') {
      logout();
      setConfirmModal(null);
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    setActionError('');
    try {
      await mypageApi.withdraw();
      logout();
      setConfirmModal(null);
      navigate('/login', { replace: true });
    } catch (error) {
      setActionError(getApiErrorMessage(error, '탈퇴하지 못했어요. 잠시 후 다시 시도해 주세요.'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="flex w-full flex-1 flex-col gap-7 bg-[#FAF8F3] px-4 pb-7 pt-5">
      <div className="flex items-center gap-4 rounded-[24px] border-[3px] border-[#F2BD76] bg-white px-5 py-4 shadow-[0_3px_10px_rgba(97,50,18,0.06)]">
        <img
          src="/characters/salpimi_Hi.png"
          alt="인사하는 살피미"
          className="h-24 w-24 shrink-0 object-contain"
        />
        <div className="min-w-0">
          <p className="break-keep text-[27px] font-extrabold leading-[1.25] text-[#3F2A1D]">
            안녕하세요,
            <br />
            {displayName} 님!
          </p>
          <p className="mt-1 break-keep text-[18px] font-extrabold leading-6 text-[#F07B32]">
            {displayRegion}
          </p>
        </div>
      </div>

      {profileError && (
        <section
          role="alert"
          className="rounded-[20px] border-[3px] border-[#F5B77C] bg-[#FFF7ED] px-4 py-4"
        >
          <p className="text-[20px] font-extrabold text-[#613212]">
            회원 정보를 불러오지 못했어요.
          </p>
          <p className="mt-1 text-[17px] font-bold leading-6 text-[#81746A]">
            {profileErrorMessage}
          </p>
          <button
            type="button"
            onClick={() => void refetchProfile()}
            disabled={isProfileFetching}
            className="mt-3 min-h-12 rounded-full bg-[#FF853E] px-5 text-[18px] font-extrabold text-white disabled:bg-[#F7C49F]"
          >
            {isProfileFetching ? '다시 불러오는 중...' : '다시 불러오기'}
          </button>
        </section>
      )}

      <LargeSection title="찜한 혜택 보러 가기">
        <LargeMenuRow
          icon="/icons/heart_fill.png"
          title="눌러서 보관한 혜택을 확인해 보세요."
          variant="outline"
          onClick={() => navigate('/mypage/liked')}
        />
      </LargeSection>

      <LargeSection title="내 정보 관리">
        <LargeMenuRow
          icon="/icons/mypage/person.png"
          title="개인정보 수정"
          description="이름, 생년월일, 성별, 주소"
          onClick={() => navigate('/mypage/edit')}
        />
        {loginType !== 'KAKAO' && (
          <LargeMenuRow
            icon="/icons/mypage/password.png"
            title="비밀번호 변경"
            onClick={() => navigate('/mypage/password')}
          />
        )}
      </LargeSection>

      <LargeSection title="고객 지원">
        <LargeMenuRow
          icon="/icons/mypage/question.png"
          title="문의하기"
          onClick={() => navigate('/mypage/inquiry')}
        />
        <LargeMenuRow
          icon="/icons/location.png"
          title="이용약관 및 개인정보 처리 방침"
          onClick={() => setShowTerms(true)}
        />
      </LargeSection>

      <LargeSection title="설정">
        <div className="overflow-hidden rounded-[22px] border-[3px] border-[#F2BD76] bg-white">
          <div className="flex min-h-[86px] items-center gap-3 px-4 py-3">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF2E2] text-[#FF853E]"
              aria-hidden
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 9a6 6 0 10-12 0c0 7-3 7-3 8.5h18C21 16 18 16 18 9Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.8 20h4.4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[20px] font-extrabold text-[#613212]">찜한 혜택 알림 표시</p>
              <p className="mt-0.5 break-keep text-[15px] font-bold leading-5 text-[#FF7A32]">
                홈 화면에서 찜한 혜택을 보여줘요.
              </p>
            </div>
            <Toggle
              checked={deadlineAlertEnabled}
              onChange={toggleDeadlineAlert}
              label="찜한 혜택 알림 표시"
            />
          </div>

          <button
            type="button"
            onClick={() => navigate('/mypage/font-size', { state: { from: '/mypage' } })}
            className="flex min-h-[86px] w-full items-center gap-3 border-t border-[#F1E5D9] px-4 py-3 text-left"
          >
            <img
              src="/icons/mypage/security.png"
              alt=""
              className="h-12 w-12 shrink-0 rounded-full bg-[#FFF2E2] object-contain p-2"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[20px] font-extrabold text-[#613212]">글자 크기 설정</p>
              <p className="mt-0.5 break-keep text-[15px] font-bold leading-5 text-[#FF7A32]">
                화면에 표시되는 글자 크기를 바꿔요. 현재 {fontSize === 'large' ? '크게' : '중간'}
              </p>
            </div>
            <img src="/icons/mypage/arrow.png" alt="" className="h-6 w-6 shrink-0" />
          </button>
        </div>
      </LargeSection>

      <div className="flex flex-col gap-3 pt-1">
        <button
          type="button"
          onClick={() => openConfirmModal('logout')}
          className="flex min-h-14 w-full items-center justify-center rounded-[18px] bg-[#FF8A3D] px-4 text-[23px] font-extrabold text-white"
        >
          로그아웃하기
        </button>
        <button
          type="button"
          onClick={() => openConfirmModal('withdraw')}
          className="flex min-h-14 w-full items-center justify-center rounded-[18px] bg-[#FF8A3D] px-4 text-[23px] font-extrabold text-white"
        >
          탈퇴하기
        </button>
      </div>

      {showTerms && <TermsDetail termKey="service" onClose={() => setShowTerms(false)} />}

      <Modal
        open={confirmModal !== null}
        title={confirmModal === 'logout' ? '로그아웃하시겠어요?' : '정말 탈퇴하시겠어요?'}
        confirmText={
          isProcessing ? '처리 중...' : confirmModal === 'logout' ? '로그아웃' : '탈퇴하기'
        }
        onConfirm={() => void handleConfirm()}
        onClose={() => {
          if (isProcessing) return;
          setConfirmModal(null);
          setActionError('');
        }}
      >
        {confirmModal === 'logout'
          ? '다시 로그인하면 이용하실 수 있어요.'
          : '탈퇴하면 저장된 정보가 모두 사라져요.'}
        {actionError && (
          <p role="alert" className="mt-2 text-sm font-bold text-red-500">
            {actionError}
          </p>
        )}
      </Modal>

      <ScrollMoreIndicator />
    </main>
  );
};

export default LargeMyPageMenu;
