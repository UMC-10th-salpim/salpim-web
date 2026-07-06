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
      className={`sticky top-0 z-30 flex h-14 items-center gap-1 bg-white px-3 ${className}`}
    >
      <button
        type="button"
        onClick={handleBack}
        aria-label="뒤로 가기"
        className="flex h-9 w-9 items-center justify-center rounded-full text-gray-800 transition-colors hover:bg-gray-100"
      >
        <svg
          width="24"
          height="24"
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
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
    </header>
  );
};

export default HeaderBar;
