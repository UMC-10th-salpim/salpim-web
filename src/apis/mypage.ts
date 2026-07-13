// TODO: 마이페이지 관련 API 함수 구현
export const mypageApi = {};

export interface MyProfile {
  name: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  gender: 'female' | 'male';
  phone: string;
  roadAddress: string;
  detail: string;
  region: string;
}

export const MOCK_PROFILE: MyProfile = {
  name: '김살핌',
  birthYear: '1955',
  birthMonth: '3',
  birthDay: '12',
  gender: 'female',
  phone: '010-1234-5678',
  roadAddress: '인천광역시 남동구 예술로 152',
  detail: '101동 202호',
  region: '인천광역시 남동구',
};

// 회원가입 시 등록한 비밀번호 찾기용 보안 질문 (온보딩과 동일한 질문)
export const SECURITY_QUESTION = '내가 가장 좋아하는 계절은?';
export const MOCK_SECURITY_ANSWER = '겨울';
export const MOCK_PASSWORD = '333333';
