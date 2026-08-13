import client from './client';
import { createErrorMessageGetter } from './errorMessage';
import type { ServerWordSize } from '@/store/settingsStore';

const KAKAO_AUTHORIZE_URL = 'https://kauth.kakao.com/oauth/authorize';
const KAKAO_REST_API_KEY_PATTERN = /^[a-f0-9]{32}$/i;

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface PhoneVerificationSendResult {
  message: string;
}

export interface PhoneVerificationConfirmResult {
  verified: boolean;
  message: string;
}

export interface PasswordResetVerifyResult {
  passwordResetToken: string;
}

const PHONE_VERIFICATION_ERROR_MESSAGES: Record<string, string> = {
  PHONE001: '올바르지 않은 전화번호 형식입니다',
  PHONE002: '이미 가입된 전화번호입니다',
  PHONE003: '인증번호 요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요',
  PHONE005: '인증번호가 일치하지 않습니다',
  PHONE006: '인증번호가 만료되었습니다',
  AUTH400_VERIFICATION: '인증번호가 일치하지 않습니다',
  GL001: '서버 오류가 발생했습니다',
};

const SIGNUP_ERROR_MESSAGES: Record<string, string> = {
  ADDR002: '주소 형식이 올바르지 않습니다',
  ADDR003: '주소 검색 결과를 찾을 수 없습니다',
  ADDR004: '주소 변환 중 오류가 발생했습니다',
  MEMBER001: '필수 입력값이 누락되었습니다',
  KAKAO006: '유효하지 않은 회원가입 토큰입니다',
  AUTH400_TERMS_AGREEMENT_NOT_SUBMITTED: '약관 동의 정보가 제출되지 않았습니다.',
  AUTH400_TERMS_AGREEMENT_EXPIRED: '약관 동의가 만료되었습니다. 약관 동의를 다시 제출해 주세요.',
  AUTH400_TERMS_AGREEMENT_VERIFICATION:
    '약관 동의 정보를 확인할 수 없습니다. 약관 동의를 다시 제출해 주세요.',
  AUTH400_VERIFICATION_EXPIRED: '인증번호가 만료되었습니다. 휴대폰 인증을 다시 진행해 주세요.',
  EXPIRED_VERIFICATION_CODE: '인증번호가 만료되었습니다. 휴대폰 인증을 다시 진행해 주세요.',
  AUTH502_GEOCODING: '주소 좌표 조회에 실패했습니다',
  GL001: '서버 오류가 발생했습니다',
};

const SIGNUP_TERMS_ERROR_MESSAGES: Record<string, string> = {
  AUTH400_PHONE_NOT_VERIFIED: '휴대폰 인증이 완료되지 않았습니다.',
  AUTH400_VERIFICATION_EXPIRED: '인증번호가 만료되었습니다.',
  TERM404: '해당 약관을 찾을 수 없습니다.',
  TERM400_REQUIRED: '필수 약관에 동의해야 합니다.',
  REQUIRED_TERM_NOT_AGREED: '필수 약관에 동의해야 합니다.',
};

const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  LOGIN001: '전화번호와 비밀번호를 입력해주세요',
  PHONE001: '올바르지 않은 전화번호 형식입니다',
  LOGIN002: '전화번호 또는 비밀번호가 일치하지 않습니다',
  AUTH404_LOGIN_MEMBER: '등록되지 않은 회원입니다',
  GL001: '서버 오류가 발생했습니다',
};

const KAKAO_LOGIN_ERROR_MESSAGES: Record<string, string> = {
  KAKAO001: '카카오 인가 코드가 필요합니다',
  KAKAO003: '유효하지 않은 카카오 인가 코드입니다',
  KAKAO005: '카카오 사용자 정보 조회에 실패했습니다',
  AUTH400_KAKAO_CODE: '카카오 인가 코드가 유효하지 않습니다',
  GL001: '서버 오류가 발생했습니다',
};

