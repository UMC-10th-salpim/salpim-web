import Button from "@/components/common/Button/Button";
import Card from "@/components/common/Card/Card";
import { useNavigate } from "react-router-dom";

interface BenefitCardProps {
  id : number; // 이동할 때 id 값
  category : string; // '지원금'
  icon : string; // 기관별 아모지
  title: string;
  className : string;
}

const BenefitCard = ({id, category, icon, title, className=''} : BenefitCardProps) => {
  const navigate = useNavigate();

  const handleDetailClick = () => {
    navigate(`/benefits/${id}`);
  };

  return (
    <div>
      <Card className={`flex items-center gap-3 !bg-[#FBE3BF] !shadow-none !border-none ${className}`}>
        <div className="w-16 h-16 rounded-full bg-[#FAF8F3] flex items-center justify-center shrink-0">
          {icon && <img src={icon} alt="" className="w-10 h-10" />}
        </div>
               
        <div className="flex flex-col flex-1 items-start">
          <div className="salpim-result-card-category rounded-full bg-white text-[#613212] font-medium px-3 py-1 flex items-center justify-center shrink-0 whitespace-nowrap w-fit">{category}</div>
          <span className="salpim-result-card-title font-bold text-[#613212] break-keep text-balance">{title}</span>
        </div>

        <Button 
          rounded="full"
          className="salpim-result-card-button font-medium text-black !bg-[#FAF8F3] shrink-0 whitespace-nowrap w-[87px] h-[22px] pl-3 py-1 pr-2"
          onClick={handleDetailClick}>
            자세히보기
          <img src="/icons/path.png" alt="화살표" className="w-4 h-5 pl-1"/>
        </Button>
      </Card>
    </div>
  );
};

export default BenefitCard;
