import { useEffect, useState } from 'react';

const REGIONS_DATA: Record<string, string[]> = {
  서울특별시: ['종로구', '중구', '용산구', '성동구', '광진구', '동대문구', '중랑구'],
  부산광역시: ['중구', '서구', '동구', '영도구', '부산진구', '동래구'],
  경기도: ['수원시', '성남시', '고양시', '용인시', '부천시', '안산시'],
};

interface RegionPickerModalProps {
  isOpen: boolean;
  initialCity: string;
  initialDistrict: string;
  onConfirm : (city: string, district: string) => void;
  onCancel: () => void;
}

export default function Dropdown({
  isOpen,
  initialCity,
  initialDistrict,
  onConfirm,
  onCancel,
}: RegionPickerModalProps) {
  const [tab, setTab] = useState<'city'|'district'>('city');
  const [draftCity, setDraftCity] = useState(initialCity);
  const [draftDistrict, setDraftDistrict] = useState(initialDistrict);

  // 열릴 때 마다 기존 값으로 초기화됨
  useEffect(()=>{
    if (isOpen) {
      setDraftCity(initialCity);
      setDraftDistrict(initialDistrict);
      setTab('city');
    }
  }, [isOpen, initialCity, initialDistrict]);

  if (!isOpen) return null;

  const districts = REGIONS_DATA[draftCity] ?? [];

  const handleCitySelect = (city: string) => {
  setDraftCity(city);
  setDraftDistrict('');
  setTab('district');
  };

  const handleDistrictSelect = (district: string) => {
    setDraftDistrict(district);
  };

  const handleConfirm = () => {
    onConfirm(draftCity, draftDistrict);
  };

  return (
<div className="absolute top-full left-0 mt-2 w-full rounded-4xl border-none bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] z-50 flex flex-col overflow-hidden max-h-[280px]">      {/* 탭 헤더 */}
      <div className="flex gap-[50px] px-12 py-[9px] border-b border-gray-200 shrink-0">
        <button
          type="button"
          className={`whitespace-nowrap flex-1 text-[32px] font-semibold ${
            tab === 'city' ? 'text-black' : 'text-gray-300'
          }`}
          onClick={() => setTab('city')}
        >
          시/도
        </button>
        <button
          type="button"
          className={`whitespace-nowrap text-[32px] font-semibold ${
            tab === 'district' ? 'text-black' : 'text-gray-300'
          }`}
          onClick={() => districts.length > 0 && setTab('district')}
          disabled={districts.length === 0}
        >
          시/군/구
        </button>
      </div>

      {/* 리스트 */}
      <div className="flex-1 overflow-y-auto max-h-[140px]">
        {tab === 'city'
          ? Object.keys(REGIONS_DATA).map((city) => (
              <div
                key={city}
                className={`cursor-pointer px-6 py-2 text-xl border-b border-gray-100 ${
                  draftCity === city ? 'bg-[#FFEDD5] font-medium' : ''
                }`}
                onClick={() => handleCitySelect(city)}
              >
                {city}
              </div>
            ))
          : districts.map((district) => (
              <div
                key={district}
                className={`cursor-pointer px-6 py-2 text-xl border-b border-gray-100 ${
                  draftDistrict === district ? 'bg-[#FFEDD5] font-medium' : ''
                }`}
                onClick={() => handleDistrictSelect(district)}
              >
                {district}
              </div>
            ))}
      </div>

      {/* 취소 / 확인 */}
      <div className="flex justify-end gap-2 py-2 pr-6 pl-[179px]">
        <button
          type="button"
          className="rounded-full border border-3 border-[#FFD7AA] px-4 py-2 text-xl font-semibold text-[#613212]"
          onClick={onCancel}
        >
          취소
        </button>
        <button
          type="button"
          className="rounded-full bg-[#FED7AA] px-4 py-2 text-xl font-semibold text-[#613212]"
          onClick={handleConfirm}
        >
          확인
        </button>
      </div>
    </div>
  );
}