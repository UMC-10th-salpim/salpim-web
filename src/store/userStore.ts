import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  accessToken: string | null;
  refreshToken: string | null;
  name: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setName: (name: string) => void;
  logout: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      name: null,
      // 다른 계정의 이름이 남지 않도록 새 인증 세션을 저장할 때 기존 이름을 초기화한다.
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken, name: null }),
      setName: (name) => set({ name }),
      logout: () => set({ accessToken: null, refreshToken: null, name: null }),
    }),
    { name: 'salpim-auth' }
  )
);

export default useUserStore;
