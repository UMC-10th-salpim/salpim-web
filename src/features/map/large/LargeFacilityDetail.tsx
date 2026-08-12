import type { FacilityBenefit, FacilityDetails } from '@/apis/facility';
import FacilityIcon from '../FacilityIcon';
import { ClockIcon, HomeIcon, PinIcon } from '../InfoIcons';
import type { Facility } from '../types';
import BenefitServiceIcon from '../BenefitServiceIcon';

interface LargeFacilityDetailProps {
  facility: Facility;
  details?: FacilityDetails;
  benefits: FacilityBenefit[];
  isLoading: boolean;
  isOutsideMyServiceCenter: boolean;
  hasNoAvailableBenefits: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  onViewBenefit: (benefitId: number) => void;
}

const LargeNotice = ({ message }: { message: string }) => (
  <div className="flex min-h-[118px] items-center rounded-[24px] border-[3px] border-[#F1B66D] bg-[#FFF2DC] px-3 py-2">
    <img
      src="/characters/salpimi_No.png"
      alt="아쉬워하는 살피미"
      className="h-24 w-24 shrink-0 self-end object-contain"
    />
    <p className="flex-1 break-keep text-center text-[19px] font-extrabold leading-[1.35] text-[#FF4B4B]">
      {message}
    </p>
  </div>
);

const LargeFacilityDetail = ({
  facility,
  details,
  benefits,
  isLoading,
  isOutsideMyServiceCenter,
  hasNoAvailableBenefits,
  errorMessage,
  onRetry,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  onViewBenefit,
}: LargeFacilityDetailProps) => {
  const name = details?.name || facility.name;
  const address = details?.address || facility.address;
  const operatingHours = details?.hour || facility.operatingHours;
  const distance = details?.distanceText || facility.distanceFromHome;

  return (
    <article className="mx-auto flex w-full max-w-[375px] flex-col gap-5 bg-[#FAF8F3] px-4 pb-6 pt-4">
      <section className="rounded-[24px] border-[3px] border-[#F1B66D] bg-[#FFF0D8] p-4 shadow-[0_3px_10px_rgba(91,53,24,0.07)]">
        <div className="flex items-center gap-3">
          <FacilityIcon
            category={facility.mainCategory}
            className="h-16 w-16"
            showShadow={false}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="break-keep text-[26px] font-extrabold leading-[1.2] text-[#172033]">
                {name}
              </h1>
              {details?.isMyCenter && (
                <span className="rounded-full bg-white px-3 py-1 text-[15px] font-extrabold text-[#E96F27]">
                  내 관할 센터
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2.5 text-[18px] font-bold leading-[1.35] text-[#613212]">
          <p className="flex items-start gap-2 break-keep">
            <PinIcon />
            <span>
              {address} {facility.detailAddress}
            </span>
          </p>
          {operatingHours && (
            <p className="flex items-center gap-2">
              <ClockIcon />
              {operatingHours}
            </p>
          )}
          <p className="flex items-center gap-2">
            <HomeIcon />
            우리 집에서 {distance}
          </p>
        </div>

        {facility.phone && (
          <a
            href={`tel:${facility.phone}`}
            className="mt-4 flex min-h-14 items-center justify-center rounded-full bg-[#FF8A3D] text-[23px] font-extrabold text-white"
          >
            전화하기
          </a>
        )}
      </section>

      <section>
        <h2 className="mb-3 break-keep text-[25px] font-extrabold leading-[1.3] text-[#613212]">
          이 시설에서 신청할 수 있는 혜택
        </h2>

        {isLoading ? (
          <p className="rounded-[22px] border-2 border-[#F1B66D] bg-white p-5 text-[19px] font-bold leading-7 text-[#76533C]">
            시설 정보와 혜택을 불러오는 중...
          </p>
        ) : isOutsideMyServiceCenter ? (
          <LargeNotice message="주소가 달라서 신청할 수 없어요. 신청 안내는 주소지에 맞는 주민센터에서 확인해 주세요." />
        ) : hasNoAvailableBenefits ? (
          <LargeNotice message="현재 제공하고 있는 혜택이 없어 신청할 수 없어요. 혜택 찾기를 진행해 주세요." />
        ) : errorMessage ? (
          <div className="rounded-[22px] border-2 border-[#F1B66D] bg-white p-5">
            <p role="alert" className="text-[18px] font-bold leading-7 text-[#76533C]">
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 min-h-12 rounded-full bg-[#FF8A3D] px-6 text-[18px] font-extrabold text-white"
            >
              다시 시도
            </button>
          </div>
        ) : benefits.length > 0 ? (
          <div className="overflow-hidden rounded-[22px] border-2 border-[#F1C991] bg-[#FFE5BD]">
            {benefits.map((benefit) => (
              <article
                key={benefit.benefitId}
                className="grid min-h-[92px] grid-cols-[58px_minmax(0,1fr)_auto] items-center gap-2 border-b-[3px] border-white px-3 py-2.5 last:border-b-0"
              >
                <BenefitServiceIcon
                  serviceName={benefit.serviceName}
                  className="h-[58px] w-[58px]"
                />
                <div className="min-w-0">
                  <span className="inline-flex rounded-full bg-white px-3 py-0.5 text-[15px] font-extrabold text-[#76533C]">
                    지원금
                  </span>
                  <h3 className="mt-1 line-clamp-2 break-keep text-[18px] font-extrabold leading-[1.2] text-[#613212]">
                    {benefit.serviceName}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => onViewBenefit(benefit.benefitId)}
                  className="whitespace-nowrap rounded-full bg-white px-2.5 py-2 text-[14px] font-extrabold text-[#613212]"
                >
                  자세히 보기 &gt;
                </button>
              </article>
            ))}
            {hasNextPage && (
              <button
                type="button"
                onClick={onLoadMore}
                disabled={isFetchingNextPage}
                className="min-h-14 w-full border-t-[3px] border-white bg-[#FFF5E7] px-4 text-[18px] font-extrabold text-[#FF7A32] disabled:opacity-50"
              >
                {isFetchingNextPage ? '더 불러오는 중...' : '혜택 더 보기'}
              </button>
            )}
          </div>
        ) : (
          <LargeNotice message="현재 제공하고 있는 혜택이 없어 신청할 수 없어요. 혜택 찾기를 진행해 주세요." />
        )}
      </section>

      {!isLoading &&
        !isOutsideMyServiceCenter &&
        !hasNoAvailableBenefits &&
        !errorMessage &&
        benefits.length > 0 && (
        <div className="flex min-h-[120px] items-center rounded-[24px] border-[3px] border-[#F1B66D] bg-white px-2 py-2">
          <img
            src="/characters/salpimi_Good.png"
            alt="안내하는 살피미"
            className="h-24 w-24 shrink-0 self-end object-contain"
          />
          <p className="flex-1 break-keep text-center text-[18px] font-extrabold leading-6 text-[#613212]">
            해당 혜택은 {name}에서 신청할 수 있어요!
            <br />
            방문 전 전화 확인을 추천해요.
          </p>
        </div>
      )}
    </article>
  );
};

export default LargeFacilityDetail;
