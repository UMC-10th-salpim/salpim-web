import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import FontSizeSettings from '@/features/mypage/FontSizeSettings';

const FontSizePage = () => {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-[#FAF8F3] pb-24">
      <HeaderBar title="글자 크기 설정" />
      <FontSizeSettings />
      <BottomNavigation />
    </div>
  );
};

export default FontSizePage;