export interface TokenResult {
  accessToken: string;
  refreshToken: string;
  wordSize?: ServerWordSize | null;
}

export interface KakaoLoginResult {
  isNewMember: boolean;
  nextStep: 'LOGIN_COMPLETE' | 'SIGNUP_REQUIRED';
  loginType?: 'KAKAO' | null;
  // 현재 카카오 로그인 응답에는 이름이 없으며, 기존 서버 응답과의 호환용으로만 허용한다.
  name?: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  signupToken: string | null;
  wordSize?: ServerWordSize | null;
}

export interface AddressLocationResult {
  roadAddress: string;
  latitude: number;
  longitude: number;
}

export interface RegionResult {
  regionId: number;
  regionName: string;
  fullRegionName: string;
}

export interface RegionResolveRequest {
  sido: string;
  sigungu: string;
  generalGu: string;
  administrativeArea: string;
}

export interface SignupTerm {
  termsTypeId: number;
  code: 'SERVICE' | 'PRIVACY' | 'SENSITIVE_INFO' | 'LOCATION' | string;
  name: string;
  isRequired: boolean;
  displayOrder: number;
  termsVersionId: number;
  version: string;
  effectiveDate: string;
}

export interface SignupTermsAgreement {
  termsVersionId: number;
  agreed: boolean;
}

export interface SignupTermClause {
  clauseNo: number;
  title: string;
  content: string;
  displayOrder: number;
}

export interface SignupTermDetail {
  termsTypeId: number;
  code: SignupTerm['code'];
  name: string;
  termsVersionId: number;
  version: string;
  clauses: SignupTermClause[];
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
  wordSize: ServerWordSize;
}

export interface LocalSignupRequest extends SignupProfile {
  password: string;
  passwordAnswer: string;
}

export type KakaoSignupRequest = SignupProfile;

const unwrap = <T>(response: ApiResponse<T>) => response.result;

export const getPhoneVerificationErrorMessage = createErrorMessageGetter(
  PHONE_VERIFICATION_ERROR_MESSAGES
);

export const getSignupErrorMessage = createErrorMessageGetter(SIGNUP_ERROR_MESSAGES);

export const getSignupTermsErrorMessage = createErrorMessageGetter(SIGNUP_TERMS_ERROR_MESSAGES);

export const getLoginErrorMessage = createErrorMessageGetter(LOGIN_ERROR_MESSAGES);

export const getKakaoLoginErrorMessage = createErrorMessageGetter(KAKAO_LOGIN_ERROR_MESSAGES);

// 마이페이지 등 공통 화면에서 서버 message를 그대로 노출할 때 사용한다.
export const getApiErrorMessage = createErrorMessageGetter({});

const normalizePhoneNumber = (phoneNumber: string) => phoneNumber.replace(/\D/g, '');

export const getKakaoRedirectUri = () => {
  const configuredRedirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI?.trim();
  return configuredRedirectUri || `${window.location.origin}/oauth/kakao`;
};

// 카카오 인가 페이지 URL (OAuth 2.0 authorization code)
export const getKakaoAuthorizeUrl = () => {
  const clientId = import.meta.env.VITE_KAKAO_REST_API_KEY?.trim();
  const redirectUri = getKakaoRedirectUri();

  if (!clientId || !KAKAO_REST_API_KEY_PATTERN.test(clientId)) {
    throw new Error('카카오 REST API 키가 올바르게 설정되지 않았습니다.');
  }

  try {
    new URL(redirectUri);
  } catch {
    throw new Error('카카오 리다이렉트 URI가 올바르게 설정되지 않았습니다.');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
  });
  return `${KAKAO_AUTHORIZE_URL}?${params.toString()}`;
};

