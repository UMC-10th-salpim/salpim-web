import { useState } from 'react';
import { SECURITY_QUESTION, MOCK_SECURITY_ANSWER } from '@/apis/mypage';
import { inputStyle, primaryButton } from '@/features/onboarding/styles';

interface FindPasswordQuestionProps {
  onVerified: () => void;
}

const FindPasswordQuestion = ({ onVerified }: FindPasswordQuestionProps) => {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (answer.trim() === MOCK_SECURITY_ANSWER) {
      onVerified();
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 pb-10 text-center">
      <img src="/characters/salpimi_Search.png" alt="살피미" className="w-24 self-center" />

      <div>
        <p className="text-lg font-bold text-gray-900">{SECURITY_QUESTION}</p>
        <input
          className={`${inputStyle} mt-4`}
          value={answer}
          onChange={(event) => {
            setAnswer(event.target.value);
            setError(false);
          }}
          placeholder="답변을 적어 주세요."
          aria-label="답변"
        />
        {error && (
          <p className="mt-2 text-sm font-semibold text-red-500">답변이 일치하지 않아요.</p>
        )}
      </div>

      <p className="text-sm leading-6 text-gray-500">
        회원가입할 때 적었던 답변을 입력하면
        <br />
        비밀번호를 찾을 수 있어요.
      </p>

      <button type="button" onClick={handleSubmit} disabled={!answer.trim()} className={primaryButton}>
        확인
      </button>
    </div>
  );
};

export default FindPasswordQuestion;
