import type { ButtonHTMLAttributes } from 'react';

type OnboardingButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const OnboardingButton = ({
  children,
  className = '',
  type = 'button',
  ...props
}: OnboardingButtonProps) => {
  return (
    <button
      type={type}
      className={`flex items-center justify-center rounded-xl bg-[#FF8A3D] text-[#FAFAFA] disabled:cursor-not-allowed disabled:bg-[#DDDDDD] disabled:text-[#FAF8F3] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default OnboardingButton;
