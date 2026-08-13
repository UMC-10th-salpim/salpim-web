import { useEffect, useRef, useState } from 'react';
import OnboardingHeaderBar from './ui/OnboardingHeaderBar';
import { authApi, getApiErrorMessage } from '@/apis/auth';
import type { SignupTerm, SignupTermDetail } from '@/apis/auth';

type TermsContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] };

const TABLE_DIVIDER_PATTERN = /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/;

const parseTableRow = (line: string) =>
  line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());

const parseTermsContent = (content: string): TermsContentBlock[] => {
  const lines = content.replace(/\r\n?/g, '\n').split('\n');
  const blocks: TermsContentBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    if (!lines[index].trim()) {
      index += 1;
      continue;
    }

    if (
      lines[index].trim().startsWith('|') &&
      index + 1 < lines.length &&
      TABLE_DIVIDER_PATTERN.test(lines[index + 1].trim())
    ) {
      const headers = parseTableRow(lines[index]);
      const rows: string[][] = [];
      index += 2;

      while (index < lines.length && lines[index].trim().startsWith('|')) {
        rows.push(parseTableRow(lines[index]));
        index += 1;
      }

      blocks.push({ type: 'table', headers, rows });
      continue;
    }

    if (/^-\s+/.test(lines[index].trim())) {
      const items: string[] = [];
      while (index < lines.length && /^-\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^-\s+/, ''));
        index += 1;
      }
      blocks.push({ type: 'list', items });
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !(
        lines[index].trim().startsWith('|') &&
        index + 1 < lines.length &&
        TABLE_DIVIDER_PATTERN.test(lines[index + 1].trim())
      ) &&
      !/^-\s+/.test(lines[index].trim())
    ) {
      paragraphLines.push(lines[index]);
      index += 1;
    }
    blocks.push({ type: 'paragraph', text: paragraphLines.join('\n') });
  }

  return blocks;
};

const TermsClauseContent = ({ content }: { content: string }) => (
  <div className="space-y-4 text-base font-medium leading-7 text-gray-800">
    {parseTermsContent(content).map((block, blockIndex) => {
      if (block.type === 'table') {
        return (
          <div
            key={`table-${blockIndex}`}
            className="w-full overflow-hidden rounded-xl border-2 border-brand-200 bg-white"
          >
            <table className="w-full table-fixed border-collapse text-left text-[12px] sm:text-sm">
              <colgroup>
                <col className="w-[26%]" />
                <col className="w-[48%]" />
                <col className="w-[26%]" />
              </colgroup>
              <thead className="bg-brand-100">
                <tr>
                  {block.headers.map((header, headerIndex) => (
                    <th
                      key={`${header}-${headerIndex}`}
                      scope="col"
                      className="break-keep border-b-2 border-r border-brand-200 px-1.5 py-2.5 text-center font-bold leading-[1.35] text-gray-900 last:border-r-0 sm:px-3 sm:py-3 sm:leading-5"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={`row-${rowIndex}`} className="even:bg-brand-50/60">
                    {block.headers.map((_, cellIndex) => (
                      <td
                        key={`cell-${rowIndex}-${cellIndex}`}
                        className="break-words border-b border-r border-brand-100 px-1.5 py-2.5 align-top font-medium leading-[1.55] text-gray-800 last:border-r-0 sm:px-3 sm:py-3 sm:leading-6"
                      >
                        {row[cellIndex] ?? ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      if (block.type === 'list') {
        return (
          <ul key={`list-${blockIndex}`} className="space-y-2 pl-5">
            {block.items.map((item, itemIndex) => (
              <li key={`${item}-${itemIndex}`} className="list-disc pl-1">
                {item}
              </li>
            ))}
          </ul>
        );
      }

      return (
        <p key={`paragraph-${blockIndex}`} className="whitespace-pre-line">
          {block.text}
        </p>
      );
    })}
  </div>
);

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
            <TermsClauseContent content={clause.content} />
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
