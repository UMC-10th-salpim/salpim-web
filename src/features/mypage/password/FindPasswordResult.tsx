import { primaryButton } from '@/features/onboarding/styles';

interface FindPasswordResultProps {
  onChangePassword: () => void;
}

const FindPasswordResult = ({ onChangePassword }: FindPasswordResultProps) => {
  return (
    <main className="mypage-content gap-6 text-center">
      <h2 className="text-[22px] font-extrabold text-[#43230F]">본인 확인이 완료됐어요!</h2>

      <div className="mypage-card self-center p-5">
        <p className="text-[17px] font-extrabold leading-7 text-[#FF7A32]">
          안전을 위해 기존 비밀번호는 보여드리지 않아요.
          <br />
          바로 새 비밀번호를 설정해 주세요.
        </p>
      </div>

      <button
        type="button"
        onClick={onChangePassword}
        className={`${primaryButton} !mt-auto !min-h-14 !flex-none !text-[22px]`}
      >
        새 비밀번호로 바꾸기
      </button>
    </main>
  );
};

export default FindPasswordResult;
