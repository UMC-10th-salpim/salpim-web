import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { searchAddress } from '@/apis/address';
import type { AddressResult } from '@/apis/address';
import { authApi, getApiErrorMessage } from '@/apis/auth';
import { MOCK_PROFILE, mypageApi } from '@/apis/mypage';
import Modal from '@/components/common/Modal/Modal';
import ScrollMoreIndicator from '@/components/common/ScrollMoreIndicator/ScrollMoreIndicator';
import { primaryButton } from '@/features/onboarding/styles';
import useUserStore from '@/store/userStore';

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

const EditProfile = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const accessToken = useUserStore((state) => state.accessToken);

  const [name, setName] = useState(MOCK_PROFILE.name);
  const [birthYear, setBirthYear] = useState(MOCK_PROFILE.birthYear);
  const [birthMonth, setBirthMonth] = useState(MOCK_PROFILE.birthMonth);
  const [birthDay, setBirthDay] = useState(MOCK_PROFILE.birthDay);
  const [gender, setGender] = useState<'female' | 'male'>(MOCK_PROFILE.gender);
  const [phone, setPhone] = useState(MOCK_PROFILE.phone);
  const [verified, setVerified] = useState(true);
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneVerificationToken, setPhoneVerificationToken] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);

  const [roadAddress, setRoadAddress] = useState(MOCK_PROFILE.roadAddress);
  const [detail, setDetail] = useState(MOCK_PROFILE.detail);
  const [query, setQuery] = useState(MOCK_PROFILE.roadAddress);
  const [results, setResults] = useState<AddressResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressResult | null>(null);

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const { data: profileSummary } = useQuery({
    queryKey: ['mypage-summary', accessToken],
    queryFn: mypageApi.getSummary,
    enabled: Boolean(accessToken),
  });

  useEffect(() => {
    if (profileSummary?.name) setName(profileSummary.name);
  }, [profileSummary?.name]);

  const handlePhoneChange = (raw: string) => {
    setPhone(formatPhone(raw));
    setVerified(false);
    setCodeSent(false);
    setVerificationCode('');
    setPhoneVerificationToken('');
    setFormError('');
  };

  const handleSendVerificationCode = async () => {
    if (verifyingPhone) return;
    setVerifyingPhone(true);
    setFormError('');

    try {
      await mypageApi.sendPhoneVerificationCode(phone);
      setCodeSent(true);
    } catch (error) {
      setFormError(getApiErrorMessage(error, '인증번호를 보내지 못했어요. 다시 시도해 주세요.'));
    } finally {
      setVerifyingPhone(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim() || verifyingPhone) return;
    setVerifyingPhone(true);
    setFormError('');

    try {
      const token = await mypageApi.verifyPhoneCode(phone, verificationCode.trim());
      setPhoneVerificationToken(token);
      setVerified(true);
    } catch (error) {
      setFormError(getApiErrorMessage(error, '인증번호가 일치하지 않아요.'));
    } finally {
      setVerifyingPhone(false);
    }
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

  const selectResult = (address: AddressResult) => {
    setRoadAddress(address.roadAddress);
    setQuery(address.roadAddress);
    setSelectedAddress(address);
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

  const handleSave = async () => {
    if (!isValid || saving) return;
    setSaving(true);
    setFormError('');

    try {
      let addressInfo = selectedAddress;
      if (!addressInfo) {
        const addressSearch = await searchAddress(roadAddress, 1);
        addressInfo =
          addressSearch.results.find((item) => item.roadAddress === roadAddress) ??
          addressSearch.results[0] ??
          null;
      }
      if (!addressInfo?.eupMyeonDong) {
        throw new Error('행정구역을 확인할 수 없습니다.');
      }

      const [coordinates, region] = await Promise.all([
        authApi.geocodeAddress(roadAddress),
        authApi.resolveRegion(addressInfo.city, addressInfo.district, addressInfo.eupMyeonDong),
      ]);

      await mypageApi.updateProfile({
        name: name.trim(),
        birthDate: `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`,
        gender: gender === 'male' ? 'MALE' : 'FEMALE',
        roadAddress: coordinates.roadAddress,
        detailAddress: detail.trim(),
        latitude: Number(coordinates.latitude.toFixed(7)),
        longitude: Number(coordinates.longitude.toFixed(7)),
        regionId: region.regionId,
        ...(phoneVerificationToken
          ? {
              phoneNumber: phone.replace(/\D/g, ''),
              phoneVerificationToken,
            }
          : {}),
      });
      await queryClient.invalidateQueries({ queryKey: ['mypage-summary'] });
      setSaved(true);
    } catch (error) {
      setFormError(getApiErrorMessage(error, '개인정보를 저장하지 못했어요. 다시 확인해 주세요.'));
    } finally {
      setSaving(false);
    }
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
            onClick={() => {
              void handleSendVerificationCode();
            }}
            disabled={verified}
            className="min-h-[52px] shrink-0 rounded-[999px] bg-[#FF853E] px-4 text-[17px] font-extrabold text-white transition-colors hover:bg-[#EB6F27] disabled:cursor-not-allowed disabled:bg-[#FFE2B9] disabled:text-[#FF7A32]"
          >
            {verified ? '인증 완료' : codeSent ? '재전송' : '인증하기'}
          </button>
        </div>
        {codeSent && !verified && (
          <div className="mt-2 flex gap-2">
            <input
              className="mypage-field mypage-pill min-w-0 flex-1"
              value={verificationCode}
              onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, ''))}
              placeholder="인증번호 입력"
              inputMode="numeric"
            />
            <button
              type="button"
              onClick={() => {
                void handleVerifyCode();
              }}
              disabled={!verificationCode.trim() || verifyingPhone}
              className="min-h-[52px] shrink-0 rounded-[999px] bg-[#FF853E] px-4 text-[17px] font-extrabold text-white disabled:opacity-50"
            >
              확인
            </button>
          </div>
        )}
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
                  onClick={() => selectResult(result)}
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
        onClick={() => {
          void handleSave();
        }}
        disabled={!isValid || saving}
        className={`${primaryButton} !min-h-14 !flex-none !text-[22px]`}
      >
        {saving ? '저장 중...' : '저장하기'}
      </button>

      {formError && (
        <p role="alert" className="text-center text-sm font-bold text-red-500">
          {formError}
        </p>
      )}

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
