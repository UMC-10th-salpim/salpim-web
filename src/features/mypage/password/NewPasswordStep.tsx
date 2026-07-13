import { useState } from 'react';
import Keypad from '@/components/common/Keypad/Keypad';
import Modal from '@/components/common/Modal/Modal';

interface NewPasswordStepProps {
  onSaved: () => void;
}

const NewPasswordStep = ({ onSaved }: NewPasswordStepProps) => {
  const [value, setValue] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSubmit = () => {
    // TODO: 새 비밀번호 저장 API 연동
    setSaved(true);
  };

  return (
    <div className="flex flex-col gap-6 p-4 pb-10">
      <h1 className="text-center text-lg font-bold text-gray-900">
        새로운 비밀번호 6자리를
        <br />
        입력해 주세요.
      </h1>

      <Keypad value={value} onChange={setValue} onSubmit={handleSubmit} />

      <Modal
        open={saved}
        title="비밀번호가 변경되었어요!"
        confirmText="확인"
        onConfirm={onSaved}
        onClose={() => setSaved(false)}
      >
        새 비밀번호로 로그인해 주세요.
      </Modal>
    </div>
  );
};

export default NewPasswordStep;
