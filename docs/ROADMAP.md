# 퀴즈 프롬프트 검증기 개발 로드맵

> 프로젝트 개요 및 기능 명세는 `docs/PRD.md` 참조.
> 기술 스택 및 아키텍처는 `CLAUDE.md` 참조.

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

### Phase 1: 애플리케이션 골격 구축

> **순서 근거**: 현재 프로젝트는 Next.js 스타터킷 상태이며, 퀴즈 프롬프트 검증기에 맞는 라우트 구조, 타입 정의, 데이터 계층이 전혀 없다. 모든 후속 작업(UI, API, 로직)이 이 골격에 의존하므로 가장 먼저 완성해야 한다.

- **Task 001: 타입 정의 및 데이터 스키마 설계** - 우선순위
  - `lib/types.ts` 생성: TargetModel, PromptInput, ValidationResult, RubricScore, Grade 타입 정의
  - `lib/rubrics.ts` 생성: 7개 루브릭 기준 상수 배열, 모델별 최적화 가이드 객체, 등급 계산 함수 (`calculateGrade`)
  - Zod 스키마 정의: 프롬프트 입력 폼 검증용 (`promptInputSchema`)
  - 데이터 디렉토리 구조 확보: `data/prompts/.gitkeep`, `data/results/.gitkeep` 생성

- **Task 002: 라우트 구조 및 레이아웃 전환**
  - 스타터킷 메인 페이지(`app/page.tsx`)를 퀴즈 프롬프트 검증기 진입점으로 교체 (빈 폼 껍데기)
  - `app/results/[id]/page.tsx` 빈 페이지 생성 (결과 상세)
  - `app/history/page.tsx` 빈 페이지 생성 (히스토리)
  - `app/login/page.tsx`, `components/login-form.tsx` 삭제 (로컬 도구이므로 인증 불필요)
  - `app/layout.tsx` metadata 변경: title을 "퀴즈 프롬프트 검증기"로 수정
  - `lib/nav-items.ts` 수정: [{href: "/", label: "검증하기"}, {href: "/history", label: "히스토리"}]
  - `lib/site-config.ts` 수정: 사이트명 및 설명을 프로젝트에 맞게 변경
  - `components/layout/header.tsx` 수정: 로고 텍스트 변경, 로그인 버튼 제거
  - `components/layout/footer.tsx` 수정: 프로젝트에 맞게 텍스트 수정

- **Task 003: 데이터 액세스 레이어 구현**
  - `lib/data.ts` 생성: Node.js fs 기반 파일 CRUD 유틸리티
  - `savePrompt(input)`: data/prompts/{id}.json 저장
  - `getPrompt(id)`: 프롬프트 JSON 읽기
  - `getResult(id)`: 결과 JSON 읽기
  - `getAllResults()`: 전체 결과 파일 목록 스캔 및 반환
  - `updatePromptStatus(id, status)`: 프롬프트 상태 업데이트
  - `.gitignore`에 `data/prompts/*.json`, `data/results/*.json` 추가

### Phase 2: UI 컴포넌트 구현 (더미 데이터 활용)

> **순서 근거**: Phase 1에서 타입과 라우트 골격이 완성되었으므로, API 없이도 더미 데이터로 모든 UI를 먼저 완성할 수 있다. 공통 컴포넌트(등급 뱃지, 점수 카드)가 여러 페이지에서 재사용되므로 개별 페이지보다 먼저 구현한다.

- **Task 004: 공통 UI 컴포넌트 구현** - 우선순위
  - `components/score-badge.tsx` 생성: 등급별 색상 뱃지 (A=초록, B=파랑, C=노랑, D=주황, F=빨강)
  - `components/rubric-score-card.tsx` 생성: 루브릭 항목별 점수 카드 (항목명, 점수/배점, 피드백, 개선 제안)
  - `components/history-card.tsx` 생성: 히스토리 카드 (모델명, 총점, 등급 뱃지, 프롬프트 미리보기, 검증 일시)
  - 더미 데이터 생성: 테스트용 PromptInput, ValidationResult 객체

- **Task 005: 메인 페이지 (검증하기) UI 구현**
  - `components/prompt-validator-form.tsx` 생성: 클라이언트 컴포넌트
  - React Hook Form + Zod 연동: 대상 모델 Select, 메타프롬프트 Textarea (최소 10줄 높이)
  - 실시간 유효성 검사 에러 메시지 표시 (모델 미선택, 프롬프트 최소 길이 미달)
  - "검증 요청 제출" 버튼 UI (API 연동 전 더미 동작)
  - `app/page.tsx`에 PromptValidatorForm 컴포넌트 렌더링

- **Task 006: 결과 상세 페이지 UI 구현**
  - `components/validation-result.tsx` 생성: 검증 결과 탭 UI (클라이언트 컴포넌트)
  - 탭 1 "항목별 점수": RubricScoreCard 7개 항목 렌더링
  - 탭 2 "개선된 프롬프트": 개선 프롬프트 텍스트 표시
  - 탭 3 "원본 프롬프트": 원본 메타프롬프트 텍스트 표시
  - 총점 + 등급 뱃지(ScoreBadge) 헤더 영역
  - 대기 상태 UI: "아직 검증이 완료되지 않았습니다" 안내 메시지 + /validate 실행 안내 (F012)
  - `app/results/[id]/page.tsx`에 더미 데이터로 결과 UI 렌더링

