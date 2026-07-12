import BenefitCard from "@/features/benefit/BenefitCard";
import HeaderBar from "@/components/common/HeaderBar/HeaderBar";
import Button from "@/components/common/Button/Button";
import BottomNavigation from "@/components/common/BottomNavigation/BottomNavigation";
import { MOCK_BENEFITS } from "@/apis/benefit";
import { useNavigate } from "react-router-dom";

// TODO : 로그인 사용자 이름 연동하기
const USER_NAME = "김살핌";

const BenefitPage = () => {
  const navigate = useNavigate();

  return (
    <div  className="mx-auto flex min-h-dvh max-w-md flex-col bg-[#FAF8F3] pb-24">
      <HeaderBar title="혜택 결과" />

      <div className="p-4 flex flex-col gap-4 flex-1">
        {/* 상단 베너*/}
        <div className="relative bg-[#FFF7ED] rounded-4xl flex items-center gap-3 border-3 border-[#E8B16A] p-3">
          <img src="/characters/salpimi_Good.png" alt="" className="absolute -bottom-3 left-1 w-25 h-25 object-contain"/>
          <div className="flex flex-col gap-1 pl-24">
            <span className="text-base font-bold text-[#613212]">
              {USER_NAME}님이 원하시는 혜택 <br/> {MOCK_BENEFITS.length}가지를 찾았어요!
            </span>
            <span className="text-sm text-[#FF8A3D]">살피미와 함께 확인해요</span>
          </div>
        </div>

        <span className="text-base font-bold text-[#613212]">
          {MOCK_BENEFITS.length}가지 혜택 보기
        </span>

        <div className="flex flex-col">
          {MOCK_BENEFITS.map((benefit, index) => {
            const isFirst = index === 0;
            const isLast = index === MOCK_BENEFITS.length -1;

            const roundedStyle = isFirst
              ? 'rounded-t-2xl rounded-b-none'
              : isLast
              ? 'rounded-b-2xl rounded-t-none'
              : 'rounded-none';

            return (
                <BenefitCard
                  id={benefit.id}
                  key={benefit.id}
                  category={benefit.category}
                  icon={benefit.icon}
                  title={benefit.title}
                  className={roundedStyle}
                />
              );
            })}
          </div>
          
          <Button
            className="h-10" rounded="full" 
            onClick={() => navigate('/search')}
          >
            다시 찾기
          </Button>
        </div>
      <BottomNavigation/>
  </div>
  );
};

export default BenefitPage;
