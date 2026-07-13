import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import InquiryForm from '@/features/mypage/InquiryForm';

const InquiryPage = () => {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-[#FAF8F3] pb-24">
      <HeaderBar title="문의하기" />
      <InquiryForm />
      <BottomNavigation />
    </div>
  );
};

export default InquiryPage;
