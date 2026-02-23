# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> 제품 요구사항(기능 명세, 데이터 모델, 루브릭 기준)은 `docs/PRD.md` 참조.
> 개발 계획(Phase/Task, 진행 상태)은 `docs/ROADMAP.md` 참조.

## 프로젝트 개요

→ 상세: `docs/PRD.md` > 핵심 정보

AI 메타프롬프트의 품질을 로컬에서 자동 평가하여 점수와 개선안을 제공하는 도구 (로컬 전용, 1인 개발자 대상).

**현재 상태**: Phase 5 구현 완료. 듀얼 에이전트 토론 기반 평가 시스템 (프롬프트 엔지니어 + 교육 평가 전문가 → 교차 검토 → 합의 도출) 동작.

## 기술 스택

- **프레임워크**: Next.js 16 (App Router, RSC 기본)
- **언어**: TypeScript 5.6+
- **UI**: React 19
- **스타일링**: Tailwind CSS v4 (`@import "tailwindcss"`, 설정 파일 없음)
- **컴포넌트**: shadcn/ui (New York 스타일, Radix UI 기반)
- **아이콘**: Lucide React
- **토스트**: sonner
- **폼**: React Hook Form 7.x + Zod + @hookform/resolvers
- **데이터 저장**: 로컬 JSON 파일 (Node.js fs, `data/` 디렉토리)
- **린트**: ESLint 9 (eslint-config-next)
- **포맷팅**: Prettier

## 명령어 (Scripts)

```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 실행
```

## 아키텍처

### 핵심 데이터 플로우

```
1. 메인 페이지: 모델 선택 + 메타프롬프트 입력 → POST /api/prompts
2. API: data/prompts/pending/{id}.json 저장
3. 리다이렉트: /results/{id} (대기 상태)
4. Claude Code: /validate 커맨드 → 듀얼 에이전트 토론 평가
   Phase 1: Agent A(프롬프트 엔지니어) + Agent B(교육 평가 전문가) 병렬 독립 평가
   Phase 2: 교차 검토 (서로의 평가 결과를 검토)
   Phase 3: 합의 조정자가 최종 점수/피드백 결정
   → data/results/{id}.json 생성 (evaluationMode: "debate")
5. 새로고침: 결과 상세 페이지 (합의 결과/에이전트별 평가/토론 로그/개선 프롬프트/원본)
```

### 라우팅 구조

| 경로                       | 유형 | 설명                       |
| -------------------------- | ---- | -------------------------- |
| `/`                        | 정적 | 프롬프트 입력 폼           |
| `/results/[id]`            | 동적 | 검증 결과 표시 (대기/완료) |
| `/history`                 | 정적 | 이전 검증 결과 목록        |
| `/api/prompts`             | API  | POST: 프롬프트 저장        |
| `/api/results/[id]`        | API  | GET: 검증 결과 조회        |
| `/api/prompts/[id]/status` | API  | GET: 프롬프트 상태 조회    |

### /validate 슬래시 커맨드

`.claude/commands/validate.md`에 정의된 Claude Code 커맨드.
듀얼 에이전트 토론 모드로 `data/prompts/pending/`의 프롬프트를 평가한다.
Agent A(프롬프트 엔지니어) + Agent B(교육 평가 전문가)가 병렬 독립 평가 → 교차 검토 → 합의 조정자가 최종 결정.
결과를 `data/results/{id}.json`에 저장하며, 완료된 프롬프트를 `data/prompts/complete/`로 이동한다.

### 디렉토리 구조