- **Task 007: 히스토리 페이지 UI 구현**
  - `app/history/page.tsx`에 HistoryCard 목록 렌더링 (더미 데이터)
  - 결과 없을 때 빈 상태 안내 메시지 표시
  - 카드 클릭 시 `/results/{id}` 이동 (Link 컴포넌트)
  - 검증 일시 기준 최신순 정렬

### Phase 3: API 및 핵심 기능 연동

> **순서 근거**: Phase 2에서 UI가 더미 데이터로 완성되었으므로, 이제 실제 데이터 흐름을 연결한다. API 엔드포인트가 폼 제출과 결과 조회의 전제 조건이므로 가장 먼저 구현한다.

- **Task 008: API 라우트 구현** - 우선순위
  - `app/api/prompts/route.ts` 생성: POST 엔드포인트 (Zod 검증 -> UUID 생성 -> JSON 파일 저장 -> ID 반환)
  - `app/api/results/[id]/route.ts` 생성: GET 엔드포인트 (결과 파일 존재 여부 확인 -> JSON 반환 또는 404)
  - `app/api/prompts/[id]/status/route.ts` 생성: GET 엔드포인트 (프롬프트 상태 조회)
  - 에러 핸들링: 400 (유효성 검사 실패), 404 (파일 없음), 500 (서버 오류) 응답 처리
  - Playwright MCP를 활용한 API 엔드포인트 통합 테스트

- **Task 009: 폼 제출 및 결과 페이지 API 연동**
  - `components/prompt-validator-form.tsx` 수정: POST /api/prompts 실제 호출 연동
  - 제출 성공 시 sonner 토스트: "터미널에서 /validate 커맨드를 실행하세요"
  - 제출 성공 시 `/results/{id}`로 자동 리디렉션 (useRouter)
  - `app/results/[id]/page.tsx` 수정: 서버 컴포넌트에서 실제 파일 읽기로 교체 (lib/data.ts 활용)
  - 결과 파일 없으면 대기 상태 UI, 있으면 결과 탭 UI 렌더링
  - Playwright MCP로 폼 제출 -> 리디렉션 -> 대기 상태 E2E 테스트

- **Task 010: 히스토리 페이지 API 연동 및 /validate 커맨드 생성**
  - `app/history/page.tsx` 수정: 서버 컴포넌트에서 getAllResults() 호출로 교체
  - 결과 파일과 프롬프트 파일 조인하여 카드 데이터 구성
  - `.claude/commands/validate.md` 생성: /validate 슬래시 커맨드 정의
    - data/prompts/ 디렉토리에서 status: "pending" 파일 탐색
    - 7개 루브릭 기준으로 평가 및 점수 산정
    - 모델별 최적화 가이드 적용
    - data/results/{id}.json 생성
    - 원본 프롬프트 status -> "validated" 업데이트
  - Playwright MCP로 히스토리 페이지 데이터 로딩 테스트

- **Task 011: 통합 테스트 및 전체 플로우 검증**
  - Playwright MCP를 사용한 전체 사용자 여정 E2E 테스트
    - 메인 페이지 -> 모델 선택 -> 프롬프트 입력 -> 제출 -> 결과 페이지(대기) 플로우
    - 결과 페이지(완료) -> 탭 전환 -> 항목별 점수/개선 프롬프트/원본 확인
    - 히스토리 페이지 -> 카드 목록 -> 카드 클릭 -> 결과 상세 이동
  - 에러 핸들링 및 엣지 케이스 테스트
  - `npm run build` 빌드 에러 없는지 확인

### Phase 4: 마무리 및 품질 개선

> **순서 근거**: 핵심 기능이 모두 동작하는 상태에서 사용자 경험 개선, 코드 정리, 문서 업데이트를 수행한다.

- **Task 012: 반응형 디자인 및 UX 개선**
  - 모바일 환경 반응형 디자인 점검 및 수정
  - 탭 UI 모바일 최적화 (스크롤 가능 탭, 터치 영역 확보)
  - 폼 입력 UX 개선: 프롬프트 Textarea 자동 높이 조절, 글자 수 카운터
  - 로딩 상태 및 스켈레톤 UI 추가 (폼 제출 중, 데이터 로딩 중)
  - 접근성(a11y) 점검: aria-label, 키보드 네비게이션, 포커스 관리

- **Task 013: 코드 정리 및 문서 업데이트**
  - CLAUDE.md 최종 업데이트: 구현된 디렉토리 구조, 데이터 플로우, /validate 커맨드 사용법 반영
  - 코드 린트 및 포맷팅 정리 (`npm run lint`, Prettier)
  - 불필요한 스타터킷 잔여 코드 제거
  - `npm run build` 최종 빌드 성공 확인
