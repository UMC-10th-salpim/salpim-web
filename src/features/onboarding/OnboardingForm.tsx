import { useState } from 'react';

export interface OnboardingInfo {
  name: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  gender: 'female' | 'male' | '';
  phone: string;
}

interface OnboardingFormProps {
  onSubmit?: (info: OnboardingInfo) => void;
}

const inputStyle =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-brand-500';
const labelStyle = 'mb-1.5 block text-sm font-semibold text-gray-800';

const OnboardingForm = ({ onSubmit }: OnboardingFormProps) => {
  const [info, setInfo] = useState<OnboardingInfo>({
    name: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    gender: '',
    phone: '',
  });

  const update = <K extends keyof OnboardingInfo>(key: K, value: OnboardingInfo[K]) =>
    setInfo((prev) => ({ ...prev, [key]: value }));

  const isValid =
    info.name.trim() !== '' &&
    info.birthYear !== '' &&
    info.birthMonth !== '' &&
    info.birthDay !== '' &&
    info.gender !== '' &&
    info.phone.trim() !== '';

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-brand-50/40 px-5 pb-6 pt-4">
      {/* 진행 표시 */}
      <div className="mb-6 flex items-center justify-center gap-2">
        {[0, 1, 2, 3].map((index) => (
          <span
            key={index}
            className={`h-2 rounded-full ${index === 1 ? 'w-6 bg-brand-500' : 'w-2 bg-brand-200'}`}
          />
        ))}
      </div>

      <h1 className="mb-6 text-xl font-bold text-gray-900">자신의 정보를 입력해 주세요!</h1>

      <div className="flex flex-col gap-5">
        {/* 이름 */}
        <div>
          <label htmlFor="name" className={labelStyle}>
            이름
          </label>
          <input
            id="name"
            className={inputStyle}
            value={info.name}
            onChange={(event) => update('name', event.target.value)}
            placeholder="이름을 입력해 주세요"
          />
        </div>

        {/* 생년월일 */}
        <div>
          <span className={labelStyle}>생년월일</span>
          <div className="flex gap-2">
            <input
              className={`${inputStyle} flex-1`}
              value={info.birthYear}
              onChange={(event) => update('birthYear', event.target.value)}
              placeholder="년"
              inputMode="numeric"
              maxLength={4}
            />
            <input
              className={`${inputStyle} w-20`}
              value={info.birthMonth}
              onChange={(event) => update('birthMonth', event.target.value)}
              placeholder="월"
              inputMode="numeric"
              maxLength={2}
            />
            <input
              className={`${inputStyle} w-20`}
              value={info.birthDay}
              onChange={(event) => update('birthDay', event.target.value)}
              placeholder="일"
              inputMode="numeric"
              maxLength={2}
            />
          </div>
        </div>

        {/* 성별 */}
        <div>
          <span className={labelStyle}>성별</span>
          <div className="flex gap-2">
            {(['female', 'male'] as const).map((gender) => {
              const selected = info.gender === gender;
              return (
                <button
                  key={gender}
                  type="button"
                  onClick={() => update('gender', gender)}
                  className={`flex-1 rounded-xl border py-3 text-sm font-medium transition-colors ${
                    selected
                      ? 'border-brand-500 bg-brand-500 text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-brand-300'
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
          <div className="flex gap-2">
            <input
              id="phone"
              className={`${inputStyle} flex-1`}
              value={info.phone}
              onChange={(event) => update('phone', event.target.value)}
              placeholder="전화번호를 입력해 주세요"
              inputMode="numeric"
            />
            <button
              type="button"
              className="shrink-0 rounded-xl border border-brand-500 px-4 text-sm font-semibold text-brand-500 transition-colors hover:bg-brand-50"
            >
              인증하기
            </button>
          </div>
          <p className="mt-1.5 text-xs text-gray-400">
            본인 확인을 위해 문자로 인증 번호를 보내 드려요.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onSubmit?.(info)}
        disabled={!isValid}
        className="mt-auto rounded-xl bg-brand-500 py-3.5 font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-brand-200"
      >
        다음
      </button>
    </div>
  );
};

export default OnboardingForm;
