# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> 제품 요구사항(기능 명세, 데이터 모델, 루브릭 기준)은 `docs/PRD.md` 참조.
> 개발 계획(Phase/Task, 진행 상태)은 `docs/ROADMAP.md` 참조.

## 프로젝트 개요

→ 상세: `docs/PRD.md` > 핵심 정보

AI 메타프롬프트의 품질을 로컬에서 자동 평가하여 점수와 개선안을 제공하는 도구 (로컬 전용, 1인 개발자 대상).

**현재 상태**: MVP 구현 완료. 프롬프트 입력 → API 저장 → /validate 커맨드 평가 → 결과 조회 전체 플로우 동작.

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
2. API: data/prompts/{id}.json 저장 (status: "pending")
3. 리다이렉트: /results/{id} (대기 상태)
4. Claude Code: /validate 커맨드 → 루브릭 평가 → data/results/{id}.json 생성
5. 새로고침: 결과 상세 페이지 (점수/피드백/개선 프롬프트)
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
`data/prompts/`에서 `status: "pending"` 프롬프트를 찾아 7개 루브릭 기준으로 평가하고 `data/results/{id}.json`에 결과를 저장한다.

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
  validation-result.tsx         # 결과 탭 (use client)
  validation-pending.tsx        # 대기 상태
  score-badge.tsx               # 등급 뱃지
  rubric-score-card.tsx         # 루브릭 점수 카드
  history-card.tsx              # 히스토리 카드
lib/
  types.ts                      # 핵심 타입 정의
  schemas.ts                    # Zod 폼 검증 스키마
  rubrics.ts                    # 루브릭 기준 + 등급 계산
  data.ts                       # 파일시스템 CRUD
data/
  prompts/{id}.json             # 프롬프트 데이터 (.gitignore)
  results/{id}.json             # 검증 결과 데이터 (.gitignore)
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
