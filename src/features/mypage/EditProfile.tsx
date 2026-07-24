import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAddress } from '@/apis/address';
import type { AddressResult } from '@/apis/address';
import { MOCK_PROFILE } from '@/apis/mypage';
import Modal from '@/components/common/Modal/Modal';
import ScrollMoreIndicator from '@/components/common/ScrollMoreIndicator/ScrollMoreIndicator';
import { primaryButton } from '@/features/onboarding/styles';

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
    <main className="mypage-content gap-6">
      <h2 className="text-center text-[20px] font-extrabold text-[#43230F]">
        수정할 정보를 입력해 주세요.
      </h2>

      <div>
        <label htmlFor="name" className="mypage-label">
          이름
        </label>
        <input
          id="name"
          className="mypage-field mypage-pill"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div>
        <span className="mypage-label">생년월일</span>
        <div className="flex items-center gap-2">
          <input
            className="mypage-field mypage-pill min-w-0 flex-1"
            value={birthYear}
            onChange={(event) => setBirthYear(event.target.value.replace(/\D/g, ''))}
            inputMode="numeric"
            maxLength={4}
            aria-label="년"
          />
          <span className="text-[17px] font-bold text-[#613212]">년</span>
          <input
            className="mypage-field mypage-pill !w-[62px] shrink-0 px-2 text-center"
            value={birthMonth}
            onChange={(event) => setBirthMonth(event.target.value.replace(/\D/g, ''))}
            inputMode="numeric"
            maxLength={2}
            aria-label="월"
          />
          <span className="text-[17px] font-bold text-[#613212]">월</span>
          <input
            className="mypage-field mypage-pill !w-[62px] shrink-0 px-2 text-center"
            value={birthDay}
            onChange={(event) => setBirthDay(event.target.value.replace(/\D/g, ''))}
            inputMode="numeric"
            maxLength={2}
            aria-label="일"
          />
          <span className="text-[17px] font-bold text-[#613212]">일</span>
        </div>
      </div>

      <div>
        <span className="mypage-label">성별</span>
        <div className="flex gap-3">
          {(['female', 'male'] as const).map((option) => {
            const selected = gender === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setGender(option)}
                className={`min-h-[54px] flex-1 rounded-[999px] border-2 text-[18px] font-extrabold transition-colors ${
                  selected
                    ? 'border-[#F39A00] bg-[#FFE2B9] text-[#FF6F12]'
                    : 'border-[#FFD29E] bg-[#FFEBD1] text-[#FF7A32] hover:bg-[#FFE2B9]'
                }`}
              >
                {option === 'female' ? '여성' : '남성'}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="mypage-label">
          전화번호
        </label>
        <p className="mb-2 text-[15px] font-bold leading-5 text-[#FF7A32]">
          본인 확인을 위해 문자로 인증 번호를 보내 드려요.
        </p>
        <div className="flex gap-2">
          <input
            id="phone"
            className="mypage-field mypage-pill min-w-0 flex-1"
            value={phone}
            onChange={(event) => handlePhoneChange(event.target.value)}
            placeholder="010-0000-0000"
            inputMode="numeric"
          />
          <button
            type="button"
            onClick={handleVerify}
            disabled={verified}
            className="min-h-[52px] shrink-0 rounded-[999px] bg-[#FF853E] px-4 text-[17px] font-extrabold text-white transition-colors hover:bg-[#EB6F27] disabled:cursor-not-allowed disabled:bg-[#FFE2B9] disabled:text-[#FF7A32]"
          >
            {verified ? '인증 완료' : '인증하기'}
          </button>
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="flex min-h-[68px] w-full items-center justify-center gap-3 rounded-[18px] border-2 border-[#FFB263] bg-[#FFE1BB] text-[20px] font-extrabold text-[#7A4B20] transition-colors hover:bg-[#FFD7A5]"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            aria-hidden
            className="shrink-0"
          >
            <circle cx="15" cy="15" r="8" stroke="currentColor" strokeWidth="2.2" />
            <path
              d="M15 2v4M15 24v4M2 15h4M24 15h4"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle cx="15" cy="15" r="3.5" fill="currentColor" />
          </svg>
          현재 위치로 자동 설정
        </button>
        <p className="mb-4 mt-3 text-center text-[15px] font-semibold text-[#81746A]">
          또는 직접 입력하기
        </p>

        <label className="mypage-label">도로명 주소</label>
        <div className="mypage-pill flex min-h-[52px] items-center gap-2 border-2 border-[#FFD29E] bg-white px-4 py-2 focus-within:border-[#FF853E]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') runSearch();
            }}
            placeholder="도로명 주소를 입력해 주세요"
            className="min-w-0 flex-1 text-[18px] font-semibold text-gray-900 outline-none placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={runSearch}
            disabled={searching}
            className="min-h-10 shrink-0 px-2 text-[18px] font-extrabold text-[#FF7A32] disabled:opacity-50"
          >
            검색
          </button>
        </div>

        {results.length > 0 && (
          <ul className="mt-2 rounded-2xl border-2 border-[#FFD29E] bg-white p-2">
            {results.map((result, index) => (
              <li key={`${result.roadAddress}-${index}`}>
                <button
                  type="button"
                  onClick={() => selectResult(result.roadAddress)}
                  className="min-h-12 w-full rounded-xl px-2 py-2.5 text-left text-[16px] font-semibold text-gray-800 hover:bg-[#FFF7EC]"
                >
                  {result.roadAddress}
                  {result.buildingName ? ` (${result.buildingName})` : ''}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5">
          <label htmlFor="detail" className="mypage-label">
            상세 주소
          </label>
          <input
            id="detail"
            className="mypage-field mypage-pill"
            value={detail}
            onChange={(event) => setDetail(event.target.value)}
            placeholder="상세 주소를 입력해 주세요"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={!isValid}
        className={`${primaryButton} !min-h-14 !flex-none !text-[22px]`}
      >
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

      <ScrollMoreIndicator />
    </main>
  );
};

export default EditProfile;
