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
    <span className={`flex h-12 w-12 shrink-0 items-center justify-center ${className}`}>
      <img
        src={CATEGORY_ICON_SRC[category]}
        alt={category}
        className="h-full w-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]"
      />
    </span>
  );
};

export default FacilityIcon;
