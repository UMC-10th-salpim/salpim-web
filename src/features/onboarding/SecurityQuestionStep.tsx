import { labelStyle, pillInputStyle, primaryButton } from './styles';

export interface SecurityData {
  question: string;
  answer: string;
}

const SECURITY_QUESTION = '내가 가장 좋아하는 계절은?';

interface SecurityQuestionStepProps {
  value: SecurityData;
  onChange: (data: SecurityData) => void;
  onNext: () => void;
}

const SecurityQuestionStep = ({ value, onChange, onNext }: SecurityQuestionStepProps) => {
  const isValid = value.answer.trim() !== '';

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-col justify-start pb-2 pt-[clamp(6px,1.02vh,8px)]">
          <h1 className="salpim-page-title text-center font-bold leading-10 text-[#613212]">
            비밀번호를 잊었을 때를 위한
            <br />
            질문이에요!
          </h1>
          <p className="salpim-page-description mb-10 mt-2 text-center font-semibold leading-8 text-brand-500">
            질문에 대한 답을 알면
            <br />
            비밀번호를 찾을 수 있어요.
          </p>

          <div>
            <p className={labelStyle}>{SECURITY_QUESTION}</p>
            <input
              className={pillInputStyle}
              value={value.answer}
              onChange={(event) =>
                onChange({ question: SECURITY_QUESTION, answer: event.target.value })
              }
              placeholder="답변을 적어 주세요."
              aria-label="답변"
            />
          </div>
        </div>
      </div>

      <div className="-mx-0.5 flex shrink-0 pt-4">
        <button type="button" onClick={onNext} disabled={!isValid} className={primaryButton}>
          다음
        </button>
      </div>
    </>
  );
};

export default SecurityQuestionStep;
