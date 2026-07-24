import client from './client';
import { createErrorMessageGetter } from './errorMessage';

const KAKAO_AUTHORIZE_URL = 'https://kauth.kakao.com/oauth/authorize';

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface PhoneVerificationSendResult {
  phoneNumber: string;
  message: string;
}

export interface PhoneVerificationConfirmResult {
  phoneNumber: string;
  verified: boolean;
  message: string;
}

const PHONE_VERIFICATION_ERROR_MESSAGES: Record<string, string> = {
  PHONE001: '올바르지 않은 전화번호 형식입니다',
  PHONE002: '이미 가입된 전화번호입니다',
  PHONE003: '인증번호 요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요',
  PHONE005: '인증번호가 일치하지 않습니다',
  PHONE006: '인증번호가 만료되었습니다',
  GL001: '서버 오류가 발생했습니다',
};

const SIGNUP_ERROR_MESSAGES: Record<string, string> = {
  ADDR002: '주소 형식이 올바르지 않습니다',
  ADDR003: '주소 검색 결과를 찾을 수 없습니다',
  ADDR004: '주소 변환 중 오류가 발생했습니다',
  MEMBER001: '필수 입력값이 누락되었습니다',
  KAKAO006: '유효하지 않은 회원가입 토큰입니다',
  GL001: '서버 오류가 발생했습니다',
};

const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  LOGIN001: '전화번호와 비밀번호를 입력해주세요',
  PHONE001: '올바르지 않은 전화번호 형식입니다',
  LOGIN002: '전화번호 또는 비밀번호가 일치하지 않습니다',
  GL001: '서버 오류가 발생했습니다',
};

const KAKAO_LOGIN_ERROR_MESSAGES: Record<string, string> = {
  KAKAO001: '카카오 인가 코드가 필요합니다',
  KAKAO003: '유효하지 않은 카카오 인가 코드입니다',
  KAKAO005: '카카오 사용자 정보 조회에 실패했습니다',
  GL001: '서버 오류가 발생했습니다',
};

export interface TokenResult {
  accessToken: string;
  refreshToken: string;
}

export interface KakaoLoginResult {
  isNewMember: boolean;
  nextStep: 'LOGIN_COMPLETE' | 'SIGNUP_REQUIRED';
  memberId: number | null;
  loginType: 'KAKAO';
  name: string;
  accessToken: string | null;
  refreshToken: string | null;
  signupToken: string | null;
}

export interface AddressLocationResult {
  regionId: number;
  cityL: string;
  cityS: string;
  dong: string;
  roadAddress: string;
  detailAddress: string;
  latitude: number;
  longitude: number;
}

interface SignupProfile {
  name: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE';
  phoneNumber: string;
  roadAddress: string;
  detailAddress: string;
  latitude: number;
  longitude: number;
  regionId: number;
}

export interface LocalSignupRequest extends SignupProfile {
  password: string;
  agreedTermIds: number[];
  passwordAnswer: string;
}

export interface KakaoSignupRequest extends SignupProfile {
  agreedTermIds: number[];
}

const unwrap = <T>(response: ApiResponse<T>) => response.result;

export const getPhoneVerificationErrorMessage = createErrorMessageGetter(
  PHONE_VERIFICATION_ERROR_MESSAGES
);

export const getSignupErrorMessage = createErrorMessageGetter(SIGNUP_ERROR_MESSAGES);

export const getLoginErrorMessage = createErrorMessageGetter(LOGIN_ERROR_MESSAGES);

export const getKakaoLoginErrorMessage = createErrorMessageGetter(KAKAO_LOGIN_ERROR_MESSAGES);

const normalizePhoneNumber = (phoneNumber: string) => phoneNumber.replace(/\D/g, '');

export const getKakaoRedirectUri = () =>
  import.meta.env.VITE_KAKAO_REDIRECT_URI || `${window.location.origin}/oauth/kakao`;

// 카카오 인가 페이지 URL (OAuth 2.0 authorization code)
export const getKakaoAuthorizeUrl = () => {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_KAKAO_REST_API_KEY,
    redirect_uri: getKakaoRedirectUri(),
    response_type: 'code',
  });
  return `${KAKAO_AUTHORIZE_URL}?${params.toString()}`;
};

export const authApi = {
  sendPhoneVerificationCode: async (phoneNumber: string): Promise<PhoneVerificationSendResult> => {
    const { data } = await client.post<ApiResponse<{ phoneNumber: string }>>(
      '/v1/signup/phone/send',
      {
        phoneNumber: normalizePhoneNumber(phoneNumber),
      }
    );

    return {
      phoneNumber: data.result.phoneNumber,
      message: data.message,
    };
  },

  verifyPhoneCode: async (
    phoneNumber: string,
    verificationCode: string
  ): Promise<PhoneVerificationConfirmResult> => {
    const { data } = await client.post<ApiResponse<{ phoneNumber: string; verified: boolean }>>(
      '/v1/signup/phone/verify',
      {
        phoneNumber: normalizePhoneNumber(phoneNumber),
        verificationCode,
      }
    );

    return {
      phoneNumber: data.result.phoneNumber,
      verified: data.result.verified,
      message: data.message,
    };
  },

  geocodeAddress: async (roadAddress: string, detailAddress: string) => {
    const { data } = await client.post<ApiResponse<AddressLocationResult>>(
      '/v1/signup/location/geocode',
      {
        roadAddress,
        detailAddress,
      }
    );
    return unwrap(data);
  },

  signupLocal: async (request: LocalSignupRequest) => {
    await client.post<void>('/v1/signup/local', {
      ...request,
      phoneNumber: normalizePhoneNumber(request.phoneNumber),
    });
  },

  loginLocal: async (phoneNumber: string, password: string) => {
    const { data } = await client.post<TokenResult>('/v1/login/local', {
      phoneNumber: normalizePhoneNumber(phoneNumber),
      password,
    });
    return data;
  },

  kakaoLogin: async (code: string, redirectUri: string) => {
    const { data } = await client.post<ApiResponse<KakaoLoginResult>>('/v1/login/kakao', {
      code,
      redirectUri,
    });
    return unwrap(data);
  },

  signupKakao: async (signupToken: string, request: KakaoSignupRequest) => {
    await client.post<void>(
      '/v1/signup/kakao',
      {
        ...request,
        phoneNumber: normalizePhoneNumber(request.phoneNumber),
      },
      {
        headers: { Authorization: `Bearer ${signupToken}` },
      }
    );
  },
};
