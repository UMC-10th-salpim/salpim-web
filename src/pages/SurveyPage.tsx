import BottomNavigation from "@/components/common/BottomNavigation/BottomNavigation";
import HeaderBar from "@/components/common/HeaderBar/HeaderBar";
import SurveyForm from "@/features/survey/SurveyForm";
import { SECOND_QUESTIONS, type SurveyQuestion, type SurveyAnswers } from "@/apis/survey";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// 1 단계 질문
const firstQuestion : SurveyQuestion = {
    id: 'needs',
    question: '어떤 도움이 필요하세요?',
    options: [
      { value: 'medical', label: '의료 지원이 필요해요', icon: '/icons/benefit/hospital.png' },
      { value: 'living', label: '생활비가 부족해요', icon: '/icons/benefit/money.png' },
      { value: 'housing', label: '주거 지원이 필요해요', icon: '/icons/benefit/house.png' },
      { value: 'care', label: '돌봄이 필요해요', icon: '/icons/benefit/handshake.png' },
      { value: 'culture', label: '문화 활동을 원해요', icon: '/icons/benefit/mask.png' },
      { value: 'job', label: '일자리를 찾고 있어요', icon: '/icons/benefit/work.png' },
    ],
  };

const SurveyPage = () => {
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

  const handleChange = (value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));

    // 1단계 선택 시 2단계 질문 설정
    if (step===0) {
      setSecondQuestion(SECOND_QUESTIONS[value as string] ?? null);
    }
  };

  // 다음
  const handleNext = () => {
    if (isLast) {
      navigate('/benefits', {state : {source: 'survey'}})
      return;
    }
    setStep((prev) => prev + 1);
  };

  // 뒤로 가기
  const handleBack = () => {
    if (step>0) {
      setStep ((prev) => prev -1);
    } else {
      navigate(-1);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-[#FAF8F3]">
      <HeaderBar title="혜택 안내" onBack={handleBack}/>
      <SurveyForm
        current={current}
        currentValue={currentValue}
        answered={answered}
        step={step}
        onChange={handleChange}
        onNext={handleNext}
      />
      <BottomNavigation/>
    </div>
  );
};

export default SurveyPage;
