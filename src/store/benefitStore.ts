import { create } from 'zustand';

interface BenefitState {
  likedIds: number[];
  isLiked: (id: number) => boolean;
  setLiked: (id: number, isLiked: boolean) => void;
  toggleLike: (id: number) => void;
}

const useBenefitStore = create<BenefitState>()((set, get) => ({
  likedIds: [],
  isLiked: (id) => get().likedIds.includes(id),
  setLiked: (id, isLiked) =>
    set((state) => ({
      likedIds: isLiked
        ? state.likedIds.includes(id)
          ? state.likedIds
          : [...state.likedIds, id]
        : state.likedIds.filter((likedId) => likedId !== id),
    })),
  toggleLike: (id) =>
    set((state) => ({
      likedIds: state.likedIds.includes(id)
        ? state.likedIds.filter((likedId) => likedId !== id)
        : [...state.likedIds, id],
    })),
}));

export default useBenefitStore;
