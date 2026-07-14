import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '@/components/common/Modal/Modal';
import Toggle from '@/components/common/Toggle/Toggle';
import TermsDetail from '@/features/onboarding/TermsDetail';
import useSettingsStore from '@/store/settingsStore';
import useUserStore from '@/store/userStore';
import { MOCK_PROFILE } from '@/apis/mypage';

interface MenuRowProps {
  icon: string;
  title: string;
  description?: string;
  onClick: () => void;
}

const MenuRow = ({ icon, title, description, onClick }: MenuRowProps) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full items-center gap-3 rounded-2xl bg-[#FBE3BF] px-4 py-4 text-left transition-colors hover:bg-[#F6D6A3]"
  >
    <img src={icon} alt="" className="h-10 w-10 shrink-0 rounded-full bg-white object-contain p-2" />
    <div className="flex-1">
      <p className="text-base font-bold text-[#613212]">{title}</p>
      {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
    </div>
    <img src="/icons/mypage/arrow.png" alt="" className="h-4 w-4 shrink-0" />
  </button>
);

interface SectionProps {
  title: string;
  children: ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <section className="flex flex-col gap-2">
    <h2 className="text-base font-bold text-[#613212]">{title}</h2>
    {children}
  </section>
);

const MyPageMenu = () => {
  const navigate = useNavigate();
  const logout = useUserStore((state) => state.logout);
  const fontSize = useSettingsStore((state) => state.fontSize);
  const deadlineAlertEnabled = useSettingsStore((state) => state.deadlineAlertEnabled);
  const toggleDeadlineAlert = useSettingsStore((state) => state.toggleDeadlineAlert);

  const [showTerms, setShowTerms] = useState(false);
  const [confirmModal, setConfirmModal] = useState<'logout' | 'withdraw' | null>(null);

  const handleConfirm = () => {
    logout();
    setConfirmModal(null);
    navigate('/login');
  };

  return (
    <div className="flex flex-col gap-6 p-4 pb-10">
      {/* 인사 카드 */}
      <div className="flex items-center gap-3 rounded-2xl border-2 border-brand-200 bg-[#FFF7ED] px-4 py-4">
        <img src="/characters/salpimi.png" alt="살피미" className="w-16 shrink-0" />
        <div>
          <p className="text-lg font-bold leading-7 text-gray-900">
            안녕하세요,
            <br />
            {MOCK_PROFILE.name} 님!
          </p>
          <p className="mt-1 text-sm font-semibold text-brand-500">{MOCK_PROFILE.region}</p>
        </div>
      </div>

      <Section title="찜한 혜택 보러 가기">
        <MenuRow
          icon="/icons/heart_fill.png"
          title="눌러서 보관한 혜택을 확인해 보세요."
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
        <div className="flex w-full items-center gap-3 rounded-2xl bg-[#FBE3BF] px-4 py-4">
          <div className="flex-1">
            <p className="text-base font-bold text-[#613212]">마감 임박 혜택 표시</p>
            <p className="mt-0.5 text-xs text-gray-500">
              홈 화면에서 곧 마감되는 혜택을 알려 줘요.
            </p>
          </div>
          <Toggle checked={deadlineAlertEnabled} onChange={toggleDeadlineAlert} label="마감 임박 혜택 표시" />
        </div>

        <MenuRow
          icon="/icons/mypage/security.png"
          title="글자 크기 설정"
          description={`화면에 표시되는 글자 크기를 바꿔요. (현재: ${fontSize === 'large' ? '크게' : '중간'})`}
          onClick={() => navigate('/mypage/font-size')}
        />
      </Section>

      <div className="flex flex-col gap-3 pt-2">
        <button
          type="button"
          onClick={() => setConfirmModal('logout')}
          className="w-full rounded-full border-2 border-brand-500 bg-white py-3.5 text-base font-bold text-brand-500 transition-colors hover:bg-brand-50"
        >
          로그아웃하기
        </button>
        <button
          type="button"
          onClick={() => setConfirmModal('withdraw')}
          className="w-full rounded-full bg-brand-500 py-3.5 text-base font-bold text-white transition-colors hover:bg-brand-600"
        >
          탈퇴하기
        </button>
      </div>

      {showTerms && <TermsDetail termKey="service" onClose={() => setShowTerms(false)} />}

      <Modal
        open={confirmModal !== null}
        title={confirmModal === 'logout' ? '로그아웃하시겠어요?' : '정말 탈퇴하시겠어요?'}
        confirmText={confirmModal === 'logout' ? '로그아웃' : '탈퇴하기'}
        onConfirm={handleConfirm}
        onClose={() => setConfirmModal(null)}
      >
        {confirmModal === 'logout'
          ? '다시 로그인하면 이용하실 수 있어요.'
          : '탈퇴하면 저장된 정보가 모두 사라져요.'}
      </Modal>
    </div>
  );
};

export default MyPageMenu;