export const authApi = {
  sendPhoneVerificationCode: async (phoneNumber: string): Promise<PhoneVerificationSendResult> => {
    const { data } = await client.post<ApiResponse<unknown>>('/signup/phone/send', {
      phoneNumber: normalizePhoneNumber(phoneNumber),
    });

    return {
      message: data.message,
    };
  },

  verifyPhoneCode: async (
    phoneNumber: string,
    verificationCode: string
  ): Promise<PhoneVerificationConfirmResult> => {
    const { data } = await client.post<ApiResponse<{ verified: boolean }>>('/signup/phone/verify', {
      phoneNumber: normalizePhoneNumber(phoneNumber),
      code: verificationCode,
    });

    return {
      verified: data.result.verified,
      message: data.message,
    };
  },

  getSignupTerms: async (): Promise<SignupTerm[]> => {
    const { data } = await client.get<ApiResponse<SignupTerm[]>>('/terms');
    return [...unwrap(data)].sort((a, b) => a.displayOrder - b.displayOrder);
  },

  getSignupTermDetail: async (termsVersionId: number): Promise<SignupTermDetail> => {
    const { data } = await client.get<ApiResponse<SignupTermDetail>>(
      `/terms/${termsVersionId}`
    );
    const detail = unwrap(data);
    return {
      ...detail,
      clauses: [...detail.clauses].sort((a, b) => a.displayOrder - b.displayOrder),
    };
  },

  submitSignupTerms: async (
    accessToken: string,
    agreements: SignupTermsAgreement[]
  ): Promise<void> => {
    await client.post<ApiResponse<SignupTermsAgreement[]>>(
      '/terms/agreements',
      { agreements },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
  },

  geocodeAddress: async (roadAddress: string) => {
    const { data } = await client.post<ApiResponse<AddressLocationResult>>(
      '/signup/location/geocode',
      { roadAddress }
    );
    return unwrap(data);
  },

  resolveRegion: async (request: RegionResolveRequest) => {
    const { data } = await client.post<ApiResponse<RegionResult>>('/regions/resolve', request);
    return unwrap(data);
  },

  signupLocal: async (request: LocalSignupRequest) => {
    await client.post<ApiResponse<unknown>>('/signup/local', {
      ...request,
      phoneNumber: normalizePhoneNumber(request.phoneNumber),
    });
  },

  loginLocal: async (phoneNumber: string, password: string) => {
    const { data } = await client.post<ApiResponse<TokenResult>>('/login/local', {
      phoneNumber: normalizePhoneNumber(phoneNumber),
      password,
    });
    return unwrap(data);
  },

  verifyPasswordReset: async (
    phoneNumber: string,
    recoveryAnswer: string
  ): Promise<PasswordResetVerifyResult> => {
    const { data } = await client.post<ApiResponse<PasswordResetVerifyResult>>(
      '/password-reset/verify',
      {
        phoneNumber: normalizePhoneNumber(phoneNumber),
        recoveryAnswer: recoveryAnswer.trim(),
      }
    );
    return unwrap(data);
  },

  resetPassword: async (passwordResetToken: string, newPassword: string) => {
    await client.put<ApiResponse<unknown>>('/password-reset', {
      passwordResetToken,
      newPassword,
    });
  },

  kakaoLogin: async (authorizationCode: string) => {
    const { data } = await client.post<ApiResponse<KakaoLoginResult>>('/login/kakao', {
      authorizationCode,
    });
    return unwrap(data);
  },

  signupKakao: async (signupToken: string, request: KakaoSignupRequest) => {
    const {
      name,
      birthDate,
      gender,
      phoneNumber,
      roadAddress,
      detailAddress,
      latitude,
      longitude,
      regionId,
      wordSize,
    } = request;

    await client.post<ApiResponse<unknown>>(
      '/signup/kakao',
      {
        name,
        birthDate,
        gender,
        phoneNumber: normalizePhoneNumber(phoneNumber),
        roadAddress,
        detailAddress,
        latitude,
        longitude,
        regionId,
        wordSize,
      },
      {
        headers: { Authorization: `Bearer ${signupToken}` },
      }
    );
  },
};
