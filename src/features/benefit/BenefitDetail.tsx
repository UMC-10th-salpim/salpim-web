import Button from "@/components/common/Button/Button";
import Chip from "@/components/common/Chip/Chip";
import { useNavigate } from "react-router-dom";
import useBenefitStore from "@/store/benefitStore";

interface BenefitDetailProps {
  isOnline : boolean;
  id: number;
  category: string;
  title: string;
  icon: string;
  deadline: string;
  ageLimit: string;
  eligibility: string;
  benefitContent: string;
  targetPerson: string;
  url?: string;
  facilityName?: string;
  facilityDistance?: string;
  facilityHours?: string;
}

const BenefitDetail = ({isOnline, id, category, title, deadline, ageLimit, eligibility, benefitContent, targetPerson, url, facilityName, facilityDistance, facilityHours}:BenefitDetailProps) => {
  const navigate = useNavigate();
  const isLiked = useBenefitStore((state) => state.isLiked(id));
  const toggleLike = useBenefitStore((state) => state.toggleLike);

  return (
    <div className="flex flex-col p-4 gap-4">

      {/* 상단 카드 형식 */}
      <div className="bg-[#FBE3BF] rounded-2xl p-4 flex flex-col gap-2">
        {/*chip + 찜하기*/}
        <div className="flex items-center justify-between">
          <Chip label={category} className="px-3 py-1 text-xs"/>
          <button type="button" aria-label="찜하기"
            onClick={()=>toggleLike(id)}
          >
            <img src={isLiked ? '/icons/heart_fill.png' : '/icons/heart.png'} alt="찜하기" className="w-6 h-6"/>
          </button>
        </div>

        <span className="text-lg font-bold text-[#613212]">{title}</span>
        <div className="flex gap-2">
          <span className="bg-[#FFB700] text-[#2B2B2B] font-bold text-xs px-3 py-1 rounded-xl">{deadline}</span>
          <span className="bg-[#FFB700] text-[#2B2B2B] font-bold text-xs px-3 py-1 rounded-xl">{ageLimit}</span>
        </div>
      </div>

      {/* 설명 박스 */}
      <div className="bg-[#FFF7ED] border border-3 border-[#E8B16A] rounded-2xl p-2 flex items-center gap-2">
        <img src="/characters/salpimi_Notebook.png" className="w-27"/>
        <div className="flex flex-col gap-1">
          <span className="text-xl font-bold text-[#613212]">병원 갈 때 드는 돈을 나라에서 일부 도와주는 제도예요!</span>
          <span className="text-base text-[#FF8A3D]">살피미가 쉽게 설명해줘요</span>
        </div>
      </div>

      {/* 누가,무엇을, 어떤것 */}
      <div className="flex flex-col gap-3">
        <div>
          <span className="font-bold text-[#613212]">누가 받을까?</span>
          <div className="border border-[#FED7AA] border-4 rounded-xl p-3 mt-1 text-center text-base">{eligibility}</div>
        </div>

        <div>
          <span className="font-bold text-[#613212]">무엇을 받을 수 있을까?</span>
          <div className="border border-[#FED7AA] border-4 rounded-xl p-3 mt-1 text-center text-base">{benefitContent}</div>
        </div>

        <div>
          <span className="font-bold text-[#613212]">어떤 사람이 받으면 좋을까?</span>
          <div className="border border-[#FED7AA] border-4 rounded-xl p-3 mt-1 text-center text-base">{targetPerson}</div>
        </div>
      </div>

      {/*온라인 신청만*/}
      {isOnline && (
        <div className="bg-[#FFF7ED] rounded-2xl border border-3 border-[#E8B16A] p-4 flex items-center gap-3">
          <img src="/characters/salpimi_Wall.png" className="w-25 h-25"/>
          <span className="text-xl text-center font-bold text-[#613212]">이 혜택은 인터넷에서 <br/> 신청해야해요! <br/> 공식 사이트에서 <br/>신청해 주세요.</span>
        </div>
      )}

      {/*가까운 기관 안내*/}
      {!isOnline && (
        <div className="flex flex-col gap-2">
          <span className="font-bold text-[#613212]">가까운 기관에서 도움받기</span>
        
          <div className="bg-[#FBE3BF] rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/icons/building.png"/>
              <div className="flex flex-col">
                <span className="font-bold text-[#613212]">{facilityName}</span>
                <span className="text-xs text-gray-500">{facilityDistance} {facilityHours}</span>
              </div>
          </div>
          {/* 해당 지도로 연결해야함*/}
          <div 
            className="flex items-center gap-1 cursor-pointer"
            onClick={()=>navigate('/map')}
          >
            <span className="text-[#FF8A3D] text-sm">지도</span>
            <img src="/icons/path.png"/>
          </div>
        </div>
      </div>
      )}

      {/*카카오톡 공유*/}
      <div className="flex flex-col gap-1">
        <span className="p-2 font-bold text-[#613212]"> 가족에게 공유하기 </span>
        <div className="bg-[#FBE3BF] rounded-3xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/icons/kakaotalk.png" className="w-10 h-10"/>
            <span className="font-bold" onClick={()=> console.log('카카오 공유 클릭')}>카카오톡으로 공유</span>
          </div>
          <img src="/icons/path.png"/>
        </div>        
      </div>

      {/*하단 버튼 2가지로 나눠서*/}
      {isOnline ? (
        <div className="flex gap-2">
          <Button rounded="full" className="flex-1 h-12"
            onClick={()=> url && window.open(url, '_blank')}>홈페이지</Button>
          <Button rounded="full" className="flex-1" onClick={()=>navigate(`/helper/${id}`)}>신청 도우미</Button>
        </div>
      ) : (
        <Button rounded="full" className="h-12" onClick={()=>navigate(`/helper/${id}`)}>신청도우미</Button>
      )}
    </div>
  );
};

export default BenefitDetail;
