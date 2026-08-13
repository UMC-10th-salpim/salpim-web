import { useState } from 'react';
import TermsDetail from '../TermsDetail';
import type { TermsData } from '../TermsAgreement';
import type { SignupTerm } from '@/apis/auth';

interface LargeTermsAgreementProps {
  value: TermsData;
  terms: SignupTerm[];
  onChange: (data: TermsData) => void;
  onBack: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
  isSubmitting?: boolean;
  errorMessage?: string;
}

const LargeCheckBox = ({ checked }: { checked: boolean }) => (
  <span
    aria-hidden
    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border-[3px] transition-colors ${
      checked ? 'border-[#FF8A3D] bg-[#FF8A3D]' : 'border-gray-200 bg-gray-200'
    }`}
  >
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
      <path
        d="M4 10l4 4 8-8"
        stroke="white"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

const LargeTermsAgreement = ({
  value,
  terms,
  onChange,
  onBack,
  onSubmit,
  isLoading = false,
  isSubmitting = false,
  errorMessage = '',
}: LargeTermsAgreementProps) => {
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
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-h-full flex-col pt-9">
          <h1 className="text-center text-[31px] font-extrabold leading-[1.25] tracking-[-0.055em] text-[#172033]">
            약관에 동의해 주세요
          </h1>
          <p className="mb-5 mt-4 text-center text-[25px] font-extrabold leading-[1.45] tracking-[-0.055em] text-[#FF8A3D]">
            아래 내용을 확인하고
            <br />
            동의해 주세요
          </p>

          <button
            type="button"
            onClick={toggleAll}
            disabled={isLoading || terms.length === 0}
            className="flex min-h-[78px] w-full items-center gap-4 rounded-[16px] border-[3px] border-[#F2BD76] bg-white px-5 text-left"
          >
            <LargeCheckBox checked={allChecked} />
            <span className="text-[25px] font-extrabold text-[#172033]">전체 동의</span>
          </button>

          <div className="mt-9 overflow-hidden rounded-[18px] border-[3px] border-[#F2BD76] bg-white px-4">
            {terms.map((term, index) => {
              const { termsVersionId, name, isRequired } = term;
              return (
                <div
                  key={termsVersionId}
                  className={`flex min-h-[80px] items-center gap-3 ${index > 0 ? 'border-t border-[#E2E5E9]' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(termsVersionId)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <LargeCheckBox checked={Boolean(value[termsVersionId])} />
                    <span className="min-w-0 break-keep text-[18px] font-extrabold leading-[1.25] tracking-[-0.055em] text-[#172033]">
                      [{isRequired ? '필수' : '선택'}] {name}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenTerm(term)}
                    className="shrink-0 rounded-full bg-[#FFE0B8] px-3 py-2 text-[17px] font-extrabold text-[#172033]"
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
              className={`mt-3 text-center text-[16px] font-bold ${errorMessage ? 'text-red-500' : 'text-[#7A8495]'}`}
            >
              {errorMessage || '약관 정보를 불러오고 있어요.'}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex shrink-0 gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex min-h-[72px] flex-1 items-center justify-center rounded-[18px] bg-[#FF8A3D] text-[29px] font-extrabold text-white"
        >
          이전
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!requiredChecked || isLoading || isSubmitting}
          className="flex min-h-[72px] flex-1 items-center justify-center rounded-[18px] bg-[#FF8A3D] text-[29px] font-extrabold text-white disabled:bg-[#DDDDDD]"
        >
          {isSubmitting ? '확인 중...' : '다음'}
        </button>
      </div>

      {openTerm && <TermsDetail term={openTerm} onClose={closeTermAndAgree} />}
    </>
  );
};

export default LargeTermsAgreement;
