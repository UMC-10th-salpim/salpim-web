import QuestionCard from '@/features/survey/QuestionCard';
import { type SurveyQuestion } from '@/apis/survey';
import { useNavigate } from 'react-router-dom';

interface SurveyFormProps {
  current : SurveyQuestion;
  currentValue : number | number[];
  answered: boolean;
  step : number;
  onChange : (value: number | number []) => void;
  onNext: () => void;
  userName?: string;
};

const SurveyForm = ({
  current,
  currentValue,
  answered,
  step,
  onChange,
  onNext,
  userName = 'OO'
}: SurveyFormProps) => {
  const navigate = useNavigate();

  const questionText =
    step === 0 ? `안녕하세요 ${userName}님!\n${current.question}` : current.question;

  return (
    <div className="mx-auto flex min-h-[100svh] max-w-md flex-col bg-brand-50/40 px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-4">
      {/*탭*/}
      <div className='flex justify-center gap-4 mb-4 mx-11'>
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
          onChange={onChange}
          multiple={current.multiple}
          className="whitespace-pre-line break-keep text-balance"
        />
      </div>

      {/*다음*/}
      <div className="flex gap-3 pt-6">
        <button
          type="button"
          onClick={onNext}
          disabled={!answered}
          className="w-full rounded-full bg-[#FF8A3D] px-[130.5px] py-[13px] font-semibold text-[32px] text-white disabled:bg-[#DDDDDD] disabled:cursor-not-allowed"
        >
          {'다음'}
        </button>
      </div>
    </div>
  );
};

export default SurveyForm;
