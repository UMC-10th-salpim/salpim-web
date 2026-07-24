import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import EditProfile from '@/features/mypage/EditProfile';

const EditProfilePage = () => {
  return (
    <div className="mypage-screen mx-auto max-w-md">
      <HeaderBar title="개인정보 수정" />
      <EditProfile />
      <BottomNavigation />
    </div>
  );
};

export default EditProfilePage;
