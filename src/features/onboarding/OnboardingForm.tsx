import { useState } from 'react';
import { authApi, getApiErrorMessage } from '@/apis/auth';
import { inputStyle, labelStyle, primaryButton, secondaryButton } from './styles';

const personalInfoInputStyle = (hasValue: boolean) =>
  `${inputStyle} !h-[clamp(48px,7.11vh,56px)] !rounded-full !border-[3px] !py-0 placeholder:!text-[21px] ${hasValue ? '!border-brand-500' : '!border-[#FED7AA]'}`;

export interface OnboardingInfo {
  name: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  gender: 'female' | 'male' | '';
  phone: string;
  phoneVerified: boolean;
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
  const [phoneRequest, setPhoneRequest] = useState<'idle' | 'sending' | 'verifying'>('idle');
  const [phoneMessage, setPhoneMessage] = useState('');
  const [phoneMessageType, setPhoneMessageType] = useState<'info' | 'success' | 'error'>('info');

  const update = <K extends keyof OnboardingInfo>(key: K, fieldValue: OnboardingInfo[K]) =>
    onChange({ ...value, [key]: fieldValue });

  const phoneComplete = value.phone.replace(/\D/g, '').length === 11;

  // 전화번호를 바꾸면 인증 상태 초기화
  const handlePhoneChange = (raw: string) => {
    onChange({ ...value, phone: formatPhone(raw), phoneVerified: false });
    setCodeSent(false);
    setCode('');
    setPhoneMessage('');
    setPhoneMessageType('info');
  };

  const handleSendCode = async () => {
    if (!phoneComplete) return;
    setPhoneRequest('sending');
    setPhoneMessage('');

    try {
      await authApi.sendPhoneVerificationCode(value.phone);
      setCodeSent(true);
      setCode('');
      setPhoneMessage('인증번호를 보냈어요. 5분 안에 입력해 주세요.');
      setPhoneMessageType('info');
    } catch (error) {
      setCodeSent(false);
      setPhoneMessage(getApiErrorMessage(error, '인증번호를 보내지 못했어요.'));
      setPhoneMessageType('error');
    } finally {
      setPhoneRequest('idle');
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) return;
    setPhoneRequest('verifying');
    setPhoneMessage('');

    try {
      const verified = await authApi.verifyPhoneCode(value.phone, code);
      onChange({ ...value, phoneVerified: verified });
      setPhoneMessage(verified ? '인증이 완료되었어요.' : '인증번호를 다시 확인해 주세요.');
      setPhoneMessageType(verified ? 'success' : 'error');
    } catch (error) {
      onChange({ ...value, phoneVerified: false });
      setPhoneMessage(getApiErrorMessage(error, '인증번호를 확인하지 못했어요.'));
      setPhoneMessageType('error');
    } finally {
      setPhoneRequest('idle');
    }
  };

  const hasCompleteBirthDate =
    value.birthYear.length === 4 && value.birthMonth !== '' && value.birthDay !== '';
  const hasInvalidBirthDate = (() => {
    if (!hasCompleteBirthDate) return false;

    const year = Number(value.birthYear);
    const month = Number(value.birthMonth);
    const day = Number(value.birthDay);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return (
      birthDate.getFullYear() !== year ||
      birthDate.getMonth() !== month - 1 ||
      birthDate.getDate() !== day ||
      birthDate >= today
    );
  })();

  // 화면 개발 중에는 인증 서버 없이 다음 단계를 확인할 수 있도록 개발 모드만 우회합니다.
  const phoneVerificationPassed = import.meta.env.DEV || value.phoneVerified;
  const isValid =
    value.name.trim() !== '' &&
    value.birthYear !== '' &&
    value.birthMonth !== '' &&
    value.birthDay !== '' &&
    !hasInvalidBirthDate &&
    value.gender !== '' &&
    phoneVerificationPassed;

