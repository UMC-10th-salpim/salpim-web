interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  rounded?: "xl" | "full";
  className?: string;
}

// rounded 기본값 "xl" 로그인 버튼 스타일
export default function Button({children, onClick, disabled, rounded = 'xl', className=''}: ButtonProps) {
  const roundedStyle = rounded === "full" ? "rounded-full" : "rounded-xl"
  console.log('button에 들어갈 텍스트:',children)
  console.log('disabled 상태', disabled)

  return (
    <button 
      className={`w-full text-[#FAFAFA] bg-[#FF8A3D] disabled:bg-[#DDDDDD] disabled:text-[#FAF8F3] disabled:cursor-not-allowed flex items-center justify-center ${roundedStyle} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}