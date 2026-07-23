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
    <main className="mypage-content gap-5">
      {likedBenefits.length === 0 ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="mypage-card flex items-center gap-3 px-4 py-3">
            <img
              src="/characters/salpimi_Dog.png"
              alt="아쉬워하는 살피미"
              className="w-[76px] shrink-0"
            />
            <p className="text-[18px] font-extrabold leading-6 text-[#613212]">
              아직 찜한 혜택이 없어요.
              <br />
              마음에 드는 혜택을 찜해두면
              <br />
              한곳에서 모아볼 수 있어요.
            </p>
          </div>

          <div className="mt-auto pt-8">
            <button
              type="button"
              onClick={() => navigate('/benefits')}
              className="mypage-primary-action"
            >
              혜택 둘러보기
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mypage-card flex items-center gap-4 px-4 py-3.5">
            <img src="/characters/salpimi.png" alt="살피미" className="w-[70px] shrink-0" />
            <p className="text-[19px] font-extrabold leading-7 text-[#613212]">
              찜해 둔 혜택 {likedBenefits.length}개예요!
              <br />
              마감일을 놓치지 마세요.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {likedBenefits.map((benefit) => (
              <article
                key={benefit.id}
                className="flex flex-col gap-3 rounded-[20px] border-2 border-[#F4C78F] bg-[#FFE9CA] p-4 shadow-[0_3px_10px_rgba(97,50,18,0.06)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Chip label={benefit.category} className="px-3 py-1 text-sm" />
                    <button
                      type="button"
                      onClick={() => navigate(`/benefits/${benefit.id}`)}
                      className="min-h-11 rounded-xl px-2 text-[15px] font-bold text-[#6F6258]"
                    >
                      자세히 보기 {'>'}
                    </button>
                  </div>
                  <button
                    type="button"
                    aria-label="찜 해제"
                    onClick={() => toggleLike(benefit.id)}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white"
                  >
                    <img src="/icons/heart_fill.png" alt="" className="h-7 w-7" />
                  </button>
                </div>

                <h2 className="text-[21px] font-extrabold leading-7 text-[#613212]">
                  {benefit.title}
                </h2>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-xl bg-[#FFB700] px-3 py-1.5 text-sm font-extrabold text-[#2B2B2B]">
                    {benefit.deadline}
                  </span>
                  <span className="rounded-xl bg-[#FFB700] px-3 py-1.5 text-sm font-extrabold text-[#2B2B2B]">
                    {benefit.ageLimit}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  );
};

export default LikedBenefits;
