import axios from 'axios';
import client from './client';

const KAKAO_AUTHORIZE_URL = 'https://kauth.kakao.com/oauth/authorize';

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface TokenResult {
  accessToken: string;
  refreshToken: string;
}

export interface KakaoLoginResult {
  isNewMember: boolean;
  nextStep: 'LOGIN_COMPLETE' | 'SIGNUP_REQUIRED';
  accessToken?: string;
  refreshToken?: string;
  signupToken?: string;
}

export interface GeocodeResult {
  roadAddress: string;
  latitude: number;
  longitude: number;
}

export interface RegionResolveRequest {
  city: string | null;
  district: string | null;
  eupMyeonDong: string;
}

export interface RegionResolveResult {
  regionId: number;
  regionName: string;
  fullRegionName: string;
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
  passwordAnswer: string;
}

export type KakaoSignupRequest = SignupProfile;

const unwrap = <T>(response: ApiResponse<T>) => response.result;

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError<ApiResponse<unknown>>(error)) return fallback;
  return error.response?.data?.message || fallback;
};

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
  sendPhoneVerificationCode: async (phoneNumber: string) => {
    const { data } = await client.post<ApiResponse<null>>('/v1/signup/phone/send', {
      phoneNumber,
    });
    return data;
  },

  verifyPhoneCode: async (phoneNumber: string, code: string) => {
    const { data } = await client.post<ApiResponse<{ verified: boolean }>>(
      '/v1/signup/phone/verify',
      { phoneNumber, code }
    );
    return unwrap(data).verified;
  },

  geocodeAddress: async (roadAddress: string) => {
    const { data } = await client.post<ApiResponse<GeocodeResult>>('/v1/signup/location/geocode', {
      roadAddress,
    });
    return unwrap(data);
  },

  resolveRegion: async (request: RegionResolveRequest) => {
    const { data } = await client.post<ApiResponse<RegionResolveResult>>(
      '/v1/regions/resolve',
      request
    );
    return unwrap(data);
  },

  signupLocal: async (request: LocalSignupRequest) => {
    await client.post<ApiResponse<null>>('/v1/signup/local', request);
  },

  loginLocal: async (phoneNumber: string, password: string) => {
    const { data } = await client.post<ApiResponse<TokenResult>>('/v1/login/local', {
      phoneNumber,
      password,
    });
    return unwrap(data);
  },

  kakaoLogin: async (authorizationCode: string) => {
    const { data } = await client.post<ApiResponse<KakaoLoginResult>>('/v1/login/kakao', {
      authorizationCode,
    });
    return unwrap(data);
  },

  signupKakao: async (signupToken: string, request: KakaoSignupRequest) => {
    await client.post<ApiResponse<null>>('/v1/signup/kakao', request, {
      headers: { Authorization: `Bearer ${signupToken}` },
    });
  },
};
