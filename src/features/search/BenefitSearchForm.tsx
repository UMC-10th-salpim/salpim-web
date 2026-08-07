import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Dropdown from '@/components/common/Dropdown/Dropdown';
import { benefitApi } from '@/apis/benefit';
import type { Region } from '@/apis/region';

const INTERESTS = ['건강·의료', '생활비·요금', '돌봄·생활', '주거 지원', '일자리·활동', '문화·배움'];

const INTEREST_CATEGORY_ID_MAP: Record<string, number> = {
  '건강·의료': 1,
  '생활비·요금': 2,
  '돌봄·생활': 3,
  '주거 지원': 4,
  '일자리·활동': 5,
  '문화·배움': 6,
};

type Sort = 'popular' | 'deadline' ;

const BenefitSearchForm = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState<Region | null>(null);
  const [district, setDistrict] = useState<Region | null>(null);
  const [isRegionPickerOpen, setIsRegionPickerOpen] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>('popular');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const regionIds = city && district ? [city.regionId, district.regionId] : null;

  const categoryIds = interests
    .map((interest) => INTEREST_CATEGORY_ID_MAP[interest])
    .filter((id): id is number => id !== undefined);

  const handleConditionSearch = async () => {
    if (!regionIds) {
      alert('지역을 선택해 주세요.');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await benefitApi.searchBenefits({
        searchKey: keyword.trim() || undefined,
        regionIds,
        categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
        sort,
      });
      navigate('/benefits', {state: { source : 'search', keyword, regionIds, categoryIds, sort, searchResult : result},
      });
    } catch (error) {
      console.error('혜택 검색 실패', error);
      navigate('/benefits', { state: { source: 'search', keyword, regionIds, categoryIds, sort } });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev)=>
      prev.includes(interest)
      ? prev.filter((item)=>item !== interest)
      : [...prev, interest]
    );
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-[#FAF8F3] p-4 pb-26 gap-[10px]">
      {/* 탭 */}
      <div className="flex justify-center gap-4 pb-4 mx-11">
        <button
          className="rounded-full px-4 py-3 text-xl font-semibold border border-[#FFD7AA] border-3 text-[#FF8A3D]"
          onClick={() => navigate('/survey')}
        >
          살피미 추천
        </button>
        <button className="rounded-full w-33 px-4 py-3 text-xl font-semibold bg-[#FF8A3D] text-white">
          직접 찾기
        </button>
      </div>

      {/*이름 직접 검색*/}
      <div className="flex flex-col">
        <span className="text-2xl font-extrabold text-[#613212] pl-6 mb-2">혜택 이름 직접 검색</span>
        <div className="flex items-center gap-2 border border-3 border-[#FF8A3D] rounded-full bg-[#FBE3BF] px-4 py-4">
          <input
            value={keyword}
            onChange={(e)=>setKeyword(e.target.value)}
            onKeyDown={(e)=> {
              if (e.key === 'Enter') handleConditionSearch();
            }}
            placeholder='찾고 싶은 혜택을 입력해보세요'
            className="flex-1 min-w-0 bg-transparent text-xl text-[#613212] outline-none placeholder:text-[#FF8A3D] placeholder:font-medium"
          />
          <img src="/icons/search.png" alt="검색" className={`w-8 h-8 shrink-0 ${isSubmitting ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`} onClick={handleConditionSearch}/>
        </div>
      </div>

      {/*원하는 조건 선택*/}
      <div className='flex flex-col gap-4'>
        <span className="pl-6 font-extrabold text-2xl text-[#613212]">원하는 조건 선택</span>
        {/*지역*/}
        <div className='flex items-baseline gap-[2px] pl-6'>
          <img src='/icons/location.png' className='w-6 h-6 self-center'/>
          <span className="font-semibold text-base text-[#FF8A3D]">지역</span>
          <span className="font-semibold text-xs text-[#EF4444]">※필수</span>
        </div>

        {/*지역 선택 드롭다운*/}
        <div className='relative z-30'>
          <button
            type="button"
            className="w-full rounded-2xl border border-4 border-[#FED7AA] bg-[#FAFAFA] px-6 py-4 flex items-center justify-between"
            onClick={() => setIsRegionPickerOpen(true)}
          >
            <span className={city ? 'text-[#613212]' : 'text-gray-400'}>
              {city && district ? `${city.regionName} ${district.regionName}` : '지역을 선택해 주세요'}
            </span>
            <img src='/icons/dropdown.png'/>
          </button>

          <Dropdown
            isOpen={isRegionPickerOpen}
            initialCity={city}
            initialDistrict={district}
            onConfirm={(newCity, newDistrict) => {
              setCity(newCity);
              setDistrict(newDistrict);
              setIsRegionPickerOpen(false);
            }}
            onCancel={() => setIsRegionPickerOpen(false)}
          />
        </div>
        
        {/*관심 분야*/}
        <div className='pt-[14px]'>
          <div className='flex items-center gap-[2px] pl-6'>
            <img src='/icons/interest.png' className='w-6 h-6'/>
            <span className='font-semibold text-base text-[#FF8A3D]'>관심 분야</span>
          </div>
          <div className='flex flex-wrap gap-3 pt-2'>
            {INTERESTS.map((interest)=> {
              const isSelected = interests.includes(interest);
              return (
                <button
                  key={interest}
                  type='button'
                  onClick={()=> toggleInterest(interest)}
                  className={`rounded-full border border-4 px-4 py-[14px] text-xl font-bold transition-colors ${
                    isSelected
                      ? 'border-[#FF8A3D] bg-[#FF8A3D] text-white'
                      : 'border-[#FFD7AA] bg-[#FAF8F3] text-[#613212]'
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        {/*정렬*/}
        <div className='flex gap-2 mx-2'>
          <button
            type='button'
            onClick={()=> setSort('popular')}
            className={`rounded-full border border-3 px-3 py-3 text-xl font-semibold transition-colors ${
              sort === 'popular'
                ? 'border-[#FF8A3D] bg-[#FF8A3D] text-white'
                : 'border-[#FFD7AA] bg-[#FAF8F3] text-[#FF8A3D]'
              }`}
          >
            인기 순서대로 보기
          </button>
          <button
            type='button'
            onClick={()=>setSort('deadline')}
            className={`rounded-full border border-3 px-3 py-3 text-xl font-semibold transition-colors ${
              sort === 'deadline'
                ? 'border-[#FF8A3D] bg-[#FF8A3D] text-white'
                : 'border-[#FFD7AA] bg-[#FAF8F3] text-[#FF8A3D]'
            }`}
          >
            마감 순서대로 보기
          </button>
        </div>

        {/*결과 확인*/}
        <button 
          type='button'
          onClick={handleConditionSearch}
           disabled={!regionIds || isSubmitting}
          className={`rounded-full py-[14px] px-[81.5px] text-3xl font-semibold mx-[14.5px] transition-colors ${
            regionIds && !isSubmitting
            ? 'bg-[#FF8A3D] text-white'
            : 'bg-[#DDDDDD] text-[#FAF8F3] cursor-not-allowed'
          }`}
        >
          {isSubmitting ? '찾는 중...':'결과 확인하기'}
        </button>
      </div>
    </div>
  );
};

export default BenefitSearchForm;