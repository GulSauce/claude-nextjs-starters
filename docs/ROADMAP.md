# 퀴즈 프롬프트 검증기 개발 로드맵

> 프로젝트 개요 및 기능 명세는 `docs/PRD.md` 참조.
> 기술 스택 및 아키텍처는 `CLAUDE.md` 참조.
> 신규 개발 계획(Phase 5~)은 `docs/ROADMAP_v2.md` 참조.

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 이 파일을 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `001-setup.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오)
   - 초기 상태의 샘플로 `000-sample.md` 참조

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 완료된 작업을 완료 표시로 변경

---

## 개발 단계

### Phase 1: 애플리케이션 골격 구축 ✅

> **순서 근거**: 현재 프로젝트는 Next.js 스타터킷 상태이며, 퀴즈 프롬프트 검증기에 맞는 라우트 구조, 타입 정의, 데이터 계층이 전혀 없다. 모든 후속 작업(UI, API, 로직)이 이 골격에 의존하므로 가장 먼저 완성해야 한다.

- ✅ **Task 001: 타입 정의 및 데이터 스키마 설계**
  - `lib/types.ts` 생성: TargetModel, PromptInput, ValidationResult, RubricScore, Grade 타입 정의
  - `lib/rubrics.ts` 생성: 7개 루브릭 기준 상수 배열, 모델별 최적화 가이드 객체, 등급 계산 함수 (`calculateGrade`)
  - Zod 스키마 정의: 프롬프트 입력 폼 검증용 (`promptInputSchema`)
  - 데이터 디렉토리 구조 확보: `data/prompts/.gitkeep`, `data/results/.gitkeep` 생성

- ✅ **Task 002: 라우트 구조 및 레이아웃 전환**
  - 스타터킷 메인 페이지(`app/page.tsx`)를 퀴즈 프롬프트 검증기 진입점으로 교체
  - `app/results/[id]/page.tsx`, `app/history/page.tsx` 생성
  - `app/login/page.tsx`, `components/login-form.tsx` 삭제
  - 레이아웃, 네비게이션, 헤더, 푸터 수정

- ✅ **Task 003: 데이터 액세스 레이어 구현**
  - `lib/data.ts` 생성: savePrompt, getPrompt, getResult, getAllResults, updatePromptStatus
  - `.gitignore`에 `data/prompts/*.json`, `data/results/*.json` 추가

### Phase 2: UI 컴포넌트 구현 (더미 데이터 활용) ✅

> **순서 근거**: Phase 1에서 타입과 라우트 골격이 완성되었으므로, API 없이도 더미 데이터로 모든 UI를 먼저 완성할 수 있다. 공통 컴포넌트(등급 뱃지, 점수 카드)가 여러 페이지에서 재사용되므로 개별 페이지보다 먼저 구현한다.

- ✅ **Task 004: 공통 UI 컴포넌트 구현**
  - `components/score-badge.tsx`, `components/rubric-score-card.tsx`, `components/history-card.tsx` 생성
  - 더미 데이터 생성: 테스트용 PromptInput, ValidationResult 객체

- ✅ **Task 005: 메인 페이지 (검증하기) UI 구현**
  - `components/prompt-validator-form.tsx` 생성: React Hook Form + Zod 연동
  - `app/page.tsx`에 PromptValidatorForm 컴포넌트 렌더링

- ✅ **Task 006: 결과 상세 페이지 UI 구현**
  - `components/validation-result.tsx` 생성: 검증 결과 탭 UI
  - `components/validation-pending.tsx` 생성: 대기 상태 UI

- ✅ **Task 007: 히스토리 페이지 UI 구현**
  - `app/history/page.tsx`에 HistoryCard 목록 렌더링

### Phase 3: API 및 핵심 기능 연동 ✅

> **순서 근거**: Phase 2에서 UI가 더미 데이터로 완성되었으므로, 이제 실제 데이터 흐름을 연결한다. API 엔드포인트가 폼 제출과 결과 조회의 전제 조건이므로 가장 먼저 구현한다.

- ✅ **Task 008: API 라우트 구현**
  - `app/api/prompts/route.ts`: POST (Zod 검증 → UUID 생성 → JSON 파일 저장 → 201)
  - `app/api/results/[id]/route.ts`: GET (결과 조회 → 200 또는 404)
  - `app/api/prompts/[id]/status/route.ts`: GET (상태 조회)

- ✅ **Task 009: 폼 제출 및 결과 페이지 API 연동**
  - 폼에서 POST /api/prompts 호출 → 토스트 → /results/{id} 리디렉션
  - 결과 페이지에서 getResult/getPrompt 직접 호출 (서버 컴포넌트)

- ✅ **Task 010: 히스토리 페이지 API 연동 및 /validate 커맨드 생성**
  - 히스토리 페이지 getAllResults() + getPrompt() 실제 데이터 연동
  - `.claude/commands/validate.md` 슬래시 커맨드 생성

- ✅ **Task 011: 통합 테스트 및 전체 플로우 검증**
  - Playwright MCP E2E 테스트: 폼 제출 → 결과 페이지 → 히스토리 플로우
  - `npx next build` 성공 확인

### Phase 4: 마무리 및 품질 개선 ✅

> **순서 근거**: 핵심 기능이 모두 동작하는 상태에서 사용자 경험 개선, 코드 정리, 문서 업데이트를 수행한다.

- ✅ **Task 012: 반응형 디자인 및 UX 개선**
  - 반응형 타이포그래피 (text-2xl sm:text-3xl)
  - 탭 UI overflow-x-auto 모바일 최적화
  - 글자 수 카운터, Loader2 스피너 로딩 상태

- ✅ **Task 013: 코드 정리 및 문서 업데이트**
  - `lib/dummy-data.ts` 삭제
  - CLAUDE.md 최종 업데이트: 디렉토리 구조, API 라우트, /validate 커맨드
  - `npm run lint` 에러 없음
  - `npx next build` 최종 빌드 성공
