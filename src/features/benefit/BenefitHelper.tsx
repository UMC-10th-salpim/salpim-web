import Button from "@/components/common/Button/Button";

interface BenefitHelperProps {
    isOnline: boolean;
    url?: string;
}

const BenefitHelper = ({isOnline, url}:BenefitHelperProps) => {
    return (
        <div className="flex flex-col p-4 gap-4">

            {/*상단 안내 카드*/}
            <div className="bg-[#FFF7ED] border-3 border-[#E8B16A] rounded-4xl flex items-center gap-1 mx-[16.5px] py-2">
                <img src="/characters/salpimi_Love.png" className="w-28 h-28"/>
                <div className="flex flex-col gap-2">
                    <span className="text-2xl font-semibold text-[#613212] text-center">노인 의료비 지원</span>
                    <span className="text-base text-[#FF8A3D] font-medium break-keep text-balance text-center">신청하기 전, <br/> 아래 내용을 꼭 확인해 주세요! <br/> 맨 밑에 신청하기 버튼이 있어요.</span>
                </div>
            </div>

            {/*내가 신청할 수 있는지*/}
            <div className="pt-[2px] flex flex-col gap-2">

                <div className="flex items-center gap-2">
                    <img src="/icons/helper/checklist.png" className="w-10 h-10 pl-2"/>
                    <span className="font-bold text-[22px] text-[#613212]">내가 신청할 수 있는지 보기</span>
                </div>

              <div className="flex flex-col gap-1">
                {/*나이*/}
                <div className="bg-[#FFEDD5] rounded-t-xl p-[6px]">
                  <div className="flex items-center gap-1">
                    <img src="/icons/helper/success.png" className="w-10 h-10"/>
                      <span className="font-semibold text-xl">나이 조건(만 00세 이상)</span>
                    </div>
                    <span className="text-base font-medium text-[#22C55E] pl-[44px]">충족 ⋅ 만 00세</span>
                </div>

                {/*사는 곳*/}
                <div className="bg-[#FFEDD5] p-[6px]">
                  <div className="flex items-center gap-1">
                    <img src="/icons/helper/success.png" className="w-10 h-10"/>
                    <span className="font-semibold text-xl">사는 곳(00시 00구)</span>
                  </div>
                  <span className="text-base text-[#22C55E] pl-[44px]">충족 ⋅ 00시 00구</span>
                </div>

                {/*소득 기준*/}
                <div className="bg-[#FFEDD5] rounded-b-xl p-[6px]">
                  <div className="flex items-center gap-1">
                    <img src="/icons/helper/question.png" className="w-10 h-10"/>
                      <span className="font-semibold text-xl">소득 기준(중위소득 100% 이내)</span>
                  </div>
                  <span className="text-base text-[#EF4444] pl-[44px]">확인이 필요해요. 담당 기관에 문의해 주세요.</span>
                </div>
            </div>
          </div>

          {/*신청할 때 필요해요*/}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1 pl-2">
              <img src="/icons/helper/document.png" className="w-10 h-10"/>
              <span className="font-bold text-[22px] text-[#613212]">신청할 때 필요해요</span>
            </div>

            <div className="flex flex-col gap-1 pl-2">
              <div className="bg-[#FED7AA] rounded-lg px-4 py-2 w-fit font-bold text-xl text-[#8B5A2B]">주민등록본</div>
              <div className="bg-[#FED7AA] rounded-lg px-4 py-2 w-fit font-bold text-xl text-[#8B5A2B]">신분증 사본</div>
              <div className="bg-[#FED7AA] rounded-lg px-4 py-2 w-fit font-bold text-xl text-[#8B5A2B]">건강보험료 납부 확인서</div>
            </div>
          </div>

          {/*안내 카드*/}
          <div className="flex items-center pl-2 pr-8 py-4 border-3 border-[#E8B16A] rounded-4xl bg-[#FFF7ED]">
            <img src="/characters/salpimi_Search.png" className="w-20 h-20"/>
              <span className="text-lg font-semibold break-keep text-balance text-center">
                필요한 서류가 다를 수 있어요. <br/> 신청하기 전, 담당 기관에 준비물을 꼭 한번 더 확인해 주세요!
              </span>
          </div>

          {/*이렇게 신청해보세요*/}
          <div className="flex flex-col gap-4 pb-2">
            <div className="flex items-center gap-1 pl-1">
              <img src="/icons/helper/application.png" className="w-10 h-10"/>
              <span className="font-bold text-[#613212] text-[22px]">이렇게 신청해 보세요</span>
            </div>

            <div className="flex flex-col gap-1">
              <div className="bg-[#FFEDD5] rounded-full py-[18px] px-[31.5px] text-center font-semibold text-xl"> ➊ 주민센터 방문 또는 복지로 검색하기</div>
                <div className="flex justify-center">
                  <img src="/icons/helper/arrow.png" className="w-10 h-10"/>
                </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="bg-[#FFEDD5] rounded-full py-[18px] px-[83.5px] text-center font-semibold text-xl"> ➋ 신청서 쓰고 제출하기</div>
                <div className="flex justify-center">
                  <img src="/icons/helper/arrow.png" className="w-10 h-10"/>
                </div>
            </div>

            <div className="bg-[#FFEDD5] rounded-full px-[17px] py-[18px] text-center font-semibold text-xl"> ➌ 결과는 2026년 7월 15일에 알려줘요</div>
          </div>
          
          {/* 신청하기*/}
          <Button
            rounded="full" disabled={!isOnline} className="h-16 mx-[14px] font-semibold text-[32px]" onClick={()=>url && window.open(url, '_blank')}>사이트 바로가기</Button>
        </div>
    )
}
export default BenefitHelper;