interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const Loading = ({ text = '불러오는 중...', fullScreen = false, className = '' }: LoadingProps) => {
  const wrapperStyle = fullScreen ? 'fixed inset-0 z-50 bg-white/80' : 'min-h-40 bg-transparent';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center justify-center ${wrapperStyle} ${className}`}
    >
      <div className="flex flex-col items-center gap-3">
        <span className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
        <span className="text-sm font-medium text-gray-500">{text}</span>
      </div>
    </div>
  );
};

export default Loading;
