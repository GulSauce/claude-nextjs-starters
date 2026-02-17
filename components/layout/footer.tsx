import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const techStack = ["Next.js 16", "React 19", "Tailwind v4", "shadcn/ui", "TypeScript"];

const links = [
  { href: "https://nextjs.org/docs", label: "Next.js Docs" },
  { href: "https://ui.shadcn.com", label: "shadcn/ui" },
  { href: "https://tailwindcss.com", label: "Tailwind CSS" },
];

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* 소개 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">StarterKit</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Next.js 기반의 모던 웹 스타터킷입니다. 프로덕션 레디 컴포넌트와 최적화된 개발 환경을 제공합니다.
            </p>
          </div>

          {/* 유용한 링크 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">링크</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 기술 스택 */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">기술 스택</h3>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-muted-foreground flex flex-col items-center justify-between gap-2 text-sm sm:flex-row">
          <p>&copy; {new Date().getFullYear()} StarterKit. All rights reserved.</p>
          <p>
            Built with{" "}
            <Link href="https://nextjs.org" className="hover:text-foreground underline underline-offset-4">
              Next.js
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
