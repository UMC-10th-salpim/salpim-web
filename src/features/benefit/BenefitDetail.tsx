import Button from "@/components/common/Button/Button";
import { useNavigate } from "react-router-dom";
import useBenefitStore from "@/store/benefitStore";
import useUserStore from "@/store/userStore";
import { useEffect } from "react"; 
import { updateFavorite, getBenefitShareInfo } from "@/apis/benefit";

interface BenefitDetailProps {
  isOnline : boolean;
  id: number;
  category: string;
  title: string;
  icon: string;
  deadline: string;
  ageLimit: string;
  easySummary: string;
  eligibility: string;
  benefitContent: string;
  targetPerson: string;
  url?: string;
  facilityName?: string;
}

const BenefitDetail = ({isOnline, id, category, title, deadline, ageLimit, easySummary, eligibility, benefitContent, targetPerson, url, facilityName}:BenefitDetailProps) => {
  const navigate = useNavigate();
  const isLiked = useBenefitStore((state) => state.isLiked(id));
  const toggleLike = useBenefitStore((state) => state.toggleLike);
  const accessToken = useUserStore((state)=>state.accessToken);
    
  const requireLogin = () => {
    window.location.href = 'https://salpim.me/';
  };

  const handleGoHomepage = () => {
    if (!accessToken) {
      requireLogin();
      return;
    }
    if (url) window.open(url, '_blank');
  };

  const handleGoHelper = () => {
    if (!accessToken) {
      requireLogin();
      return;
    }
    navigate(`/helper/${id}`)
  };

  const handleToggleLike = async () => {
    const nextIsFavorite = !isLiked;
    toggleLike(id);

    try {
      await updateFavorite(id, nextIsFavorite);
    } catch(error) {
      console.error('찜하기 실패', error);
      toggleLike(id);
    }
  }

useEffect(()=>{
  if(!window.Kakao.isInitialized()){
    window.Kakao.init(import.meta.env.VITE_KAKAO_MAP_KEY);
  }
}, []);

const handleKakaoShare = async () => {
  try {
    const shareInfo = await getBenefitShareInfo(id);
    window.Kakao.Share.sendCustom({
      templateId: 135487,
      templateArgs: {
        title: shareInfo.title,
        summary: shareInfo.summary,
        benefitId: String(id),
      },
    });
  } catch (error) {
    console.error('공유 정보 조회 실패', error);
  }
}

  return (
    <div className="flex flex-col p-4 gap-4">
      {/* 상단 카드 형식 */}
      <div className="bg-[#FBE3BF] rounded-xl p-4 flex flex-col gap-2">
        {/*chip + 찜하기*/}
        <div className="flex items-center gap-2 pl-2">
          <div className="salpim-detail-category rounded-full bg-white text-[#613212] font-medium min-w-23 min-h-8 flex items-center justify-center shrink-0 whitespace-nowrap px-3 py-1">{category}</div>
          <button type="button" aria-label="찜하기" className="ml-auto"
            onClick={handleToggleLike}
          >
            <img src={isLiked ? '/icons/heart_fill.png' : '/icons/heart.png'} alt="찜하기" className="w-[32px] h-[32px]"/>
          </button>
        </div>

        <span className="salpim-detail-title font-bold text-[#613212]">{title}</span>
        <div className="flex gap-[10px]">
          <span className="salpim-detail-badge bg-[#FFB700] text-[#2B2B2B] font-bold px-3 py-1 rounded-xl">{deadline}</span>
          <span className="salpim-detail-badge bg-[#FFB700] text-[#2B2B2B] font-bold px-3 py-1 rounded-xl">{ageLimit}</span>
        </div>
      </div>

      <div className="flex flex-col gap-8 mx-[16.5px]">
        {/* 설명 박스 */}
        <div className="bg-[#FFF7ED] border border-3 border-[#E8B16A] rounded-4xl p-[11px] flex items-center gap-1 ">
          <img src="/characters/salpimi_Notebook.png" className="w-28 h-28"/>
          <div className="flex flex-col gap-2">
            <span className="salpim-detail-summary font-semibold text-[#613212] break-keep text-balance text-center">{easySummary}</span>
            <span className="salpim-detail-summary-caption text-[#FF8A3D] text-center">살피미가 쉽게 설명해줘요</span>
          </div>
        </div>

        {/* 누가,무엇을, 어떤것 */}
        <div className="flex flex-col gap-2">
          <div>
            <span className="salpim-detail-section-title font-bold text-[#613212]">누가 받을까?</span>
            <div className="salpim-detail-section-button border border-[#FED7AA] border-4 rounded-2xl mt-1 text-center font-bold p-4 break-keep text-balance">{eligibility}</div>
          </div>

          <div>
            <span className="salpim-detail-section-title font-bold text-[#613212]">무엇을 받을 수 있을까?</span>
            <div className="salpim-detail-section-button border border-[#FED7AA] border-4 rounded-2xl p-4 mt-1 text-center font-bold">{benefitContent}</div>
          </div>

          <div>
            <span className="salpim-detail-section-title font-bold text-[#613212]">어떤 사람이 받으면 좋을까?</span>
            <div className="salpim-detail-section-button border border-[#FED7AA] border-4 rounded-2xl p-4 mt-1 text-center font-bold break-keep text-balance">{targetPerson}</div>
          </div>
        </div>

        {/*온라인 신청만*/}
        {isOnline && (
          <div className="bg-[#FFF7ED] rounded-4xl border border-3 border-[#E8B16A] p-3 flex items-center">
            <img src="/characters/salpimi_Wall.png" className="w-28 h-28"/>
            <span className="salpim-detail-notice text-center font-semibold text-[#613212] break-keep text-balance">이 혜택은 인터넷에서 신청해야해요! <br/> 공식 사이트에서 신청해 주세요.</span>
          </div>
        )}
      </div>

        {/*가까운 기관 안내*/}
        {!isOnline && (
          <div className="flex flex-col gap-2">
            <span className="salpim-detail-share-title pl-4 font-bold text-[#613212]">가까운 기관에서 도움받기</span>
            <div className="bg-[#FBE3BF] rounded-4xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#FAFAFA] w-16 h-16 flex items-center justift-center pl-3">
                  <img src="/icons/building.png" className="w-10 h-10"/>
                </div>
                <div className="flex flex-col">
                  <span className="salpim-detail-facility-name font-semibold">{facilityName}행정 복지 센터</span>
                  <div className="flex items-center gap-2">
                    <span className="salpim-detail-facility-info text-[#613212] font-regular">09:00~18:00</span>
                  </div>
                </div>
            </div>

            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={()=>navigate('/map')}
            >
              <span className="salpim-detail-facility-link text-[#2B2B2B] font-medium">지도</span>
              <img src="/icons/path.png" className="w-10 h-10"/>
            </div>
          </div>
        </div>
        )}

      {/*카카오톡 공유*/}
      <div className="flex flex-col gap-2">
        <span className="salpim-detail-share-title pl-4 font-bold text-[#613212]"> 가족에게 공유하기 </span>
        <div className="bg-[#FBE3BF] rounded-4xl p-5 flex items-center justify-between"
          onClick={handleKakaoShare}
        >
          <div className="flex items-center gap-3">
            <img src="/icons/kakaotalk.png" className="w-16 h-16"/>
            <span className="salpim-detail-share-button font-semibold pl-2">카카오톡으로 공유</span>
          </div>
          <img src="/icons/path.png" className="w-10 h-10"/>
        </div>        
      </div>

      {/*하단 버튼 2가지로 나눠서*/}
      {isOnline ? (
        <div className="flex gap-2">
          <Button rounded="full" className="salpim-detail-action flex-1 h-16 font-semibold text-[#FAFAFA]"
            onClick={handleGoHomepage}>홈페이지</Button>
          <Button rounded="full" className="salpim-detail-action flex-1 h-16 font-semibold text-[#FAFAFA]" onClick={handleGoHelper}>신청 도우미</Button>
        </div>
      ) : (
        <Button rounded="full" className="salpim-detail-action h-16 font-semibold text-[#FAFAFA] mx-[52.5px]" onClick={handleGoHelper}>신청도우미</Button>
      )}
    </div>
  );
};

export default BenefitDetail;
