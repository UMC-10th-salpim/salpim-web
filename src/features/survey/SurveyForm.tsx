import { useState } from 'react';
import QuestionCard from '@/features/survey/QuestionCard';
import { SECOND_QUESTIONS, type SurveyQuestion, type SurveyAnswers } from '@/apis/survey';
import { useNavigate } from 'react-router-dom';

interface SurveyFormProps {
  userName?: string;
  onComplete?: (answers: SurveyAnswers) => void;
};

// 1 단계 질문
const firstQuestion : SurveyQuestion = {
    id: 'needs',
    question: '어떤 도움이 필요하세요?',
    options: [
      { value: 'medical', label: '의료 지원이 필요해요', icon: '/icons/benefit/hospital.png' },
      { value: 'living', label: '생활비가 부족해요', icon: '/icons/benefit/money.png' },
      { value: 'housing', label: '주거 지원이 필요해요', icon: '/icons/benefit/house.png' },
      { value: 'care', label: '돌봄이 필요해요', icon: '/icons/benefit/handshake.png' },
      { value: 'culture', label: '문화 활동을 하고 싶어요', icon: '/icons/benefit/mask.png' },
      { value: 'job', label: '일자리를 찾고 있어요', icon: '/icons/benefit/work.png' },
    ],
  };

const SurveyForm = ({ userName = 'OO', onComplete }: SurveyFormProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [secondQuestion, setSecondQuestion] = useState<SurveyQuestion | null >(null); 

  const questions = secondQuestion
    ? [firstQuestion, secondQuestion]
    : [firstQuestion];
  const current = questions[step];
  const isLast = step === questions.length - 1;
  const currentValue = answers[current.id] ?? '';
  const answered = currentValue !== '';

  const questionText =
    step === 0 ? `안녕하세요 ${userName}님!\n${current.question}` : current.question;

  const handleChange = (value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));

    // 1단계 선택 시 2단계 질문 설정
    if (step===0) {
      setSecondQuestion(SECOND_QUESTIONS[value as string] ?? null);
    }
  };

  const handleNext = () => {
    if (isLast) {
      onComplete?.(answers);
      navigate('/benefits')
      return;
    }
    setStep((prev) => prev + 1);
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-brand-50/40 px-4 pb-26 pt-4">
      {/*탭*/}
      <div className='flex justify-center gap-4 mb-4'>
        <button className='rounded-full px-4 py-3 text-xl font-semibold bg-[#FF8A3D] text-white'>
          살피미 추천
        </button>
        <button className="rounded-full w-33 px-4 py-3 text-xl font-semibold border border-[#FFD7AA] border-3 text-[#FF8A3D]"
          onClick={() => navigate('/benefits/search')}
        >
          직접 찾기
        </button>
      </div>

      {/* 진행 표시 */}
      <div className='flex justify-center mb-10'>
        <img 
          src={step === 0 ? '/icons/bar/half.png' : '/icons/bar/full.png'}
          alt="진행 상황"
          className='w-full'
        />
      </div>

      {/* 말풍선 */}
      <div className="flex items-center mb-2.5">
        <img src='/characters/salpimi_Dog.png' className='w-22 h-22 shrink-0'/>
        <div className="bg-[#FFF3EB] rounded-[20px] rounded-bl-[1px] border border-[#FF913D] border-[0.5px] px-2.5 py-2.5">
          <span className='text-2xl font-regular text-[#613212] whitespace-pre-line'>{questionText}</span>
        </div>
      </div>

      <div className='pl-20'>
        <QuestionCard
          options={current.options}
          value={currentValue}
          onChange={handleChange}
          multiple={current.multiple}
          className="whitespace-pre-line"
        />
      </div>

      {/*다음*/}
      <div className="flex gap-3 pt-6">
        <button
          type="button"
          onClick={handleNext}
          disabled={!answered}
          className="w-full rounded-full bg-[#FF8A3D] px-[130.5px] py-[13px] font-semibold text-[32px] text-white disabled:cursor-not-allowed"
        >
          {'다음'}
        </button>
      </div>
    </div>
  );
};

export default SurveyForm;
