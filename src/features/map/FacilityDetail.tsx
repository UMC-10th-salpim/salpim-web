import type { FacilityBenefit, FacilityDetails } from '@/apis/facility';
import FacilityIcon from './FacilityIcon';
import { ClockIcon, HomeIcon, PinIcon } from './InfoIcons';
import type { Facility } from './types';

interface FacilityDetailProps {
  facility: Facility;
  details?: FacilityDetails;
  benefits: FacilityBenefit[];
  isLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

const FacilityDetail = ({
  facility,
  details,
  benefits,
  isLoading,
  errorMessage,
  onRetry,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: FacilityDetailProps) => {
  const name = details?.name || facility.name;
  const address = details?.address || facility.address;
  const operatingHours = details?.hour || facility.operatingHours;
  const distance = details?.distanceText || facility.distanceFromHome;

  return (
    <article className="flex flex-col gap-4 bg-gray-50 px-4 py-5">
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <FacilityIcon category={facility.mainCategory} className="h-11 w-11" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900">{name}</h1>
              {details?.isMyCenter && (
                <span className="rounded-full bg-[#FFF0DE] px-2.5 py-1 text-xs font-bold text-[#E96F27]">
                  내 관할 센터
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{address}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm text-gray-600">
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
            className="mt-4 block rounded-xl bg-[#FF8A3D] py-3 text-center text-sm font-semibold text-white"
          >
            전화하기
          </a>
        )}
      </div>

      <section>
        <h2 className="mb-3 text-base font-bold text-gray-900">이 시설에서 신청할 수 있는 혜택</h2>

        {isLoading ? (
          <p className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
            시설 정보와 혜택을 불러오는 중...
          </p>
        ) : errorMessage ? (
          <div className="rounded-2xl border border-red-100 bg-white p-4">
            <p role="alert" className="text-sm text-gray-600">
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 rounded-xl bg-[#FF8A3D] px-4 py-2 text-sm font-semibold text-white"
            >
              다시 시도
            </button>
          </div>
        ) : benefits.length > 0 ? (
          <div className="flex flex-col gap-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.servId}
                className="rounded-2xl border border-[#F4C78F] bg-[#FBE3BF] p-4"
              >
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#613212]">
                  {benefit.region || '전국'}
                </span>
                <h3 className="mt-2 text-base font-bold text-[#613212]">{benefit.serviceName}</h3>
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
          <p className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
            현재 이 시설에서 신청할 수 있는 혜택 정보가 없습니다.
          </p>
        )}
      </section>

      <div className="flex items-center gap-3 rounded-2xl bg-[#FBE3BF] p-4">
        <img src="/characters/salpimi.png" alt="" className="h-12 w-12" />
        <p className="text-sm font-bold text-[#613212]">
          해당 혜택은 {name}에서 신청할 수 있어요! 방문 전 전화로 확인을 추천해요.
        </p>
      </div>
    </article>
  );
};

export default FacilityDetail;
