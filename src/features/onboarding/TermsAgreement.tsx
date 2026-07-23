import { useState } from 'react';
import { primaryButton } from './styles';
import TermsDetail from './TermsDetail';
import type { TermKey } from './termsContent';

export interface TermsData {
  service: boolean;
  privacy: boolean;
  sensitive: boolean;
  location: boolean;
}

const TERMS: { key: TermKey; label: string }[] = [
  { key: 'service', label: '서비스 이용 약관' },
  { key: 'privacy', label: '개인정보 수집 및 이용 동의' },
  { key: 'sensitive', label: '민감정보 수집 및 이용 동의' },
  { key: 'location', label: '위치정보 수집 및 이용 동의' },
];

interface TermsAgreementProps {
  value: TermsData;
  onChange: (data: TermsData) => void;
  onSubmit: () => void;
}

const CheckBox = ({ checked }: { checked: boolean }) => (
  <span
    aria-hidden
    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-[3px] transition-colors ${
      checked ? 'border-brand-500 bg-brand-500' : 'border-gray-200 bg-gray-200'
    }`}
  >
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
      <path
        d="M4 10l4 4 8-8"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

const TermsAgreement = ({ value, onChange, onSubmit }: TermsAgreementProps) => {
  const [openTerm, setOpenTerm] = useState<TermKey | null>(null);
  const allChecked = TERMS.every(({ key }) => value[key]);

  const toggleAll = () =>
    onChange({
      service: !allChecked,
      privacy: !allChecked,
      sensitive: !allChecked,
      location: !allChecked,
    });

  const toggle = (key: keyof TermsData) => onChange({ ...value, [key]: !value[key] });

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-col justify-center py-2">
          <h1 className="text-center text-3xl font-bold text-gray-900">약관에 동의해 주세요</h1>
          <p className="mb-8 mt-2 text-center text-2xl font-semibold leading-8 text-brand-500">
            아래 내용을 확인하고
            <br />
            동의해 주세요
          </p>

          {/* 전체 동의 */}
          <button
            type="button"
            onClick={toggleAll}
            className="flex w-full items-center gap-3 rounded-2xl border-[3px] border-brand-200 bg-white px-5 py-4 text-left"
          >
            <CheckBox checked={allChecked} />
            <span className="text-2xl font-bold text-gray-900">전체 동의</span>
          </button>

          {/* 개별 약관 */}
          <div className="mt-6 rounded-2xl border-[3px] border-brand-400/60 bg-white">
            {TERMS.map(({ key, label }, index) => (
              <div
                key={key}
                className={`relative flex items-center gap-3 px-5 py-4 ${
                  index !== 0
                    ? 'before:absolute before:inset-x-5 before:top-0 before:h-px before:bg-gray-200 before:content-[""]'
                    : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(key)}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  <CheckBox checked={value[key]} />
                  <span className="flex min-w-0 flex-1 items-center gap-1 font-bold leading-[1.25] tracking-[-0.06em] text-gray-800">
                    <span className="shrink-0 !text-[clamp(18px,2.54vh,20px)]">[필수]</span>
                    <span className="min-w-0 flex-1 !text-[clamp(18px,2.54vh,20px)]">{label}</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setOpenTerm(key)}
                  className="shrink-0 rounded-full bg-brand-200/70 px-3 py-1 text-sm text-gray-900"
                >
                  보기 &gt;
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 pt-4">
        <button type="button" onClick={onSubmit} disabled={!allChecked} className={primaryButton}>
          다음
        </button>
      </div>

      {openTerm && <TermsDetail termKey={openTerm} onClose={() => setOpenTerm(null)} />}
    </>
  );
};

export default TermsAgreement;
