import axios from 'axios';

interface ApiErrorResponse {
  status?: number;
  code?: string;
  message?: string;
}

// 에러코드 → 메시지 맵을 받아, axios 에러에서 표시용 메시지를 뽑는 함수를 생성한다.
export const createErrorMessageGetter =
  (messages: Record<string, string>) =>
  (error: unknown, fallback: string) => {
    if (!axios.isAxiosError<ApiErrorResponse>(error)) return fallback;

    const response = error.response?.data;
    if (!response) return fallback;

    return (response.code && messages[response.code]) || response.message || fallback;
  };

export const getApiErrorCode = (error: unknown) => {
  if (!axios.isAxiosError<ApiErrorResponse>(error)) return undefined;
  return error.response?.data?.code;
};
