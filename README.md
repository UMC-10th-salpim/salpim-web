# Salpim Web

사용자의 기본 정보와 설문 결과를 바탕으로 맞춤형 복지 혜택과 주변 시설 정보를 제공하는 프론트엔드 웹 서비스입니다.

## 최종 구현 범위

- 로컬·카카오 로그인과 단계형 회원가입
- 휴대전화 인증, 도로명 주소 검색, 현재 위치 기반 주소 자동 설정
- 설문 기반 맞춤 복지 혜택 추천과 직접 검색
- 혜택 상세, 신청 도우미, 찜 목록 및 마감 알림
- 현재 위치·집 위치 기반 주변 시설 지도와 카테고리 필터
- 시설 요약 Bottom Sheet, 시설 상세 및 연관 혜택 페이지네이션
- 개인정보 수정, 비밀번호 변경, 회원 탈퇴와 사용자 설정
- 중간/큰 글씨 UI, 모바일·Safari 대응, 로딩·빈 결과·오류·권한 예외 처리

## 프로젝트 소개

Salpim은 사용자가 받을 수 있는 복지 혜택을 쉽게 확인하고, 복지관, 주민센터, 보건소, 병원, 약국 등 주변 시설 정보를 탐색할 수 있도록 돕는 서비스입니다.

주요 기능은 다음과 같습니다.

- 온보딩을 통한 사용자 기본 정보 입력
- 설문 기반 맞춤 혜택 추천
- 복지 혜택 목록 및 상세 정보 제공
- 주변 시설 지도 탐색
- 카테고리별 시설 조회
- 시설 상세 정보 제공
- 마이페이지를 통한 사용자 정보 확인

## 팀원 및 프론트엔드 역할 분담

| 이름   | 역할     | 최종 담당 영역 |
| ------ | -------- | -------------- |
| 동동   | Frontend | 혜택 추천·검색·상세, 신청 도우미, 카카오 공유, 혜택 API 및 큰 글씨 UI |
| 조쉬   | Frontend | 로그인·회원가입·온보딩·설문·홈, 인증/지역 API, 공통 반응형·큰 글씨 기반 |
| 오스카 | Frontend | 지도·시설 상세·마이페이지, 개인정보/비밀번호/찜/알림 API, 주소·위치 보완 |

초기 역할은 공통 컴포넌트와 주요 화면을 기준으로 분담했으며, API 연동 및 최종 QA 단계에서는 기능 의존성에 따라 역할을 확장했습니다. 특히 현재 위치 주소 기능은 회원가입 영역을 조쉬가 먼저 구현하고, 개인정보 수정과 최종 행정동 보완을 오스카가 이어서 담당했습니다.

## 컴포넌트 역할 분담

### 공통 컴포넌트

프로젝트 전역에서 재사용되는 UI 컴포넌트입니다.

| 컴포넌트              | 담당자 | 설명                                      |
| --------------------- | ------ | ----------------------------------------- |
| `Button`              | 동동   | 주요 버튼 UI                              |
| `Input`               | 동동   | 입력 필드 UI                              |
| `Dropdown`            | 동동   | 드롭다운 선택 UI                          |
| `Chip`                | 조쉬   | 필터/태그 선택 UI                         |
| `Tab`                 | 조쉬   | 탭 전환 UI                                |
| `Card`                | 조쉬   | 콘텐츠 카드 UI                            |
| `Modal`               | 오스카 | 모달 UI                                   |
| `Loading`             | 오스카 | 로딩 상태 UI                              |
| `BottomNavigation`    | 오스카 | 하단 내비게이션 UI                        |
| `HeaderBar`           | 오스카 | 뒤로가기와 화면 제목을 제공하는 공통 헤더 |
| `Keypad`              | 오스카 | 6자리 비밀번호 입력용 숫자 키패드         |
| `Toggle`              | 오스카 | 설정의 표시·숨김 상태 전환                |
| `ScrollMoreIndicator` | 오스카 | 아래 콘텐츠 존재 여부 안내 및 스크롤 이동 |

### 기능 컴포넌트

여러 공통 컴포넌트를 조합하여 특정 기능을 담당하는 컴포넌트입니다.

