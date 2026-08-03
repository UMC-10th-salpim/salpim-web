import { create } from 'zustand';

export type FontSize = 'medium' | 'large';

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
