import { MOCK_PASSWORD } from '@/apis/mypage';
import { primaryButton } from '@/features/onboarding/styles';

interface FindPasswordResultProps {
  onChangePassword: () => void;
}

const FindPasswordResult = ({ onChangePassword }: FindPasswordResultProps) => {
  return (
    <div className="flex flex-col gap-6 p-4 pb-10 text-center">
      <p className="text-lg font-bold text-gray-900">본인 확인이 완료됐어요!</p>

      <div className="self-center">
        <p className="mb-2 text-sm font-semibold text-brand-500">현재 비밀번호</p>
        <div className="flex gap-3">
          {MOCK_PASSWORD.split('').map((digit, index) => (
            <span
              key={index}
              className="flex h-12 w-10 items-center justify-center rounded-xl border border-brand-200 bg-white text-xl font-bold text-gray-900"
            >
              {digit}
            </span>
          ))}
        </div>
      </div>

      <button type="button" onClick={onChangePassword} className={primaryButton}>
        새 비밀번호로 바꾸기
      </button>
    </div>
  );
};

export default FindPasswordResult;
