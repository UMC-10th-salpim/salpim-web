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
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      setName: (name) => set({ name }),
      logout: () => set({ accessToken: null, refreshToken: null, name: null }),
    }),
    { name: 'salpim-auth' }
  )
);

export default useUserStore;
