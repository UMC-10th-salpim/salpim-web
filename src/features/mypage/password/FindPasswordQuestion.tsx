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
      const message = getApiErrorMessage(requestError, '답변을 확인하지 못했어요.');
      setError(
        message
          .replaceAll('비밀번호 찾기 답변', '답변')
          .replaceAll('비밀번호 복구 답변', '답변')
      );
    } finally {
      setVerifying(false);
    }
  };

  return (
    <main className="mypage-content gap-5 text-center">
      <div>
        <h2 className="text-[26px] font-extrabold leading-[1.3] text-[#292524]">{SECURITY_QUESTION}</h2>
        <input
          className={`${inputStyle} mt-3 !min-h-[58px] !border-2 !border-[#FFD29E] !text-[22px]`}
          value={answer}
          onChange={(event) => {
            setAnswer(event.target.value);
            setError('');
          }}
          placeholder="답변을 적어 주세요."
          aria-label="답변"
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 py-2">
        <img
          src={error ? '/assets/Salpimi/No.png' : '/assets/Salpimi/Search.png'}
          alt={error ? '풀이 죽은 살피미' : '돋보기를 든 살피미'}
          className="h-[220px] w-[220px] max-h-[58vw] max-w-[58vw] object-contain"
        />
        <p aria-live="polite" className="text-[22px] font-extrabold leading-[1.4] text-[#613212]">
          {error ? (
            <>
              {error}
              <br />
              다시 입력해 주세요.
            </>
          ) : (
            <>
              회원가입할 때 적었던 답변을 입력하면
              <br />
              비밀번호를 바꿀 수 있어요!
            </>
          )}
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          void handleSubmit();
        }}
        disabled={!answer.trim() || verifying}
        className={`${primaryButton} !min-h-16 !flex-none !text-[26px]`}
      >
        {verifying ? '확인 중...' : '새 비밀번호로 바꾸기'}
      </button>
    </main>
  );
};

export default FindPasswordQuestion;
