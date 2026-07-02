# Salpim Web

사용자의 기본 정보와 설문 결과를 바탕으로 맞춤형 복지 혜택과 주변 시설 정보를 제공하는 프론트엔드 웹 서비스입니다.

## 수행 내용

- Repository Public 설정
- React + TypeScript + Vite 프로젝트 초기 세팅
- `.gitignore` 설정
- 브랜치 전략 수립
- 공통 컴포넌트 및 feature 기반 폴더 구조 설계
- README 작성
- Mock 데이터 기반 지도/주변시설 UI 구현

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

| 이름 | 역할 | 담당 영역 |
| --- | --- | --- |
| 동동 | Frontend | `Button`, `Input`, `Dropdown`, 혜택 feature |
| 조쉬 | Frontend | `Chip`, `Tab`, `Card`, 설문 feature |
| 오스카 | Frontend | 지도, 시설 목록, 시설 상세 UI |

## 컴포넌트 역할 분담

### 공통 컴포넌트

프로젝트 전역에서 재사용되는 UI 컴포넌트입니다.

| 컴포넌트 | 담당자 | 설명 |
| --- | --- | --- |
| `Button` | 동동 | 주요 버튼 UI |
| `Input` | 동동 | 입력 필드 UI |
| `Dropdown` | 동동 | 드롭다운 선택 UI |
| `Chip` | 조쉬 | 필터/태그 선택 UI |
| `Tab` | 조쉬 | 탭 전환 UI |
| `Card` | 조쉬 | 콘텐츠 카드 UI |
| `Modal` | 오스카 | 모달 UI |
| `Loading` | 오스카 | 로딩 상태 UI |
| `BottomNavigation` | 오스카 | 하단 내비게이션 UI |

### 기능 컴포넌트

여러 공통 컴포넌트를 조합하여 특정 기능을 담당하는 컴포넌트입니다.

| 기능 | 컴포넌트 | 담당자 | 설명 |
| --- | --- | --- | --- |
| 온보딩 | `OnboardingForm`, `AddressSelector` | 조쉬 | 사용자 기본 정보 입력 및 주소 선택 |
| 설문 | `SurveyForm`, `QuestionCard` | 조쉬 | 설문 진행 및 질문 카드 UI |
| 추천 | `RecommendationCard`, `RecommendationList` | 동동 | 맞춤 추천 결과 카드 및 목록 |
| 혜택 | `BenefitCard`, `BenefitDetail` | 동동 | 복지 혜택 요약 및 상세 정보 |
| 지도 | `MapView`, `FilterBar`, `FacilityCard`, `FacilityDetail` | 오스카 | 주변시설 지도, 카테고리 필터, 시설 목록, 시설 상세 정보 |

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| Core | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| Routing | React Router DOM |
| Client State | Zustand |
| Server State | TanStack Query |
| HTTP Client | Axios |
| Code Quality | ESLint, Prettier |
| Package Manager | npm |

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
│   │   ├── Loading
│   │   ├── Modal
│   │   └── Tab
│   └── layout
│       └── Layout.tsx
├── features
│   ├── benefit
│   ├── map
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

| 경로 | 설명 |
| --- | --- |
| `src/apis` | Axios 기반 API 함수 관리 |
| `src/components/common` | 버튼, 입력, 카드 등 전역 공통 UI 컴포넌트 |
| `src/components/layout` | 페이지 공통 레이아웃 구성 |
| `src/features` | 기능 단위 UI 컴포넌트 관리 |
| `src/pages` | 라우팅 단위 페이지 컴포넌트 |
| `src/router` | React Router 설정 |
| `src/store` | Zustand 기반 클라이언트 상태 관리 |
| `src/styles` | 전역 스타일 |

## 상태 관리 설계

전역 상태는 Zustand를 사용하여 관리합니다. 서버에서 받아오는 데이터는 TanStack Query를 통해 관리하고, UI 전역에서 공유해야 하는 클라이언트 상태만 store에 분리합니다.

