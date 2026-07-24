import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import Chip from '@/components/common/Chip/Chip';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';

const INTERESTS = ['건강·의료', '생활비·요금', '돌봄·생활', '주거 지원', '일자리·활동', '문화·배움'];

const REGIONS = [
  '서울특별시',
  '부산광역시',
  '대구광역시',
  '인천광역시',
  '광주광역시',
  '대전광역시',
  '울산광역시',
  '세종특별자치시',
  '경기도',
  '강원특별자치도',
  '충청북도',
  '충청남도',
  '전북특별자치도',
  '전라남도',
  '경상북도',
  '경상남도',
  '제주특별자치도',
];

type Mode = 'recommend' | 'direct';
type Sort = 'popular' | 'deadline';

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-gray-500">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
    <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-brand-500">
    <path d="M12 21s7-5.686 7-11a7 7 0 10-14 0c0 5.314 7 11 7 11z" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const modePill = (active: boolean) =>
  `rounded-full px-5 py-2 text-base font-bold transition-colors ${
    active ? 'bg-brand-500 text-white' : 'border border-brand-300 bg-white text-brand-500'
  }`;

const BenefitSearchPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('direct');
  const [keyword, setKeyword] = useState('');
  const [region, setRegion] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>('popular');

  const toggleInterest = (interest: string) =>
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((item) => item !== interest) : [...prev, interest],
    );

  // TODO: 검색 조건을 결과 페이지로 전달 (쿼리스트링/스토어)
  const goResults = () => navigate('/benefits');

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-white pb-24">
      <HeaderBar title="혜택 안내" onBack={() => navigate(-1)} />

      <div className="flex flex-col gap-6 px-5 pt-2">
        {/* 추천 방식 토글 */}
        <div className="flex justify-center gap-3">
          <button type="button" onClick={() => navigate('/survey')} className={modePill(mode === 'recommend')}>
            살피미 추천
          </button>
          <button type="button" onClick={() => setMode('direct')} className={modePill(mode === 'direct')}>
            직접 찾기
          </button>
        </div>

        {/* 이름 직접 검색 */}
        <div>
          <h2 className="mb-2 text-lg font-bold text-gray-900">혜택 이름 직접 검색</h2>
          <div className="flex items-center gap-2 rounded-2xl border border-brand-300 bg-brand-50 px-4 py-3.5 focus-within:border-brand-500">
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="찾고 싶은 혜택을 입력해 보세요"
              className="min-w-0 flex-1 bg-transparent text-base text-gray-900 outline-none placeholder:text-brand-400"
              aria-label="혜택 이름 검색"
            />
            <SearchIcon />
          </div>
        </div>

        {/* 조건 선택 */}
        <div>
          <h2 className="mb-3 text-lg font-bold text-gray-900">원하는 조건 선택</h2>

          {/* 지역 */}
          <div className="mb-2 flex items-center gap-1 text-base font-bold text-brand-500">
            <PinIcon />
            지역
          </div>
          <select
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            className={`w-full rounded-2xl border border-brand-200 bg-white px-4 py-3.5 text-base outline-none focus:border-brand-500 ${
              region ? 'text-gray-900' : 'text-gray-400'
            }`}
            aria-label="지역 선택"
          >
            <option value="">지역을 선택해 주세요</option>
            {REGIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {/* 관심 분야 */}
          <div className="mb-3 mt-6 flex items-center gap-1 text-base font-bold text-brand-500">
            <SearchIcon />
            관심 분야
          </div>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((interest) => (
              <Chip
                key={interest}
                label={interest}
                selected={interests.includes(interest)}
                onClick={() => toggleInterest(interest)}
              />
            ))}
          </div>

          {/* 정렬 */}
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip label="인기 순서대로 보기" selected={sort === 'popular'} onClick={() => setSort('popular')} />
            <Chip label="마감 순서대로 보기" selected={sort === 'deadline'} onClick={() => setSort('deadline')} />
          </div>
        </div>

        <button
          type="button"
          onClick={goResults}
          className="rounded-2xl bg-brand-500 py-4 text-lg font-bold text-white transition-colors hover:bg-brand-600"
        >
          결과 확인하기
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default BenefitSearchPage;
