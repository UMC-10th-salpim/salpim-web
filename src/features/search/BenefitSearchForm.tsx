import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Dropdown from '@/components/common/Dropdown/Dropdown';

const INTERESTS = ['건강·의료', '생활비·요금', '돌봄·생활', '주거 지원', '일자리·활동', '문화·배움'];
type Sort = 'popular' | 'deadline' | null;
const BenefitSearchForm = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    if (!keyword.trim()) return;
    navigate('/benefits', {state: { source : 'search', keyword}});
  }

  const handleConditionSearch = () => {
    if (!city || !district) {
      alert('지역을 선택해 주세요.');
      return;
    }
    navigate('/benefits', {
      state: {
        source : 'search',
        city,
        district,
        interests,
        sort,
      }
    })
  }

  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [isRegionPickerOpen, setIsRegionPickerOpen] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>(null);

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
              if (e.key === 'Enter') handleSearch();
            }}
            placeholder='찾고 싶은 혜택을 입력해보세요'
            className="flex-1 min-w-0 bg-transparent text-xl text-[#613212] outline-none placeholder:text-[#FF8A3D] placeholder:font-medium"
          />
          <img src="/icons/search.png" alt="검색" className='w-8 h-8 shrink-0 cursor-pointer' onClick={handleSearch}/>
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
              {city && district ? `${city} ${district}` : '지역을 선택해 주세요'}
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
            onClick={()=> setSort(sort === 'popular' ? null : 'popular')}
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
            onClick={()=>setSort(sort === 'deadline' ? null : 'deadline')}
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
          className='rounded-full bg-[#FF8A3D] py-[14px] px-[81.5px] text-3xl font-semibold text-white mx-[14.5px]'
        >
          결과 확인하기
        </button>
      </div>
    </div>
  );
};

export default BenefitSearchForm;