```
app/
  api/prompts/route.ts          # POST 프롬프트 저장
  api/prompts/[id]/status/      # GET 상태 조회
  api/results/[id]/route.ts     # GET 결과 조회
  results/[id]/page.tsx         # 결과 상세 페이지
  history/page.tsx              # 히스토리 페이지
  page.tsx                      # 메인 (검증하기)
components/
  layout/header.tsx, footer.tsx # 레이아웃
  ui/                           # shadcn/ui (수정 금지)
  prompt-validator-form.tsx     # 폼 (use client)
  validation-result.tsx         # 결과 탭 - single/debate 분기 (use client)
  validation-pending.tsx        # 대기 상태
  score-badge.tsx               # 등급 뱃지
  rubric-score-card.tsx         # 루브릭 점수 카드 (compact 모드 지원)
  history-card.tsx              # 히스토리 카드 (evaluationMode 뱃지)
  consensus-score-card.tsx      # 합의 결과 카드 (debate 모드)
  debate-log.tsx                # 토론 로그 채팅 UI (debate 모드)
  agent-evaluation-panel.tsx    # 에이전트별 평가 패널 (debate 모드)
.claude/
  agents/evaluators/
    quiz-prompt-evaluator.md    # 공통 평가 기준
    prompt-engineer-evaluator.md # Agent A: 프롬프트 엔지니어링 관점
    education-evaluator.md      # Agent B: 교육 평가 전문가 관점
    consensus-moderator.md      # 합의 조정자 가이드
  agents/docs/
    prd-generator.md            # PRD 생성 에이전트
    notion-api-database-expert.md # Notion API 에이전트
lib/
  types.ts                      # 핵심 타입 정의 (듀얼 에이전트 타입 포함)
  schemas.ts                    # Zod 폼 검증 스키마
  rubrics.ts                    # 루브릭 기준 + 등급 계산
  data.ts                       # 파일시스템 CRUD
data/
  prompts/pending/{id}.json     # 대기 중 프롬프트 (.gitignore)
  prompts/complete/{id}.json    # 검증 완료 프롬프트 (.gitignore)
  results/{id}.json             # 검증 결과 데이터 (.gitignore)
  temp/{파일}.json              # 토론 중간 임시 파일 (.gitignore)
```

### 루트 레이아웃 구조 (`app/layout.tsx`)

```
ThemeProvider → TooltipProvider → Header + main + Footer + Toaster
```

Geist Sans / Geist Mono 폰트 사용, `lang="ko"` 설정.

## 코딩 컨벤션

### 일반 규칙

- 변수명/함수명: 영어 (camelCase)
- 컴포넌트명: PascalCase
- 파일명: kebab-case (컴포넌트 파일 포함)
- 코드 주석: 한국어
- 경로 alias: `@/*` (프로젝트 루트 기준)

### 컴포넌트 규칙

- 서버 컴포넌트 기본, 필요 시에만 `"use client"` 사용
- shadcn/ui 컴포넌트는 `components/ui/`에 위치, 직접 수정 금지
- 커스텀 컴포넌트는 `components/` 직하 또는 기능별 하위 디렉토리
- 레이아웃 컴포넌트(Header, Footer)는 `components/layout/`

### 스타일링 규칙

- Tailwind CSS v4 유틸리티 클래스 사용
- `cn()` 함수로 조건부 클래스 병합 (`lib/utils.ts`)
- CSS 변수 기반 테마 (`globals.css`), oklch 색상 체계

### 폼 규칙

- React Hook Form + Zod 스키마 조합
- `@hookform/resolvers`로 연결

## 환경 변수

현재 환경 변수 없음 (로컬 전용 도구).

## 개발 도구 및 설정

- **패키지 매니저**: npm
- **Node.js**: 20+
- **shadcn CLI**: `npx shadcn@latest add <component>` (컴포넌트 추가)
- **Prettier**: 코드 포맷팅

## 전용 에이전트 사용 규칙

작업 유형에 따라 반드시 해당 전용 에이전트(Task tool의 subagent_type)를 사용해야 합니다.

| 작업 유형                      | 전용 에이전트          | 비고                               |
| ------------------------------ | ---------------------- | ---------------------------------- |
| UI 컴포넌트 생성/수정 (마크업) | `ui-markup-specialist` | Tailwind + shadcn/ui 스타일링 전담 |
| 코드 구현 후 리뷰              | `code-reviewer`        | 구현 완료 후 자동 실행 권장        |
| PRD 작성                       | `prd-generator`        | 새 기능 요구사항 정리 시           |
| ROADMAP.md 갱신                | `development-planner`  | Task 완료/추가 시                  |
| 코드베이스 탐색                | `Explore`              | 3회 이상 검색이 필요한 탐색 작업   |
| 구현 계획 수립                 | `Plan`                 | 아키텍처 결정이 필요한 작업        |
| Git 커밋                       | `/commit` 스킬 사용    | Skill tool로 호출                  |
| 프롬프트 검증                  | `/validate` 스킬 사용  | Skill tool로 호출                  |

