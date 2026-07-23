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
      className={`sticky top-0 z-30 flex h-14 items-center gap-1 bg-[#FAF8F3] px-3 ${className}`}
    >
      <button
        type="button"
        onClick={handleBack}
        aria-label="뒤로 가기"
        className="flex h-20 w-10 items-center justify-center rounded-full text-gray-800 transition-colors hover:bg-gray-100"
      >
      <img src='/icons/back.png'/>
      </button>
      <h1 className="text-2xl tracking-[-0.06em] font-bold text-[#6B4423]">{title}</h1>
    </header>
  );
};

export default HeaderBar;
