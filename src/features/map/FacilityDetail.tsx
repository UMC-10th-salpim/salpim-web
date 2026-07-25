import BenefitCard from '@/features/benefit/BenefitCard';
import { MOCK_BENEFITS } from '@/apis/benefit';
import type { FacilityBenefit } from '@/apis/facility';
import FacilityIcon from './FacilityIcon';
import { ClockIcon, HomeIcon, PinIcon } from './InfoIcons';
import type { Facility } from './types';

interface FacilityDetailProps {
  facility: Facility;
  benefits?: FacilityBenefit[];
}

const FacilityDetail = ({ facility, benefits }: FacilityDetailProps) => {
  const relatedBenefits = MOCK_BENEFITS.filter((benefit) => benefit.facilityName === facility.name);
  const hasBackendBenefits = benefits !== undefined;

  return (
    <article className="flex flex-col gap-4 bg-gray-50 px-4 py-5">
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <FacilityIcon category={facility.mainCategory} className="h-11 w-11" />
          <div>
            <h1 className="text-lg font-bold text-gray-900">{facility.name}</h1>
            <p className="text-sm text-gray-500">{facility.address}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm text-gray-600">
          <p className="flex items-center gap-1.5">
            <PinIcon />
            {facility.address} {facility.detailAddress}
          </p>
          {facility.operatingHours && (
            <p className="flex items-center gap-1.5">
              <ClockIcon />
              {facility.operatingHours}
            </p>
          )}
          <p className="flex items-center gap-1.5">
            <HomeIcon />
            우리 집에서 {facility.distanceFromHome}
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

        {benefits && benefits.length > 0 ? (
          <div className="flex flex-col gap-3">
            {benefits.map((benefit) => (
              <article
                key={benefit.servId}
                className="rounded-2xl border border-gray-200 bg-white p-4"
              >
                <p className="text-base font-bold text-gray-900">{benefit.serviceName}</p>
                <p className="mt-1 text-sm text-gray-500">{benefit.region}</p>
              </article>
            ))}
          </div>
        ) : !hasBackendBenefits && relatedBenefits.length > 0 ? (
          <div className="flex flex-col gap-3">
            {relatedBenefits.map((benefit) => (
              <BenefitCard
                key={benefit.id}
                id={benefit.id}
                category={benefit.category}
                icon={benefit.icon}
                title={benefit.title}
                className="rounded-2xl"
              />
            ))}
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
          해당 혜택은 {facility.name}에서 신청할 수 있어요! 방문 전 전화로 확인을 추천해요.
        </p>
      </div>
    </article>
  );
};

export default FacilityDetail;
