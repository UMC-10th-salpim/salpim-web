import { useNavigate } from 'react-router-dom';
import Chip from '@/components/common/Chip/Chip';
import useBenefitStore from '@/store/benefitStore';
import { MOCK_BENEFITS } from '@/apis/benefit';

const LikedBenefits = () => {
  const navigate = useNavigate();
  const likedIds = useBenefitStore((state) => state.likedIds);
  const toggleLike = useBenefitStore((state) => state.toggleLike);

  const likedBenefits = MOCK_BENEFITS.filter((benefit) => likedIds.includes(benefit.id));

  return (
    <div className="flex flex-col gap-4 p-4 pb-10">
      <div className="flex items-center gap-3 rounded-2xl border-2 border-brand-200 bg-[#FFF7ED] px-4 py-4">
        <img src="/characters/salpimi.png" alt="살피미" className="w-16 shrink-0" />
        <p className="text-base font-bold leading-6 text-gray-900">
          찜해 둔 혜택 {likedBenefits.length}개예요!
          <br />
          마감일을 놓치지 마세요.
        </p>
      </div>

      {likedBenefits.length === 0 ? (
        <p className="py-16 text-center text-sm text-gray-400">
          아직 찜한 혜택이 없어요.
          <br />
          마음에 드는 혜택을 하트를 눌러 저장해 보세요.
        </p>
      ) : (
        likedBenefits.map((benefit) => (
          <div key={benefit.id} className="flex flex-col gap-2 rounded-2xl bg-[#FBE3BF] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Chip label={benefit.category} className="px-3 py-1 text-xs" />
                <button
                  type="button"
                  onClick={() => navigate(`/benefits/${benefit.id}`)}
                  className="text-xs font-medium text-gray-600"
                >
                  자세히 보기 {'>'}
                </button>
              </div>
              <button type="button" aria-label="찜 해제" onClick={() => toggleLike(benefit.id)}>
                <img src="/icons/heart_fill.png" alt="찜 해제" className="h-6 w-6" />
              </button>
            </div>

            <span className="text-lg font-bold text-[#613212]">{benefit.title}</span>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-xl bg-[#FFB700] px-3 py-1 text-xs font-bold text-[#2B2B2B]">
                {benefit.deadline}
              </span>
              <span className="rounded-xl bg-[#FFB700] px-3 py-1 text-xs font-bold text-[#2B2B2B]">
                {benefit.ageLimit}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default LikedBenefits;
