import Card from '@/components/common/Card/Card';
import Chip from '@/components/common/Chip/Chip';
import type { Facility } from './types';

interface FacilityDetailProps {
  facility: Facility;
  onBack?: () => void;
}

const FacilityDetail = ({ facility, onBack }: FacilityDetailProps) => {
  return (
    <article className="flex flex-col gap-4 bg-gray-50 px-4 py-5">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="w-fit text-sm font-semibold text-[#FF8A3D]"
        >
          이전으로
        </button>
      )}

      <Card className="flex flex-col gap-4">
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <Chip label={facility.category} selected />
            {facility.distance && (
              <span className="rounded-full bg-orange-50 px-3 py-1.5 text-sm font-semibold text-[#FF8A3D]">
                {facility.distance}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{facility.name}</h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">{facility.address}</p>
        </div>

        {facility.description && (
          <p className="rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-700">{facility.description}</p>
        )}
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-gray-900">기본 정보</h2>
        <dl className="mt-4 flex flex-col gap-3 text-sm">
          <div className="flex gap-4">
            <dt className="w-20 shrink-0 font-medium text-gray-500">주소</dt>
            <dd className="text-gray-800">{facility.address}</dd>
          </div>

          {facility.phone && (
            <div className="flex gap-4">
              <dt className="w-20 shrink-0 font-medium text-gray-500">전화번호</dt>
              <dd>
                <a className="font-semibold text-[#FF8A3D]" href={`tel:${facility.phone}`}>
                  {facility.phone}
                </a>
              </dd>
            </div>
          )}

          {facility.operatingHours && (
            <div className="flex gap-4">
              <dt className="w-20 shrink-0 font-medium text-gray-500">운영시간</dt>
              <dd className="text-gray-800">{facility.operatingHours}</dd>
            </div>
          )}
        </dl>
      </Card>

      {facility.services && facility.services.length > 0 && (
        <Card>
          <h2 className="text-base font-semibold text-gray-900">제공 서비스</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {facility.services.map((service) => (
              <li key={service} className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {service}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {facility.tags && facility.tags.length > 0 && (
        <Card>
          <h2 className="text-base font-semibold text-gray-900">관련 태그</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {facility.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        </Card>
      )}
    </article>
  );
};

export default FacilityDetail;
