import { useState } from 'react';

export interface AddressInfo {
  sido: string;
  gu: string;
  detail: string;
}

interface AddressSelectorProps {
  onComplete?: (address: AddressInfo) => void;
  onUseCurrentLocation?: () => void;
}

const SIDO_OPTIONS = [
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

const fieldStyle =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-brand-500';

const AddressSelector = ({ onComplete, onUseCurrentLocation }: AddressSelectorProps) => {
  const [address, setAddress] = useState<AddressInfo>({ sido: '', gu: '', detail: '' });

  const update = <K extends keyof AddressInfo>(key: K, value: AddressInfo[K]) =>
    setAddress((prev) => ({ ...prev, [key]: value }));

  const isValid = address.sido !== '' && address.gu.trim() !== '' && address.detail.trim() !== '';

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-brand-50/40 px-5 pb-6 pt-4">
      {/* 진행 표시 */}
      <div className="mb-6 flex items-center justify-center gap-2">
        {[0, 1, 2, 3].map((index) => (
          <span
            key={index}
            className={`h-2 rounded-full ${index === 2 ? 'w-6 bg-brand-500' : 'w-2 bg-brand-200'}`}
          />
        ))}
      </div>

      <h1 className="mb-2 text-xl font-bold text-gray-900">우리집을 설정해 주세요!</h1>
      <p className="mb-6 text-sm text-gray-500">
        주소로 내 지역 혜택과 근처 복지 시설을 찾아 드려요.
      </p>

      {/* 현재 위치 자동 설정 */}
      <button
        type="button"
        onClick={onUseCurrentLocation}
        className="flex items-center justify-center gap-2 rounded-xl bg-brand-100 py-3.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-200"
      >
        <span aria-hidden>📍</span>
        현재 위치로 자동 설정
      </button>

      <div className="my-5 flex items-center gap-3 text-xs text-gray-400">
        <span className="h-px flex-1 bg-gray-200" />
        또는
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="flex flex-col gap-4">
        {/* 시/도 · 구 */}
        <div className="flex gap-2">
          <select
            className={`${fieldStyle} flex-1 ${address.sido === '' ? 'text-gray-400' : ''}`}
            value={address.sido}
            onChange={(event) => update('sido', event.target.value)}
            aria-label="시/도"
          >
            <option value="">시/도</option>
            {SIDO_OPTIONS.map((sido) => (
              <option key={sido} value={sido}>
                {sido}
              </option>
            ))}
          </select>
          <input
            className={`${fieldStyle} flex-1`}
            value={address.gu}
            onChange={(event) => update('gu', event.target.value)}
            placeholder="구"
            aria-label="구"
          />
        </div>

        {/* 상세 주소 */}
        <div>
          <label htmlFor="detail" className="mb-1.5 block text-sm font-semibold text-gray-800">
            상세 주소 <span className="text-brand-500">(필수)</span>
          </label>
          <input
            id="detail"
            className={fieldStyle}
            value={address.detail}
            onChange={(event) => update('detail', event.target.value)}
            placeholder="상세 주소를 입력해 주세요"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => onComplete?.(address)}
        disabled={!isValid}
        className="mt-auto rounded-xl bg-brand-500 py-3.5 font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-brand-200"
      >
        설정 완료
      </button>
    </div>
  );
};

export default AddressSelector;
