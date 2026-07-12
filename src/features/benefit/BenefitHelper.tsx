import Button from "@/components/common/Button/Button";

interface BenefitHelperProps {
    isOnline: boolean;
    url?: string;
}

const BenefitHelper = ({isOnline, url}:BenefitHelperProps) => {
    return (
        <div className="flex flex-col p-4 gap-4">

            {/*상단 안내 카드*/}
            <div className="bg-[#FFF7ED] border-3 border-[#E8B16A] rounded-2xl flex items-center gap-2">
                <img src="/characters/salpimi_Love.png" className="w-20 h-20"/>
                <div className="flex flex-col gap-1">
                    <span className="font-bold text-[#613212]">노인 의료비 지원</span>
                    <span className="text-sm text-[#FF8A3D]">신청하기 전, <br/> 아래 내용을 꼭 확인해요!</span>
                </div>
            </div>

            {/*내가 신청할 수 있는지*/}
            <div className="flex flex-col gap-2">

                <div className="flex items-center gap-2">
                    <img src="/icons/helper/checklist.png" className="w-6 h-6"/>
                    <span className="font-bold text-[#613212]">내가 신청할 수 있는지 보기</span>
                </div>

                {/*나이*/}
                <div className="bg-[#FFEDD5] rounded-t-xl p-3">
                    <div className="flex items-center gap-2">
                        <img src="/icons/helper/success.png" className="w-6 h-6"/>
                        <span className="font-bold">나이 조건(만 00세 이상)</span>
                    </div>
                    <span className="text-sm text-[#22C55E] pl-8">충족 ⋅ 만 00세</span>
                </div>

                {/*사는 곳*/}
                <div className="bg-[#FFEDD5] p-3">
                    <div className="flex items-center gap-2">
                        <img src="/icons/helper/success.png" className="w-6 h-6"/>
                        <span className="font-bold">사는 곳(00시 00구)</span>
                    </div>
                    <span className="text-sm text-[#22C55E] pl-8">충족 ⋅ 00시 00구</span>
                </div>

                {/*소득 기준*/}
                <div className="bg-[#FFEDD5] rounded-b-xl p-3">
                    <div className="flex items-center gap-2">
                        <img src="/icons/helper/question.png" className="w-6 h-6"/>
                        <span className="font-bold">소득 기준(중위소득 100% 이내)</span>
                    </div>
                    <span className="text-sm text-[#EF4444] pl-8">확인이 필요해요. 담당 기관에 문의해 주세요.</span>
                </div>
            </div>

            {/*신청할 때 필요해요-online*/}
            {isOnline && (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <img src="/icons/helper/document.png" className="w-6 h-6"/>
                        <span className="font-bold text-[#613212]">신청할 때 필요해요</span>
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="bg-[#FED7AA] rounded-xl px-4 py-2 w-fit font-bold text-[#8B5A2B]">주민등록본</div>
                        <div className="bg-[#FED7AA] rounded-xl px-4 py-2 w-fit font-bold text-[#8B5A2B]">신분증 사본</div>
                        <div className="bg-[#FED7AA] rounded-xl px-4 py-2 w-fit font-bold text-[#8B5A2B]">건강보험료 납부 확인서</div>
                    </div>
                </div>
            )}

            {/*안내 카드*/}
            <div className="flex items-center gap-3 p-4 border-3 border-[#E8B16A] rounded-2xl bg-[#FFF7ED]">
                <img src="/characters/salpimi_Search.png" className="w-17 h-17"/>
                <span className="text-sm font-bold">
                    {isOnline
                        ? '필요한 서류가 다를 수 있어요. 신청하기 전, 담당 기관에 준비물을 꼭 한번 더 확인해 주세요!'
                        : '기본적으로 신분등을 꼭 챙겨 주세요. 방문하기 전, 담당 기관에 준비물을 한번 더 확인해 주세요!'}
                        </span>
            </div>

            {/*이렇게 신청해보세요-online*/}
            {isOnline && (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <img src="/icons/helper/application.png" className="w-6 h-6"/>
                        <span className="font-bold text-[#613212]">이렇게 신청해 보세요</span>
                    </div>

                    <div className="bg-[#FFEDD5] rounded-4xl p-4 text-center font-bold"> 1. 주민센터 방문 또는 복지로 검색하기</div>
                    <div className="flex justify-center">
                        <img src="/icons/helper/arrow.png" className="w-8 h-8"/>
                    </div>

                    <div className="bg-[#FFEDD5] rounded-4xl p-4 text-center font-bold"> 2. 신청서 쓰고 제출하기</div>
                    <div className="flex justify-center">
                        <img src="/icons/helper/arrow.png" className="w-8 h-8"/>
                    </div>

                    <div className="bg-[#FFEDD5] rounded-4xl p-4 text-center font-bold"> 3. 결과는 2026년 7월 15일에 알려줘요</div>
                </div>
            )}

            {/* 신청하기*/}
            {isOnline && (
            <Button rounded="full" className="h-14" onClick={()=>url && window.open(url, '_blank')}>신청하기</Button>
            )}

        </div>
    )
}
export default BenefitHelper;