import Button from "@/components/common/Button/Button";
import type { AgeConditionStatus } from "@/apis/helper";

interface BenefitHelperProps {
    isOnline: boolean;
    url: string | null;
    title: string;
    ageConditionStatus : AgeConditionStatus;
    minAge: number | null;
    maxAge : number | null;
    isAgeSatisfied : boolean | null;
    applicationEndDate : string | null;
    organization : string;
    isRegionSatisfied : boolean;
    userAge: number;
    userSido: string;
    userSigungu: string;
}

// 나이 조건
const getAgeConditionText = (
  status: AgeConditionStatus,
  minAge : number | null,
  maxAge : number | null
) => {
  if (status === 'NO_RESTRICTION') return '나이 조건 없음';
  if (status === 'UNKNOWN') return '나이 조건 확인 필요';

  if (minAge !== null && maxAge !== null) return `나이 조건 (만 ${minAge}세 이상 ${maxAge}세 미만)`;
  if (minAge !== null) return `나이 조건 (만 ${minAge}세 이상)`;
  if (maxAge !== null) return `나이 조건 (만 ${maxAge}세 미만)`;
  return '나이 조건 확인 중';
};

// 지역
const getRegionText = (organization : string) => {
  const parts = organization.trim().split(/\s+/);
  return parts.slice(0,2).join(' ');
}

