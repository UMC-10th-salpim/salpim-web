import client from './client';

const KAKAO_AUTHORIZE_URL = 'https://kauth.kakao.com/oauth/authorize';

export interface AuthUser {
  id: number;
  nickname: string;
}

export interface AuthResult {
  accessToken: string;
  user: AuthUser;
}

// 카카오 인가 페이지 URL (OAuth 2.0 authorization code)
export const getKakaoAuthorizeUrl = () => {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_KAKAO_REST_API_KEY,
    redirect_uri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
    response_type: 'code',
  });
  return `${KAKAO_AUTHORIZE_URL}?${params.toString()}`;
};

export const authApi = {
  // 백엔드가 인가 코드로 카카오 토큰 교환 후 세션/JWT 반환
  kakaoLogin: async (code: string) => {
    const { data } = await client.post<AuthResult>('/auth/kakao', { code });
    return data;
  },
};
