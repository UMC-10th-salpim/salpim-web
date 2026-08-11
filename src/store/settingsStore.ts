import { create } from 'zustand';

export type FontSize = 'medium' | 'large';
export type ServerWordSize = 'MEDIUM' | 'LARGE';

export const fromServerWordSize = (
  wordSize: ServerWordSize | null | undefined
): FontSize | null => {
  if (wordSize === 'MEDIUM') return 'medium';
  if (wordSize === 'LARGE') return 'large';
  return null;
};

export const toServerWordSize = (fontSize: FontSize): ServerWordSize =>
  fontSize === 'large' ? 'LARGE' : 'MEDIUM';

export const FONT_SIZE_STORAGE_KEY = 'salpim-font-size';

const getInitialFontSize = (): FontSize => {
  if (typeof window === 'undefined') return 'medium';
  return window.localStorage.getItem(FONT_SIZE_STORAGE_KEY) === 'large' ? 'large' : 'medium';
};

interface SettingsState {
  fontSize: FontSize;
  setFontSize: (fontSize: FontSize) => void;
  deadlineAlertEnabled: boolean;
  toggleDeadlineAlert: () => void;
}

const useSettingsStore = create<SettingsState>()((set) => ({
  fontSize: getInitialFontSize(),
  setFontSize: (fontSize) => {
    window.localStorage.setItem(FONT_SIZE_STORAGE_KEY, fontSize);
    set({ fontSize });
  },
  deadlineAlertEnabled: true,
  toggleDeadlineAlert: () =>
    set((state) => ({ deadlineAlertEnabled: !state.deadlineAlertEnabled })),
}));

export default useSettingsStore;