  return (
    <>
      <div className="-mx-[clamp(2px,1.07vw,4px)] min-h-0 flex-1 overflow-y-auto px-[clamp(2px,1.07vw,4px)]">
        <div className="flex min-h-full flex-col justify-start pb-2 pt-[clamp(6px,1.02vh,8px)]">
          <h1 className="mb-5 text-center text-[clamp(26px,3.55vh,28px)] font-extrabold text-[#613212]">
            자신의 정보를 입력해 주세요!
          </h1>

          <div className="-mx-[clamp(2px,1.07vw,4px)] flex flex-col gap-4">
            {/* 이름 */}
            <div>
              <label htmlFor="name" className={labelStyle}>
                이름
              </label>
              <input
                id="name"
                className={personalInfoInputStyle(value.name.trim() !== '')}
                value={value.name}
                onChange={(event) => update('name', event.target.value)}
                placeholder="김살핌"
              />
            </div>

            {/* 생년월일 */}
            <div>
              <span className={labelStyle}>생년월일</span>
              <div className="flex items-center gap-[clamp(1px,0.54vw,2px)]">
                <div className="flex min-w-0 flex-1 items-center gap-[clamp(1px,0.54vw,2px)]">
                  <input
                    className={`${personalInfoInputStyle(value.birthYear !== '')} min-w-[clamp(84px,25.34vw,95px)] flex-1 !px-2 text-[23px]`}
                    value={value.birthYear}
                    onChange={(event) => update('birthYear', event.target.value.replace(/\D/g, ''))}
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="YYYY"
                    aria-label="년"
                  />
                  <span className="text-2xl font-medium text-gray-700">년</span>
                </div>
                <div className="flex shrink-0 items-center gap-[clamp(1px,0.54vw,2px)]">
                  <input
                    className={`${personalInfoInputStyle(value.birthMonth !== '')} !w-[clamp(64px,19.74vw,74px)] shrink-0 !px-2 text-center tracking-[-0.08em] ${value.birthMonth.length === 2 ? 'text-[21px]' : 'text-[23px]'}`}
                    value={value.birthMonth}
                    onChange={(event) =>
                      update('birthMonth', event.target.value.replace(/\D/g, ''))
                    }
                    inputMode="numeric"
                    maxLength={2}
                    placeholder="MM"
                    aria-label="월"
                  />
                  <span className="text-2xl font-medium text-gray-700">월</span>
                </div>
                <div className="flex shrink-0 items-center gap-[clamp(1px,0.54vw,2px)]">
                  <input
                    className={`${personalInfoInputStyle(value.birthDay !== '')} !w-[clamp(64px,19.74vw,74px)] shrink-0 !px-2 text-center tracking-[-0.08em] ${value.birthDay.length === 2 ? 'text-[21px]' : 'text-[23px]'}`}
                    value={value.birthDay}
                    onChange={(event) => update('birthDay', event.target.value.replace(/\D/g, ''))}
                    inputMode="numeric"
                    maxLength={2}
                    placeholder="DD"
                    aria-label="일"
                  />
                  <span className="text-2xl font-medium text-gray-700">일</span>
                </div>
              </div>
              {hasInvalidBirthDate && (
                <p role="alert" className="mt-2 px-2 text-sm font-normal text-red-500 opacity-80">
                  유효하지 않은 생년월일입니다. 생년월일을 확인해주세요!
                </p>
              )}
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
                      className={`flex h-[clamp(48px,7.11vh,56px)] flex-1 items-center justify-center rounded-full border-[clamp(3px,0.51vh,4px)] py-0 text-2xl font-bold transition-colors ${
                        selected
                          ? 'border-brand-500 bg-brand-100 text-brand-600'
                          : 'border-brand-100 bg-brand-100 text-brand-600 opacity-50 hover:border-brand-200 hover:opacity-70'
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
                  className={`${personalInfoInputStyle(value.phone !== '')} flex-1 placeholder:!text-[#613212] placeholder:!opacity-40`}
                  value={value.phone}
                  onChange={(event) => handlePhoneChange(event.target.value)}
                  placeholder="010-0000-0000"
                  inputMode="numeric"
                  disabled={value.phoneVerified}
                />
                <button
                  type="button"
                  onClick={() => void handleSendCode()}
                  disabled={!phoneComplete || value.phoneVerified || phoneRequest !== 'idle'}
                  className="shrink-0 rounded-2xl bg-brand-100 px-4 text-2xl font-bold text-brand-600 transition-colors hover:bg-brand-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {phoneRequest === 'sending'
                    ? '전송 중'
                    : codeSent && !value.phoneVerified
                      ? '재전송'
                      : '인증하기'}
                </button>
              </div>

              {/* 인증번호 입력 (발송 후 노출) */}
              {codeSent && !value.phoneVerified && (
                <div className="mt-2 flex gap-2">
                  <input
                    className={`${personalInfoInputStyle(code !== '')} flex-1`}
                    value={code}
                    onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="인증번호 6자리"
                    inputMode="numeric"
                    maxLength={6}
                    aria-label="인증번호"
                  />
                  <button
                    type="button"
                    onClick={() => void handleVerify()}
                    disabled={code.length !== 6 || phoneRequest !== 'idle'}
                    className="shrink-0 rounded-2xl bg-brand-500 px-4 text-2xl font-bold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-brand-200"
                  >
                    {phoneRequest === 'verifying' ? '확인 중' : '확인'}
                  </button>
                </div>
              )}

              {phoneMessage && (
                <p
                  role="status"
                  className={`mt-2 text-sm font-bold ${
                    phoneMessageType === 'error' ? 'text-red-500' : 'text-brand-500'
                  }`}
                >
                  {phoneMessage}
                </p>
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
