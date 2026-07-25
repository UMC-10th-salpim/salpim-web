interface BenefitEmptyStateProps {
  source : 'survey' | 'search';
}

const CHECKLIST_BY_SOURCE: Record<'survey' | 'search', string[]> = {
  survey : [
    '거주 지역을 다시 선택해 보세요.',
    '살피미 답변을 다시 선택해 보세요.',
    '직접 찾기를 이용해 보세요.',
  ],
  search : [
    '거주 지역을 다시 선택해 보세요.',
    '관심 분야를 추가해 보세요.',
    '혜택을 다시 선택해 보세요.',
  ],
};

const BenefitEmptyState = ({source}: BenefitEmptyStateProps) => {
  const checklist = CHECKLIST_BY_SOURCE[source];

  return (
    <div className="flex flex-col gap-10">
      {/* 안내 배너 */}
      <div className="relative bg-[#FFF7ED] rounded-4xl flex items-center border-3 border-[#E8B16A] py-6 pr-[14.5px] pl-[96.5px]">
        <img
          src="/characters/salpimi_No.png"
          alt=""
          className="absolute top-5 -left-3 w-25 h-25"
        />
        <span className="text-2xl font-semibold text-center text-[#EF4444] break-keep">
          현재 조건에 맞는 혜택을 <br /> 찾지 못했어요.
        </span>
      </div>

      {/* 체크리스트 */}
      <div className="flex flex-col gap-4 pl-5 pb-55">
        {checklist.map((item) => (
          <div key={item} className="flex items-center gap-4">
            <img src="/icons/benefit/checkList.png" alt="" className="w-6 h-6" />
            <span className="text-xl font-semibold text-[#8B5A2B] break-keep">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenefitEmptyState;