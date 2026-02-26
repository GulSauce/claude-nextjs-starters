"use client";

// 마크다운 텍스트를 HTML로 렌더링하는 공통 컴포넌트
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
  /** 텍스트 크기: sm(기본) 또는 base */
  size?: "sm" | "base";
}

export function MarkdownRenderer({
  content,
  className,
  size = "sm",
}: MarkdownRendererProps) {
  if (!content.trim()) return null;

  return (
    <div
      className={cn(
        "prose dark:prose-invert max-w-none",
        size === "sm" ? "prose-sm" : "prose-base",
        // 간격 축소
        "prose-p:my-1 prose-ul:my-1 prose-ol:my-1",
        "prose-li:my-0.5",
        "prose-headings:mt-3 prose-headings:mb-1",
        className,
      )}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
