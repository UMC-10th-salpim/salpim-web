//   return (
//         <button
//           type="button"
//           onClick={goResults}
//           className="rounded-2xl bg-brand-500 py-4 text-lg font-bold text-white transition-colors hover:bg-brand-600"
//         >
//           결과 확인하기
//         </button>
//       </div>

import BottomNavigation from "@/components/common/BottomNavigation/BottomNavigation";
import HeaderBar from "@/components/common/HeaderBar/HeaderBar";
import BenefitSearchForm from "@/features/search/BenefitSearchForm";

const BenefitSearchPage = () => {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-[#FAF8F3]">
      <HeaderBar title="혜택 안내" />
      <BenefitSearchForm />
      <BottomNavigation />
    </div>
  );
};

export default BenefitSearchPage;