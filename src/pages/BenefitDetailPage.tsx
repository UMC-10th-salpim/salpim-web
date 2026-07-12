import { MOCK_BENEFITS } from "@/apis/benefit";
import { useParams } from "react-router-dom";
import BenefitDetail from "@/features/benefit/BenefitDetail";
import HeaderBar from "@/components/common/HeaderBar/HeaderBar";
import BottomNavigation from "@/components/common/BottomNavigation/BottomNavigation";

const BenefitDetailPage = () => {
  const {id} = useParams();
  const benefit = MOCK_BENEFITS.find((b) => b.id === Number(id));

  if(!benefit) return <div>찾을 수 없다</div>;

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-[#FAF8F3] pb-20">
      <HeaderBar title="혜택 자세히 보기"/>
      <BenefitDetail
        isOnline={benefit.isOnline}
        category={benefit.category}
        title={benefit.title}
        icon={benefit.icon}
        deadline={benefit.deadline}
        ageLimit={benefit.ageLimit}
        eligibility={benefit.eligibility}
        benefitContent={benefit.benefitContent}
        targetPerson={benefit.targetPerson}
        url={benefit.url}
        facilityName={benefit.facilityName}
        facilityDistance={benefit.facilityDistance}
        facilityHours={benefit.facilityHours}
        />
      <BottomNavigation/>
    </div>
  );
};

export default BenefitDetailPage;
