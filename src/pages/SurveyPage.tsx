import BottomNavigation from "@/components/common/BottomNavigation/BottomNavigation";
import HeaderBar from "@/components/common/HeaderBar/HeaderBar";
import SurveyForm from "@/features/survey/SurveyForm";
import { SECOND_QUESTIONS, surveyApi, type SurveyQuestion, type SurveyAnswers } from "@/apis/survey";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useUserStore from "@/store/userStore";

// 1 단계 질문
const firstQuestion : SurveyQuestion = {
    id: 'needs',
    question: '어떤 도움이 필요하세요?',
    options: [
      { value: 1, label: '의료 지원이 필요해요', icon: '/icons/benefit/hospital.png' },
      { value: 2, label: '생활비가 부족해요', icon: '/icons/benefit/money.png' },
      { value: 4, label: '주거 지원이 필요해요', icon: '/icons/benefit/house.png' },
      { value: 3, label: '돌봄이 필요해요', icon: '/icons/benefit/handshake.png' },
      { value: 6, label: '문화 활동을 원해요', icon: '/icons/benefit/mask.png' },
      { value: 5, label: '일자리를 찾고 있어요', icon: '/icons/benefit/work.png' },
    ],
  };

const SurveyPage = () => {
  const navigate = useNavigate();
  const userName = useUserStore((state)=>state.name)
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [secondQuestion, setSecondQuestion] = useState<SurveyQuestion | null >(null);

  const questions = secondQuestion
    ? [firstQuestion, secondQuestion]
    : [firstQuestion];
  const current = questions[step];
  const isLast = step === questions.length - 1;
  const currentValue = answers[current.id] ?? 0;
  const answered = currentValue !== 0;

  const [isLoadingSecond, setIsLoadingSecond] = useState(false);

  const handleChange = async (value: number | number[]) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));

    // 1단계 선택 시 2단계 질문 설정
    if (step===0) {
      const categoryId = value as number;
      setIsLoadingSecond(true);

      try {
        const options = await surveyApi.getSecondQuestionOptions(categoryId);
        const questionText = SECOND_QUESTIONS[categoryId]?.question ?? '';

        setSecondQuestion({
          id : `category_${categoryId}_detail`,
          question : questionText,
          options : options
            .sort((a,b)=> a.optionOrder - b.optionOrder)
            .map((opt)=>({
              value : opt.optionId,
              label: opt.optionText,
            })),
        });
      } catch (error) {
        console.error('2단계 질문 조회 실패', error);
        // TODO : API 실패 시 mock 데이터 사용
        setSecondQuestion(SECOND_QUESTIONS[categoryId] ?? null);
      } finally {
        setIsLoadingSecond(false);
      }
    }
  };

  // 다음
  const handleNext = () => {
    if (isLast) {
      const optionId = answers[current.id] as number;
      navigate('/benefits', {state : {source: 'survey', optionId}})
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
    <div className="mx-auto flex min-h-[100svh] max-w-md flex-col bg-[#FAF8F3]">
      <HeaderBar title="혜택 안내" onBack={handleBack}/>
      <SurveyForm
        current={current}
        currentValue={currentValue}
        answered={answered && !isLoadingSecond}
        step={step}
        onChange={handleChange}
        onNext={handleNext}
        userName={userName ?? undefined}
      />
      <BottomNavigation/>
    </div>
  );
};

export default SurveyPage;
