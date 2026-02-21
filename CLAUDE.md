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
- **shadcn/ui** (New York 스타일, Radix UI 기반, 21개 컴포넌트 사전 구성)
- **next-themes** (라이트/다크/시스템 테마)
- **react-hook-form** + **zod** + **@hookform/resolvers** (폼 + 밸리데이션)
- **lucide-react** (아이콘), **sonner** (토스트 알림)
- **date-fns** (날짜 유틸리티), **tw-animate-css** (애니메이션)
- **prettier** (코드 포맷터, devDependency)

## 아키텍처

### 레이아웃 계층

```
app/layout.tsx (RootLayout, 서버 컴포넌트)
  └── ThemeProvider (next-themes, "use client")
      └── TooltipProvider (shadcn/ui)
          ├── Header (sticky, 반응형 네비게이션)
          ├── main.flex-1 > {children}
          ├── Footer
          └── Toaster (sonner)
```

- HTML `lang="ko"`, `suppressHydrationWarning` (next-themes 필수)
- 폰트: Geist Sans + Geist Mono (`next/font/google`)

### 디렉토리 구조

- `app/` - App Router 페이지 및 레이아웃 (서버 컴포넌트 기본)
- `components/layout/` - Header, Footer 등 레이아웃 컴포넌트
- `components/providers/` - ThemeProvider 등 클라이언트 컨텍스트 래퍼
- `components/ui/` - shadcn/ui 컴포넌트 (직접 수정 가능)
- `lib/utils.ts` - `cn()` 유틸리티 (clsx + tailwind-merge)
- `lib/nav-items.ts` - 네비게이션 항목 정의 (`{ href, label }[]`)
- `lib/site-config.ts` - 사이트 설정 (GitHub URL 등)

### 경로 별칭

`@/*` → 프로젝트 루트 (`./`) 기준. 예: `import { Button } from "@/components/ui/button"`

## 코딩 컨벤션

### 서버/클라이언트 컴포넌트 분리

- **기본은 서버 컴포넌트** (별도 지시어 없음)
- 클라이언트 컴포넌트 필요 시 파일 최상단에 `"use client"` 명시
- `"use client"` 필요한 경우: 이벤트 핸들러, useState/useEffect, 브라우저 API, next-themes 등

### 컴포넌트 작성 패턴

```tsx
// 타입: React.ComponentProps<> 확장
function MyComponent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="my-component" // 컴포넌트 식별용
      className={cn("기본-클래스", className)} // cn()으로 클래스 병합
      {...props}
    />
  );
}
```

### CVA variant 패턴 (Button 등)

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const myVariants = cva("기본-클래스", {
  variants: {
    variant: { default: "...", secondary: "..." },
    size: { default: "...", sm: "..." },
  },
  defaultVariants: { variant: "default", size: "default" },
});

// 타입: React.ComponentProps<> & VariantProps<>
function MyComp({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof myVariants>) {
  return (
    <div className={cn(myVariants({ variant, size, className }))} {...props} />
  );
}
```

### asChild / Slot 패턴

```tsx
import { Slot } from "radix-ui";
const Comp = asChild ? Slot.Root : "button";
```

## 스타일링 규칙

### Tailwind CSS v4 주의사항

- **`tailwind.config.js` 미사용** — 모든 테마 설정은 `globals.css`의 `@theme inline {}` 블록에서 정의
- `@import "tailwindcss"` + `@import "tw-animate-css"` + `@import "shadcn/tailwind.css"`
- 다크모드: `@custom-variant dark (&:is(.dark *))` — 클래스 기반

### OKLCH 색상 체계

`globals.css`의 `:root` / `.dark`에 CSS 변수로 정의. 주요 의미론적 변수:

| 변수                                     | 용도                |
| ---------------------------------------- | ------------------- |
| `--background` / `--foreground`          | 페이지 배경/텍스트  |
| `--primary` / `--primary-foreground`     | 주요 액션 (버튼 등) |
| `--secondary` / `--secondary-foreground` | 보조 액션           |
| `--muted` / `--muted-foreground`         | 비활성/보조 텍스트  |
| `--accent` / `--accent-foreground`       | 강조 (hover 등)     |
| `--destructive`                          | 삭제/에러 액션      |
| `--border`, `--input`, `--ring`          | 테두리/입력/포커스  |
| `--card` / `--popover`                   | 카드/팝오버 배경    |

Tailwind에서 사용: `bg-primary`, `text-muted-foreground`, `border-border` 등

### 반응형 브레이크포인트

`sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`, `2xl:1536px` (Tailwind 기본값)

## 사용 가능한 shadcn/ui 컴포넌트

21개 파일이 `components/ui/`에 설치됨:

alert, alert-dialog, avatar, badge, button, card, checkbox, dialog, dropdown-menu, form, input, label, select, separator, sheet, skeleton, sonner, switch, tabs, textarea, tooltip

추가 설치: `npx shadcn@latest add [component-name]` (설정: `components.json`)

## 주요 개발 패턴

### 새 페이지 추가

```
app/새경로/page.tsx    // 서버 컴포넌트 (기본)
```

네비게이션에 추가하려면 `lib/nav-items.ts`의 `navItems` 배열에 항목 추가.

### 폼 작성 패턴

```tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({ name: z.string().min(1, "필수 입력") });

function MyForm() {
  const form = useForm({ resolver: zodResolver(schema) });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이름</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">제출</Button>
      </form>
    </Form>
  );
}
```

## 주의사항

- `html` 태그의 `suppressHydrationWarning`은 next-themes 필수 — 제거 금지
- shadcn/ui 컴포넌트 직접 수정 가능하나 `data-slot` 속성 패턴 유지
- `radix-ui` 패키지에서 직접 import (`@radix-ui/*` 아닌 `radix-ui`)
