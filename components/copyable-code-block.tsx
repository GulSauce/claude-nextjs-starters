"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopyableCodeBlockProps {
  content: string;
}

export function CopyableCodeBlock({ content }: CopyableCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-muted relative rounded-lg p-6">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-3 right-3 h-8 w-8 opacity-60 hover:opacity-100"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
      <pre className="whitespace-pre-wrap pr-10 text-sm leading-relaxed">
        {content}
      </pre>
    </div>
  );
}
