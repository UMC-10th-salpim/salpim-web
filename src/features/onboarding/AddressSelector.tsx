import { useState } from 'react';
import type { AddressResult } from '@/apis/address';
import RoadAddressSearchPage from './RoadAddressSearchPage';
import { inputStyle, labelStyle, primaryButton, secondaryButton } from './styles';

export interface AddressInfo {
  roadAddress: string;
  detail: string;
  city: string;
  district: string;
  eupMyeonDong: string;
}

interface AddressSelectorProps {
  value: AddressInfo;
  onChange: (address: AddressInfo) => void;
  onBack: () => void;
  onNext: () => void;
  onUseCurrentLocation?: () => void;
}

const SearchIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
    <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const LocationIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="4" fill="currentColor" />
    <path
      d="M12 1v3M12 20v3M1 12h3M20 12h3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const AddressSelector = ({
  value,
  onChange,
  onBack,
  onNext,
  onUseCurrentLocation,
}: AddressSelectorProps) => {
  const [query, setQuery] = useState(value.roadAddress);
  const [isSearchPageOpen, setIsSearchPageOpen] = useState(false);

  const isValid = value.roadAddress.trim() !== '' && value.detail.trim() !== '';

  const openSearchPage = () => {
    if (!query.trim()) return;
    setIsSearchPageOpen(true);
  };

  const confirmAddress = (address: AddressResult) => {
    onChange({
      roadAddress: address.roadAddress,
      detail: address.roadAddress === value.roadAddress ? value.detail : '',
      city: address.city,
      district: address.district,
      eupMyeonDong: address.eupMyeonDong,
    });
    setQuery(address.roadAddress);
    setIsSearchPageOpen(false);
  };

  if (isSearchPageOpen) {
    return (
      <RoadAddressSearchPage
        initialQuery={query}
        initialSelectedAddress={value.roadAddress}
        onBack={() => setIsSearchPageOpen(false)}
        onConfirm={confirmAddress}
      />
    );
  }

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-col pb-2 pt-[clamp(6px,1.02vh,8px)]">
          <h1 className="mb-6 text-center text-[clamp(26px,3.68vh,29px)] font-bold text-[#613212]">
            우리집을 설정해 주세요!
          </h1>

          {/* 안내 */}
          <div className="relative mb-[clamp(4px,0.76vh,6px)] h-[clamp(88px,12.18vh,96px)] w-full translate-y-[clamp(40px,6.35vh,50px)]">
            <img
              src="/assets/Salpimi/Search.png"
              alt="살피미"
              className="absolute -left-[clamp(12px,4vw,15px)] top-[calc(50%-clamp(36px,5.71vh,45px))] z-10 h-[clamp(96px,14.21vh,112px)] w-[clamp(96px,14.21vh,112px)] -translate-y-1/2 scale-x-[-1] object-contain"
            />
            <div className="absolute left-1/2 top-1/2 flex h-[clamp(88px,12.18vh,96px)] w-[clamp(280px,82.67vw,310px)] -translate-x-1/2 -translate-y-1/2 items-center rounded-2xl bg-brand-100 pl-[clamp(60px,18.13vw,68px)] pr-4 font-[Pretendard] text-[clamp(18px,2.54vh,20px)] font-medium leading-[1.35] text-black">
              주소로 내 지역 혜택과
              <br />
              근처 복지 시설을 찾아 드려요.
            </div>
          </div>

          {/* 현재 위치 자동 설정 */}
          <button
            type="button"
            onClick={onUseCurrentLocation}
            className="mx-auto flex h-[clamp(60px,8.88vh,70px)] w-[clamp(280px,82.67vw,310px)] translate-y-[clamp(40px,6.35vh,50px)] items-center justify-center gap-2 rounded-2xl border-[clamp(1px,0.254vh,2px)] border-[#FFB86B] bg-[#FFE3C2] py-0 font-[Pretendard] text-[clamp(20px,3.05vh,24px)] font-semibold text-[#8B5A2B] transition-colors hover:bg-[#FFDBB2]"
          >
            <LocationIcon className="h-6 w-6 shrink-0 text-[#8B5A2B]" />
            현재 위치로 자동 설정
          </button>
          <p className="mb-[clamp(50px,7.61vh,60px)] mt-[clamp(8px,1.27vh,10px)] flex w-full translate-y-[clamp(40px,6.35vh,50px)] justify-center text-center font-[Pretendard] text-[clamp(16px,2.54vh,20px)] font-semibold text-black">
            또는 직접 입력하기
          </p>

          {/* 도로명 주소 검색 */}
          <label className={labelStyle}>도로명 주소</label>
          <div className="flex items-center gap-2 rounded-2xl border-[clamp(3px,0.51vh,4px)] border-[#FED7AA] bg-white px-4 py-3.5 focus-within:border-[#FED7AA]">
            <SearchIcon className="h-[clamp(30px,4.57vh,36px)] w-[clamp(30px,4.57vh,36px)] shrink-0 text-[#613212]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') openSearchPage();
              }}
              placeholder="도로명 주소 입력"
              className="min-w-0 flex-1 text-2xl text-gray-900 outline-none placeholder:text-gray-400"
              aria-label="도로명 주소 검색"
            />
            <button
              type="button"
              onClick={openSearchPage}
              disabled={!query.trim()}
              className="flex h-[clamp(30px,4.57vh,36px)] shrink-0 items-center text-2xl font-bold text-[#613212]"
            >
              검색
            </button>
          </div>

          {/* 상세 주소 (주소 선택 후 노출) */}
          {value.roadAddress && (
            <div className="mt-5">
              <label htmlFor="detail" className={labelStyle}>
                상세 주소
              </label>
              <textarea
                id="detail"
                rows={2}
                className={`${inputStyle} resize-none !border-[clamp(3px,0.51vh,4px)] !border-[#FED7AA] !font-[Inter] !text-[clamp(20px,3.05vh,24px)] !font-medium !leading-[1.35] focus:!border-[#FED7AA] placeholder:!font-[Inter] placeholder:!text-[clamp(20px,3.05vh,24px)] placeholder:!font-medium placeholder:!text-[#613212] placeholder:!opacity-40`}
                value={value.detail}
                onChange={(event) => onChange({ ...value, detail: event.target.value })}
                placeholder={'건물명, 동/호수 등\n상세 주소를 입력해주세요.'}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 gap-3 pt-4">
        <button type="button" onClick={onBack} className={secondaryButton}>
          이전
        </button>
        <button type="button" onClick={onNext} disabled={!isValid} className={primaryButton}>
          다음
        </button>
      </div>
    </>
  );
};

export default AddressSelector;
