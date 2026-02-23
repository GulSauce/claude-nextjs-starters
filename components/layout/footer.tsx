import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Separator className="mb-6" />
        <div className="text-muted-foreground flex flex-col items-center justify-between gap-2 text-sm sm:flex-row">
          <p>&copy; {new Date().getFullYear()} 퀴즈 프롬프트 검증기</p>
          <p>
            Built with{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground underline underline-offset-4"
            >
              Next.js
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
