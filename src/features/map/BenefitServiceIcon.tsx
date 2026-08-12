import { getBenefitIcon } from '@/apis/benefit';

interface BenefitServiceIconProps {
  serviceName: string;
  className?: string;
}

const BenefitServiceIcon = ({ serviceName, className = '' }: BenefitServiceIconProps) => {
  const icon = getBenefitIcon(serviceName) || '/assets/IconWelfare.png';

  return (
    <span
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white p-2 ${className}`}
    >
      <img src={icon} alt="" className="h-full w-full object-contain" />
    </span>
  );
};

export default BenefitServiceIcon;
