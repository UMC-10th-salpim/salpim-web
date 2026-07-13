import { create } from 'zustand';

interface BenefitState {
  likedIds: number[];
  isLiked: (id: number) => boolean;
  toggleLike: (id: number) => void;
}

const useBenefitStore = create<BenefitState>()((set, get) => ({
  likedIds: [],
  isLiked: (id) => get().likedIds.includes(id),
  toggleLike: (id) =>
    set((state) => ({
      likedIds: state.likedIds.includes(id)
        ? state.likedIds.filter((likedId) => likedId !== id)
        : [...state.likedIds, id],
    })),
}));

export default useBenefitStore;
