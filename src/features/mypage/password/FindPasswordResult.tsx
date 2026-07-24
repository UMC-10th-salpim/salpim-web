import { MOCK_PASSWORD } from '@/apis/mypage';
import { primaryButton } from '@/features/onboarding/styles';

interface FindPasswordResultProps {
  onChangePassword: () => void;
}

const FindPasswordResult = ({ onChangePassword }: FindPasswordResultProps) => {
  return (
    <main className="mypage-content gap-6 text-center">
      <h2 className="text-[22px] font-extrabold text-[#43230F]">본인 확인이 완료됐어요!</h2>

      <div className="mypage-card self-center p-5">
        <p className="mb-3 text-[17px] font-extrabold text-[#FF7A32]">현재 비밀번호</p>
        <div className="flex gap-2">
          {MOCK_PASSWORD.split('').map((digit, index) => (
            <span
              key={index}
              className="flex h-12 w-10 items-center justify-center rounded-lg bg-[#FFEBD1] text-xl font-extrabold text-[#613212]"
            >
              {digit}
            </span>
          ))}
        </div>
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
