import { useState } from 'react';
import QuestionCard, { type QuestionOption } from '@/features/survey/QuestionCard';
import { useNavigate } from 'react-router-dom';

export interface SurveyQuestion {
  id: string;
  question: string;
  options: QuestionOption[];
  multiple?: boolean;
}

export type SurveyAnswers = Record<string, string | string[]>;

interface SurveyFormProps {
  questions?: SurveyQuestion[];
  userName?: string;
  onComplete?: (answers: SurveyAnswers) => void;
}

const defaultQuestions: SurveyQuestion[] = [
  {
    id: 'needs',
    question: '어떤 도움이 필요하세요?',
    multiple: true,
    options: [
      { value: 'medical', label: '의료 지원이 필요해요', icon: '/icons/benefit/hospital.png' },
      { value: 'living', label: '생활비가 부족해요', icon: '/icons/benefit/money.png' },
      { value: 'housing', label: '주거 지원이 필요해요', icon: 'icons/benefit/house.png' },
      { value: 'care', label: '돌봄이 필요해요', icon: '/icons/benefit/handshake.png' },
      { value: 'culture', label: '문화 활동을 하고 싶어요', icon: 'icons/benefit/mask.png' },
      { value: 'job', label: '일자리를 찾고 있어요', icon: '/icons/benefit/work.png' },
    ],
  },
  {
    id: 'health',
    question: '건강·병원비가 걱정되시나요?',
    options: [
      { value: 'discomfort', label: '불편한 곳이 있어요' },
      { value: 'cost', label: '병원비가 걱정돼요' },
    ],
  },
];

const SurveyForm = ({ questions = defaultQuestions, userName = 'OO', onComplete }: SurveyFormProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>({});

  const current = questions[step];
  const isLast = step === questions.length - 1;
  const currentValue = answers[current.id] ?? (current.multiple ? [] : '');
  const answered = current.multiple
    ? (currentValue as string[]).length > 0
    : currentValue !== '';

  const questionText =
    step === 0 ? `안녕하세요 ${userName}님\n${current.question}` : current.question;

  const handleChange = (value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  };

  const handleNext = () => {
    if (isLast) {
      onComplete?.(answers);
      navigate('/benefits')
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => setStep((prev) => Math.max(0, prev - 1));

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-brand-50/40 px-5 pb-26 pt-4">
      {/*탭*/}
      <div className='flex justify-center gap-3 mb-6'>
        <button className='rounded-full px-5 py-2 text-base font-bold bg-[#FF8A3D] text-white'>
          살피미 추천
        </button>
        <button className="rounded-full px-5 py-2 text-base font-bold border border-[#FF8A3D] text-[#FF8A3D] bg-white"
          onClick={() => navigate('/benefits/search')}
        >
          직접 찾기
        </button>
      </div>

      {/* 진행 표시 */}
      <div className='flex justify-center mb-4'>
        <img 
          src={step === 0 ? '/icons/bar/half.png' : '/icons/bar/full.png'}
          alt="진행 상황"
          className='w-full'
        />
      </div>

      {/* 말풍선 */}
      <div className="flex items-center gap-3 mb-4">
        <img src='/characters/salpimi_Dog.png' className='w-20 h-20 shrink-0'/>
        <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
          <span className='text-base font-bold text-[#613212] whitespace-pre-line'>{questionText}</span>
        </div>
      </div>

      <QuestionCard
        question=""
        options={current.options}
        value={currentValue}
        onChange={handleChange}
        multiple={current.multiple}
        className="whitespace-pre-line"
      />

      {/*이전 다음*/}
      <div className="mt-auto flex gap-3 pt-6">
        {step > 0 && (
          <button
            type="button"
            onClick={handlePrev}
            className="flex-1 rounded-xl border border-brand-200 bg-white py-3.5 font-semibold text-gray-700 transition-colors hover:bg-brand-50"
          >
            이전
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          disabled={!answered}
          className="flex-[2] rounded-4xl bg-[#FF8A3D] py-3.5 font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-brand-200"
        >
          {isLast ? '완료' : '다음'}
        </button>
      </div>
    </div>
  );
};

export default SurveyForm;
