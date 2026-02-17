# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Next.js 16 기반 모던 웹 스타터킷. shadcn/ui 컴포넌트가 사전 구성된 프로덕션 레디 템플릿.

## 주요 명령어

```bash
npm run dev       # 개발 서버 (http://localhost:3000)
npm run build     # 프로덕션 빌드
npm run start     # 빌드된 앱 실행
npm run lint      # ESLint 실행
```

## 기술 스택

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (PostCSS 플러그인 방식, `@import "tailwindcss"`)
- **shadcn/ui** (New York 스타일, Radix UI 기반, 26개 컴포넌트 사전 구성)
- **next-themes** (라이트/다크/시스템 테마)
- **react-hook-form** + **zod** (폼 + 밸리데이션)
- **lucide-react** (아이콘)
- **sonner** (토스트 알림)

## 아키텍처

### 레이아웃 계층

```
app/layout.tsx (RootLayout)
  └── ThemeProvider (next-themes)
      └── TooltipProvider (shadcn/ui)
          ├── Header (sticky, 반응형 네비게이션)
          ├── {children} (페이지 콘텐츠)
          ├── Footer
          └── Toaster (sonner)
```

- HTML `lang="ko"`, 메타데이터 한국어
- 폰트: Geist Sans + Geist Mono (next/font/google)

### 디렉토리 구조

- `app/` - App Router 페이지 및 레이아웃
- `components/layout/` - Header, Footer 등 레이아웃 컴포넌트
- `components/providers/` - ThemeProvider 등 컨텍스트 래퍼
- `components/ui/` - shadcn/ui 컴포넌트 (직접 수정 가능)
- `lib/utils.ts` - `cn()` 유틸리티 (clsx + tailwind-merge)

### 경로 별칭

`@/*` → 프로젝트 루트 (`./`) 기준. 예: `import { Button } from "@/components/ui/button"`

## 스타일링 패턴

- **globals.css**: Tailwind v4 import + OKLCH 기반 CSS 변수 (라이트/다크 모드)
- **컴포넌트 변형**: CVA(class-variance-authority)로 variant/size 정의
- **클래스 병합**: `cn()` 함수로 Tailwind 클래스 충돌 해결
- **data-slot 속성**: 컴포넌트 식별용 마크업 패턴

## shadcn/ui 컴포넌트 추가

```bash
npx shadcn@latest add [component-name]
```

설정은 `components.json`에 정의. 컴포넌트는 `components/ui/`에 생성되며 직접 수정 가능.
