import type { FacilityBenefit, FacilityDetails } from '@/apis/facility';
import FacilityIcon from './FacilityIcon';
import { ClockIcon, HomeIcon, PinIcon } from './InfoIcons';
import type { Facility } from './types';

interface FacilityDetailProps {
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

interface FacilityNoticeProps {
  message: string;
}

const FacilityNotice = ({ message }: FacilityNoticeProps) => (
  <div className="flex min-h-[112px] items-center rounded-[28px] border-[3px] border-[#E8B16A] bg-[#FFF7ED] px-3 py-2">
    <img
      src="/characters/salpimi_No.png"
      alt="아쉬워하는 살피미"
      className="h-24 w-24 shrink-0 self-end object-contain"
    />
    <p className="flex-1 break-keep text-center text-[18px] font-extrabold leading-[1.35] text-[#FF4B4B]">
      {message}
    </p>
  </div>
);

const FacilityDetail = ({
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
}: FacilityDetailProps) => {
  const name = details?.name || facility.name;
  const address = details?.address || facility.address;
  const operatingHours = details?.hour || facility.operatingHours;
  const distance = details?.distanceText || facility.distanceFromHome;

  return (
    <article className="mx-auto flex w-full max-w-md flex-col gap-4 bg-[#FAF8F3] px-4 py-5">
      <div className="rounded-2xl border-2 border-[#FFD29E] bg-white p-4 shadow-[0_4px_12px_rgba(91,53,24,0.08)]">
        <div className="flex items-center gap-3">
          <FacilityIcon category={facility.mainCategory} className="h-11 w-11" showShadow={false} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="break-words text-[20px] font-extrabold leading-7 text-[#43230F]">
                {name}
              </h1>
              {details?.isMyCenter && (
                <span className="rounded-full bg-[#FFF0DE] px-2.5 py-1 text-xs font-bold text-[#E96F27]">
                  내 관할 센터
                </span>
              )}
            </div>
            <p className="mt-0.5 break-words text-[15px] font-semibold leading-5 text-[#81746A]">
              {address}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-[16px] font-semibold leading-6 text-[#613212]">
          <p className="flex items-center gap-1.5">
            <PinIcon />
            {address} {facility.detailAddress}
          </p>
          {operatingHours && (
            <p className="flex items-center gap-1.5">
              <ClockIcon />
              {operatingHours}
            </p>
          )}
          <p className="flex items-center gap-1.5">
            <HomeIcon />
            우리 집에서 {distance}
          </p>
        </div>

        {facility.phone && (
          <a
            href={`tel:${facility.phone}`}
            className="mt-4 block min-h-12 rounded-xl bg-[#FF8A3D] py-3 text-center text-[17px] font-extrabold text-white"
          >
            전화하기
          </a>
        )}
      </div>

      <section>
        <h2 className="mb-3 text-[19px] font-extrabold text-[#43230F]">
          이 시설에서 신청할 수 있는 혜택
        </h2>

        {isLoading ? (
          <p className="rounded-2xl border-2 border-[#FFD29E] bg-white p-4 text-[16px] font-semibold text-[#81746A]">
            시설 정보와 혜택을 불러오는 중...
          </p>
        ) : isOutsideMyServiceCenter ? (
          <FacilityNotice message="주소가 달라서 신청할 수 없어요. 신청 안내는 주소지에 맞는 주민센터에서 확인해 주세요." />
        ) : hasNoAvailableBenefits ? (
          <FacilityNotice message="현재 제공하고 있는 혜택이 없어 신청할 수 없어요. 혜택 찾기를 진행해 주세요." />
        ) : errorMessage ? (
          <div className="rounded-2xl border-2 border-[#FFD29E] bg-white p-4">
            <p role="alert" className="text-[16px] font-semibold leading-6 text-[#81746A]">
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 min-h-11 rounded-xl bg-[#FF8A3D] px-5 py-2 text-[16px] font-extrabold text-white"
            >
              다시 시도
            </button>
          </div>
        ) : benefits.length > 0 ? (
          <div className="flex flex-col gap-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.benefitId}
                className="rounded-2xl border border-[#F4C78F] bg-[#FBE3BF] p-4"
              >
                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold text-[#613212]">
                      {benefit.region || '전국'}
                    </span>
                    <h3 className="mt-2 break-words text-base font-bold text-[#613212]">
                      {benefit.serviceName}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => onViewBenefit(benefit.benefitId)}
                    className="min-h-10 shrink-0 rounded-full bg-white px-4 text-sm font-extrabold text-[#E85D04] shadow-sm"
                  >
                    자세히 보기
                  </button>
                </div>
              </div>
            ))}
            {hasNextPage && (
              <button
                type="button"
                onClick={onLoadMore}
                disabled={isFetchingNextPage}
                className="min-h-12 rounded-xl border border-[#FF8A3D] bg-white px-4 text-sm font-semibold text-[#FF8A3D] disabled:opacity-50"
              >
                {isFetchingNextPage ? '더 불러오는 중...' : '혜택 더 보기'}
              </button>
            )}
          </div>
        ) : (
          <FacilityNotice message="현재 제공하고 있는 혜택이 없어 신청할 수 없어요. 혜택 찾기를 진행해 주세요." />
        )}
      </section>

      {!isLoading &&
        !isOutsideMyServiceCenter &&
        !hasNoAvailableBenefits &&
        !errorMessage &&
        benefits.length > 0 && (
        <div className="flex items-center gap-3 rounded-2xl bg-[#FBE3BF] p-4">
          <img
            src="/characters/salpimi_Good.png"
            alt="안내하는 살피미"
            className="h-14 w-14 shrink-0 object-contain"
          />
          <p className="text-[16px] font-extrabold leading-6 text-[#613212]">
            표시된 혜택은 {name}에서 신청할 수 있어요! 방문 전 전화로 확인해 주세요.
          </p>
        </div>
      )}
    </article>
  );
};

export default FacilityDetail;
