import { useEffect, useState } from 'react';
import { regionApi, type Region } from '@/apis/region';

interface RegionPickerModalProps {
  isOpen: boolean;
  initialCity: Region | null;
  initialDistrict: Region | null;
  onConfirm : (city: Region, district: Region) => void;
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
  const [cities, setCities] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [draftCity, setDraftCity] = useState<Region | null>(initialCity);
  const [draftDistrict, setDraftDistrict] = useState<Region | null>(initialDistrict);

  // 열릴 때 마다 기존 값으로 초기화됨
  useEffect(()=>{
    if (isOpen) {
      setDraftCity(initialCity);
      setDraftDistrict(initialDistrict);
      setTab('city');
      regionApi.getRegions().then(setCities).catch((error)=> {
        console.error('지역 목록 조회 실패', error);
      });
    }
  }, [isOpen, initialCity, initialDistrict]);

  if (!isOpen) return null;

  const handleCitySelect = async (city: Region) => {
  setDraftCity(city);
  setDraftDistrict(null);
  setTab('district');
  try {
    const children = await regionApi.getChildRegions(city.regionId);
    setDistricts(children);
  } catch (error) {
    console.error('하위 지역 조회 실패', error);
    setDistricts([]);
  }
  };

  const handleDistrictSelect = (district: Region) => {
    setDraftDistrict(district);
  };

  const handleConfirm = () => {
    if (draftCity && draftDistrict) {
      onConfirm(draftCity, draftDistrict);
    }
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
          ? cities.map((city) => (
              <div
                key={city.regionId}
                className={`cursor-pointer px-6 py-2 text-xl border-b border-gray-100 ${
                  draftCity === city ? 'bg-[#FFEDD5] font-medium' : ''
                }`}
                onClick={() => handleCitySelect(city)}
              >
                {city.regionName}
              </div>
            ))
          : districts.map((district) => (
              <div
                key={district.regionId}
                className={`cursor-pointer px-6 py-2 text-xl border-b border-gray-100 ${
                  draftDistrict === district ? 'bg-[#FFEDD5] font-medium' : ''
                }`}
                onClick={() => handleDistrictSelect(district)}
              >
                {district.regionName}
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