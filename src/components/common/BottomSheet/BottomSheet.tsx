import type { ReactNode } from 'react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

const BottomSheet = ({ open, onClose, children, className = '' }: BottomSheetProps) => {
  if (!open) return null;

  return (
    <div role="presentation" className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={`animate-slide-up relative z-10 max-h-[calc(100svh-env(safe-area-inset-top))] w-full max-w-screen-sm overflow-y-auto rounded-t-3xl bg-white px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-3 shadow-lg ${className}`}
      >
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-gray-200" />
        {children}
      </div>
    </div>
  );
};

export default BottomSheet;
