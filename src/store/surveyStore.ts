import { create } from 'zustand';

// TODO: 설문 상태 타입 정의
type SurveyState = Record<string, never>;

// TODO: 설문 스토어 구현
const useSurveyStore = create<SurveyState>()(() => ({
  // TODO: 초기 상태 정의
}));

export default useSurveyStore;
