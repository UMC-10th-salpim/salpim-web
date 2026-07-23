import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import FontSizeSettings from '@/features/mypage/FontSizeSettings';

const FontSizePage = () => {
  return (
    <div className="mypage-screen mx-auto max-w-md">
      <HeaderBar title="글자 크기 설정" />
      <FontSizeSettings />
      <BottomNavigation />
    </div>
  );
};

export default FontSizePage;
