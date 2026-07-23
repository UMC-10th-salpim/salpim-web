import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import MyPageMenu from '@/features/mypage/MyPageMenu';

const MyPage = () => {
  return (
    <div className="mypage-screen mx-auto max-w-md">
      <HeaderBar title="마이페이지" />
      <MyPageMenu />
      <BottomNavigation />
    </div>
  );
};

export default MyPage;