| 기능       | 컴포넌트                                                 | 담당자 | 설명                                                    |
| ---------- | -------------------------------------------------------- | ------ | ------------------------------------------------------- |
| 온보딩     | `OnboardingForm`, `AddressSelector`                      | 조쉬   | 사용자 기본 정보 입력 및 주소 선택                      |
| 설문       | `SurveyForm`, `QuestionCard`                             | 조쉬   | 설문 진행 및 질문 카드 UI                               |
| 추천       | `RecommendationCard`, `RecommendationList`               | 동동   | 맞춤 추천 결과 카드 및 목록                             |
| 혜택       | `BenefitCard`, `BenefitDetail`                           | 동동   | 복지 혜택 요약 및 상세 정보                             |
| 지도       | `MapView`, `FilterBar`, `FacilityCard`, `FacilityDetail` | 오스카 | 주변시설 지도, 카테고리 필터, 시설 목록, 시설 상세 정보 |
| 마이페이지 | `MyPageMenu`, `EditProfile`, `LikedBenefits`             | 오스카 | 사용자 정보, 설정, 찜한 혜택 관리                       |
| 비밀번호   | `CurrentPasswordStep`, `NewPasswordStep`                 | 오스카 | 비밀번호 확인, 변경 및 재입력                           |

## 기술 스택

아래 버전은 `package-lock.json` 기준이며, 동일한 환경 설치를 위해 `npm ci` 사용을 권장합니다.

| 구분            | 기술                 | 버전    |
| --------------- | -------------------- | ------- |
| Runtime         | Node.js              | 24.15.0 |
| Core            | React / React DOM    | 19.2.7  |
| Language        | TypeScript           | 5.8.3   |
| Build           | Vite                 | 6.4.3   |
| Styling         | Tailwind CSS         | 4.3.1   |
| Routing         | React Router DOM     | 7.18.0  |
| Client State    | Zustand              | 5.0.14  |
| Server State    | TanStack Query       | 5.101.1 |
| HTTP Client     | Axios                | 1.18.1  |
| Map             | React Kakao Maps SDK | 1.2.1   |
| Code Quality    | ESLint               | 9.39.4  |
| Code Quality    | Prettier             | 3.8.4   |
| Package Manager | npm                  | 11.12.1 |

## 폴더 구조

```text
src
├── apis
│   ├── auth.ts
│   ├── benefit.ts
│   ├── client.ts
│   ├── facility.ts
│   └── survey.ts
├── components
│   ├── common
│   │   ├── BottomNavigation
│   │   ├── Button
│   │   ├── Card
│   │   ├── Chip
│   │   ├── Dropdown
│   │   ├── HeaderBar
│   │   ├── Input
│   │   ├── Keypad
│   │   ├── Loading
│   │   ├── Modal
│   │   ├── ScrollMoreIndicator
│   │   ├── Tab
│   │   └── Toggle
│   └── layout
│       └── Layout.tsx
├── features
│   ├── benefit
│   ├── map
│   ├── mypage
│   ├── onboarding
│   ├── recommendation
│   └── survey
├── pages
├── router
├── store
├── styles
├── App.tsx
└── main.tsx
```

### 주요 디렉토리 역할

| 경로                    | 설명                                      |
| ----------------------- | ----------------------------------------- |
| `src/apis`              | Axios 기반 API 함수 관리                  |
| `src/components/common` | 버튼, 입력, 카드 등 전역 공통 UI 컴포넌트 |
| `src/components/layout` | 페이지 공통 레이아웃 구성                 |
| `src/features`          | 기능 단위 UI 컴포넌트 관리                |
| `src/pages`             | 라우팅 단위 페이지 컴포넌트               |
| `src/router`            | React Router 설정                         |
| `src/store`             | Zustand 기반 클라이언트 상태 관리         |
| `src/styles`            | 전역 스타일                               |

## 상태 관리 설계

전역 상태는 Zustand를 사용하여 관리합니다. 서버에서 받아오는 데이터는 TanStack Query를 통해 관리하고, UI 전역에서 공유해야 하는 클라이언트 상태만 store에 분리합니다.

