import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSettingsStore from '@/store/settingsStore';
import { toServerWordSize } from '@/store/settingsStore';
import type { FontSize } from '@/store/settingsStore';
import { primaryButton } from '@/features/onboarding/styles';
import { mypageApi } from '@/apis/mypage';
import { getApiErrorMessage } from '@/apis/auth';

const OPTIONS: { value: FontSize; label: string }[] = [
  { value: 'medium', label: '중간' },
  { value: 'large', label: '크게' },
];

const FontSizeSettings = () => {
  const navigate = useNavigate();
  const fontSize = useSettingsStore((state) => state.fontSize);
  const setFontSize = useSettingsStore((state) => state.setFontSize);
  const [selected, setSelected] = useState<FontSize>(fontSize);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    setSaveError('');

    try {
      await mypageApi.updateWordSize(toServerWordSize(selected));
      setFontSize(selected);
      navigate(-1);
    } catch (error) {
      setSaveError(getApiErrorMessage(error, '글자 크기를 저장하지 못했어요. 다시 시도해 주세요.'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="mypage-content gap-7">
      <div className="grid grid-cols-2 gap-4 pt-4">
        {OPTIONS.map((option) => {
          const active = selected === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelected(option.value)}
              aria-pressed={active}
              className={`flex min-h-[112px] items-center justify-center rounded-[20px] border-2 font-extrabold shadow-[0_4px_10px_rgba(73,45,24,0.10)] transition-colors ${
                option.value === 'large' ? 'text-[30px]' : 'text-[22px]'
              } ${
                active
                  ? 'border-[#FFB700] bg-[#FFB700] text-[#292524]'
                  : 'border-[#FFE2BC] bg-[#FFEBD1] text-[#292524] hover:border-[#FFD29E]'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <section>
        <h2 className="mb-2 text-[18px] font-extrabold text-[#613212]">미리보기</h2>
        <div className="min-h-[150px] rounded-[16px] border-2 border-[#E5E1DC] bg-white p-4">
          <p
            className={`font-extrabold leading-tight text-[#292524] ${
              selected === 'large' ? 'text-[30px]' : 'text-[22px]'
            }`}
          >
            노인 의료비 지원
          </p>
          <p
            className={`mt-3 font-bold text-[#292524] ${
              selected === 'large' ? 'text-[24px] leading-8' : 'text-[18px] leading-6'
            }`}
          >
            병원 갈 때 드는 돈을 나라에서 일부 도와주는 제도예요!
          </p>
        </div>
      </section>

      <button
        type="button"
        onClick={() => void handleSave()}
        disabled={isSaving}
        className={`${primaryButton} !mt-auto !min-h-14 !flex-none !bg-[#FF843D] !text-[22px] hover:!bg-[#FF843D]`}
      >
        {isSaving ? '저장 중...' : '저장하기'}
      </button>
      {saveError && (
        <p role="alert" className="text-center text-sm font-semibold text-red-500">
          {saveError}
        </p>
      )}
    </main>
  );
};

export default FontSizeSettings;
