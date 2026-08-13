import { useState } from 'react';
import { primaryButton } from './styles';
import TermsDetail from './TermsDetail';
import type { SignupTerm } from '@/apis/auth';

export type TermsData = Record<number, boolean>;

interface TermsAgreementProps {
  value: TermsData;
  terms: SignupTerm[];
  onChange: (data: TermsData) => void;
  onBack: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
  isSubmitting?: boolean;
  errorMessage?: string;
}

const CheckBox = ({ checked }: { checked: boolean }) => (
  <span
    aria-hidden
    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-[3px] transition-colors ${
      checked ? 'border-brand-500 bg-brand-500' : 'border-gray-200 bg-gray-200'
    }`}
  >
    {checked && (
      <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
        <path
          d="M4 10l4 4 8-8"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
  </span>
);

const TermsAgreement = ({
  value,
  terms,
  onChange,
  onBack,
  onSubmit,
  isLoading = false,
  isSubmitting = false,
  errorMessage = '',
}: TermsAgreementProps) => {
  const [openTerm, setOpenTerm] = useState<SignupTerm | null>(null);
  const allChecked = terms.length > 0 && terms.every(({ termsVersionId }) => value[termsVersionId]);
  const requiredChecked =
    terms.length > 0 &&
    terms
      .filter(({ isRequired }) => isRequired)
      .every(({ termsVersionId }) => value[termsVersionId]);

  const toggleAll = () => {
    const nextValue = !allChecked;
    onChange(Object.fromEntries(terms.map(({ termsVersionId }) => [termsVersionId, nextValue])));
  };

  const toggle = (termsVersionId: number) =>
    onChange({ ...value, [termsVersionId]: !value[termsVersionId] });

  const closeTermAndAgree = () => {
    if (!openTerm) return;
    onChange({ ...value, [openTerm.termsVersionId]: true });
    setOpenTerm(null);
  };

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-col justify-start pt-8">
          <h1 className="salpim-page-title text-center font-bold text-gray-900">
            약관에 동의해 주세요
          </h1>
          <p className="salpim-page-description mb-[14px] mt-2 text-center font-semibold leading-8 text-brand-500">
            아래 내용을 확인하고
            <br />
            동의해 주세요
          </p>

          {/* 전체 동의 */}
          <button
            type="button"
            onClick={toggleAll}
            disabled={isLoading || terms.length === 0}
            className="flex h-[78px] w-full items-center gap-3 rounded-[11px] border-[3px] border-brand-200 bg-white px-5 py-0 text-left !font-semibold"
          >
            <CheckBox checked={allChecked} />
            <span className="salpim-field-text font-semibold text-gray-900">전체 동의</span>
          </button>

          {/* 개별 약관 */}
          <div className="mt-[50px] overflow-hidden rounded-[11px] border-[3px] border-brand-200 bg-white">
            {terms.map((term, index) => {
              const { termsVersionId, name, isRequired } = term;
              return (
                <div
                  key={termsVersionId}
                  className={`relative flex h-20 items-center gap-3 px-3 ${
                    index !== 0
                      ? 'before:absolute before:inset-x-3 before:top-0 before:h-px before:bg-gray-200 before:content-[""]'
                      : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(termsVersionId)}
                    className="flex flex-1 items-center gap-3 text-left !font-semibold"
                  >
                    <CheckBox checked={Boolean(value[termsVersionId])} />
                    <span className="salpim-home-card-body flex min-w-0 flex-1 items-center gap-1 font-semibold leading-[1.25] tracking-[-0.06em] text-gray-800">
                      <span className="shrink-0">[{isRequired ? '필수' : '선택'}]</span>
                      <span className="min-w-0 flex-1">{name}</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenTerm(term)}
                    className="shrink-0 rounded-full bg-brand-200/70 px-3 py-1 !text-sm !font-semibold text-gray-900"
                  >
                    보기 &gt;
                  </button>
                </div>
              );
            })}
          </div>

          {(isLoading || errorMessage) && (
            <p
              role={errorMessage ? 'alert' : undefined}
              className={`mt-3 text-center text-sm font-semibold ${errorMessage ? 'text-red-500' : 'text-gray-500'}`}
            >
              {errorMessage || '약관 정보를 불러오고 있어요.'}
            </p>
          )}
        </div>
      </div>

      <div className="-mx-0.5 flex shrink-0 gap-4 pt-4">
        <button type="button" onClick={onBack} className={primaryButton}>
          이전
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!requiredChecked || isLoading || isSubmitting}
          className={primaryButton}
        >
          {isSubmitting ? '확인 중...' : '다음'}
        </button>
      </div>

      {openTerm && <TermsDetail term={openTerm} onClose={closeTermAndAgree} />}
    </>
  );
};

export default TermsAgreement;
