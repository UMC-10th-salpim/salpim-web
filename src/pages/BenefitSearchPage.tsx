import BottomNavigation from "@/components/common/BottomNavigation/BottomNavigation";
import HeaderBar from "@/components/common/HeaderBar/HeaderBar";
import ScrollMoreIndicator from "@/components/common/ScrollMoreIndicator/ScrollMoreIndicator";
import BenefitSearchForm from "@/features/search/BenefitSearchForm";

const BenefitSearchPage = () => {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-[#FAF8F3]">
      <HeaderBar title="혜택 안내" className="salpim-header-title"/>
      <BenefitSearchForm />
      <ScrollMoreIndicator/>
      <BottomNavigation />
    </div>
  );
};

export default BenefitSearchPage;