const BenefitHelper = ({isOnline, url, title, ageConditionStatus, minAge, maxAge, isAgeSatisfied, applicationEndDate, organization, isRegionSatisfied, userAge, userSido, userSigungu}:BenefitHelperProps) => {
  // 나이 조건
  const ageHeaderText = getAgeConditionText(ageConditionStatus, minAge, maxAge);
  const ageStatusText = 
    isAgeSatisfied === null
      ? '확인이 필요해요. 담당 기관에 문의해 주세요.'
      : isAgeSatisfied
      ? `충족 · 만 ${userAge}세`
      : `미충족 · 만 ${userAge}세`;
    const ageStatusColor =
      isAgeSatisfied === null ? 'text-[#EF4444]' : isAgeSatisfied ? 'text-[#22C55E]' : 'text-[#EF4444]';
    const ageIcon = isAgeSatisfied === true ? '/icons/helper/success.png' : '/icons/helper/error.png';

    // 사는 곳
    const regionText = getRegionText(organization);
    const regionStatusText = isRegionSatisfied ? `충족 · ${userSido} ${userSigungu}` : `미충족 · ${userSido} ${userSigungu}`;
    const regionStatusColor = isRegionSatisfied ? 'text-[#22C55E]' : 'text-[#EF4444]';
    const regionIcon = isRegionSatisfied ? '/icons/helper/success.png' : '/icons/helper/error.png';

    // 신청 마감일
    const deadlineText = applicationEndDate
      ? (()=> {
        const [y, m, d] = applicationEndDate.split('-').map(Number);
        return `${y}년 ${m}월 ${d}일까지 신청할 수 있어요`;
      })()
      : '언제든 신청할 수 있어요';

    return (
        <div className="flex flex-col p-4 gap-7">

            {/*상단 안내 카드*/}
            <div className="bg-[#FFF7ED] border-3 border-[#E8B16A] rounded-4xl flex items-center gap-1 mx-[16.5px] py-2">
                <img src="/characters/salpimi_Love.png" className="w-27 h-27 shrink-0"/>
                <div className="flex flex-col gap-2 min-w-0 flex-1">
                    <span className="salpim-helper-title font-semibold text-[#613212] text-center break-keep text-balance">{title}</span>
                    <span className="salpim-helper-guide text-[#FF8A3D] font-medium text-center">신청하기 전, <br/>아래 내용을 꼭 확인해 주세요! <br/>맨 밑에 신청하기 버튼이 있어요.</span>
                </div>
            </div>

            {/*내가 신청할 수 있는지*/}
            <div className="pt-[2px] flex flex-col gap-4">

                <div className="flex items-center gap-2">
                    <img src="/icons/helper/checklist.png" className="w-10 h-10 pl-2"/>
                    <span className="salpim-helper-section-title font-bold text-[#613212]">내가 신청할 수 있는지 보기</span>
                </div>

              <div className="flex flex-col gap-1">
                {/*나이*/}
                <div className="bg-[#FFEDD5] rounded-t-xl p-[6px]">
                  <div className="flex items-center gap-1">
                    <img src={ageIcon} className="w-10 h-10"/>
                      <span className="salpim-helper-condtion-label font-semibold">{ageHeaderText}</span>
                    </div>
                    <span className={`salpim-helper-condtion-status font-medium text-[#22C55E] pl-[44px] ${ageStatusColor}`}>{ageStatusText}</span>
                </div>

                {/*사는 곳*/}
                <div className="bg-[#FFEDD5] p-[6px]">
                  <div className="flex items-center gap-1">
                    <img src={regionIcon} className="w-10 h-10"/>
                    <span className="salpim-helper-condtion-label font-semibold">사는 곳 ({regionText})</span>
                  </div>
                  <span className={`salpim-helper-condtion-status text-[#22C55E] pl-[44px] ${regionStatusColor}`}>{regionStatusText}</span>
                </div>

                {/*소득 기준*/}
                <div className="bg-[#FFEDD5] rounded-b-xl p-[6px]">
                  <div className="flex items-center gap-1">
                    <img src="/icons/helper/question.png" className="w-10 h-10"/>
                      <span className="salpim-helper-condtion-label font-semibold">소득 기준</span>
                  </div>
                  <span className="salpim-helper-condtion-status text-[#EF4444] pl-[44px]">확인이 필요해요. 담당 기관에 문의해 주세요.</span>
                </div>
            </div>
          </div>

          {/*신청할 때 필요해요*/}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1 pl-2">
              <img src="/icons/helper/document.png" className="w-10 h-10"/>
              <span className="salpim-helper-section-title font-bold text-[#613212]">신청할 때 필요해요</span>
            </div>

            <div className="flex flex-col gap-1 pl-2">
              <div className="salpim-helper-document bg-[#FED7AA] rounded-lg px-4 py-2 w-fit font-bold text-[#8B5A2B]">주민등록본</div>
              <div className="salpim-helper-document bg-[#FED7AA] rounded-lg px-4 py-2 w-fit font-bold text-[#8B5A2B]">신분증 사본</div>
              <div className="salpim-helper-document bg-[#FED7AA] rounded-lg px-4 py-2 w-fit font-bold text-[#8B5A2B]">건강보험료 납부 확인서</div>
            </div>
          </div>

          {/*안내 카드*/}
          <div className="flex items-center pl-2 pr-8 py-4 border-3 border-[#E8B16A] rounded-4xl bg-[#FFF7ED]">
            <img src="/characters/salpimi_Search.png" className="w-20 h-20"/>
              <span className="salpim-helper-notice font-semibold break-keep text-balance text-center">
                필요한 서류가 다를 수 있어요. <br/> 신청하기 전, 담당 기관에 준비물을 꼭 한번 더 확인해 주세요!
              </span>
          </div>

          {/*이렇게 신청해보세요*/}
          <div className="flex flex-col gap-4 pb-2">
            <div className="flex items-center gap-1 pl-1">
              <img src="/icons/helper/application.png" className="w-10 h-10"/>
              <span className="salpim-helper-section-title font-bold text-[#613212]">이렇게 신청해 보세요</span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="salpim-helper-step bg-[#FFEDD5] rounded-full py-[18px] px-[31.5px] text-center font-semibold"> ➊ 주민센터 방문 또는 복지로 검색하기</div>
                <div className="flex justify-center">
                  <img src="/icons/helper/arrow.png" className="w-10 h-10"/>
                </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="salpim-helper-step bg-[#FFEDD5] rounded-full py-[18px] px-[83.5px] text-center font-semibold"> ➋ 신청서 쓰고 제출하기</div>
                <div className="flex justify-center">
                  <img src="/icons/helper/arrow.png" className="w-10 h-10"/>
                </div>
            </div>

            <div className="salpim-helper-step bg-[#FFEDD5] rounded-full px-[17px] py-[18px] text-center font-semibold"> ➌ {deadlineText}</div>
          </div>

          {/* 신청하기*/}
          <Button
            rounded="full" disabled={!isOnline} className="salpim-helper-submit h-20 mx-[14px] font-semibold" onClick={()=>url && window.open(url, '_blank')}>사이트 바로가기</Button>
        </div>
    )
}
export default BenefitHelper;