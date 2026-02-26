# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> 제품 요구사항(기능 명세, 데이터 모델, 루브릭 기준)은 `docs/PRD.md` 참조.
> 개발 계획(Phase/Task, 진행 상태)은 `docs/roadmaps/ROADMAP_v*.md` 참조 (`[COMP]` 접두사 없는 파일이 활성).

## 프로젝트 개요

→ 상세: `docs/PRD.md` > 핵심 정보

AI 메타프롬프트의 품질을 로컬에서 자동 평가하여 점수와 개선안을 제공하는 도구 (로컬 전용, 1인 개발자 대상).

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
- **마크다운 렌더링**: react-markdown + @tailwindcss/typography
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
   Phase 2.5: 개선 프롬프트 교차 검토 (서로의 improvedPrompt를 검토)
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
Agent A(프롬프트 엔지니어) + Agent B(교육 평가 전문가)가 병렬 독립 평가 → 교차 검토 → 개선 프롬프트 교차 검토 → 합의 조정자가 최종 결정.
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
  markdown-renderer.tsx          # 마크다운 렌더링 공통 컴포넌트
  consensus-score-card.tsx      # 합의 결과 카드 (debate 모드)
  debate-log.tsx                # 토론 로그 채팅 UI (debate 모드)
  agent-evaluation-panel.tsx    # 에이전트별 평가 패널 (debate 모드)
.claude/
  agents/evaluators/            # 평가 에이전트 프롬프트
  agents/docs/                  # 문서 생성 에이전트 프롬프트
  rules/                        # 모듈형 규칙 파일
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

## 환경 변수

현재 환경 변수 없음 (로컬 전용 도구).

## 개발 도구 및 설정

- **패키지 매니저**: npm
- **Node.js**: 20+
- **shadcn CLI**: `npx shadcn@latest add <component>` (컴포넌트 추가)
- **Prettier**: 코드 포맷팅
