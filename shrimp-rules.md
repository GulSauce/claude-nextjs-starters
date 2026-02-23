# Development Guidelines

> 이 파일은 AI 행동 규칙, 의사결정 기준, 금지 사항의 진실의 원천이다.
> 기술 스택, 명령어, 코딩 컨벤션은 `CLAUDE.md` 참조.
> 제품 요구사항, 데이터 모델, 루브릭 기준은 `docs/PRD.md` 참조.
> 개발 계획, Phase/Task, 작업 워크플로우는 `docs/ROADMAP.md` 참조.

## 작업 실행 규칙

- **모든 작업은 `docs/ROADMAP.md`를 기준으로 계획하고 실행한다**
- 작업 시작 전 반드시 `docs/ROADMAP.md`를 읽고 현재 Phase와 Task 진행 상태를 파악한다
- Phase 순서(1 → 2 → 3 → 4)를 준수하며, 각 Phase 내 Task도 명시된 순서를 따른다
- 이전 Phase의 모든 Task가 완료되어야 다음 Phase로 진행할 수 있다
- 작업 완료 시 `docs/ROADMAP.md`에서 해당 Task를 완료 표시로 변경한다
- 각 단계 완료 후 중단하고 추가 지시를 기다린다

## 주요 파일 상호작용 규칙

### 동시 수정 필수 파일

| 변경 대상        | 함께 수정해야 할 파일                                                              |
| ---------------- | ---------------------------------------------------------------------------------- |
| 라우트 추가/삭제 | `lib/nav-items.ts`, `CLAUDE.md` (라우팅 구조 섹션)                                 |
| 데이터 모델 변경 | `lib/types.ts`, `lib/data.ts`, 관련 API 라우트, `docs/PRD.md` (데이터 모델 섹션)   |
| 루브릭 기준 변경 | `lib/rubrics.ts`, `.claude/commands/validate.md`, `docs/PRD.md` (루브릭 기준 섹션) |
| 사이트 메타 변경 | `lib/site-config.ts`, `app/layout.tsx` (metadata), `components/layout/header.tsx`  |
| 네비게이션 변경  | `lib/nav-items.ts`, `components/layout/header.tsx`, `components/mobile-nav.tsx`    |
| 기술 스택 변경   | `package.json`, `CLAUDE.md` (기술 스택 섹션)                                       |
| 작업 완료        | `docs/ROADMAP.md` (완료 표시), 해당 `/tasks/*.md` (진행 상황 업데이트)             |

## AI 의사결정 기준

### 작업 우선순위

1. `docs/ROADMAP.md`의 Phase/Task 순서를 최우선으로 따른다
2. 현재 Phase 내에서 "우선순위" 표시가 있는 Task를 먼저 처리한다
3. 의존성이 있는 Task는 선행 Task 완료 후 진행한다

### 구현 방식 선택

- UI 컴포넌트: shadcn/ui에 해당 컴포넌트가 있으면 반드시 사용한다
- 새 페이지: 서버 컴포넌트로 시작하고, 인터랙티브 부분만 클라이언트 컴포넌트로 분리한다
- 데이터 처리: 외부 DB 대신 로컬 JSON 파일(`data/`)을 사용한다
- 인증/권한: 로컬 전용 도구이므로 인증 기능을 구현하지 않는다

### 모호한 상황 대처

- ROADMAP.md에 명시되지 않은 작업은 사용자에게 확인 후 진행한다
- 기술적 선택이 필요한 경우 `CLAUDE.md`의 기술 스택을 우선 따른다
- UI 디자인 결정은 shadcn/ui 기본 스타일을 따른다

## 금지 사항

### 절대 금지

- **외부 데이터베이스** (PostgreSQL, MongoDB 등) 도입 금지 — 로컬 JSON 파일만 사용
- **인증/권한 시스템** 구현 금지 — 로컬 전용 도구
- **`components/ui/` 내 파일 직접 수정** 금지 — shadcn CLI로만 관리
- **`any` 타입** 사용 금지
- **인라인 스타일** (`style` 속성) 사용 금지
- **ROADMAP.md 순서 무시** 금지 — Phase/Task 순서 엄수
- **CSS 파일 직접 작성** 금지 — Tailwind 유틸리티 클래스만 사용 (`globals.css` 테마 변수 제외)

### 주의 사항

- 스타터킷 잔여 코드(login 관련)는 Task 002에서 정리 예정이므로 그 전에 삭제하지 않는다
- `data/` 디렉토리의 JSON 파일을 Git에 커밋하지 않는다
- 환경 변수가 필요한 기능을 추가하지 않는다 (로컬 전용)
- `npm run build`가 항상 성공하는 상태를 유지한다
