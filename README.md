# 살핌 (Salpim)

> 고령 사용자가 자신에게 맞는 복지 혜택을 찾고, 주변 복지·생활 시설까지 쉽게 확인할 수 있도록 돕는 웹 서비스

- 서비스: [https://salpim.me](https://salpim.me)
- GitHub: [UMC-10th-salpim/salpim-web](https://github.com/UMC-10th-salpim/salpim-web)
- 개발 기간: 2026.06.24 ~ 2026.08.13
- 최종 반영: PR #126 (`dev` → `main`)

## 프로젝트 소개

살핌은 회원 정보와 단계형 설문을 바탕으로 복지 혜택을 추천하고, 사용자의 집 또는 현재 위치 주변에 있는 주민센터·복지관·보건소·병원·약국 등의 시설을 지도에서 탐색할 수 있도록 지원합니다.

고령 사용자의 접근성을 고려해 중간·큰 글씨 모드, 큰 터치 영역, 단순한 단계형 입력, 명확한 오류 문구와 캐릭터 안내를 적용했습니다.

## 주요 기능

### 로그인·회원가입

- 로컬 로그인 및 카카오 OAuth 로그인
- 전화번호 인증을 포함한 단계형 회원가입
- 서버 기반 약관 목록·상세 조회 및 필수 동의 제출
- 도로명주소 검색 및 현재 위치 기반 주소 자동 입력
- 역지오코딩 결과의 행정구역 보완 및 `regionId` 연동
- JWT 기반 보호 경로와 로그인 상태 유지
- 로그인 전 전화번호·복구 답변 기반 비밀번호 재설정

### 설문·혜택

- 2단계 설문 기반 맞춤 복지 혜택 추천
- 키워드·지역·카테고리를 이용한 혜택 직접 검색
- 혜택 상세 정보와 신청 도우미
- 커서 기반 추천·검색 결과 페이지네이션
- 혜택 찜·취소와 마이페이지 찜 목록
- 찜 목록의 카테고리·마감일·나이 조건 표시
- 카카오톡 커스텀 템플릿 공유

### 지도·시설

- 집 위치와 현재 위치 기준 카카오 지도 탐색
- 건강·의료, 생활지원, 문화, 배움·일자리 카테고리 필터
- 여러 세부 시설 API 병렬 검색 및 부분 실패 대응
- 카테고리별 커스텀 마커와 시설 요약 Bottom Sheet
- 시설 전화번호·운영시간·거리·연관 혜택 상세 조회
- 시설 혜택 페이지네이션, 서비스 아이콘 및 지역 태그
- 상세 화면에서 복귀할 때 선택 마커·필터·지도 위치 복원
- 편의점, 주차장, 동물병원 등 비복지시설 검색 결과 제외

### 마이페이지·접근성

- 회원 정보 조회 및 이름·생년월일·성별·전화번호·주소 수정
- 현재 비밀번호 또는 회원가입 시 등록한 복구 답변 기반 비밀번호 변경
- 비밀번호 변경 후 인증 정보와 서버 캐시 제거 및 시작 화면 이동
- 회원 탈퇴, 알림 표시·숨김, 글자 크기 설정
- 대표 이메일·전화번호 문의 안내
- 중간·큰 글씨 전용 UI와 모바일·Safari 레이아웃 대응
- 로딩·빈 결과·오류·권한 거부 상태별 안내 및 재시도

## 사용자 흐름

```text
서비스 시작
→ 로그인 또는 회원가입
→ 설문 진행
→ 맞춤 혜택 추천
→ 혜택 상세 및 신청 도우미
→ 찜 또는 카카오톡 공유
```

```text
지도
→ 집 위치 또는 현재 위치 선택
→ 시설 카테고리 필터
→ 시설 마커 및 요약 카드 선택
→ 시설 상세와 신청 가능한 혜택 확인
→ 뒤로가기 시 기존 지도 선택 상태 복원
```

```text
마이페이지
→ 비밀번호 변경
├─ 현재 비밀번호 검증
└─ 음식 복구 답변 검증
→ 새 비밀번호 입력 및 확인
→ 로그아웃
→ 시작 화면
```

## 기술 스택

| 구분 | 기술 | 적용 내용 |
| --- | --- | --- |
| Core | React 19, TypeScript 5 | 타입 기반 페이지·기능 컴포넌트 구현 |
| Build | Vite 6 | 개발 서버, 프로덕션 빌드, 페이지 코드 스플리팅 |
| Styling | Tailwind CSS 4 | 모바일 중심 UI와 큰 글씨 화면 구현 |
| Routing | React Router DOM 7 | 공개·보호 경로, 단계별 사용자 흐름 구성 |
| Server State | TanStack Query 5 | API 캐싱, 재조회, 무한 쿼리, 캐시 무효화 |
| Client State | Zustand 5 | 인증, 찜, 글자 크기, 알림 설정 관리 |
| HTTP | Axios | API Base URL 및 JWT 요청 인터셉터 |
| Map | react-kakao-maps-sdk | 지도, CustomOverlayMap, 지도 범위 제어 |
| Location | Browser Geolocation API | 현재 위치 위도·경도 획득 |
| External API | Kakao Local REST API | 주소 검색, 역지오코딩, 주변 시설 검색 |
| Deployment | Vercel Rewrite, Vite Proxy | SPA 라우팅 및 백엔드 API 프록시 |
| Quality | ESLint, Prettier | 정적 검사와 코드 스타일 관리 |

설치되는 정확한 버전은 `package-lock.json`을 기준으로 합니다.

## 핵심 기술 구현

### 1. 역지오코딩과 Region ID 연결

Geolocation API는 좌표만 반환하지만 회원가입과 개인정보 수정에는 주소와 행정구역 ID가 필요합니다.

```text
현재 위도·경도
→ Kakao Reverse Geocoding
→ 도로명주소 우선 선택, 미제공 시 지번주소 사용
→ 시·도·시군구·행정동 정규화
→ Region Resolve API
→ regionId와 정규화된 좌표 생성
→ 회원가입 또는 개인정보 수정 요청
```

- 행정동이 있으면 법정동보다 우선합니다.
- 시·도는 `인천광역시`와 같은 공식 명칭으로 통일합니다.
- 좌표는 유효 범위를 확인하고 백엔드 허용 자릿수로 정규화합니다.
- 회원가입과 개인정보 수정에서 동일한 주소 유틸리티를 재사용합니다.

### 2. 여러 외부 API의 부분 실패 대응

주변 시설은 병원·약국·보건소·복지관 등 여러 세부 검색 요청을 동시에 실행합니다. `Promise.allSettled`를 사용해 한 요청이 실패해도 성공한 시설은 지도에 계속 표시합니다.

- 성공한 응답만 병합
- 중복 시설 제거
- 비복지시설 이름 필터링
- 키 누락·결과 없음·위치 권한 거부 상태별 안내
- 개발 환경에서 확인 가능한 fallback 데이터 제공

### 3. 지도 선택 상태 복원

시설 상세로 이동하기 전에 선택 시설 ID, 세부 카테고리, 현재 위치 기준 좌표를 라우터 상태와 `sessionStorage`에 저장합니다. 상세 화면에서 돌아오면 이전 마커와 시설 카드, 필터와 지도 기준 위치를 복원합니다.

### 4. 서버 상태와 클라이언트 상태 분리

| 상태 | 관리 방식 | 예시 |
| --- | --- | --- |
| 서버 상태 | TanStack Query | 회원, 혜택, 시설 상세, 찜 목록 |
| 인증·전역 상태 | Zustand | Access/Refresh Token, 로그인 유형, 집 좌표 |
| 사용자 설정 | Zustand + localStorage | 글자 크기, 마감 알림 표시 여부 |
| 일시적 UI 상태 | useState | 입력값, 모달, 현재 단계, 선택 필터 |

개인정보 수정과 찜 상태 변경 후 관련 Query를 무효화해 최신 서버 응답을 다시 반영합니다. 비밀번호 변경 시 인증 저장소와 Query 캐시를 모두 제거합니다.

## 예외 처리

- 로그인: 전화번호 및 숫자 6자리 비밀번호 검증, 오류 코드별 메시지
- 회원가입: 생년월일, 전화번호 인증, 필수 주소와 약관 검증
- 위치: Geolocation 미지원, 권한 거부, HTTPS 미사용, 타임아웃 안내
- 주소: 도로명주소 우선 처리, 행정구역 누락 보완, 지번주소 fallback
- 지도: 외부 API 부분 실패, 지도 키 누락, 빈 검색 결과 처리
- 시설 상세: 관할 불일치, 신청 불가 시설, 일반 API 오류 분리
- 찜: 변경 실패 시 오류 안내 및 서버 목록 재조회
- 비밀번호: 현재 비밀번호·복구 답변 오류, 재입력, 변경 후 세션 초기화
- 접근성: 큰 글씨의 긴 제목·태그 줄바꿈 및 터치 영역 확대

## 프론트엔드 역할 분담

| 담당자 | 최종 담당 영역 |
| --- | --- |
| 오스카 | 지도·시설 상세, 마이페이지, 개인정보 수정, 비밀번호, 찜 목록, 알림·문의 UI, 주소·위치 QA |
| 동동 | 혜택 추천·검색·상세, 신청 도우미, 카카오 공유, 페이지네이션, 혜택 큰 글씨 UI |
| 조시 | 로그인·회원가입·온보딩·설문·홈, 약관·인증·지역 API, 공통 반응형·큰 글씨 기반 |

## 프로젝트 구조

```text
src
├── apis          # Axios 클라이언트와 도메인별 API 함수·타입
├── components
│   ├── common    # Header, Navigation, Modal, Keypad 등 공통 UI
│   └── layout    # 공통 페이지 레이아웃
├── features
│   ├── benefit   # 혜택 카드·상세·신청 도우미
│   ├── map       # 지도·필터·시설 요약·시설 상세
│   ├── mypage    # 회원 정보·찜·비밀번호·설정
│   ├── onboarding
│   ├── search
│   └── survey
├── pages         # 라우팅 단위 페이지
├── router        # 공개·보호 경로 및 lazy loading
├── store         # Zustand 전역 상태
├── styles        # 전역 디자인 토큰과 글자 크기 규칙
├── types
└── utils
```

## 주요 경로

| 경로 | 화면 |
| --- | --- |
| `/` | 시작 화면 |
| `/login?step=login` | 로컬 로그인 |
| `/signup` | 회원가입 |
| `/password/find` | 로그인 전 비밀번호 재설정 |
| `/recommendation` | 홈·추천 진입 화면 |
| `/survey` | 살피미 설문 |
| `/benefits` | 혜택 결과 |
| `/benefits/search` | 혜택 직접 찾기 |
| `/benefits/:id` | 혜택 상세 |
| `/helper/:id` | 신청 도우미 |
| `/map` | 주변 시설 지도 |
| `/facility/:id` | 시설 상세 |
| `/mypage` | 마이페이지 |
| `/mypage/edit` | 개인정보 수정 |
| `/mypage/liked` | 찜한 혜택 |
| `/mypage/password` | 현재 비밀번호 기반 변경 |
| `/mypage/password/find` | 복구 답변 기반 변경 |

## 실행 방법

### 요구 환경

- Node.js 20 이상 권장
- npm

### 1. 저장소 설치

```bash
git clone https://github.com/UMC-10th-salpim/salpim-web.git
cd salpim-web
npm ci
```

### 2. 환경 변수 설정

루트의 `.env.example`을 복사해 `.env`를 생성합니다. 실제 키는 Git에 커밋하지 않습니다.

```env
VITE_API_BASE_URL=/api
VITE_KAKAO_REST_API_KEY=your_kakao_rest_api_key
VITE_KAKAO_REDIRECT_URI=http://localhost:5173/oauth/kakao
VITE_KAKAO_MAP_KEY=your_kakao_javascript_key
```

카카오 Developers에 로컬·운영 Web Origin과 Redirect URI를 등록해야 합니다. 개발 환경의 `/api` 요청은 Vite Proxy, 배포 환경은 Vercel Rewrite를 통해 백엔드로 전달됩니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

기본 주소는 `http://localhost:5173`입니다.

### 4. 품질 검증

```bash
npm run build
npm run lint
```

필요한 경우 포맷을 적용합니다.

```bash
npm run format
```

## 협업 규칙

```text
main
└── dev
    ├── feature/*
    ├── fix/*
    ├── refactor/*
    ├── chore/*
    ├── docs/*
    └── test/*
```

- 기능·버그 단위로 Issue와 브랜치를 생성합니다.
- 작업 브랜치는 `dev`로 Pull Request를 생성하고 리뷰 후 병합합니다.
- 통합 QA가 완료된 `dev`를 `main`에 반영합니다.
- PR에는 작업 목적, 주요 변경, 확인 방법, 스크린샷과 검증 결과를 작성합니다.
- 자세한 규칙은 [CONTRIBUTING.md](./CONTRIBUTING.md)와 GitHub 템플릿을 따릅니다.

## 최종 상태와 확인 사항

- 핵심 사용자 흐름 및 서버 API 연동 완료
- 중간·큰 글씨, 모바일·Safari QA 반영
- 주요 페이지 lazy loading 적용
- 최종 Main 반영: PR #126
- 프로덕션 빌드 및 전체 ESLint 통과

운영 시연 전에는 실제 기기에서 위치 권한, 카카오 로그인·공유, 도로명주소가 없는 위치의 지번주소 표시를 최종 확인합니다. 문의하기는 별도의 등록 API 없이 대표 이메일과 전화번호를 안내하는 화면으로 제공합니다.
