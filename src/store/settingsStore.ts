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
export const DEADLINE_ALERT_STORAGE_KEY = 'salpim-deadline-alert-enabled';

const getInitialFontSize = (): FontSize => {
  if (typeof window === 'undefined') return 'medium';
  return window.localStorage.getItem(FONT_SIZE_STORAGE_KEY) === 'large' ? 'large' : 'medium';
};

const getInitialDeadlineAlertEnabled = (): boolean => {
  if (typeof window === 'undefined') return true;
  return window.localStorage.getItem(DEADLINE_ALERT_STORAGE_KEY) !== 'false';
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
  deadlineAlertEnabled: getInitialDeadlineAlertEnabled(),
  toggleDeadlineAlert: () =>
    set((state) => {
      const deadlineAlertEnabled = !state.deadlineAlertEnabled;
      window.localStorage.setItem(
        DEADLINE_ALERT_STORAGE_KEY,
        String(deadlineAlertEnabled)
      );
      return { deadlineAlertEnabled };
    }),
}));

export default useSettingsStore;
