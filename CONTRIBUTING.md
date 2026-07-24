# Salpim Web 협업 가이드

## 기본 작업 흐름

1. 작업 전에 Issue를 생성하고 담당자와 완료 조건을 지정합니다.
2. 최신 `dev`에서 작업 유형에 맞는 브랜치를 생성합니다.
3. 작은 단위로 커밋하고 로컬에서 빌드와 린트를 확인합니다.
4. `dev`를 대상으로 Pull Request를 생성하고 Issue를 연결합니다.
5. 리뷰 승인을 받은 뒤 병합합니다.

긴급 운영 수정인 `hotfix/*`만 `main`에서 분기하며, 수정 후 `main`과 `dev`에 모두 반영합니다.

## Issue Convention

### 제목

```text
[FEAT] 마이페이지 UI 구현
[FIX] 지도 마커 위치 오류 수정
[REFACTOR] API 호출 로직 분리
[CHORE] ESLint 설정 변경
[DOCS] README 업데이트
[TEST] 마이페이지 사용자 흐름 테스트 추가
```

### 필수 내용

- 작업 목적 또는 문제 설명
- 상세 작업 체크리스트
- 확인 가능한 완료 조건
- 담당자와 관련 자료
- 선행 작업 또는 의존 Issue

기능과 버그는 각각의 Issue Form을 사용하고, 리팩터링·문서·설정·테스트는 일반 작업 Form을 사용합니다.

## Branch Convention

브랜치 이름은 `작업유형/이슈번호-간단한-설명` 형식을 사용합니다.

| 브랜치       | 용도                     | 분기 기준 | 병합 대상     | 예시                     |
| ------------ | ------------------------ | --------- | ------------- | ------------------------ |
| `feature/*`  | 신규 기능                | `dev`     | `dev`         | `feature/12-mypage`      |
| `fix/*`      | 버그 수정                | `dev`     | `dev`         | `fix/23-map-marker`      |
| `refactor/*` | 기능 변경 없는 구조 개선 | `dev`     | `dev`         | `refactor/31-api-client` |
| `chore/*`    | 설정, 의존성, 빌드 작업  | `dev`     | `dev`         | `chore/42-eslint`        |
| `docs/*`     | 문서 작업                | `dev`     | `dev`         | `docs/45-readme`         |
| `test/*`     | 테스트 추가 및 수정      | `dev`     | `dev`         | `test/48-mypage-flow`    |
| `hotfix/*`   | 운영 긴급 수정           | `main`    | `main`, `dev` | `hotfix/51-login`        |

한 브랜치에는 하나의 Issue 범위만 포함합니다.

## Commit Convention

커밋 메시지는 `type: 변경 내용` 형식을 사용합니다.

| 타입       | 용도                     |
| ---------- | ------------------------ |
| `feat`     | 기능 추가                |
| `fix`      | 버그 수정                |
| `refactor` | 기능 변경 없는 코드 개선 |
| `style`    | UI 또는 코드 포맷 변경   |
| `docs`     | 문서 변경                |
| `test`     | 테스트 추가 및 수정      |
| `chore`    | 설정, 의존성, 빌드 변경  |

```text
feat: 마이페이지 스크롤 인디케이터 추가
fix: 비밀번호 입력 표시 위치 수정
docs: Issue 및 PR 컨벤션 추가
```

## Pull Request Convention

- 제목은 커밋 컨벤션과 동일한 형식을 사용합니다.
- 본문 첫 줄에 `Closes #이슈번호`를 작성합니다.
- UI 변경은 변경 전·후 스크린샷을 첨부합니다.
- 테스트한 사용자 흐름과 명령어를 작성합니다.
- API 키, 개인정보, 불필요한 로그가 없는지 확인합니다.
- 최소 한 명의 리뷰 승인을 받은 뒤 병합합니다.

## 작업 전 체크

```bash
npm ci
npm run build
npm run lint
```
