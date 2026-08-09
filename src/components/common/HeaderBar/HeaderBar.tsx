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
      className={`sticky top-0 z-30 flex h-16 items-center gap-1 bg-[#FAF8F3] px-3 ${className}`}
    >
      <button
        type="button"
        onClick={handleBack}
        aria-label="뒤로 가기"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-800 transition-colors hover:bg-[#FFF0DA] active:scale-95"
      >
        <img src="/icons/back.png" alt="" aria-hidden className="h-6 w-6 object-contain" />
      </button>
      <h1 className="salpim-header-title font-extrabold leading-none text-[#6B4423]">{title}</h1>
    </header>
  );
};

export default HeaderBar;