| 상태           | 저장 위치       | 설명                                          |
| -------------- | --------------- | --------------------------------------------- |
| 사용자 정보    | `userStore`     | 로그인 사용자 정보, 온보딩 기본 정보          |
| 설문 응답 결과 | `surveyStore`   | 사용자가 선택한 설문 답변                     |
| 찜 상태        | `benefitStore`  | 상세 화면과 찜 목록 사이의 즉시 상태 동기화   |
| 사용자 설정    | `settingsStore` | 글자 크기와 찜한 혜택 알림 표시 여부           |
| 위치 정보      | `locationStore` | 선택 지역과 주변시설 탐색 기준 위치             |

서버 데이터 변경 후에는 관련 TanStack Query 키를 무효화하여 최신 응답을 다시 반영합니다. 인증 토큰과 집 좌표는 `userStore`의 persist 저장소로 유지하고, 입력 폼·모달·선택 상태는 각 컴포넌트의 로컬 상태로 관리합니다.

## 핵심 기술 구현

### 위치 기반 시설 탐색

Browser Geolocation API로 현재 좌표를 얻고 Kakao Local REST API로 주변 시설을 검색한 뒤, `react-kakao-maps-sdk`의 `CustomOverlayMap`으로 카테고리별 마커를 렌더링합니다. 사용자 위치와 가까운 시설이 한 화면에 들어오도록 Haversine 거리 계산과 지도 bounds 조절을 적용했습니다.

### 외부 API 부분 실패 대응

병원·약국·복지관 등 여러 세부 카테고리 요청을 `Promise.allSettled`로 병렬 처리합니다. 일부 요청이 실패해도 성공한 시설 데이터는 계속 지도에 표시하며, 키 누락 또는 결과 없음 상황에서는 개발용 fallback과 오류 UI를 제공합니다.

### 역지오코딩과 행정구역 연결

현재 위치 좌표를 도로명 주소로 변환한 뒤, 역지오코딩 결과에 행정동이 누락되거나 법정동만 포함되는 경우 도로명 주소를 다시 검색합니다. 보완한 시·도·시군구·행정동으로 Region API를 호출하여 `regionId`를 얻고, 주소·좌표·지역 ID를 회원가입 및 개인정보 수정 요청에 함께 전달합니다.

### 서버 상태와 클라이언트 상태 분리

회원·시설·혜택 등 서버 데이터는 TanStack Query, 인증과 사용자 설정은 Zustand, 화면 내부 입력과 모달은 `useState`로 역할을 분리했습니다. 찜 및 개인정보 변경 후에는 Query invalidation을 사용해 데이터 변경 결과가 관련 화면에 반영되도록 구성했습니다.

## 브랜치 전략

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

### 브랜치 규칙

- 브랜치 이름은 `작업유형/이슈번호-간단한-설명` 형식을 사용합니다.
- `feature`, `fix`, `refactor`, `chore`, `docs`, `test`는 최신 `dev`에서 분기하고 `dev`로 병합합니다.
- 운영 긴급 수정인 `hotfix`만 `main`에서 분기하고 `main`과 `dev`에 모두 반영합니다.
- 한 브랜치에는 하나의 Issue 범위만 포함합니다.
- 모든 변경은 Pull Request와 리뷰를 통해 병합합니다.

| 브랜치       | 용도                     | 분기 기준 | 병합 대상     |
| ------------ | ------------------------ | --------- | ------------- |
| `feature/*`  | 신규 기능                | `dev`     | `dev`         |
| `fix/*`      | 버그 수정                | `dev`     | `dev`         |
| `refactor/*` | 기능 변경 없는 구조 개선 | `dev`     | `dev`         |
| `chore/*`    | 설정, 의존성, 빌드 작업  | `dev`     | `dev`         |
| `docs/*`     | 문서 작업                | `dev`     | `dev`         |
| `test/*`     | 테스트 추가 및 수정      | `dev`     | `dev`         |
| `hotfix/*`   | 운영 긴급 수정           | `main`    | `main`, `dev` |

### 브랜치 예시

```text
feature/12-mypage
fix/23-map-marker
refactor/31-api-client
chore/42-eslint
docs/45-readme
test/48-mypage-flow
```

## 커밋 컨벤션

| 타입       | 설명                | 예시                                |
| ---------- | ------------------- | ----------------------------------- |
| `feat`     | 기능 추가           | `feat: 주변시설 지도 UI 구현`       |
| `fix`      | 버그 수정           | `fix: 필터 선택 상태 오류 수정`     |
| `refactor` | 리팩토링            | `refactor: 시설 타입 분리`          |
| `style`    | 스타일 수정         | `style: 카드 여백 조정`             |
| `docs`     | 문서 수정           | `docs: README 작성`                 |
| `test`     | 테스트 추가 및 수정 | `test: 마이페이지 흐름 테스트 추가` |
| `chore`    | 설정/빌드 작업      | `chore: eslint 설정 수정`           |

