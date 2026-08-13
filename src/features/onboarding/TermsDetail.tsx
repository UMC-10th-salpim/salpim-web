import { useEffect, useRef, useState } from 'react';
import OnboardingHeaderBar from './ui/OnboardingHeaderBar';
import { authApi, getApiErrorMessage } from '@/apis/auth';
import type { SignupTerm, SignupTermDetail } from '@/apis/auth';

interface TermsDetailProps {
  term?: SignupTerm;
  termCode?: SignupTerm['code'];
  onClose: () => void;
}

const TermsDetail = ({ term, termCode, onClose }: TermsDetailProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hasMoreContent, setHasMoreContent] = useState(false);
  const [detail, setDetail] = useState<SignupTermDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isActive = true;
    setDetail(null);
    setIsLoading(true);
    setErrorMessage('');

    const loadDetail = async () => {
      const selectedTerm =
        term ?? (await authApi.getSignupTerms()).find(({ code }) => code === termCode);

      if (!selectedTerm) throw new Error('약관 정보를 찾을 수 없습니다.');
      return authApi.getSignupTermDetail(selectedTerm.termsVersionId);
    };

    void loadDetail()
      .then((loadedDetail) => {
        if (isActive) setDetail(loadedDetail);
      })
      .catch((error) => {
        if (!isActive) return;
        setErrorMessage(
          getApiErrorMessage(error, '약관 상세 내용을 불러오지 못했어요. 다시 시도해 주세요.')
        );
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [retryCount, term, termCode]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const updateHasMoreContent = () => {
      const remainingScroll =
        scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight;
      setHasMoreContent(remainingScroll > 8);
    };

    scrollContainer.scrollTop = 0;
    updateHasMoreContent();

    const resizeObserver = new ResizeObserver(updateHasMoreContent);
    resizeObserver.observe(scrollContainer);
    window.addEventListener('resize', updateHasMoreContent);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHasMoreContent);
    };
  }, [detail]);

  const scrollToNextContent = () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    scrollContainer.scrollBy({
      top: Math.max(180, scrollContainer.clientHeight * 0.7),
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-md flex-col bg-[#FAF8F3] pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
      <OnboardingHeaderBar title={detail?.name || term?.name || '이용약관'} onBack={onClose} />

      <div
        ref={scrollContainerRef}
        onScroll={() => {
          const scrollContainer = scrollContainerRef.current;
          if (!scrollContainer) return;
          const remainingScroll =
            scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight;
          setHasMoreContent(remainingScroll > 8);
        }}
        className="min-h-0 flex-1 overflow-y-auto bg-[#FAF8F3] px-5 pb-24"
      >
        {isLoading && (
          <p className="py-16 text-center text-base font-semibold text-gray-500">
            약관 내용을 불러오고 있어요.
          </p>
        )}

        {!isLoading && errorMessage && (
          <div className="py-16 text-center">
            <p role="alert" className="text-base font-semibold leading-7 text-gray-600">
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="mt-5 rounded-xl bg-brand-500 px-6 py-3 text-base font-semibold text-white"
            >
              다시 시도
            </button>
          </div>
        )}

        {detail?.clauses.map((clause) => (
          <section key={`${clause.clauseNo}-${clause.displayOrder}`} className="mb-6">
            <h2 className="mb-2 text-lg font-bold text-gray-900">
              제{clause.clauseNo}조 ({clause.title})
            </h2>
            <p className="whitespace-pre-line text-base font-medium leading-7 text-gray-800">
              {clause.content}
            </p>
          </section>
        ))}
      </div>

      {hasMoreContent && (
        <button
          type="button"
          onClick={scrollToNextContent}
          aria-label="약관 내용 더 보기"
          className="absolute bottom-[max(18px,env(safe-area-inset-bottom))] left-1/2 z-20 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border-2 border-brand-200 bg-[#FAF8F3] text-brand-500 shadow-[0_4px_12px_rgba(97,50,18,0.16)] transition-transform active:scale-95"
        >
          <svg aria-hidden viewBox="0 0 24 24" fill="none" className="h-8 w-8">
            <path
              d="m6 9 6 6 6-6"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default TermsDetail;
