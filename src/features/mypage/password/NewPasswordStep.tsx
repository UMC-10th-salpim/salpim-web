import { useState } from 'react';
import Keypad from '@/components/common/Keypad/Keypad';
import Modal from '@/components/common/Modal/Modal';

interface NewPasswordStepProps {
  onSaved: () => void;
}

const NewPasswordStep = ({ onSaved }: NewPasswordStepProps) => {
  const [value, setValue] = useState('');
  const [firstValue, setFirstValue] = useState('');
  const [phase, setPhase] = useState<'new' | 'confirm'>('new');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSubmit = () => {
    if (phase === 'new') {
      setFirstValue(value);
      setValue('');
      setError('');
      setPhase('confirm');
      return;
    }

    if (value !== firstValue) {
      setValue('');
      setError('비밀번호가 달라요. 다시 입력해 주세요.');
      return;
    }

    // TODO: 새 비밀번호 저장 API 연동
    setSaved(true);
  };

  return (
    <main className="mypage-content gap-5">
      <h2 className="text-center text-[20px] font-extrabold leading-7 text-[#43230F]">
        {phase === 'new' ? (
          <>
            새로운 비밀번호 6자리를
            <br />
            입력해 주세요.
          </>
        ) : (
          '한번 더 입력해 주세요.'
        )}
      </h2>

      <div aria-live="polite" className="min-h-6 text-center">
        {error && <p className="text-[16px] font-bold text-red-500">{error}</p>}
      </div>

      <Keypad
        value={value}
        onChange={(nextValue) => {
          setValue(nextValue);
          setError('');
        }}
        onSubmit={handleSubmit}
        submitLabel="다음"
      />

      <Modal
        open={saved}
        title="비밀번호가 변경되었어요!"
        confirmText="확인"
        onConfirm={onSaved}
        onClose={() => setSaved(false)}
      >
        새 비밀번호로 로그인해 주세요.
      </Modal>
    </main>
  );
};

export default NewPasswordStep;
