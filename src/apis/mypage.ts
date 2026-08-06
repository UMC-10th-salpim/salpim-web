import client from './client';

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export interface MyPageSummary {
  name: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE';
  phoneNumber: string;
  roadAddress: string;
  detailAddress: string | null;
  latitude: number;
  longitude: number;
  regionId: number;
  sido: string;
  sigungu: string;
  generalGu: string;
  administrativeArea: string;
}

export interface UpdateProfileRequest {
  name: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE';
  roadAddress: string;
  detailAddress: string;
  latitude: number;
  longitude: number;
  regionId: number;
  phoneNumber?: string;
  phoneVerificationToken?: string;
}

export type PasswordVerificationMethod = 'CURRENT_PASSWORD' | 'RECOVERY_ANSWER';

export interface ChangePasswordRequest {
  verificationMethod: PasswordVerificationMethod;
  currentPassword?: string;
  recoveryAnswer?: string;
  newPassword: string;
}

export const mypageApi = {
  getSummary: async () => {
    const { data } = await client.get<ApiResponse<MyPageSummary>>('/users/me');
    return data.result;
  },

  updateProfile: async (request: UpdateProfileRequest) => {
    await client.put<ApiResponse<null>>('/users/me', request);
  },

  sendPhoneVerificationCode: async (phoneNumber: string) => {
    await client.post<ApiResponse<null>>('/users/me/phone-verification/send', { phoneNumber });
  },

  verifyPhoneCode: async (phoneNumber: string, code: string) => {
    const { data } = await client.post<ApiResponse<{ phoneVerificationToken: string }>>(
      '/users/me/phone-verification/verify',
      { phoneNumber, code }
    );
    return data.result.phoneVerificationToken;
  },

  verifyCurrentPassword: async (currentPassword: string) => {
    const { data } = await client.post<ApiResponse<{ isVerified: boolean }>>(
      '/users/me/password/verify',
      { currentPassword }
    );
    return data.result.isVerified;
  },

  verifyRecoveryAnswer: async (recoveryAnswer: string) => {
    const { data } = await client.post<ApiResponse<{ isVerified: boolean }>>(
      '/users/me/password/recovery/verify',
      { recoveryAnswer }
    );
    return data.result.isVerified;
  },

  changePassword: async (request: ChangePasswordRequest) => {
    await client.put<ApiResponse<null>>('/users/me/password', request);
  },

  withdraw: async () => {
    const { data } = await client.delete<ApiResponse<null>>('/members/me');
    return data;
  },
};

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
export const SECURITY_QUESTION = '내가 가장 좋아하는 음식은?';
