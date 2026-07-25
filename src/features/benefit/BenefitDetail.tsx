import Button from "@/components/common/Button/Button";
import { useNavigate } from "react-router-dom";
import useBenefitStore from "@/store/benefitStore";
import { useEffect } from "react";

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

useEffect(()=>{
  if(!window.Kakao.isInitialized()){
    window.Kakao.init(import.meta.env.VITE_KAKAO_MAP_KEY);
  }
}, []);

const handleKakaoShare = () => {
  window.Kakao.Share.sendCustom({
    templateId: 135487,
    templateArgs: {
      title: title,
      deadline: deadline,
      ageLimit: ageLimit,
    },
  });
}

  return (
    <div className="flex flex-col p-4 gap-4">

      {/* 상단 카드 형식 */}
      <div className="bg-[#FBE3BF] rounded-xl p-4 flex flex-col gap-2">
        {/*chip + 찜하기*/}
        <div className="flex items-center justify-between pl-2">
          <div className="rounded-full bg-white text-[#613212] font-medium text-xl w-23 h-8 flex items-center justify-center shrink-0 whitespace-nowrap">{category}</div>
          <button type="button" aria-label="찜하기"
            onClick={()=>toggleLike(id)}
          >
            <img src={isLiked ? '/icons/heart_fill.png' : '/icons/heart.png'} alt="찜하기" className="w-[32px] h-[32px]"/>
          </button>
        </div>

        <span className="text-2xl font-bold text-[#613212]">{title}</span>
        <div className="flex gap-[10px]">
          <span className="bg-[#FFB700] text-[#2B2B2B] font-bold text-xl px-3 py-1 rounded-xl">{deadline}</span>
          <span className="bg-[#FFB700] text-[#2B2B2B] font-bold text-xl px-3 py-1 rounded-xl">{ageLimit}</span>
        </div>
      </div>

      <div className="flex flex-col gap-6 mx-[16.5px]">
        {/* 설명 박스 */}
        <div className="bg-[#FFF7ED] border border-3 border-[#E8B16A] rounded-4xl p-[11px] flex items-center gap-1 ">
          <img src="/characters/salpimi_Notebook.png" className="w-28 h-28"/>
          <div className="flex flex-col gap-2">
            <span className="text-2xl font-semibold text-[#613212] break-keep text-balance text-center">병원 갈 때 드는 돈을 나라에서 일부 도와주는 제도예요!</span>
            <span className="text-base text-[#FF8A3D] text-center">살피미가 쉽게 설명해줘요</span>
          </div>
        </div>

        {/* 누가,무엇을, 어떤것 */}
        <div className="flex flex-col gap-2">
          <div>
            <span className="font-bold text-[#613212] text-2xl">누가 받을까?</span>
            <div className="border border-[#FED7AA] border-4 rounded-2xl mt-1 text-center font-bold text-2xl p-4 break-keep text-balance">{eligibility}</div>
          </div>

          <div>
            <span className="font-bold text-[#613212] text-2xl">무엇을 받을 수 있을까?</span>
            <div className="border border-[#FED7AA] border-4 rounded-2xl p-4 mt-1 text-center font-bold text-2xl">{benefitContent}</div>
          </div>

          <div>
            <span className="font-bold text-[#613212] text-2xl">어떤 사람이 받으면 좋을까?</span>
            <div className="border border-[#FED7AA] border-4 rounded-2xl p-4 mt-1 text-center font-bold text-2xl break-keep text-balance">{targetPerson}</div>
          </div>
        </div>

        {/*온라인 신청만*/}
        {isOnline && (
          <div className="bg-[#FFF7ED] rounded-4xl border border-3 border-[#E8B16A] p-3 flex items-center">
            <img src="/characters/salpimi_Wall.png" className="w-28 h-28"/>
            <span className="text-2xl text-center font-semibold text-[#613212] break-keep text-balance">이 혜택은 인터넷에서 신청해야해요! <br/> 공식 사이트에서 신청해 주세요.</span>
          </div>
        )}
      </div>

        {/*가까운 기관 안내*/}
        {!isOnline && (
          <div className="flex flex-col gap-2">
            <span className="pl-4 font-bold text-[#613212] text-2xl">가까운 기관에서 도움받기</span>
          
            <div className="bg-[#FBE3BF] rounded-4xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#FAFAFA] w-16 h-16 flex items-center justift-center pl-3">
                  <img src="/icons/building.png" className="w-10 h-10"/>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[22px]">{facilityName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-base text-[#613212] font-regular">{facilityDistance}</span>
                    <span className="text-base text-[#613212] font-regular">{facilityHours}</span>
                  </div>
                </div>
            </div>

            {/* TODO: 백엔드 연동 시 시설 좌표(위도/경도) 데이터를 받아서 /map으로 navigate state 전달 */}
            <div 
              className="flex items-center gap-1 cursor-pointer"
              onClick={()=>navigate('/map')}
            >
              <span className="text-[#2B2B2B] font-medium text-xl">지도</span>
              <img src="/icons/path.png" className="w-10 h-10"/>
            </div>
          </div>
        </div>
        )}

      {/*카카오톡 공유*/}
      <div className="flex flex-col gap-2">
        <span className="pl-4 font-bold text-[#613212] text-2xl"> 가족에게 공유하기 </span>
        <div className="bg-[#FBE3BF] rounded-4xl p-5 flex items-center justify-between"
          onClick={handleKakaoShare}
        >
          <div className="flex items-center gap-3">
            <img src="/icons/kakaotalk.png" className="w-16 h-16"/>
            <span className="font-semibold text-[22px] pl-2">카카오톡으로 공유</span>
          </div>
          <img src="/icons/path.png" className="w-10 h-10"/>
        </div>        
      </div>

      {/*하단 버튼 2가지로 나눠서*/}
      {isOnline ? (
        <div className="flex gap-2">
          <Button rounded="full" className="flex-1 h-16 font-semibold text-[#FAFAFA] text-3xl"
            onClick={()=> url && window.open(url, '_blank')}>홈페이지</Button>
          <Button rounded="full" className="flex-1 h-16 font-semibold text-[#FAFAFA] text-3xl" onClick={()=>navigate(`/helper/${id}`)}>신청 도우미</Button>
        </div>
      ) : (
        <Button rounded="full" className="h-16 font-semibold text-[#FAFAFA] text-3xl mx-[52.5px]" onClick={()=>navigate(`/helper/${id}`)}>신청도우미</Button>
      )}
    </div>
  );
};

export default BenefitDetail;
