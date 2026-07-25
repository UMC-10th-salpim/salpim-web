/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_KAKAO_REST_API_KEY: string;
  readonly VITE_KAKAO_REDIRECT_URI: string;
  readonly VITE_KAKAO_MAP_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface KakaoShareLink {
  mobileWebUrl: string;
  webUrl: string;
}

interface KakaoShareFeedOptions {
  objectType: 'feed';
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: KakaoShareLink;
  };
  buttons: Array<{
    title: string;
    link: KakaoShareLink;
  }>;
}

interface KakaoShareCustomOptions{
  templateId: number;
  templateArgs?: Record<string,string>;
}

interface KakaoSdk {
  isInitialized: () => boolean;
  init: (appKey: string) => void;
  Share: {
    sendDefault: (options: KakaoShareFeedOptions) => void;
    sendCustom: (options: KakaoShareCustomOptions) => void;
  };
}

interface Window {
  Kakao: KakaoSdk;
}
