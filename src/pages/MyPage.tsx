import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import MyPageMenu from '@/features/mypage/MyPageMenu';
import LargeMyPageMenu from '@/features/mypage/LargeMyPageMenu';
import useSettingsStore from '@/store/settingsStore';

const MyPage = () => {
  const isLarge = useSettingsStore((state) => state.fontSize === 'large');

  return (
    <div className="mypage-screen mx-auto max-w-md">
      <HeaderBar title="마이페이지" className={isLarge ? '!h-14 [&_h1]:!text-[25px]' : ''} />
      {isLarge ? <LargeMyPageMenu /> : <MyPageMenu />}
      <BottomNavigation />
    </div>
  );
};

export default MyPage;
