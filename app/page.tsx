import {
  ArrowRight,
  Blocks,
  Moon,
  Paintbrush,
  Route,
  Smartphone,
  FileCode2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Route,
    title: "App Router",
    description:
      "Next.js 16의 App Router로 파일 기반 라우팅과 서버 컴포넌트를 활용합니다.",
  },
  {
    icon: Paintbrush,
    title: "Tailwind CSS v4",
    description: "최신 Tailwind CSS v4로 빠르고 일관된 스타일링을 구현합니다.",
  },
  {
    icon: Blocks,
    title: "shadcn/ui",
    description:
      "20개 이상의 접근성 높은 UI 컴포넌트가 사전 구성되어 있습니다.",
  },
  {
    icon: Moon,
    title: "다크 모드",
    description:
      "next-themes 기반의 라이트/다크/시스템 테마 전환을 지원합니다.",
  },
  {
    icon: Smartphone,
    title: "반응형 디자인",
    description:
      "모바일 퍼스트 설계로 모든 디바이스에서 최적의 경험을 제공합니다.",
  },
  {
    icon: FileCode2,
    title: "TypeScript",
    description: "완전한 타입 안전성으로 개발 생산성과 코드 품질을 높입니다.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero 섹션 */}
      <section className="flex flex-col items-center justify-center gap-6 px-4 py-24 text-center sm:px-6 md:py-32">
        <Badge variant="secondary" className="gap-1.5 px-3 py-1">
          <span className="text-muted-foreground">v1.0</span>
          프로덕션 레디 스타터킷
        </Badge>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          더 빠르게 시작하는
          <br />
          <span className="text-primary/80">모던 웹 개발</span>
        </h1>

        <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
          Next.js 16, React 19, Tailwind CSS v4, shadcn/ui가 완벽하게 통합된
          스타터킷으로 프로젝트를 즉시 시작하세요.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <a href="#getting-started">
              시작하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub에서 보기
            </a>
          </Button>
        </div>
      </section>

      {/* Features 섹션 */}
      <section id="features" className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              주요 기능
            </h2>
            <p className="text-muted-foreground mt-3 text-lg">
              프로덕션 환경에서 검증된 기술 스택을 미리 구성했습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="transition-colors hover:border-foreground/20"
              >
                <CardHeader>
                  <feature.icon className="text-primary/80 mb-2 h-8 w-8" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section id="getting-started" className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            지금 바로 시작하세요
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">
            아래 명령어로 프로젝트를 클론하고 개발을 시작할 수 있습니다.
          </p>

          <div className="bg-muted mt-8 rounded-lg p-6 text-left">
            <code className="text-sm leading-loose sm:text-base">
              <span className="text-muted-foreground"># 프로젝트 클론</span>
              <br />
              <span className="text-primary">$</span> git clone
              https://github.com/your-repo/starter-kit.git
              <br />
              <span className="text-primary">$</span> cd starter-kit
              <br />
              <br />
              <span className="text-muted-foreground">
                # 의존성 설치 및 실행
              </span>
              <br />
              <span className="text-primary">$</span> npm install
              <br />
              <span className="text-primary">$</span> npm run dev
            </code>
          </div>

          <p className="text-muted-foreground mt-6 text-sm">
            이 스타터킷을 기반으로 자유롭게 커스터마이징하세요.
          </p>
        </div>
      </section>
    </div>
  );
}
