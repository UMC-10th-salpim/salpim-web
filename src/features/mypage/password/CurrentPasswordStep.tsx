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
    <div className="flex flex-col gap-6 p-4 pb-10">
      <h1 className="text-center text-lg font-bold text-gray-900">
        현재 비밀번호 6자리를
        <br />
        입력해 주세요.
      </h1>

      {error && <p className="text-sm font-semibold text-red-500">비밀번호가 일치하지 않아요.</p>}

      <Keypad value={value} onChange={handleChange} onSubmit={handleSubmit} />

      <div className="text-center text-sm text-gray-500">
        비밀번호를 잊으셨나요?{' '}
        <button
          type="button"
          onClick={() => navigate('/mypage/password/find')}
          className="font-bold text-brand-500"
        >
          비밀번호 찾기
        </button>
      </div>
    </div>
  );
};

export default CurrentPasswordStep;
