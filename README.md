# salpim-web
# Frontend Project

## 프로젝트 개요

사용자의 설문 및 기본 정보를 기반으로 맞춤형 혜택 및 시설 정보를 추천하는 웹 서비스입니다.

---

# 기술 스택

## Core

- React
- TypeScript
- Vite

## Styling

- TailwindCSS

## State Management

- Zustand

## Server State

- TanStack Query

## HTTP Client

- Axios

## Routing

- React Router DOM

## Code Quality

- ESLint
- Prettier

---

# Git 전략

## Branch Strategy

```text
main
 └── dev
      └── feature/*
```

### 규칙

- main 직접 작업 금지
- dev 직접 작업 금지
- feature 브랜치 생성 후 작업
- Pull Request를 통해 dev 병합
- 최종 테스트 완료 후 dev → main 병합

### 브랜치 예시

```text
feature/login
feature/onboarding
feature/survey
feature/map
feature/benefit
```

---

# 코드 컨벤션

## Component

PascalCase 사용

```tsx
LoginPage.tsx
BenefitCard.tsx
FacilityDetail.tsx
```

## Variable

camelCase 사용

```ts
userInfo
surveyAnswer
selectedFacility
```

## String

쌍따옴표 사용

```ts
const name = "Oscar";
```

## Indent

2 Space

## Commit Convention

### Feature

```bash
feat: 로그인 기능 구현
```

### Fix

```bash
fix: 회원가입 오류 수정
```

### Refactor

```bash
refactor: 상태 관리 구조 개선
```

### Style

```bash
style: 코드 포맷 수정
```

### Docs

```bash
docs: README 수정
```

---

# 프로젝트 구조

```text
src

├── apis
├── assets
├── components
│   ├── common
│   └── layout
│
├── features
│   ├── onboarding
│   ├── survey
│   ├── recommendation
│   ├── benefit
│   └── map
│
├── hooks
├── store
├── pages
├── router
├── constants
├── types
├── styles
│
├── App.tsx
└── main.tsx
```

---

# 공통 컴포넌트

프로젝트 전역에서 재사용되는 UI 컴포넌트

## Components

- Button
- Input
- Dropdown
- Chip
- Tab
- Card
- Modal
- Loading
- HeaderBar
- BottomNavigation

---

# 기능 컴포넌트

## Onboarding

### OnboardingForm

사용자 기본 정보 입력

### AddressSelector

사용자 주소 선택

---

## Survey

### SurveyForm

설문 진행

### QuestionCard

질문 단위 컴포넌트

---

## Recommendation

### RecommendationCard

추천 결과 표시

### RecommendationList

추천 결과 목록 표시

---

## Benefit

### BenefitCard

혜택 요약 정보

### BenefitDetail

혜택 상세 정보

---

## Map

### MapView

지도 표시

### FilterBar

시설 필터

### FacilityCard

시설 요약 정보

### FacilityDetail

시설 상세 정보

---

# 상태 관리 구조

Zustand 사용

## userStore

사용자 정보

```ts
{
  name: "",
  gender: "",
  ageGroup: "",
  location: ""
}
```

---

## surveyStore

설문 응답

```ts
{
  healthConditions: [],
  interests: [],
  lifestyles: []
}
```

---

## benefitStore

추천 및 신청 정보

```ts
{
  selectedBenefit: null
}
```

---

## locationStore

시설 및 위치 정보

```ts
{
  selectedFacility: null,
  location: null
}
```

---

# API 구조

Axios + TanStack Query 사용

## Axios

HTTP 요청 처리

### API Modules

```text
apis

auth.ts
survey.ts
benefit.ts
facility.ts
client.ts
```

---

## TanStack Query

서버 상태 관리

### Query

조회

```tsx
useQuery()
```

예시

- 혜택 목록 조회
- 시설 목록 조회
- 사용자 정보 조회

### Mutation

생성 / 수정 / 삭제

```tsx
useMutation()
```

예시

- 로그인
- 설문 제출
- 혜택 신청

---

