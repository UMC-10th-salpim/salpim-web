import type { FacilityMainCategory } from './types';

interface FacilityIconProps {
  category: FacilityMainCategory;
  className?: string;
}

const CATEGORY_ICON_SRC: Record<FacilityMainCategory, string> = {
  '건강·의료': '/icons/map/hospital.png',
  생활지원: '/icons/map/welfare.png',
  문화: '/icons/map/center.png',
  '배움·일자리': '/icons/map/school.png',
};

const FacilityIcon = ({ category, className = '' }: FacilityIconProps) => {
  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ${className}`}
    >
      <img src={CATEGORY_ICON_SRC[category]} alt={category} className="h-5 w-5" />
    </span>
  );
};

export default FacilityIcon;
