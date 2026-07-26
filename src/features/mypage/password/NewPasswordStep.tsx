import { useState } from 'react';
import Keypad from '@/components/common/Keypad/Keypad';
import Modal from '@/components/common/Modal/Modal';
import { getApiErrorMessage } from '@/apis/auth';
import { mypageApi } from '@/apis/mypage';
import type { PasswordVerificationMethod } from '@/apis/mypage';

interface NewPasswordStepProps {
  onSaved: () => void;
  verificationMethod: PasswordVerificationMethod;
  currentPassword?: string;
  recoveryAnswer?: string;
}

const NewPasswordStep = ({
  onSaved,
  verificationMethod,
  currentPassword,
  recoveryAnswer,
}: NewPasswordStepProps) => {
  const [value, setValue] = useState('');
  const [firstValue, setFirstValue] = useState('');
  const [phase, setPhase] = useState<'new' | 'confirm'>('new');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
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

    if (saving) return;
    setSaving(true);
    setError('');

    try {
      await mypageApi.changePassword({
        verificationMethod,
        currentPassword,
        recoveryAnswer,
        newPassword: value,
      });
      setSaved(true);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, '비밀번호를 변경하지 못했어요.'));
    } finally {
      setSaving(false);
    }
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
        onSubmit={() => {
          void handleSubmit();
        }}
        disabled={saving}
        submitLabel={saving ? '저장 중...' : '다음'}
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
