import { useNavigate } from 'react-router-dom';

interface HeaderBarProps {
  title: string;
  onBack?: () => void;
  className?: string;
}

const HeaderBar = ({ title, onBack, className = '' }: HeaderBarProps) => {
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate(-1));

  return (
    <header
      className={`sticky top-0 z-30 flex h-14 shrink-0 items-center gap-0 border-b border-[#EDE4DA] bg-[#FFFCF8] px-2 shadow-[0_2px_6px_rgba(87,52,25,0.04)] ${className}`}
    >
      <button
        type="button"
        onClick={handleBack}
        aria-label="뒤로 가기"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#9B8068] transition-colors hover:bg-[#FFF0DA] active:bg-[#FFE4C2]"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <h1 className="truncate text-[20px] font-extrabold text-[#613212]">{title}</h1>
    </header>
  );
};

export default HeaderBar;
