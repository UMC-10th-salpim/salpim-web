import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getBenefitDetail, type BenefitDetailResult, getBenefitIcon} from "@/apis/benefit";
import { getAgeLimitText, getDeadlineText } from "@/utils/benefitText";
import BenefitDetail from "@/features/benefit/BenefitDetail";
import HeaderBar from "@/components/common/HeaderBar/HeaderBar";
import BottomNavigation from "@/components/common/BottomNavigation/BottomNavigation";
import ScrollMoreIndicator from "@/components/common/ScrollMoreIndicator/ScrollMoreIndicator";

const BenefitDetailPage = () => {
  const {id} = useParams();
  const [detail, setDetail] = useState<BenefitDetailResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(()=>{
    if (!id) return;
    setIsLoading(true);
    setError(false);

    getBenefitDetail(Number(id))
      .then(setDetail)
      .catch((err)=> {
        console.error('혜택 상세 조회 실패', err);
        setError(true);
      })
      .finally(()=>setIsLoading(false));
  },[id]);

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[100svh] max-w-md flex-col bg-[#FAF8F3]">
        <HeaderBar title="혜택 자세히 보기" />
        <div className="flex flex-1 items-center justify-center">로딩중</div>
      </div>
    )
  }

  if (error || !detail) return <div>찾을 수 없다</div>;

  return (
    <div className="mx-auto flex min-h-[100svh] max-w-md flex-col bg-[#FAF8F3] pb-[calc(5rem+env(safe-area-inset-bottom))]">
      <HeaderBar title="혜택 자세히 보기"/>
      <BenefitDetail
        isOnline={detail.isOnlineApplicationAvailable}
        id={Number(id)}
        category={detail.welfareCategoryName}
        title={detail.title}
        icon={getBenefitIcon(detail.welfareCategoryName)}
        deadline={getDeadlineText(detail.applicationEndDate)}
        ageLimit={getAgeLimitText(detail.ageConditionStatus, detail.minAge, detail.maxAge)}
        easySummary={detail.easySummary}
        eligibility={detail.whoCanReceive}
        benefitContent={detail.whatYouReceive}
        targetPerson={detail.recommendedFor}
        url={detail.applicationUrl ?? undefined}

        //TODO : API 없음
        facilityName={undefined}
        />
      <ScrollMoreIndicator/>
      <BottomNavigation/>
    </div>
  );
};

export default BenefitDetailPage;