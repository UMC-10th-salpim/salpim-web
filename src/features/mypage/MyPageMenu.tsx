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

interface MenuRowProps {
  icon: string;
  title: string;
  description?: string;
  variant?: 'filled' | 'outline';
  onClick: () => void;
}

const MenuRow = ({ icon, title, description, variant = 'filled', onClick }: MenuRowProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex min-h-[76px] w-full items-center gap-3 rounded-[20px] px-4 py-3.5 text-left shadow-[0_3px_10px_rgba(97,50,18,0.06)] transition-colors ${
      variant === 'filled'
        ? 'border-2 border-[#F4C78F] bg-[#FFE9CA] hover:bg-[#FFDFB4]'
        : 'border-2 border-[#FFD19C] bg-white hover:bg-[#FFF8EF]'
    }`}
  >
    <img
      src={icon}
      alt=""
      className="h-11 w-11 shrink-0 rounded-full bg-white object-contain p-2"
    />
    <div className="flex-1">
      <p className="text-[20px] font-extrabold leading-6 text-[#613212]">{title}</p>
      {description && (
        <p className="mt-1 text-[16px] font-semibold leading-5 text-[#81746A]">{description}</p>
      )}
    </div>
    <img src="/icons/mypage/arrow.png" alt="" className="h-6 w-6 shrink-0" />
  </button>
);

interface SectionProps {
  title: string;
  children: ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <section className="flex flex-col gap-2.5">
    <h2 className="px-1 text-[20px] font-extrabold text-[#613212]">{title}</h2>
    {children}
  </section>
);

const MyPageMenu = () => {
  const navigate = useNavigate();
  const logout = useUserStore((state) => state.logout);
  const accessToken = useUserStore((state) => state.accessToken);
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

  const openConfirmModal = (type: 'logout' | 'withdraw') => {
    setActionError('');
    setConfirmModal(type);
  };

  return (
    <main className="mypage-content gap-7">
      {/* 인사 카드 */}
      <div className="mypage-card flex items-center gap-4 px-5 py-4">
        <img
          src="/characters/salpimi_Hi.png"
          alt="인사하는 살피미"
          className="h-[72px] w-[72px] shrink-0 object-contain"
        />
        <div>
          <p className="text-[22px] font-extrabold leading-8 text-[#3F2A1D]">
            안녕하세요,
            <br />
            {displayName} 님!
          </p>
          <p className="mt-1 text-[17px] font-bold text-[#F07B32]">{displayRegion}</p>
        </div>
      </div>

      {profileError && (
        <section
          role="alert"
          className="rounded-[18px] border-2 border-[#F5B77C] bg-[#FFF7ED] px-4 py-3"
        >
          <p className="text-[17px] font-extrabold text-[#613212]">
            회원 정보를 불러오지 못했어요.
          </p>
          <p className="mt-1 text-[15px] font-semibold leading-6 text-[#81746A]">
            {profileErrorMessage}
          </p>
          <button
            type="button"
            onClick={() => {
              void refetchProfile();
            }}
            disabled={isProfileFetching}
            className="mt-3 min-h-11 rounded-full bg-[#FF853E] px-5 text-[16px] font-extrabold text-white disabled:bg-[#F7C49F]"
          >
            {isProfileFetching ? '다시 불러오는 중...' : '다시 불러오기'}
          </button>
        </section>
      )}

      <Section title="찜한 혜택 보러 가기">
        <MenuRow
          icon="/icons/heart_fill.png"
          title="눌러서 보관한 혜택을 확인해 보세요."
          variant="outline"
          onClick={() => navigate('/mypage/liked')}
        />
      </Section>

      <Section title="내 정보 관리">
        <MenuRow
          icon="/icons/mypage/person.png"
          title="개인정보 수정"
          description="이름, 생년월일, 성별, 주소"
          onClick={() => navigate('/mypage/edit')}
        />
        <MenuRow
          icon="/icons/mypage/password.png"
          title="비밀번호 변경"
          onClick={() => navigate('/mypage/password')}
        />
      </Section>

      <Section title="고객 지원">
        <MenuRow
          icon="/icons/mypage/question.png"
          title="문의하기"
          onClick={() => navigate('/mypage/inquiry')}
        />
        <MenuRow
          icon="/icons/location.png"
          title="이용약관 및 개인정보 처리 방침"
          onClick={() => setShowTerms(true)}
        />
      </Section>

      <Section title="설정">
        <div className="overflow-hidden rounded-[18px] border-2 border-[#FFD29E] bg-white">
          <div className="flex min-h-[76px] items-center gap-3 px-4 py-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF2E2] text-[#FF853E]"
              aria-hidden
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
              <p className="text-[18px] font-extrabold text-[#613212]">마감 임박 혜택 표시</p>
              <p className="mt-0.5 text-[14px] font-semibold leading-5 text-[#FF7A32]">
                홈 화면에서 곧 마감되는 혜택을 알려 줘요.
              </p>
            </div>
            <Toggle
              checked={deadlineAlertEnabled}
              onChange={toggleDeadlineAlert}
              label="마감 임박 혜택 표시"
            />
          </div>

          <button
            type="button"
            onClick={() => navigate('/mypage/font-size')}
            className="flex min-h-[76px] w-full items-center gap-3 border-t border-[#F1E5D9] px-4 py-3 text-left transition-colors hover:bg-[#FFF8EF]"
          >
            <img
              src="/icons/mypage/security.png"
              alt=""
              className="h-10 w-10 shrink-0 rounded-full bg-[#FFF2E2] object-contain p-2"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[18px] font-extrabold text-[#613212]">글자 크기 설정</p>
              <p className="mt-0.5 text-[14px] font-semibold leading-5 text-[#FF7A32]">
                화면에 표시되는 글자 크기를 바꿔요. 현재 {fontSize === 'large' ? '크게' : '중간'}
              </p>
            </div>
            <img src="/icons/mypage/arrow.png" alt="" className="h-6 w-6 shrink-0" />
          </button>
        </div>
      </Section>

      <div className="flex flex-col gap-3 pt-1">
        <button
          type="button"
          onClick={() => openConfirmModal('logout')}
          className="mypage-primary-action"
        >
          로그아웃하기
        </button>
        <button
          type="button"
          onClick={() => openConfirmModal('withdraw')}
          className="mypage-primary-action"
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
        onConfirm={() => {
          void handleConfirm();
        }}
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

export default MyPageMenu;
