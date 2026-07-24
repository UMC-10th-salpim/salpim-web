import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '@/components/common/Modal/Modal';
import { inputStyle, labelStyle, primaryButton } from '@/features/onboarding/styles';

const InquiryForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sent, setSent] = useState(false);

  const isValid = title.trim() !== '' && content.trim() !== '';

  const handleSend = () => {
    // TODO: 문의 등록 API 연동
    setSent(true);
  };

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
        onClick={handleSend}
        disabled={!isValid}
        className={`${primaryButton} !mt-auto !min-h-14 !flex-none !text-[22px]`}
      >
        문의 보내기
      </button>

      <Modal
        open={sent}
        title="문의가 접수되었어요!"
        confirmText="확인"
        onConfirm={() => navigate('/mypage')}
        onClose={() => setSent(false)}
      >
        빠르게 확인하고 답변드릴게요.
      </Modal>
    </main>
  );
};

export default InquiryForm;
