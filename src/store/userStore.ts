import { create } from 'zustand';

// TODO: 사용자 상태 타입 정의
interface UserState {
  // TODO: 사용자 정보 필드 추가
}

// TODO: 사용자 스토어 구현
const useUserStore = create<UserState>()(() => ({
  // TODO: 초기 상태 정의
}));

export default useUserStore;
