import { useCallback, useEffect, useState } from 'react';
import { searchAddress } from '@/apis/address';
import type { AddressResult } from '@/apis/address';
import { primaryButton, secondaryButton } from './styles';

interface RoadAddressSearchPageProps {
  initialQuery: string;
  initialSelectedAddress: string;
  onBack: () => void;
  onConfirm: (address: AddressResult) => void;
}

type SearchStatus = 'loading' | 'results' | 'empty' | 'error';

const SearchIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
    <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const PinIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path
      d="M12 21s7-5.686 7-11a7 7 0 10-14 0c0 5.314 7 11 7 11z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const LoadingSpinner = () => (
  <span
    role="status"
    aria-label="주소 검색 중"
    className="h-[clamp(56px,9.14vh,72px)] w-[clamp(56px,9.14vh,72px)] animate-spin rounded-full border-[7px] border-[#FFB989] border-r-[#F97316] border-t-[#F97316]"
  />
);

const RoadAddressSearchPage = ({
  initialQuery,
  initialSelectedAddress,
  onBack,
  onConfirm,
}: RoadAddressSearchPageProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [searchedQuery, setSearchedQuery] = useState(initialQuery.trim());
  const [status, setStatus] = useState<SearchStatus>('loading');
  const [results, setResults] = useState<AddressResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<AddressResult | null>(null);
  const [page, setPage] = useState(1);
  const [isEnd, setIsEnd] = useState(true);
  const [total, setTotal] = useState(0);

  const runSearch = useCallback(
    async (searchQuery: string, nextPage: number) => {
      const trimmedQuery = searchQuery.trim();
      if (!trimmedQuery) return;

      setStatus('loading');
      if (nextPage === 1) {
        setSelectedResult(null);
        setSearchedQuery(trimmedQuery);
      }

      try {
        const [response] = await Promise.all([
          searchAddress(trimmedQuery, nextPage),
          new Promise((resolve) => window.setTimeout(resolve, 450)),
        ]);

        setResults((previous) =>
          nextPage === 1 ? response.results : [...previous, ...response.results]
        );
        setTotal(response.totalCount);
        setIsEnd(response.isEnd);
        setPage(nextPage);
        if (nextPage === 1 && initialSelectedAddress) {
          setSelectedResult(
            response.results.find((result) => result.roadAddress === initialSelectedAddress) ?? null
          );
        }
        setStatus(response.totalCount === 0 ? 'empty' : 'results');
      } catch {
        setResults([]);
        setStatus('error');
      }
    },
    [initialSelectedAddress]
  );

  useEffect(() => {
    void runSearch(initialQuery, 1);
  }, [initialQuery, runSearch]);

  const submitSearch = () => {
    if (!query.trim()) return;
    void runSearch(query, 1);
  };

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col pt-[clamp(4px,1.02vh,8px)]">
        <label
          htmlFor="road-address-search"
          className="mb-2 block shrink-0 font-[Pretendard] text-[clamp(22px,3.05vh,24px)] font-semibold text-[#2B2B2B]"
        >
          도로명 주소
        </label>

        <div className="flex h-[clamp(52px,7.11vh,56px)] shrink-0 items-center rounded-[18px] border-[clamp(3px,0.51vh,4px)] border-[#FED7AA] bg-white pl-3 pr-2 focus-within:border-[#F97316]">
          <SearchIcon className="h-[clamp(28px,4.57vh,36px)] w-[clamp(28px,4.57vh,36px)] shrink-0 text-[#613212]" />
          <input
            id="road-address-search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedResult(null);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submitSearch();
            }}
            placeholder="도로명 또는 건물명"
            className="min-w-0 flex-1 px-2 font-[Pretendard] text-[clamp(18px,2.79vh,22px)] font-medium text-[#2B2B2B] outline-none placeholder:text-[#9A9A9A]"
          />
          <button
            type="button"
            onClick={submitSearch}
            disabled={!query.trim() || status === 'loading'}
            className="flex h-[clamp(36px,5.08vh,40px)] shrink-0 items-center border-l border-[#F97316] pl-3 pr-1 font-[Pretendard] text-[clamp(21px,3.05vh,24px)] font-bold text-[#613212] disabled:opacity-45"
          >
            검색
          </button>
        </div>

        <div className="mt-3 min-h-0 flex-1 overflow-hidden rounded-[24px] bg-white shadow-[0_12px_28px_rgba(97,50,18,0.12)]">
          {status === 'loading' && (
            <div className="flex h-full min-h-[clamp(300px,48.22vh,380px)] flex-col items-center justify-center gap-[clamp(28px,4.57vh,36px)]">
              <LoadingSpinner />
              <p className="font-[Pretendard] text-[clamp(22px,3.55vh,28px)] font-bold text-[#2B2B2B]">
                검색 중입니다...
              </p>
            </div>
          )}

          {status === 'results' && (
            <div className="flex h-full min-h-0 flex-col">
              <p className="shrink-0 px-4 pb-2 pt-4 font-[Pretendard] text-[clamp(18px,2.79vh,22px)] font-semibold text-[#777777]">
                검색 결과 {total}건
              </p>
              <ul className="min-h-0 flex-1 overflow-y-auto px-3">
                {results.map((result, index) => {
                  const selected =
                    selectedResult?.roadAddress === result.roadAddress ||
                    (!selectedResult && initialSelectedAddress === result.roadAddress);

                  return (
                    <li
                      key={`${result.roadAddress}-${index}`}
                      className="border-b border-[#E3E3E3]"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedResult(result)}
                        aria-pressed={selected}
                        className={`flex min-h-[clamp(46px,6.6vh,52px)] w-full items-center gap-2 px-1 text-left transition-colors ${
                          selected ? 'bg-[#FFF3E6]' : 'hover:bg-[#FFF8F1]'
                        }`}
                      >
                        <PinIcon className="h-6 w-6 shrink-0 text-[#2B2B2B]" />
                        <span className="min-w-0 font-[Pretendard] text-[clamp(17px,2.54vh,20px)] font-medium text-[#2B2B2B]">
                          {result.roadAddress}
                          {result.buildingName ? ` (${result.buildingName})` : ''}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              {!isEnd && (
                <button
                  type="button"
                  onClick={() => void runSearch(searchedQuery, page + 1)}
                  className="flex h-[clamp(48px,7.11vh,56px)] shrink-0 items-center justify-center gap-2 border-t border-[#E3E3E3] font-[Pretendard] text-[clamp(18px,2.79vh,22px)] font-semibold text-[#777777]"
                >
                  더 많은 결과 보기
                  <span className="text-[24px] leading-none" aria-hidden>
                    ⌄
                  </span>
                </button>
              )}
            </div>
          )}

          {(status === 'empty' || status === 'error') && (
            <div className="flex h-full min-h-[clamp(300px,48.22vh,380px)] flex-col items-center justify-center text-center">
              <SearchIcon className="mb-7 h-[clamp(52px,8.12vh,64px)] w-[clamp(52px,8.12vh,64px)] text-[#EF4444]" />
              <p className="font-[Pretendard] text-[clamp(22px,3.55vh,28px)] font-bold text-[#2B2B2B]">
                {status === 'empty' ? '검색 결과가 없습니다.' : '검색에 실패했어요.'}
              </p>
              <p className="mt-2 font-[Pretendard] text-[clamp(17px,2.54vh,20px)] font-medium leading-[1.4] text-[#888888]">
                {status === 'empty' ? (
                  <>
                    도로명 또는 건물명을
                    <br />
                    다시 입력해 주세요
                  </>
                ) : (
                  '잠시 후 다시 검색해 주세요'
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 gap-3 pt-4">
        <button type="button" onClick={onBack} className={secondaryButton}>
          이전
        </button>
        <button
          type="button"
          onClick={() => selectedResult && onConfirm(selectedResult)}
          disabled={!selectedResult || status !== 'results'}
          className={primaryButton}
        >
          다음
        </button>
      </div>
    </>
  );
};

export default RoadAddressSearchPage;
