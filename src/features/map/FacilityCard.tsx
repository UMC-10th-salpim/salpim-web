import Card from '@/components/common/Card/Card';
import Chip from '@/components/common/Chip/Chip';
import type { Facility } from './types';

interface FacilityCardProps {
  facility: Facility;
  selected?: boolean;
  onClick?: (facility: Facility) => void;
}

const FacilityCard = ({ facility, selected = false, onClick }: FacilityCardProps) => {
  return (
    <Card
      onClick={onClick ? () => onClick(facility) : undefined}
      className={`border-gray-200 ${selected ? 'border-[#FF8A3D] ring-2 ring-orange-100' : ''}`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-semibold text-gray-900">{facility.name}</h3>
              <Chip label={facility.category} selected />
            </div>
            <p className="mt-1 line-clamp-2 text-sm leading-5 text-gray-600">{facility.address}</p>
          </div>

          {facility.distance && (
            <span className="shrink-0 text-sm font-semibold text-[#FF8A3D]">{facility.distance}</span>
          )}
        </div>

        {facility.description && (
          <p className="line-clamp-2 text-sm leading-5 text-gray-700">{facility.description}</p>
        )}

        {facility.tags && facility.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {facility.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default FacilityCard;
