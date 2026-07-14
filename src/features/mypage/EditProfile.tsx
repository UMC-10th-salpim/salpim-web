import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAddress } from '@/apis/address';
import type { AddressResult } from '@/apis/address';
import { MOCK_PROFILE } from '@/apis/mypage';
import Modal from '@/components/common/Modal/Modal';
import { inputStyle, labelStyle, primaryButton } from '@/features/onboarding/styles';

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

const EditProfile = () => {
  const navigate = useNavigate();

  const [name, setName] = useState(MOCK_PROFILE.name);
  const [birthYear, setBirthYear] = useState(MOCK_PROFILE.birthYear);
  const [birthMonth, setBirthMonth] = useState(MOCK_PROFILE.birthMonth);
  const [birthDay, setBirthDay] = useState(MOCK_PROFILE.birthDay);
  const [gender, setGender] = useState<'female' | 'male'>(MOCK_PROFILE.gender);
  const [phone, setPhone] = useState(MOCK_PROFILE.phone);
  const [verified, setVerified] = useState(true);

  const [roadAddress, setRoadAddress] = useState(MOCK_PROFILE.roadAddress);
  const [detail, setDetail] = useState(MOCK_PROFILE.detail);
  const [query, setQuery] = useState(MOCK_PROFILE.roadAddress);
  const [results, setResults] = useState<AddressResult[]>([]);
  const [searching, setSearching] = useState(false);

  const [saved, setSaved] = useState(false);

  const handlePhoneChange = (raw: string) => {
    setPhone(formatPhone(raw));
    setVerified(false);
  };

  const handleVerify = () => {
    // TODO: 인증번호 발송/확인 API 연동
    setVerified(true);
  };

  const handleUseCurrentLocation = () => {
    // TODO: GPS 좌표 → 주소 변환 API 연동
    setRoadAddress('현재 위치 기반 주소 (예시)');
    setQuery('현재 위치 기반 주소 (예시)');
    setResults([]);
  };

  const runSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setSearching(true);
    try {
      const res = await searchAddress(q, 1);
      setResults(res.results);
    } finally {
      setSearching(false);
    }
  };

  const selectResult = (addr: string) => {
    setRoadAddress(addr);
    setQuery(addr);
    setResults([]);
  };

  const isValid =
    name.trim() !== '' &&
    birthYear !== '' &&
    birthMonth !== '' &&
    birthDay !== '' &&
    verified &&
    roadAddress.trim() !== '' &&
    detail.trim() !== '';

  const handleSave = () => {
    // TODO: 개인정보 수정 API 연동
    setSaved(true);
  };

  return (
    <div className="flex flex-col gap-6 p-4 pb-10">
      <h1 className="text-center text-lg font-bold text-gray-900">
        수정할 정보를 입력해 주세요.
      </h1>

      <div>
        <label htmlFor="name" className={labelStyle}>
          이름
        </label>
        <input
          id="name"
          className={inputStyle}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div>
        <span className={labelStyle}>생년월일</span>
        <div className="flex items-center gap-2">
          <input
            className={`${inputStyle} flex-1`}
            value={birthYear}
            onChange={(event) => setBirthYear(event.target.value.replace(/\D/g, ''))}
            inputMode="numeric"
            maxLength={4}
            aria-label="년"
          />
          <span className="text-base font-medium text-gray-700">년</span>
          <input
            className={`${inputStyle} !w-16 shrink-0 px-3 text-center`}
            value={birthMonth}
            onChange={(event) => setBirthMonth(event.target.value.replace(/\D/g, ''))}
            inputMode="numeric"
            maxLength={2}
            aria-label="월"
          />
          <span className="text-base font-medium text-gray-700">월</span>
          <input
            className={`${inputStyle} !w-16 shrink-0 px-3 text-center`}
            value={birthDay}
            onChange={(event) => setBirthDay(event.target.value.replace(/\D/g, ''))}
            inputMode="numeric"
            maxLength={2}
            aria-label="일"
          />
          <span className="text-base font-medium text-gray-700">일</span>
        </div>
      </div>

      <div>
        <span className={labelStyle}>성별</span>
        <div className="flex gap-3">
          {(['female', 'male'] as const).map((option) => {
            const selected = gender === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setGender(option)}
                className={`flex-1 rounded-2xl border py-4 text-base font-bold transition-colors ${
                  selected
                    ? 'border-brand-500 bg-brand-100 text-brand-600'
                    : 'border-brand-200 bg-brand-50 text-gray-500 hover:border-brand-300'
                }`}
              >
                {option === 'female' ? '여성' : '남성'}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="phone" className={labelStyle}>
          전화번호
        </label>
        <p className="mb-2 text-sm font-semibold text-brand-500">
          본인 확인을 위해 문자로 인증 번호를 보내 드려요.
        </p>
        <div className="flex gap-2">
          <input
            id="phone"
            className={`${inputStyle} flex-1`}
            value={phone}
            onChange={(event) => handlePhoneChange(event.target.value)}
            placeholder="010-0000-0000"
            inputMode="numeric"
          />
          <button
            type="button"
            onClick={handleVerify}
            disabled={verified}
            className="shrink-0 rounded-2xl bg-brand-100 px-4 text-base font-bold text-brand-600 transition-colors hover:bg-brand-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {verified ? '인증 완료' : '인증하기'}
          </button>
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-brand-300 bg-brand-50 py-4 text-base font-bold text-brand-600 transition-colors hover:bg-brand-100"
        >
          <span aria-hidden>◎</span>
          현재 위치로 자동 설정
        </button>
        <p className="mb-4 mt-3 text-center text-sm text-gray-400">또는 직접 입력하기</p>

        <label className={labelStyle}>도로명 주소</label>
        <div className="flex items-center gap-2 rounded-2xl border border-brand-200 bg-white px-4 py-3.5 focus-within:border-brand-500">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') runSearch();
            }}
            placeholder="도로명 주소를 입력해 주세요"
            className="min-w-0 flex-1 text-base text-gray-900 outline-none placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={runSearch}
            disabled={searching}
            className="shrink-0 text-base font-bold text-brand-500 disabled:opacity-50"
          >
            검색
          </button>
        </div>

        {results.length > 0 && (
          <ul className="mt-2 rounded-2xl border border-brand-200 bg-white p-2">
            {results.map((result, index) => (
              <li key={`${result.roadAddress}-${index}`}>
                <button
                  type="button"
                  onClick={() => selectResult(result.roadAddress)}
                  className="w-full rounded-xl px-2 py-2.5 text-left text-sm text-gray-800 hover:bg-brand-50"
                >
                  {result.roadAddress}
                  {result.buildingName ? ` (${result.buildingName})` : ''}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5">
          <label htmlFor="detail" className={labelStyle}>
            상세 주소
          </label>
          <input
            id="detail"
            className={inputStyle}
            value={detail}
            onChange={(event) => setDetail(event.target.value)}
            placeholder="상세 주소를 입력해 주세요"
          />
        </div>
      </div>

      <button type="button" onClick={handleSave} disabled={!isValid} className={primaryButton}>
        저장하기
      </button>

      <Modal
        open={saved}
        title="저장되었어요!"
        confirmText="확인"
        onConfirm={() => navigate('/mypage')}
        onClose={() => setSaved(false)}
      >
        수정한 정보가 반영되었어요.
      </Modal>
    </div>
  );
};

export default EditProfile;
