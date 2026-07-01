import { useState } from "react";

const REGIONS_DATA : Record<string, string[]> = {
  "서울특별시" : ['강남구', '강북구', '강서구'],
  "인천광역시" : ['미추홀구', '서구', '중구'],
  "경기도" : ['수원시', '화성시', '고양시']
}

export default function Dropdown() {
  const [isOpenCity, setIsOpenCity] = useState(false);
  const [isOpenDistrict, setIsOpenDistrict] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  console.log("선택된 값:",selectedCity);
  console.log("선택된 값:",selectedDistrict);

  const handleCitySelect = (value: string) => {
    setSelectedCity(value);
    setSelectedDistrict('');
    setIsOpenCity(false);
  }

  const handleDistrictSelect = (value: string) => {
    setSelectedDistrict(value);
    setIsOpenDistrict(false)
  }

  // 선택된 시/도에 해당하는 시/군/구 목록
  const districts = REGIONS_DATA[selectedCity] ?? [];

  return (
    <div className="flex gap-4">
      {/*시/도 드롭다운*/}
      <div>
        <button className="w-full cursor-pointer rounded-xl border border-[#FF8A3D] bg-white px-4 py-3 flex items-center justify-between text-sm text-gray-700"
          onClick={()=> setIsOpenCity(!isOpenCity)}
        >
          <span>{selectedCity}</span>
          <span className="text-[#FF8A3D]">{isOpenCity ? '▲' : '▼'}</span>
        </button>

        {isOpenCity && (
          <div className="absolute z-10 mt-1 w-full rounded-xl border border-[#FF8A3D] bg-white shadow-md">
            {Object.keys(REGIONS_DATA).map((city)=>(
              <div
                key={city}
                className="cursor-pointer px-4 py-2 text-sm hover:bg-orange-50"
                onClick= {()=> handleCitySelect(city)}
              >
                {city}
              </div>
            ))}
          </div>
        )}
    </div>

    {/* 시/군/구 드롭다운 */} 
    <div className="relative w-[130px]">
      <button 
        className="w-full cursor-pointer rounded-xl border border-[#FF8A3D] bg-white px-4 py-3 flex items-center justify-between text-sm text-gray-700 disabled:border-gray-300 disabled:cursor-not-allowed disabled:text-gray-300"
        onClick={()=> setIsOpenDistrict(!isOpenDistrict)}
        disabled={districts.length === 0}
      > {/*시/도 선택 전엔 비활성*/}
        <span>{selectedDistrict}</span>
        <span className={districts.length === 0 ? 'text-gray-300' : 'text-[#FF8A3D]'}>
          {isOpenDistrict ? '▲' : '▼'}
        </span>
      </button>

      {isOpenDistrict && (
        <div className="absolute z-10 mt-1 w-full rounded-xl border border-[#FF8A3D] bg-white shadow-md">
          {districts.map((district)=>(
            <div
              key={district}
              className="cursor-pointer px-4 py-2 text-sm hover:bg-orange-50"
              onClick={()=> handleDistrictSelect(district)}>
              {district}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
  );
};