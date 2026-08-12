import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { benefitApi, getBenefitDetail, type BenefitDetailResult, getBenefitIcon, getMyWelfareCenter} from "@/apis/benefit";
import { getAgeLimitText, getDeadlineText } from "@/utils/benefitText";
import BenefitDetail from "@/features/benefit/BenefitDetail";
import HeaderBar from "@/components/common/HeaderBar/HeaderBar";
import BottomNavigation from "@/components/common/BottomNavigation/BottomNavigation";
import ScrollMoreIndicator from "@/components/common/ScrollMoreIndicator/ScrollMoreIndicator";
import useUserStore from "@/store/userStore";

const BenefitDetailPage = () => {
  const {id} = useParams();
  const [detail, setDetail] = useState<BenefitDetailResult | null>(null);
  const [welfareCenter, setWelfareCenter] = useState<string | undefined>(undefined);
  const [initialIsFavorite, setInitialIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const accessToken = useUserStore((state) => state.accessToken);
  
  const requireLoginBeforeNavigate = () => {
    if (!accessToken) {
      alert('로그인이 필요한 기능이에요. 로그인 페이지로 이동할게요.');
      window.location.href = 'https://salpim.me/';
      return false;
    }
    return true;
  };

  useEffect(()=>{
    if (!id) return;
    setIsLoading(true);
    setError(false);

    Promise.all([
      getBenefitDetail(Number(id)),
      getMyWelfareCenter().catch((err)=> {
        console.error('복지관 정보 조회 실패', err);
        return null;
      }),
      accessToken
        ? benefitApi.isFavoriteBenefit(Number(id)).catch((err) => {
            console.error('찜 상태 조회 실패', err);
            return false;
          })
        : Promise.resolve(false),
    ])
      .then(([detailResult, welfareResult, favoriteResult]) => {
        setDetail(detailResult);
        setWelfareCenter(welfareResult?.welfareCenter);
        setInitialIsFavorite(detailResult.isFavorite ?? favoriteResult);
      })
      .catch((err)=> {
        console.error('혜택 상세 조회 실패', err);
        setError(true);
      })
      .finally(()=>setIsLoading(false));
  },[accessToken, id]);

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
    
    <div className="bg-[#FAF8F3] min-h-[100svh] w-full pb-[calc(5rem+env(safe-area-inset-bottom))] max-w-md mx-auto">
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
        facilityName={welfareCenter}
        initialIsLiked={initialIsFavorite}
        />
      <ScrollMoreIndicator/>
      <BottomNavigation onBeforeNavigate={requireLoginBeforeNavigate}/>
    </div>
  );
};

export default BenefitDetailPage;
