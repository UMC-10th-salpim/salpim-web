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
  <div className="flex min-w-0 gap-4">
    <span className="salpim-field-text w-20 shrink-0 font-semibold text-gray-800">{label}</span>
    <span className="salpim-field-text min-w-0 flex-1 break-words font-semibold text-brand-500 [overflow-wrap:anywhere]">
      {value}
    </span>
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
      <div className="flex flex-col justify-start pt-2">
        <img
          src="/assets/Salpimi/Love.png"
          alt="살피미"
          className="mx-auto size-[clamp(160px,53.33vw,200px)] object-contain"
        />
        <h1 className="salpim-page-title mt-4 text-center font-bold leading-8 text-[#613212]">
          {name} 님께 딱 맞는
          <br />
          혜택을 찾아 드릴게요!
        </h1>

        <div className="mt-5 box-border min-h-[307px] w-full min-w-0 rounded-[11px] border-[3px] border-brand-300 bg-[#FBE3BF] px-6 py-6">
          <h2 className="salpim-page-title mb-5 text-center font-semibold text-gray-900">
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

      <div className="-mx-0.5 mt-auto flex shrink-0 pt-4">
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
