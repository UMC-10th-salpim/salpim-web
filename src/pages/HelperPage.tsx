import BenefitHelper from '@/features/benefit/BenefitHelper';
import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import { useParams } from 'react-router-dom';
import { MOCK_BENEFITS } from '@/apis/benefit';

const HelperPage = () => {
  const {id} = useParams();
  const benefit = MOCK_BENEFITS.find((b)=> b.id === Number(id));

  if (!benefit) return <div>찾을 수 없다</div>

  return (
    <div className="mx-auto flex min-h-[100svh] max-w-md flex-col bg-[#FAF8F3] pb-[calc(6rem+env(safe-area-inset-bottom))]">
      <HeaderBar title="신청 도우미"/>
      <BenefitHelper isOnline={benefit.isOnline} url={benefit.url}/>
      <BottomNavigation />
    </div>
  );
};

export default HelperPage;
