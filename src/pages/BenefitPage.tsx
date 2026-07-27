import BenefitCard from "@/features/benefit/BenefitCard";
import BenefitEmptyState from "@/features/benefit/BenefitEmptyState";
import HeaderBar from "@/components/common/HeaderBar/HeaderBar";
import Button from "@/components/common/Button/Button";
import BottomNavigation from "@/components/common/BottomNavigation/BottomNavigation";
import { benefitApi, getBenefitIcon } from "@/apis/benefit";
import { useNavigate, useLocation } from "react-router-dom";
import useUserStore from "@/store/userStore";
import {useEffect, useState} from "react";

// 이렇게 보내줘야함
interface LocationState {
  source?: 'survey' | 'search';
  keyword?: string;
  optionId?: number; // survey
  regionIds?: number[]; // search
  categoryIds?: number[]; // search
  sort?: 'popular' | 'deadline'; // search
}

const BenefitPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { source = 'search', keyword, optionId, regionIds, categoryIds, sort } =
    (location.state as LocationState) ?? {};

  const userName = useUserStore((state)=> state.name);
  const [benefits, setBenefits] = useState<{benefitId: number; benefitTitle: string; benefitCategory: string }[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=> {
    const fetchBenefits = async () => {
      setIsLoading(true);
      try {
        if (source === 'survey' && optionId === undefined){
          console.warn('설문 결과 조회에 optionId가 없다');
        }

        const result = source === 'survey'
          ? await benefitApi.getRecommendationResult({optionId : optionId ?? 0})
          : await benefitApi.searchBenefits({
              searchKey : keyword,
              regionIds : regionIds ?? [],
              categoryIds,
              sort,
          });
        setBenefits(result.data);
        setTotalCount(result.totalCount);
      } catch (error) {
        console.error('혜택 목록 조회 실패', error);
        setBenefits([]);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBenefits();
  }, [source, keyword, optionId, regionIds, categoryIds, sort]);

  const hasBenefits = totalCount > 0;

  // 로딩 수정
  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center bg-[#FAF8F3]">
        <span className="text-lg font-semibold text-[#613212]">혜택을 찾고 있어요...</span>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-[100svh] max-w-md flex-col bg-[#FAF8F3] pb-[calc(6rem+env(safe-area-inset-bottom))]">
      <HeaderBar title="혜택 결과" />

      <div className="p-4 flex flex-col gap-4 flex-1">
        {hasBenefits ? (
          <>
            {/* 상단 베너*/}
            <div className="relative bg-[#FFF7ED] rounded-4xl flex items-center border-3 border-[#E8B16A] py-[11px] pl-[114px] pr-8">
              <img src="/characters/salpimi_Good.png" alt="" className="absolute top-6 -left-px w-28 h-28"/>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[23px] font-semibold text-[#613212]">
                  {userName}님이 원하시는 혜택 <br/> {totalCount}가지를 찾았어요!
                </span>
                <span className="text-base font-medium text-center text-[#FF8A3D]">살피미와 함께 확인해요</span>
              </div>
            </div>

            <span className="text-2xl font-extrabold text-[#613212] pl-[24px] pb-2">
              {totalCount}가지 혜택 보기
            </span>

            <div className="flex flex-col gap-1">
              {benefits.map((benefit, index) => {
                const isFirst = index === 0;
                const isLast = index === benefits.length -1;

                const roundedStyle = isFirst
                  ? 'rounded-t-[32px] rounded-b-none'
                  : isLast
                  ? 'rounded-b-[32px] rounded-t-none'
                  : 'rounded-none';

                return (
                    <BenefitCard
                      id={benefit.benefitId}
                      key={benefit.benefitId}
                      category={benefit.benefitCategory}
                      icon={getBenefitIcon(benefit.benefitCategory)}
                      title={benefit.benefitTitle}
                      className={roundedStyle}
                    />
                  );
                })}
              </div>
          </>
        ) : (
          <BenefitEmptyState source={source}/>
        )}

          <Button
            className="h-16 px-[105.5px] py-[14px] !w-[calc(100%-28px)] mx-auto font-semibold text-3xl" rounded="full" 
            onClick={() => navigate('/benefits/search')}
          >
            다시 찾기
          </Button>
        </div>
      <BottomNavigation/>
  </div>
  );
};

export default BenefitPage;
