import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  title?: string;
  children: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onClose: () => void;
  className?: string;
}

const Modal = ({
  open,
  title,
  children,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onClose,
  className = '',
}: ModalProps) => {
  if (!open) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-5 py-[max(1.25rem,env(safe-area-inset-top))]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={`max-h-full w-full max-w-sm overflow-y-auto rounded-[20px] border-2 border-[#FFD29E] bg-[#FFFCF8] p-5 shadow-lg ${className}`}
        onClick={(event) => event.stopPropagation()}
      >
        {title && (
          <h2 id="modal-title" className="text-xl font-extrabold text-[#613212]">
            {title}
          </h2>
        )}

        <div className={`${title ? 'mt-3' : ''} text-base font-semibold leading-7 text-gray-700`}>
          {children}
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            className="min-h-12 flex-1 rounded-2xl border-2 border-[#FFD29E] bg-white px-4 py-3 text-base font-bold text-[#613212] transition-colors hover:bg-[#FFF7EC]"
            onClick={onClose}
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              type="button"
              className="min-h-12 flex-1 rounded-2xl bg-[#FF853E] px-4 py-3 text-base font-bold text-white transition-colors hover:bg-[#EB6F27]"
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
