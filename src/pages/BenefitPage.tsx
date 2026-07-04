import BenefitCard from "@/features/benefit/BenefitCard";
import HeaderBar from "@/components/common/HeaderBar/HeaderBar";
import Button from "@/components/common/Button/Button";
import BottomNavigation from "@/components/common/BottomNavigation/BottomNavigation";
import { MOCK_BENEFITS } from "@/apis/benefit";

const BenefitPage = () => {
  return (
    <div  className="p-4 flex flex-col gap-1">
      <HeaderBar title="추천결과"/>

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
      <Button className="h-10" rounded="full">다시 찾기</Button>
      <BottomNavigation/>
  </div>
  );
};

export default BenefitPage;
