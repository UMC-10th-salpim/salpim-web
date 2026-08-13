import { useEffect, useRef, useState } from 'react';
import OnboardingHeaderBar from './ui/OnboardingHeaderBar';
import { TERMS_CONTENT } from './termsContent';
import type { TermKey } from './termsContent';

interface TermsDetailProps {
  termKey: TermKey;
  onClose: () => void;
}

const TermsDetail = ({ termKey, onClose }: TermsDetailProps) => {
  const content = TERMS_CONTENT[termKey];
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hasMoreContent, setHasMoreContent] = useState(false);

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
  }, [termKey]);

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
      <OnboardingHeaderBar title={content.title} onBack={onClose} />

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
        {content.intro && (
          <p className="mb-6 text-base font-medium leading-7 text-gray-800">{content.intro}</p>
        )}

        {/* 조항형 (서비스 이용 약관) */}
        {content.articles?.map((article) => (
          <section key={article.heading} className="mb-6">
            <h2 className="mb-2 text-lg font-bold text-gray-900">{article.heading}</h2>
            {article.paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-1.5 text-base font-medium leading-7 text-gray-800">
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        {/* 표형 (개인정보/민감정보/위치정보 동의) */}
        {content.table && (
          <table className="w-full table-fixed border-collapse overflow-hidden rounded-xl border-[3px] border-gray-200 text-base">
            <thead>
              <tr className="bg-brand-50">
                {content.table.columns.map((column) => (
                  <th
                    key={column}
                    className="border-[3px] border-gray-200 px-2 py-3 text-center font-bold text-gray-900"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {content.table.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="border-[3px] border-gray-200 px-2 py-3 text-center font-medium leading-7 text-gray-800"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 안내 문구 */}
        {content.notes && (
          <ul className="mt-4 space-y-1.5">
            {content.notes.map((note, index) => (
              <li key={index} className="flex gap-1 text-sm leading-6 text-gray-500">
                <span aria-hidden>※</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        )}
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
