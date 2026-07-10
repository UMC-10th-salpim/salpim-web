import { create } from 'zustand';
import type { AuthUser } from '@/apis/auth';

interface UserState {
  user: AuthUser | null;
  accessToken: string | null;
  setAuth: (user: AuthUser, accessToken: string) => void;
  logout: () => void;
}

const useUserStore = create<UserState>()((set) => ({
  user: null,
  accessToken: null,
  setAuth: (user, accessToken) => set({ user, accessToken }),
  logout: () => set({ user: null, accessToken: null }),
}));

export default useUserStore;
