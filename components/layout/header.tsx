import Link from "next/link";
import { Github, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";
import { navItems } from "@/lib/nav-items";
import { siteConfig } from "@/lib/site-config";

export function Header() {
  return (
    <header className="bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* 로고 + 모바일 네비 */}
        <div className="flex items-center gap-2">
          <MobileNav />
          <Link href="/" className="text-xl font-bold tracking-tight">
            Starter<span className="text-primary/60">Kit</span>
          </Link>
        </div>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 액션 버튼 */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button variant="ghost" size="icon" asChild>
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
          <Button variant="default" size="sm" asChild>
            <Link href="/login">
              <LogIn className="h-4 w-4" />
              로그인
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
