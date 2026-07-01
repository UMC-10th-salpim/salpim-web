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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={`w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 shadow-lg ${className}`}
        onClick={(event) => event.stopPropagation()}
      >
        {title && (
          <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
        )}

        <div className={`${title ? 'mt-3' : ''} text-sm leading-6 text-gray-700`}>{children}</div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            onClick={onClose}
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              type="button"
              className="flex-1 rounded-xl border border-brand-500 bg-brand-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-600"
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
