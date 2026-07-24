import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Keypad from '@/components/common/Keypad/Keypad';
import { MOCK_PASSWORD } from '@/apis/mypage';

interface CurrentPasswordStepProps {
  onVerified: () => void;
}

const CurrentPasswordStep = ({ onVerified }: CurrentPasswordStepProps) => {
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const handleChange = (next: string) => {
    setValue(next);
    setError(false);
  };

  const handleSubmit = () => {
    if (value === MOCK_PASSWORD) {
      onVerified();
    } else {
      setError(true);
      setValue('');
    }
  };

  return (
    <main className="mypage-content gap-5">
      <h2 className="text-center text-[20px] font-extrabold leading-7 text-[#43230F]">
        현재 비밀번호 6자리를
        <br />
        입력해 주세요.
      </h2>

      <div aria-live="polite" className="min-h-6 text-center">
        {error && <p className="text-[16px] font-bold text-red-500">비밀번호가 일치하지 않아요.</p>}
      </div>

      <Keypad value={value} onChange={handleChange} onSubmit={handleSubmit} submitLabel="다음" />

      <div className="mt-auto border-t border-[#E8E0D8] pt-3 text-center">
        <p className="mb-2 text-[16px] font-semibold text-[#8A817A]">비밀번호를 잊으셨나요?</p>
        <button
          type="button"
          onClick={() => navigate('/mypage/password/find')}
          className="min-h-11 rounded-full border-2 border-[#FFD29E] bg-white px-5 text-[18px] font-extrabold text-[#FF7A32]"
        >
          비밀번호 찾기
        </button>
      </div>
    </main>
  );
};

export default CurrentPasswordStep;