## Issue 컨벤션

작업 전에 Issue를 생성하고 담당자, 작업 범위와 완료 조건을 합의합니다.

### Issue 제목

```text
[FEAT] 마이페이지 UI 구현
[FIX] 지도 마커 위치 오류 수정
[REFACTOR] API 호출 로직 분리
[CHORE] ESLint 설정 변경
[DOCS] README 업데이트
[TEST] 마이페이지 사용자 흐름 테스트 추가
```

### Issue 필수 내용

- 작업 목적 또는 문제 설명
- 상세 작업 체크리스트
- 리뷰어가 확인할 수 있는 완료 조건
- 담당자와 관련 디자인·명세
- 선행 작업 또는 의존 Issue

기능, 버그, 일반 작업용 Issue Form은 `.github/ISSUE_TEMPLATE`에 정의되어 있습니다. 자세한 작업 흐름은 [CONTRIBUTING.md](./CONTRIBUTING.md)를 참고합니다.

## PR 컨벤션

PR 제목은 커밋 컨벤션과 동일한 형식을 사용합니다.

```text
feat: 주변시설 지도 UI 구현
```

PR에는 관련 Issue를 `Closes #이슈번호` 형식으로 연결하고 작업 내용, 주요 변경 사항, 스크린샷과 검증 결과를 작성합니다.

실제 PR 작성 화면에 자동 적용되는 템플릿은 `.github/pull_request_template.md`에 정의되어 있습니다.

## 실행 방법

### 환경 변수

저장소 루트에 `.env`를 만들고 다음 값을 설정합니다. 실제 키와 토큰은 Git에 커밋하지 않습니다.

```env
VITE_API_BASE_URL=/api
VITE_KAKAO_REST_API_KEY=카카오_REST_API_KEY
VITE_KAKAO_MAP_KEY=카카오_JAVASCRIPT_KEY
VITE_KAKAO_REDIRECT_URI=http://localhost:5173/oauth/kakao
```

개발 서버의 `/api` 요청은 Vite proxy를 통해 백엔드로 전달됩니다. 배포 환경에서는 `VITE_API_BASE_URL`과 카카오 허용 도메인·리다이렉트 URI를 배포 주소에 맞게 설정해야 합니다.

### 1. 의존성 설치

```bash
npm ci
```

### 2. 개발 서버 실행

```bash
npm run dev
```

기본 접속 주소:

```text
http://localhost:5173
```

### 3. 빌드

```bash
npm run build
```

### 4. 린트

```bash
npm run lint
```

## 주요 예외 처리

- 위치 API 미지원, 권한 거부, HTTPS 미사용 및 타임아웃 안내
- 시설 검색 일부 실패 시 성공 결과 유지
- 로딩, 빈 목록, API 오류와 재시도 UI
- 로그인 보호 경로와 토큰 만료 처리
- 생년월일·전화번호·비밀번호·필수 주소 입력 검증
- 주소 행정구역 누락 보완 및 좌표 범위·소수 자릿수 정규화
- 찜 요청 실패 시 낙관적 UI 원상 복구

## 검증

```bash
npm run build
npm run lint
```

최종 변경은 프로덕션 빌드와 ESLint를 통과한 뒤 `dev`에서 검토하고 `main`에 병합합니다.

### 5. 포맷팅

```bash
npm run format
```

## 화면 목록 및 플로우

| 경로              | 화면          | 설명                                            |
| ----------------- | ------------- | ----------------------------------------------- |
| `/login`          | 로그인        | 사용자 로그인                                   |
| `/onboarding`     | 온보딩        | 사용자 기본 정보 입력                           |
| `/survey`         | 설문          | 맞춤 추천을 위한 설문 진행                      |
| `/recommendation` | 추천          | 설문 결과 기반 맞춤 혜택 추천                   |
| `/benefits`       | 혜택 목록     | 복지 혜택 목록 조회                             |
| `/benefits/:id`   | 혜택 상세     | 혜택 상세 정보 확인                             |
| `/map`            | 주변시설 지도 | 주변 시설 지도 탐색 및 카테고리별 조회          |
| `/facility/:id`   | 시설 상세     | 시설 주소, 전화번호, 운영시간, 제공 서비스 확인 |
| `/mypage`         | 마이페이지    | 사용자 정보 및 설정 확인                        |

