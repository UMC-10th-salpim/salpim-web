import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSettingsStore from '@/store/settingsStore';
import type { FontSize } from '@/store/settingsStore';
import { primaryButton } from '@/features/onboarding/styles';

const OPTIONS: { value: FontSize; label: string }[] = [
  { value: 'medium', label: '중간' },
  { value: 'large', label: '크게' },
];

const FontSizeSettings = () => {
  const navigate = useNavigate();
  const fontSize = useSettingsStore((state) => state.fontSize);
  const setFontSize = useSettingsStore((state) => state.setFontSize);
  const [selected, setSelected] = useState<FontSize>(fontSize);

  const handleSave = () => {
    setFontSize(selected);
    navigate(-1);
  };

  return (
    <div className="flex flex-col gap-6 p-4 pb-10">
      <div className="flex gap-3">
        {OPTIONS.map((option) => {
          const active = selected === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelected(option.value)}
              className={`flex-1 rounded-2xl border py-4 text-base font-bold transition-colors ${
                active
                  ? 'border-brand-500 bg-brand-400 text-white'
                  : 'border-brand-200 bg-white text-gray-500 hover:border-brand-300'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div>
        <h2 className="mb-2 text-base font-bold text-[#613212]">미리보기</h2>
        <div className="rounded-2xl border border-brand-200 bg-white p-4">
          <p
            className={`font-bold text-gray-900 ${selected === 'large' ? 'text-xl' : 'text-base'}`}
          >
            노인 의료비 지원
          </p>
          <p
            className={`mt-2 leading-7 text-gray-700 ${
              selected === 'large' ? 'text-lg' : 'text-sm'
            }`}
          >
            병원 갈 때 드는 돈을 나라에서 일부 도와주는 제도예요!
          </p>
        </div>
      </div>

      <button type="button" onClick={handleSave} className={primaryButton}>
        저장하기
      </button>
    </div>
  );
};

export default FontSizeSettings;
