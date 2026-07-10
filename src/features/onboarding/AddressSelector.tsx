import { useState } from 'react';
import { searchAddress } from '@/apis/address';
import type { AddressResult } from '@/apis/address';
import { inputStyle, labelStyle, primaryButton } from './styles';

export interface AddressInfo {
  roadAddress: string;
  detail: string;
}

interface AddressSelectorProps {
  value: AddressInfo;
  onChange: (address: AddressInfo) => void;
  onNext: () => void;
  onUseCurrentLocation?: () => void;
}

type SearchStatus = 'idle' | 'loading' | 'results' | 'empty' | 'error';

const SearchIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
    <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const PinIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 21s7-5.686 7-11a7 7 0 10-14 0c0 5.314 7 11 7 11z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const AddressSelector = ({
  value,
  onChange,
  onNext,
  onUseCurrentLocation,
}: AddressSelectorProps) => {
  const [query, setQuery] = useState(value.roadAddress);
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [results, setResults] = useState<AddressResult[]>([]);
  const [page, setPage] = useState(1);
  const [isEnd, setIsEnd] = useState(true);
  const [total, setTotal] = useState(0);

  const isValid = value.roadAddress.trim() !== '' && value.detail.trim() !== '';

  const runSearch = async (nextPage: number) => {
    const q = query.trim();
    if (!q) return;
    setStatus('loading');
    try {
      const res = await searchAddress(q, nextPage);
      setResults((prev) => (nextPage === 1 ? res.results : [...prev, ...res.results]));
      setTotal(res.totalCount);
      setIsEnd(res.isEnd);
      setPage(nextPage);
      setStatus(res.totalCount === 0 ? 'empty' : 'results');
    } catch {
      setStatus('error');
    }
  };

  const selectResult = (addr: string) => {
    onChange({ ...value, roadAddress: addr });
    setQuery(addr);
    setResults([]);
    setStatus('idle');
  };

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-col py-2">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
            우리집을 설정해 주세요!
          </h1>

          {/* 안내 */}
          <div className="mb-6 flex items-center gap-3">
            <img src="/assets/Salpimi/Search.png" alt="살피미" className="w-20 shrink-0" />
            <div className="flex-1 rounded-2xl bg-brand-100 px-4 py-3 text-sm font-medium leading-6 text-brand-700">
              주소로 내 지역 혜택과
              <br />
              근처 복지 시설을 찾아 드려요.
            </div>
          </div>

          {/* 현재 위치 자동 설정 */}
          <button
            type="button"
            onClick={onUseCurrentLocation}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-brand-300 bg-brand-50 py-4 text-base font-bold text-brand-600 transition-colors hover:bg-brand-100"
          >
            <span aria-hidden>◎</span>
            현재 위치로 자동 설정
          </button>
          <p className="mb-6 mt-3 text-center text-sm text-gray-400">또는 직접 입력하기</p>

          {/* 도로명 주소 검색 */}
          <label className={labelStyle}>도로명 주소</label>
          <div className="flex items-center gap-2 rounded-2xl border border-brand-200 bg-white px-4 py-3.5 focus-within:border-brand-500">
            <SearchIcon className="h-5 w-5 shrink-0 text-gray-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') runSearch(1);
              }}
              placeholder="도로명 주소를 입력해 주세요"
              className="min-w-0 flex-1 text-base text-gray-900 outline-none placeholder:text-gray-400"
              aria-label="도로명 주소 검색"
            />
            <button
              type="button"
              onClick={() => runSearch(1)}
              className="shrink-0 text-base font-bold text-brand-500"
            >
              검색
            </button>
          </div>

          {/* 로딩 */}
          {status === 'loading' && (
            <div className="mt-3 flex flex-col items-center gap-4 rounded-2xl border border-brand-200 bg-white py-14">
              <span className="h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500" />
              <span className="text-base font-bold text-gray-700">검색 중입니다...</span>
            </div>
          )}

          {/* 검색 결과 */}
          {status === 'results' && (
            <div className="mt-3 rounded-2xl border border-brand-200 bg-white p-2">
              <p className="px-2 py-2 text-sm text-gray-500">검색 결과 {total}건</p>
              <ul>
                {results.map((result, index) => {
                  const selected = value.roadAddress === result.roadAddress;
                  return (
                    <li key={`${result.roadAddress}-${index}`}>
                      <button
                        type="button"
                        onClick={() => selectResult(result.roadAddress)}
                        className={`flex w-full items-start gap-2 rounded-xl px-2 py-2.5 text-left text-sm transition-colors ${
                          selected ? 'bg-brand-50' : 'hover:bg-brand-50'
                        }`}
                      >
                        <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                        <span className="text-gray-800">
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
                  onClick={() => runSearch(page + 1)}
                  className="mt-1 flex w-full items-center justify-center gap-1 border-t border-brand-100 py-3 text-sm text-gray-500"
                >
                  더 많은 결과 보기 <span aria-hidden>˅</span>
                </button>
              )}
            </div>
          )}

          {/* 결과 없음 */}
          {status === 'empty' && (
            <div className="mt-3 flex flex-col items-center gap-2 rounded-2xl border border-brand-200 bg-white py-12 text-center">
              <SearchIcon className="mb-1 h-9 w-9 text-brand-500" />
              <p className="text-base font-bold text-gray-800">검색 결과가 없습니다.</p>
              <p className="text-sm leading-6 text-gray-400">
                도로명 또는 건물명을
                <br />
                다시 입력해 주세요
              </p>
            </div>
          )}

          {/* 오류 */}
          {status === 'error' && (
            <div className="mt-3 flex flex-col items-center gap-2 rounded-2xl border border-brand-200 bg-white py-12 text-center">
              <SearchIcon className="mb-1 h-9 w-9 text-brand-500" />
              <p className="text-base font-bold text-gray-800">검색에 실패했어요.</p>
              <p className="text-sm leading-6 text-gray-400">
                잠시 후 다시 시도해 주세요
              </p>
            </div>
          )}

          {/* 상세 주소 (주소 선택 후 노출) */}
          {value.roadAddress && status === 'idle' && (
            <div className="mt-5">
              <label htmlFor="detail" className={labelStyle}>
                상세 주소
              </label>
              <input
                id="detail"
                className={inputStyle}
                value={value.detail}
                onChange={(event) => onChange({ ...value, detail: event.target.value })}
                placeholder="상세 주소를 입력해 주세요"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 pt-4">
        <button type="button" onClick={onNext} disabled={!isValid} className={primaryButton}>
          다음
        </button>
      </div>
    </>
  );
};

export default AddressSelector;
