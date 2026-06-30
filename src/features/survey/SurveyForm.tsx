import { useState } from 'react';
import QuestionCard, { type QuestionOption } from '@/features/survey/QuestionCard';

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
      { value: 'medical', label: '의료 지원이 필요해요', icon: '🩺' },
      { value: 'living', label: '생활비가 부족해요', icon: '💰' },
      { value: 'housing', label: '주거 지원이 필요해요', icon: '🏠' },
      { value: 'care', label: '돌봄이 필요해요', icon: '🤝' },
      { value: 'culture', label: '문화 활동을 하고 싶어요', icon: '🎨' },
      { value: 'job', label: '일자리를 찾고 있어요', icon: '💼' },
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
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => setStep((prev) => Math.max(0, prev - 1));

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-brand-50/40 px-5 pb-6 pt-4">
      {/* 진행 표시 */}
      <div className="mb-6 flex items-center justify-center gap-2">
        {questions.map((question, index) => (
          <span
            key={question.id}
            className={`h-2 rounded-full transition-all ${
              index === step ? 'w-6 bg-brand-500' : 'w-2 bg-brand-200'
            }`}
          />
        ))}
      </div>

      {/* 마스코트 */}
      <div className="mb-4 flex justify-center text-5xl" aria-hidden>
        🐶
      </div>

      <QuestionCard
        question={questionText}
        options={current.options}
        value={currentValue}
        onChange={handleChange}
        multiple={current.multiple}
        className="whitespace-pre-line"
      />

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
          className="flex-[2] rounded-xl bg-brand-500 py-3.5 font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-brand-200"
        >
          {isLast ? '완료' : '다음'}
        </button>
      </div>
    </div>
  );
};

export default SurveyForm;
