import { useState } from 'react';
import { inputStyle, labelStyle, primaryButton, secondaryButton } from './styles';

export interface OnboardingInfo {
  name: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  gender: 'female' | 'male' | '';
  phone: string;
}

interface OnboardingFormProps {
  value: OnboardingInfo;
  onChange: (info: OnboardingInfo) => void;
  onNext: () => void;
  onBack: () => void;
}

// 숫자만 남기고 010-1234-5678 형태로 자동 하이픈
const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

const OnboardingForm = ({ value, onChange, onNext, onBack }: OnboardingFormProps) => {
  // 문자 인증 상태 (발송 → 코드 입력 → 확인 → 완료)
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [verified, setVerified] = useState(false);

  const update = <K extends keyof OnboardingInfo>(key: K, fieldValue: OnboardingInfo[K]) =>
    onChange({ ...value, [key]: fieldValue });

  const phoneComplete = value.phone.replace(/\D/g, '').length === 11;

  // 전화번호를 바꾸면 인증 상태 초기화
  const handlePhoneChange = (raw: string) => {
    update('phone', formatPhone(raw));
    setCodeSent(false);
    setVerified(false);
    setCode('');
  };

  const handleSendCode = () => {
    if (!phoneComplete) return;
    // TODO: 인증번호 발송 API 연동 (예: POST /auth/phone/send)
    setCodeSent(true);
    setVerified(false);
    setCode('');
  };

  const handleVerify = () => {
    // TODO: 인증번호 확인 API 연동 (예: POST /auth/phone/verify) → 성공 시 verified 처리
    if (code.length !== 6) return;
    setVerified(true);
  };

  const isValid =
    value.name.trim() !== '' &&
    value.birthYear !== '' &&
    value.birthMonth !== '' &&
    value.birthDay !== '' &&
    value.gender !== '' &&
    verified;

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto">
       <div className="flex min-h-full flex-col justify-center py-2">
        <h1 className="mb-5 text-center text-2xl font-bold text-gray-900">
          자신의 정보를 입력해 주세요!
        </h1>

        <div className="flex flex-col gap-4">
          {/* 이름 */}
          <div>
            <label htmlFor="name" className={labelStyle}>
              이름
            </label>
            <input
              id="name"
              className={inputStyle}
              value={value.name}
              onChange={(event) => update('name', event.target.value)}
              placeholder="김살핌"
            />
          </div>

          {/* 생년월일 */}
          <div>
            <span className={labelStyle}>생년월일</span>
            <div className="flex items-center gap-2">
              <input
                className={`${inputStyle} flex-1`}
                value={value.birthYear}
                onChange={(event) => update('birthYear', event.target.value.replace(/\D/g, ''))}
                inputMode="numeric"
                maxLength={4}
                aria-label="년"
              />
              <span className="text-base font-medium text-gray-700">년</span>
              <input
                className={`${inputStyle} !w-16 shrink-0 px-3 text-center`}
                value={value.birthMonth}
                onChange={(event) => update('birthMonth', event.target.value.replace(/\D/g, ''))}
                inputMode="numeric"
                maxLength={2}
                aria-label="월"
              />
              <span className="text-base font-medium text-gray-700">월</span>
              <input
                className={`${inputStyle} !w-16 shrink-0 px-3 text-center`}
                value={value.birthDay}
                onChange={(event) => update('birthDay', event.target.value.replace(/\D/g, ''))}
                inputMode="numeric"
                maxLength={2}
                aria-label="일"
              />
              <span className="text-base font-medium text-gray-700">일</span>
            </div>
          </div>

          {/* 성별 */}
          <div>
            <span className={labelStyle}>성별</span>
            <div className="flex gap-3">
              {(['female', 'male'] as const).map((gender) => {
                const selected = value.gender === gender;
                return (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => update('gender', gender)}
                    className={`flex-1 rounded-2xl border py-4 text-base font-bold transition-colors ${
                      selected
                        ? 'border-brand-500 bg-brand-100 text-brand-600'
                        : 'border-brand-200 bg-brand-50 text-gray-500 hover:border-brand-300'
                    }`}
                  >
                    {gender === 'female' ? '여성' : '남성'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 전화번호 */}
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
                value={value.phone}
                onChange={(event) => handlePhoneChange(event.target.value)}
                placeholder="010-0000-0000"
                inputMode="numeric"
                disabled={verified}
              />
              <button
                type="button"
                onClick={handleSendCode}
                disabled={!phoneComplete || verified}
                className="shrink-0 rounded-2xl bg-brand-100 px-4 text-base font-bold text-brand-600 transition-colors hover:bg-brand-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {codeSent && !verified ? '재전송' : '인증하기'}
              </button>
            </div>

            {/* 인증번호 입력 (발송 후 노출) */}
            {codeSent && !verified && (
              <div className="mt-2 flex gap-2">
                <input
                  className={`${inputStyle} flex-1`}
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="인증번호 6자리"
                  inputMode="numeric"
                  maxLength={6}
                  aria-label="인증번호"
                />
                <button
                  type="button"
                  onClick={handleVerify}
                  disabled={code.length !== 6}
                  className="shrink-0 rounded-2xl bg-brand-500 px-4 text-base font-bold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-brand-200"
                >
                  확인
                </button>
              </div>
            )}

            {/* 인증 완료 */}
            {verified && (
              <p className="mt-2 text-sm font-bold text-brand-500">✓ 인증이 완료되었어요.</p>
            )}
          </div>
        </div>
       </div>
      </div>

      <div className="flex shrink-0 gap-3 pt-4">
        <button type="button" onClick={onBack} className={secondaryButton}>
          이전
        </button>
        <button type="button" onClick={onNext} disabled={!isValid} className={primaryButton}>
          다음
        </button>
      </div>
    </>
  );
};

export default OnboardingForm;