### 사용자 플로우

```text
로그인
→ 온보딩
→ 설문
→ 맞춤 추천 확인
→ 혜택 상세 확인
```

```text
로그인
→ 지도
→ 카테고리 필터 선택
→ 주변시설 목록 확인
→ 시설 상세 정보 확인
```

## 현재 구현 상태

| 영역                           | 상태    |
| ------------------------------ | ------- |
| 프로젝트 초기 세팅             | 완료    |
| 라우터 구조                    | 완료    |
| 공통 컴포넌트 기본 구조        | 완료    |
| 온보딩·로그인 UI               | 완료    |
| 설문·혜택 UI                   | 진행 중 |
| 지도·시설 상세 UI              | 완료    |
| 마이페이지 UI                  | 완료    |
| Zustand store 구조             | 진행 중 |
| Axios/TanStack Query 기반 구조 | 진행 중 |
| 지도 Mock UI                   | 완료    |
| 시설 상세 Mock UI              | 완료    |

## 개발 일정

날짜가 확정되지 않은 작업을 임의의 달력 날짜로 고정하지 않고 Sprint 단위로 관리합니다. 각 Sprint 시작 시 관련 Issue에 담당자와 시작일·마감일을 지정합니다.

| 단계                  | 기간     | 주요 작업                                            | 완료 기준                               | 상태    |
| --------------------- | -------- | ---------------------------------------------------- | --------------------------------------- | ------- |
| 프로젝트 기반 구성    | Sprint 1 | 저장소, 라우터, 상태 관리, HTTP 클라이언트 구조 설정 | 로컬 실행 및 기본 라우팅 가능           | 완료    |
| 공통 컴포넌트 설계    | Sprint 2 | 버튼, 입력, 카드, 헤더, 내비게이션 등 구현           | 주요 화면에서 공통 컴포넌트 재사용      | 완료    |
| 화면 UI 개발          | Sprint 3 | 온보딩, 설문, 혜택, 지도, 마이페이지 구현            | Figma 기준 주요 화면과 사용자 흐름 확인 | 진행 중 |
| API 명세 및 Mock 정리 | Sprint 4 | 요청·응답 타입, Mock 데이터, 에러 규격 합의          | 프론트·백엔드 API 계약 확정             | 진행 중 |
| API 연동              | Sprint 5 | 인증, 사용자, 설문, 혜택, 시설 API 연결              | Mock 없이 핵심 사용자 흐름 동작         | 예정    |
| 통합 테스트           | Sprint 6 | 모바일 반응형, 접근성, 로딩·빈 상태·오류 상태 점검   | 주요 시나리오 및 회귀 테스트 통과       | 예정    |
| 안정화 및 코드 프리즈 | Sprint 7 | 버그 수정, 로그·환경변수·번들 점검                   | 빌드·린트 통과 및 배포 차단 이슈 0건    | 예정    |
| 배포 및 운영 점검     | Sprint 8 | 프로덕션 배포, 환경변수 및 모니터링 확인             | 배포 URL에서 핵심 흐름 정상 동작        | 예정    |

## 지도 Feature 구현 내용

`src/features/map`에는 주변시설 탐색 기능을 위한 컴포넌트가 분리되어 있습니다.

| 컴포넌트         | 역할                                      |
| ---------------- | ----------------------------------------- |
| `MapView`        | 주변시설 위치를 지도 영역에 표시          |
| `FilterBar`      | 복지관, 주민센터, 보건소 등 카테고리 필터 |
| `FacilityCard`   | 시설 요약 카드                            |
| `FacilityDetail` | 시설 상세 정보                            |
| `mockFacilities` | 지도 UI 확인용 목업 데이터                |

현재 `/map`, `/facility/:id` 화면은 목업 데이터를 기반으로 UI 확인이 가능합니다. 실제 지도 SDK와 API 연동은 추후 내부 구현을 교체하는 방식으로 확장할 수 있습니다.
