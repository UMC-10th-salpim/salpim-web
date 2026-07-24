import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import LikedBenefits from '@/features/mypage/LikedBenefits';

const LikedBenefitsPage = () => {
  return (
    <div className="mypage-screen mx-auto max-w-md">
      <HeaderBar title="찜한 혜택" />
      <LikedBenefits />
      <BottomNavigation />
    </div>
  );
};

export default LikedBenefitsPage;
