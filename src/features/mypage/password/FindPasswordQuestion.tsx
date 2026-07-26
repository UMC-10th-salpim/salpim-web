import { useState } from 'react';
import { getApiErrorMessage } from '@/apis/auth';
import { SECURITY_QUESTION, mypageApi } from '@/apis/mypage';
import { inputStyle, primaryButton } from '@/features/onboarding/styles';

interface FindPasswordQuestionProps {
  onVerified: (recoveryAnswer: string) => void;
}

const FindPasswordQuestion = ({ onVerified }: FindPasswordQuestionProps) => {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);

  const handleSubmit = async () => {
    if (verifying) return;
    setVerifying(true);
    setError('');

    try {
      const isVerified = await mypageApi.verifyRecoveryAnswer(answer.trim());
      if (!isVerified) {
        setError('답변이 일치하지 않아요.');
        return;
      }
      onVerified(answer.trim());
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, '답변을 확인하지 못했어요.'));
    } finally {
      setVerifying(false);
    }
  };

  return (
    <main className="mypage-content gap-5 text-center">
      <div>
        <h2 className="text-[22px] font-extrabold text-[#292524]">{SECURITY_QUESTION}</h2>
        <input
          className={`${inputStyle} mt-3 !min-h-[52px] !border-2 !border-[#FFD29E] !text-[18px]`}
          value={answer}
          onChange={(event) => {
            setAnswer(event.target.value);
            setError('');
          }}
          placeholder="답변을 적어 주세요."
          aria-label="답변"
        />
        {error && (
          <p className="mt-2 text-[16px] font-bold text-red-500">{error}</p>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 py-2">
        <img
          src="/characters/salpimi_Search.png"
          alt="돋보기를 든 살피미"
          className="w-[150px] max-w-[44vw]"
        />
        <p className="text-[18px] font-extrabold leading-7 text-[#613212]">
          회원가입할 때 적었던 답변을 입력하면
          <br />
          비밀번호를 바꿀 수 있어요!
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          void handleSubmit();
        }}
        disabled={!answer.trim() || verifying}
        className={`${primaryButton} !min-h-14 !flex-none !text-[22px]`}
      >
        {verifying ? '확인 중...' : '새 비밀번호로 바꾸기'}
      </button>
    </main>
  );
};

export default FindPasswordQuestion;
