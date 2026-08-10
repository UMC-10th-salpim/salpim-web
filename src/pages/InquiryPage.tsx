import { useState } from 'react';
import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import InquiryForm from '@/features/mypage/InquiryForm';

const InquiryPage = () => {
  const [isErrorResult, setIsErrorResult] = useState(false);

  return (
    <div className="mypage-screen mx-auto max-w-md">
      <HeaderBar title="문의하기" />
      <InquiryForm onErrorStateChange={setIsErrorResult} />
      {!isErrorResult && <BottomNavigation />}
    </div>
  );
};

export default InquiryPage;
