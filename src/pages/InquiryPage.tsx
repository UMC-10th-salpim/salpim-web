import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import InquiryForm from '@/features/mypage/InquiryForm';

const InquiryPage = () => {
  return (
    <div className="mypage-screen mx-auto max-w-md">
      <HeaderBar title="문의하기" />
      <InquiryForm />
      <BottomNavigation />
    </div>
  );
};

export default InquiryPage;
