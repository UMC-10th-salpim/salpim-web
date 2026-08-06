import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  accessToken: string | null;
  refreshToken: string | null;
  name: string | null;
  homeLatitude: number | null;
  homeLongitude: number | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setName: (name: string) => void;
  setHomeLocation: (latitude: number, longitude: number) => void;
  logout: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      name: null,
      homeLatitude: null,
      homeLongitude: null,
      // 다른 계정의 이름이 남지 않도록 새 인증 세션을 저장할 때 기존 이름을 초기화한다.
      setTokens: (accessToken, refreshToken) =>
        set({
          accessToken,
          refreshToken,
          name: null,
          homeLatitude: null,
          homeLongitude: null,
        }),
      setName: (name) => set({ name }),
      setHomeLocation: (homeLatitude, homeLongitude) => set({ homeLatitude, homeLongitude }),
      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          name: null,
          homeLatitude: null,
          homeLongitude: null,
        }),
    }),
    { name: 'salpim-auth' }
  )
);

export default useUserStore;
