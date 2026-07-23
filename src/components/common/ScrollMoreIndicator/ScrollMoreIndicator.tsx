import { useEffect, useState } from 'react';

interface ScrollMoreIndicatorProps {
  className?: string;
}

const ScrollMoreIndicator = ({ className = '' }: ScrollMoreIndicatorProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      const page = document.documentElement;
      const hasMoreContent = page.scrollHeight > window.innerHeight + 24;
      const reachedBottom = window.scrollY + window.innerHeight >= page.scrollHeight - 48;

      setVisible(hasMoreContent && !reachedBottom);
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);

    const resizeObserver = new ResizeObserver(updateVisibility);
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
      resizeObserver.disconnect();
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="아래 내용 더 보기"
      onClick={() =>
        window.scrollBy({
          top: Math.max(window.innerHeight * 0.62, 320),
          behavior: 'smooth',
        })
      }
      className={`fixed bottom-[calc(86px+env(safe-area-inset-bottom))] left-1/2 z-[35] flex h-13 w-13 -translate-x-1/2 items-center justify-center rounded-full border border-[#F3E8DC] bg-white text-[#FF7A32] shadow-[0_5px_16px_rgba(89,55,27,0.22)] transition-transform hover:scale-105 ${className}`}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
};

export default ScrollMoreIndicator;
