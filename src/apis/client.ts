import axios from 'axios';

// TODO: 환경변수에서 baseURL 설정
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// TODO: 요청 인터셉터 - 토큰 주입
client.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// TODO: 응답 인터셉터 - 에러 처리, 토큰 갱신
client.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default client;
