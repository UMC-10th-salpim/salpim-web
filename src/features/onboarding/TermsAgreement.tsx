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
    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors ${
      checked ? 'bg-brand-500' : 'border-2 border-brand-200 bg-white'
    }`}
  >
    {checked && (
      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
        <path d="M4 10l4 4 8-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
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
        <h1 className="text-center text-2xl font-bold text-gray-900">약관에 동의해 주세요</h1>
        <p className="mb-8 mt-2 text-center text-base font-semibold leading-6 text-brand-500">
          아래 내용을 확인하고
          <br />
          동의해 주세요
        </p>

        {/* 전체 동의 */}
        <button
          type="button"
          onClick={toggleAll}
          className="flex w-full items-center gap-3 rounded-2xl border border-brand-200 bg-white px-5 py-4 text-left"
        >
          <CheckBox checked={allChecked} />
          <span className="text-lg font-bold text-gray-900">전체 동의</span>
        </button>

        {/* 개별 약관 */}
        <div className="mt-6 rounded-2xl border border-brand-200 bg-white">
          {TERMS.map(({ key, label }, index) => (
            <div
              key={key}
              className={`flex items-center gap-3 px-5 py-4 ${
                index !== 0 ? 'border-t border-brand-100' : ''
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(key)}
                className="flex flex-1 items-center gap-3 text-left"
              >
                <CheckBox checked={value[key]} />
                <span className="flex-1 text-base font-medium leading-6 text-gray-800">
                  <span className="font-bold">[필수]</span> {label}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setOpenTerm(key)}
                className="shrink-0 rounded-full bg-brand-50 px-3 py-1 text-sm text-gray-500"
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
