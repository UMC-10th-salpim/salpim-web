import { primaryButton } from './styles';
import type { OnboardingInfo } from './OnboardingForm';
import type { AddressInfo } from './AddressSelector';

interface SummaryStepProps {
  info: OnboardingInfo;
  address: AddressInfo;
  onStart: () => void;
  isSubmitting?: boolean;
  errorMessage?: string;
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-4">
    <span className="w-20 shrink-0 text-2xl font-semibold text-gray-800">{label}</span>
    <span className="text-2xl font-semibold text-brand-500">{value}</span>
  </div>
);

const SummaryStep = ({
  info,
  address,
  onStart,
  isSubmitting = false,
  errorMessage = '',
}: SummaryStepProps) => {
  const name = info.name.trim() || 'OOO';
  const birth =
    info.birthYear && info.birthMonth && info.birthDay
      ? `${info.birthYear}년 ${info.birthMonth}월 ${info.birthDay}일`
      : '-';
  const region = address.roadAddress.trim() || '-';
  const gender = info.gender === 'male' ? '남성' : info.gender === 'female' ? '여성' : '-';

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-col justify-center py-2">
          <img
            src="/assets/Salpimi/Love.png"
            alt="살피미"
            className="mx-auto size-[clamp(160px,53.33vw,200px)] object-contain"
          />
          <h1 className="mt-4 text-center text-[clamp(28px,4.06vh,32px)] font-bold leading-8 text-[#613212]">
            {name} 님께 딱 맞는
            <br />
            혜택을 찾아 드릴게요!
          </h1>

          <div className="mt-8 rounded-2xl border-[3px] border-brand-300 bg-[#FBE3BF] px-6 py-6">
            <h2 className="mb-5 text-center text-[clamp(28px,4.06vh,32px)] font-semibold text-gray-900">
              설정된 정보
            </h2>
            <div className="flex flex-col gap-4">
              <Row label="이름" value={name} />
              <Row label="생년월일" value={birth} />
              <Row label="지역" value={region} />
              <Row label="성별" value={gender} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 pt-4">
        <button type="button" onClick={onStart} disabled={isSubmitting} className={primaryButton}>
          {isSubmitting ? '회원가입 중...' : '살핌 시작하기'}
        </button>
      </div>
      {errorMessage && (
        <p role="alert" className="mt-2 text-center text-sm font-semibold text-red-500">
          {errorMessage}
        </p>
      )}
    </>
  );
};

export default SummaryStep;
