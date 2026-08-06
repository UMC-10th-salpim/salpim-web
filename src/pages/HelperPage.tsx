import BenefitHelper from '@/features/benefit/BenefitHelper';
import HeaderBar from '@/components/common/HeaderBar/HeaderBar';
import BottomNavigation from '@/components/common/BottomNavigation/BottomNavigation';
import { useParams } from 'react-router-dom';
import { BenefitApplicationHelperResult, getBenefitApplicationHelper } from '@/apis/helper';
import { useEffect, useState } from 'react';
import ScrollMoreIndicator from '@/components/common/ScrollMoreIndicator/ScrollMoreIndicator';

const HelperPage = () => {
  const {id} = useParams();
  const [benefit, setBenefit] = useState<BenefitApplicationHelperResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(()=>{
    if (!id) return;

    setIsLoading(true);
    setError(false);

    getBenefitApplicationHelper(Number(id))
      .then(setBenefit)
      .catch((err)=>{
        console.error('신청도우미 조회 실패', err);
        setError(true);
      })
      .finally(()=>setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[100svh] max-w-md flex-col bg-[#FAF8F3]">
        <HeaderBar title='신청 도우미'/>
        <div className="flex flex-1 items-center justify-center">로딩중...</div>
      </div>
    );
  }

  if (error || !benefit) {
    return (
      <div className="mx-auto flex min-h-[100svh] max-w-md flex-col bg-[#FAF8F3]">
        <HeaderBar title='신청 도우미'/>
        <div className="flex flex-1 items-center justify-center">찾을 수 없다</div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[100svh] max-w-md flex-col bg-[#FAF8F3] pb-[calc(6rem+env(safe-area-inset-bottom))]">
      <HeaderBar title="신청 도우미"/>
      <BenefitHelper
        isOnline={benefit.isOnlineApplicationAvailable}
        url={benefit.applicationUrl}
        title={benefit.title}
        ageConditionStatus={benefit.ageConditionStatus}
        minAge={benefit.minAge}
        maxAge={benefit.maxAge}
        isAgeSatisfied={benefit.isAgeSatisfied}
        applicationEndDate={benefit.applicationEndDate}
        organization={benefit.organization}
        isRegionSatisfied={benefit.isRegionSatisfied}
      />
      <ScrollMoreIndicator/>
      <BottomNavigation />
    </div>
  );
};

export default HelperPage;
