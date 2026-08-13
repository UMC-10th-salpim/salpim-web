import { useState } from 'react';
import { authApi, getPhoneVerificationErrorMessage } from '@/apis/auth';
import { MAX_SIGNUP_AGE, validateBirthDate } from '@/utils/birthDate';
import { formatPhone } from '@/utils/phone';
import { inputStyle, labelStyle, primaryButton, secondaryButton } from './styles';

const personalInfoInputStyle = (hasValue: boolean) =>
  `${inputStyle} !h-[52px] !min-h-[52px] !rounded-full !border-4 !py-0 ${hasValue ? '!border-brand-500' : '!border-[#FED7AA]'}`;

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
  externalErrorMessage?: string;
}

const OnboardingForm = ({
  value,
  onChange,
  onNext,
  onBack,
  externalErrorMessage = '',
}: OnboardingFormProps) => {
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
      const result = await authApi.sendPhoneVerificationCode(value.phone);
      setCodeSent(true);
      setCode('');
      setPhoneMessage(result.message);
      setPhoneMessageType('info');
    } catch (error) {
      setCodeSent(false);
      setPhoneMessage(getPhoneVerificationErrorMessage(error, '인증번호를 보내지 못했어요.'));
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
      const result = await authApi.verifyPhoneCode(value.phone, code);
      onChange({ ...value, phoneVerified: result.verified });
      setPhoneMessage(result.verified ? result.message : '인증번호를 다시 확인해 주세요.');
      setPhoneMessageType(result.verified ? 'success' : 'error');
    } catch (error) {
      onChange({ ...value, phoneVerified: false });
      setPhoneMessage(getPhoneVerificationErrorMessage(error, '인증번호를 확인하지 못했어요.'));
      setPhoneMessageType('error');
    } finally {
      setPhoneRequest('idle');
    }
  };

  const birthDateValidation = validateBirthDate(value.birthYear, value.birthMonth, value.birthDay);
  const hasInvalidBirthDate =
    birthDateValidation === 'invalid' || birthDateValidation === 'too-old';

  const isValid =
    value.name.trim() !== '' &&
    birthDateValidation === 'valid' &&
    value.gender !== '' &&
    value.phoneVerified;

  return (
    <>
      <div className="-mx-[clamp(2px,1.07vw,4px)] min-h-0 flex-1 overflow-y-auto px-[clamp(2px,1.07vw,4px)]">
        <div className="flex min-h-full flex-col justify-start pb-2 pt-[clamp(6px,1.02vh,8px)]">
          <h1 className="salpim-page-title mb-[78px] text-center font-extrabold text-[#613212]">
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
                className={`${personalInfoInputStyle(value.name.trim() !== '')} placeholder:!text-[#613212] placeholder:!opacity-40`}
                value={value.name}
                onChange={(event) => update('name', event.target.value)}
                placeholder="김살핌"
              />
            </div>

            {/* 생년월일 */}
            <div>
              <span className={labelStyle}>생년월일</span>
              <div className="grid grid-cols-[92px_41px_52px_41px_68px_1fr] items-center">
                <input
                  className={`${personalInfoInputStyle(value.birthYear !== '')} salpim-birth-date-input !w-[92px] !px-4 placeholder:!text-[#613212] placeholder:!opacity-40`}
                  value={value.birthYear}
                  onChange={(event) => update('birthYear', event.target.value.replace(/\D/g, ''))}
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="YYYY"
                  aria-label="년"
                  aria-invalid={hasInvalidBirthDate}
                  aria-describedby={hasInvalidBirthDate ? 'birth-date-error' : undefined}
                />
                <span className="salpim-field-text text-center font-medium text-gray-700">년</span>
                <input
                  className={`${personalInfoInputStyle(value.birthMonth !== '')} salpim-birth-date-input !w-[52px] !px-1 text-center tracking-[-0.08em] placeholder:!text-[#613212] placeholder:!opacity-40`}
                  value={value.birthMonth}
                  onChange={(event) => update('birthMonth', event.target.value.replace(/\D/g, ''))}
                  inputMode="numeric"
                  maxLength={2}
                  placeholder="MM"
                  aria-label="월"
                  aria-invalid={hasInvalidBirthDate}
                  aria-describedby={hasInvalidBirthDate ? 'birth-date-error' : undefined}
                />
                <span className="salpim-field-text text-center font-medium text-gray-700">월</span>
                <input
                  className={`${personalInfoInputStyle(value.birthDay !== '')} salpim-birth-date-input !w-[68px] !px-1 text-center tracking-[-0.08em] placeholder:!text-[#613212] placeholder:!opacity-40`}
                  value={value.birthDay}
                  onChange={(event) => update('birthDay', event.target.value.replace(/\D/g, ''))}
                  inputMode="numeric"
                  maxLength={2}
                  placeholder="DD"
                  aria-label="일"
                  aria-invalid={hasInvalidBirthDate}
                  aria-describedby={hasInvalidBirthDate ? 'birth-date-error' : undefined}
                />
                <span className="salpim-field-text text-right font-medium text-gray-700">일</span>
              </div>
              {hasInvalidBirthDate && (
                <p
                  id="birth-date-error"
                  role="alert"
                  className="mt-2 px-2 text-sm font-normal text-red-500 opacity-80"
                >
                  {birthDateValidation === 'too-old'
                    ? `만 ${MAX_SIGNUP_AGE}세를 초과하는 생년월일은 입력할 수 없습니다.`
                    : '유효하지 않은 생년월일입니다. 생년월일을 확인해주세요!'}
                </p>
              )}
            </div>

            {/* 성별 */}
            <div>
              <span className={labelStyle}>성별</span>
              <div className="-mx-0.5 flex gap-[13px]">
                {(['female', 'male'] as const).map((gender) => {
                  const selected = value.gender === gender;
                  return (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => update('gender', gender)}
                      className={`salpim-field-text flex h-14 flex-1 items-center justify-center rounded-full border-4 py-0 !font-semibold transition-colors ${
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
              <div className="flex gap-1.5">
                <input
                  id="phone"
                  className={`${personalInfoInputStyle(value.phone !== '')} min-w-0 flex-1 placeholder:!text-[#613212] placeholder:!opacity-40`}
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
                  className="salpim-field-text h-[52px] w-[109px] shrink-0 rounded-[26px] bg-brand-100 px-0 !font-semibold text-brand-600 transition-colors hover:bg-brand-200 disabled:cursor-not-allowed disabled:opacity-50"
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
                    className="salpim-field-text shrink-0 rounded-2xl bg-brand-500 px-4 !font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-brand-200"
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
              {!phoneMessage && externalErrorMessage && (
                <p role="alert" className="mt-2 text-sm font-bold text-red-500">
                  {externalErrorMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="-mx-0.5 flex shrink-0 gap-4 pt-4">
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
