import { create } from 'zustand';

// TODO: 위치 상태 타입 정의
type LocationState = Record<string, never>;

// TODO: 위치 스토어 구현
const useLocationStore = create<LocationState>()(() => ({
  // TODO: 초기 상태 정의
}));

export default useLocationStore;
