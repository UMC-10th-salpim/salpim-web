import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import LikedBenefits from '@/features/mypage/LikedBenefits';

const LikedBenefitsPage = () => {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-[#FAF8F3] pb-24">
      <HeaderBar title="찜한 혜택" />
      <LikedBenefits />
      <BottomNavigation />
    </div>
  );
};

export default LikedBenefitsPage;