### 에이전트 사용 원칙

- 독립적인 작업은 **병렬로** 여러 에이전트를 동시 실행한다.
- UI 마크업 변경은 직접 수행하지 않고 반드시 `ui-markup-specialist`에 위임한다.
- 코드 구현이 완료되면 `code-reviewer`를 실행하여 품질을 검증한다.
- 단순 파일 읽기/검색은 에이전트 없이 Glob, Grep, Read 도구를 직접 사용한다.

---

## 문서 연동 규칙

프로젝트 문서는 4개 파일로 구성되며, 코드 변경 시 아래 테이블에 따라 관련 문서를 **반드시 함께 갱신**해야 합니다.

### 문서별 소유 범위

| 문서              | 진실의 원천                                     | 자동 로드              |
| ----------------- | ----------------------------------------------- | ---------------------- |
| `CLAUDE.md`       | 기술 스택, 명령어, 아키텍처, 코딩 컨벤션        | O (매 세션)            |
| `docs/PRD.md`     | 기능 명세, 데이터 모델, 루브릭 기준, 등급 기준  | X (필요 시 읽기)       |
| `docs/ROADMAP.md` | Phase/Task 계획, 진행 상태, 작업 워크플로우     | X (필요 시 읽기)       |
| `shrimp-rules.md` | AI 의사결정 기준, 금지 사항, 파일 상호작용 규칙 | X (Shrimp MCP 호출 시) |

### 변경 → 문서 갱신 트리거

| 코드 변경                       | 갱신할 문서                   |
| ------------------------------- | ----------------------------- |
| `package.json` 패키지 추가/삭제 | `CLAUDE.md` (기술 스택)       |
| `package.json` scripts 변경     | `CLAUDE.md` (명령어)          |
| `app/` 라우트 추가/삭제         | `CLAUDE.md` (라우팅 구조)     |
| `lib/types.ts` 데이터 모델 변경 | `docs/PRD.md` (데이터 모델)   |
| `lib/rubrics.ts` 루브릭 변경    | `docs/PRD.md` (루브릭 기준)   |
| Task 완료                       | `docs/ROADMAP.md` (완료 표시) |
| 새 Task 추가                    | `docs/ROADMAP.md` (Task 삽입) |
| 금지 사항/의사결정 규칙 변경    | `shrimp-rules.md`             |
| 파일 상호작용 규칙 변경         | `shrimp-rules.md`             |

---

## CLAUDE.md 유지 규칙

이 파일(`CLAUDE.md`)은 프로젝트의 **Single Source of Truth**이며, 아래 변경 사항 발생 시 반드시 CLAUDE.md도 함께 업데이트해야 합니다.

| 변경 사항                            | 갱신 대상 섹션                  |
| ------------------------------------ | ------------------------------- |
| 명령어(scripts) 추가/변경/삭제       | `명령어 (Scripts)`              |
| 기술 스택 또는 주요 패키지 추가/변경 | `기술 스택`                     |
| 아키텍처, 라우팅 구조 변경           | `아키텍처`                      |
| 환경 변수 추가/변경                  | `환경 변수`                     |
| 개발 도구 및 설정 변경               | `개발 도구 및 설정`             |
| 디렉토리 구조나 컨벤션 변경          | `디렉토리 구조` / `코딩 컨벤션` |

### 준수 원칙

- 코드 변경과 문서 갱신은 **동일 작업 단위**로 수행한다.
- CLAUDE.md 갱신을 누락한 채 커밋하지 않는다.
- 의심스러운 경우, CLAUDE.md를 먼저 확인하고 최신 상태인지 검증한 뒤 작업을 진행한다.

---

## Plan 모드 Accept 후 행동 규칙

Plan이 accept되면 **코드 구현에 들어가지 않는다.** 대신 다음 순서를 따른다:

1. `docs/PRD.md`가 없으면 → `prd-generator` 에이전트를 먼저 호출하여 PRD 생성
2. PRD가 준비되면 → `development-planner` 에이전트를 호출하여 ROADMAP 생성
3. ROADMAP 생성이 완료되면 **종료**. 결과 요약만 출력할 것

### 금지 사항

- 코드 파일 생성/수정
- 패키지 설치
- 빌드/서버 실행
- Task 자동 구현
