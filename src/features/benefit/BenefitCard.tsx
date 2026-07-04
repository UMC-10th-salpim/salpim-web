import Button from "@/components/common/Button/Button";
import Card from "@/components/common/Card/Card";
import Chip from "@/components/common/Chip/Chip";
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
      <Card className={`flex items-center gap-3 !bg-[#FBE3BF] ${className}`}>
        <img src={icon} alt="" className="rounded-full w-12 h-12 bg-[#FAF8F3]" /> 
               
        <div className="flex flex-col gap-1 flex-1 items-start">
          <Chip label={category}></Chip>
          <span className="text-base font-bold text-[#613212]">{title}</span>
        </div>

        <Button 
          rounded="full"
          className="!w-auto !h-auto px-3 py-1.5 text-xs font-medium bg-white !text-gray-700 border border-gray-200 shadow-sm whitespace-nowrap flex-shrink-0"
          onClick={handleDetailClick}>
            자세히보기 {'>'}
        </Button>
      </Card>
    </div>
  );
};

export default BenefitCard;
