import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import EditProfile from '@/features/mypage/EditProfile';

const EditProfilePage = () => {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-[#FAF8F3] pb-24">
      <HeaderBar title="개인정보 수정" />
      <EditProfile />
      <BottomNavigation />
    </div>
  );
};

export default EditProfilePage;
