import BottomNavigation from "@/components/common/BottomNavigation/BottomNavigation";
import HeaderBar from "@/components/common/HeaderBar/HeaderBar";
import SurveyForm from "@/features/survey/SurveyForm";

const SurveyPage = () => {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-[#FAF8F3]">
      <HeaderBar title="혜택 안내"/>
      <SurveyForm/>
      <BottomNavigation/>
    </div>
  );
};

export default SurveyPage;
