import { labelStyle, pillInputStyle, primaryButton } from './styles';

export interface PasswordData {
  password: string;
  confirm: string;
}

interface PasswordStepProps {
  value: PasswordData;
  onChange: (data: PasswordData) => void;
  onNext: () => void;
}

const normalizePassword = (value: string) => value.replace(/\D/g, '').slice(0, 6);

const PasswordStep = ({ value, onChange, onNext }: PasswordStepProps) => {
  const meetsPasswordRule = /^\d{6}$/.test(value.password);
  const mismatch = value.confirm !== '' && value.password !== value.confirm;
  const isValid = meetsPasswordRule && value.password === value.confirm;

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-col justify-start pb-2 pt-[clamp(6px,1.02vh,8px)]">
          <h1 className="text-center text-3xl font-bold text-[#613212]">
            비밀 번호를 설정해 주세요!
          </h1>
          <p className="mb-8 mt-2 text-center text-2xl font-semibold leading-8 text-brand-500">
            로그인할 때 사용할 비밀번호예요
          </p>

          <div className="flex flex-col gap-6">
            <div>
              <label htmlFor="password" className={labelStyle}>
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                inputMode="numeric"
                maxLength={6}
                className={pillInputStyle}
                value={value.password}
                onChange={(event) =>
                  onChange({ ...value, password: normalizePassword(event.target.value) })
                }
                placeholder="숫자 6자리를 입력해 주세요."
              />
              {value.password !== '' && !meetsPasswordRule && (
                <p className="mt-2 text-sm font-semibold text-red-500">
                  숫자 6자리를 입력해 주세요.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirm" className={labelStyle}>
                비밀번호 확인
              </label>
              <input
                id="confirm"
                type="password"
                inputMode="numeric"
                maxLength={6}
                className={pillInputStyle}
                value={value.confirm}
                onChange={(event) =>
                  onChange({ ...value, confirm: normalizePassword(event.target.value) })
                }
                placeholder="숫자 6자리를 한번 더 입력해 주세요."
              />
              {mismatch && (
                <p className="mt-2 text-sm font-semibold text-red-500">
                  비밀번호가 일치하지 않아요.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 pt-4">
        <button type="button" onClick={onNext} disabled={!isValid} className={primaryButton}>
          다음
        </button>
      </div>
    </>
  );
};

export default PasswordStep;
