"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopyableCodeBlockProps {
  content: string;
  /** 상단바에 표시할 레이블 (기본값: "프롬프트") */
  label?: string;
}

export function CopyableCodeBlock({
  content,
  label = "프롬프트",
}: CopyableCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      {/* 상단바: 레이블(왼쪽) + 복사 버튼(오른쪽) */}
      <div className="flex items-center justify-between rounded-t-xl border-b border-border bg-muted/60 px-4 py-2">
        <span className="text-xs text-muted-foreground font-medium font-mono">
          {label}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-60 hover:opacity-100"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* 본문: 위쪽 모서리 제거 */}
      <div className="bg-muted rounded-b-xl p-6">
        <pre className="whitespace-pre-wrap text-sm leading-relaxed">
          {content}
        </pre>
      </div>
    </div>
  );
}
