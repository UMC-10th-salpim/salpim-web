import { create } from 'zustand';

export type FontSize = 'medium' | 'large';

interface SettingsState {
  fontSize: FontSize;
  setFontSize: (fontSize: FontSize) => void;
  deadlineAlertEnabled: boolean;
  toggleDeadlineAlert: () => void;
}

const useSettingsStore = create<SettingsState>()((set) => ({
  fontSize: 'medium',
  setFontSize: (fontSize) => set({ fontSize }),
  deadlineAlertEnabled: true,
  toggleDeadlineAlert: () => set((state) => ({ deadlineAlertEnabled: !state.deadlineAlertEnabled })),
}));

export default useSettingsStore;