| 상태 | 저장 위치 | 설명 |
| --- | --- | --- |
| 사용자 정보 | `userStore` | 로그인 사용자 정보, 온보딩 기본 정보 |
| 설문 응답 결과 | `surveyStore` | 사용자가 선택한 설문 답변 |
| 추천 결과 | `benefitStore` | 설문 기반 추천 혜택 결과 |
| 위치 정보 | `locationStore` | 현재 위치, 선택 지역, 주변시설 탐색 기준 위치 |

## 브랜치 전략

```text
main
└── dev
    └── feature/*
```

### 브랜치 규칙

- `main`: 배포 가능한 최종 브랜치
- `dev`: 기능 통합 및 테스트 브랜치
- `feature/*`: 개별 기능 개발 브랜치
- 모든 기능 작업은 `feature/*` 브랜치에서 진행
- 작업 완료 후 Pull Request를 통해 `dev` 브랜치로 병합
- 최종 테스트 완료 후 `dev`에서 `main`으로 병합

### 브랜치 예시

```text
feature/login
feature/onboarding
feature/survey
feature/recommendation
feature/benefit
feature/map
feature/mypage
```

## 커밋 컨벤션

| 타입 | 설명 | 예시 |
| --- | --- | --- |
| `feat` | 기능 추가 | `feat: 주변시설 지도 UI 구현` |
| `fix` | 버그 수정 | `fix: 필터 선택 상태 오류 수정` |
| `refactor` | 리팩토링 | `refactor: 시설 타입 분리` |
| `style` | 스타일 수정 | `style: 카드 여백 조정` |
| `docs` | 문서 수정 | `docs: README 작성` |
| `chore` | 설정/빌드 작업 | `chore: eslint 설정 수정` |

## PR 컨벤션

PR 제목은 커밋 컨벤션과 동일한 형식을 사용합니다.

```text
feat: 주변시설 지도 UI 구현
```

PR 본문에는 다음 내용을 포함합니다.

```md
## 작업 내용
- 구현한 기능 요약

## 확인 사항
- 실행 또는 테스트 결과

## 참고 사항
- 리뷰어가 알아야 할 내용
```

## 실행 방법

### 1. 의존성 설치

```bash
npm install
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

### 5. 포맷팅

```bash
npm run format
```

## 화면 목록 및 플로우

| 경로 | 화면 | 설명 |
| --- | --- | --- |
| `/login` | 로그인 | 사용자 로그인 |
| `/onboarding` | 온보딩 | 사용자 기본 정보 입력 |
| `/survey` | 설문 | 맞춤 추천을 위한 설문 진행 |
| `/recommendation` | 추천 | 설문 결과 기반 맞춤 혜택 추천 |
| `/benefits` | 혜택 목록 | 복지 혜택 목록 조회 |
| `/benefits/:id` | 혜택 상세 | 혜택 상세 정보 확인 |
| `/map` | 주변시설 지도 | 주변 시설 지도 탐색 및 카테고리별 조회 |
| `/facility/:id` | 시설 상세 | 시설 주소, 전화번호, 운영시간, 제공 서비스 확인 |
| `/mypage` | 마이페이지 | 사용자 정보 및 설정 확인 |

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

| 영역 | 상태 |
| --- | --- |
| 프로젝트 초기 세팅 | 완료 |
| 라우터 구조 | 완료 |
| 공통 컴포넌트 기본 구조 | 진행 중 |
| Zustand store 구조 | 진행 중 |
| Axios/TanStack Query 기반 구조 | 진행 중 |
| 지도 Mock UI | 완료 |
| 시설 상세 Mock UI | 완료 |

## 지도 Feature 구현 내용

`src/features/map`에는 주변시설 탐색 기능을 위한 컴포넌트가 분리되어 있습니다.

| 컴포넌트 | 역할 |
| --- | --- |
| `MapView` | 주변시설 위치를 지도 영역에 표시 |
| `FilterBar` | 복지관, 주민센터, 보건소 등 카테고리 필터 |
| `FacilityCard` | 시설 요약 카드 |
| `FacilityDetail` | 시설 상세 정보 |
| `mockFacilities` | 지도 UI 확인용 목업 데이터 |

현재 `/map`, `/facility/:id` 화면은 목업 데이터를 기반으로 UI 확인이 가능합니다. 실제 지도 SDK와 API 연동은 추후 내부 구현을 교체하는 방식으로 확장할 수 있습니다.
