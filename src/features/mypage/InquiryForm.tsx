import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { inputStyle, labelStyle, primaryButton } from '@/features/onboarding/styles';

type InquiryStatus = 'form' | 'submitting' | 'success' | 'error';

interface InquiryFormProps {
  onErrorStateChange?: (isError: boolean) => void;
}

const InquiryForm = ({ onErrorStateChange }: InquiryFormProps) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<InquiryStatus>('form');

  const isValid = title.trim() !== '' && content.trim() !== '';

  const handleSend = async () => {
    if (!isValid || status === 'submitting') return;
    setStatus('submitting');

    try {
      // TODO: 문의 등록 API가 제공되면 이 위치에서 요청한다.
      if (!navigator.onLine) throw new Error('offline');
      await Promise.resolve();
      setStatus('success');
      onErrorStateChange?.(false);
    } catch {
      setStatus('error');
      onErrorStateChange?.(true);
    }
  };

  if (status === 'success' || status === 'error') {
    const isSuccess = status === 'success';

    return (
      <main className="mypage-content items-center px-4 pb-0 pt-20 text-center">
        <img
          src="/characters/salpimi_Dog.png"
          alt="강아지 모양 살피미"
          className="h-[132px] w-[164px] object-contain"
        />
        <p className="mt-7 whitespace-pre-line text-[18px] font-extrabold leading-7 text-[#613212]">
          {isSuccess
            ? '문의가 정상적으로 접수되었습니다.'
            : '오류가 발생하였습니다.\n잠시 후 다시 시도해 주세요.'}
        </p>
        <button
          type="button"
          onClick={() => {
            if (isSuccess) {
              navigate('/mypage');
              return;
            }
            setStatus('form');
            onErrorStateChange?.(false);
          }}
          className="mt-auto min-h-[54px] w-full rounded-[10px] bg-[#FF843D] text-[22px] font-extrabold text-white"
        >
          {isSuccess ? '완료하기' : '문의 보내기'}
        </button>
      </main>
    );
  }

  return (
    <main className="mypage-content gap-4">
      <div className="flex flex-col items-center gap-3 pb-1 text-center">
        <img
          src="/characters/salpimi_Talk.png"
          alt="말풍선 모양 살피미"
          className="w-[120px] max-w-[36vw]"
        />
        <p className="text-[20px] font-extrabold leading-7 text-[#43230F]">
          궁금한 점을 자유롭게
          <br />
          적어 주세요.
        </p>
      </div>

      <div>
        <label htmlFor="title" className={`${labelStyle} !mb-1.5 !text-[18px] !text-[#613212]`}>
          제목
        </label>
        <input
          id="title"
          className={`${inputStyle} !min-h-[52px] !border-2 !border-[#FFD29E] !text-[18px]`}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="제목을 입력해 주세요"
        />
      </div>

      <div>
        <label htmlFor="content" className={`${labelStyle} !mb-1.5 !text-[18px] !text-[#613212]`}>
          문의 내용
        </label>
        <textarea
          id="content"
          className={`${inputStyle} min-h-[132px] resize-none !rounded-[20px] !border-2 !border-[#FFD29E] !text-[18px]`}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="문의하실 내용을 입력해 주세요"
        />
      </div>

      <button
        type="button"
        onClick={() => void handleSend()}
        disabled={!isValid || status === 'submitting'}
        className={`${primaryButton} !mt-auto !min-h-14 !flex-none !text-[22px]`}
      >
        {status === 'submitting' ? '문의 보내는 중...' : '문의 보내기'}
      </button>
    </main>
  );
};

export default InquiryForm;
