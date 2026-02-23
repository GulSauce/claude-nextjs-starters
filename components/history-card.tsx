import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import { ScoreBadge } from "@/components/score-badge";
import type { ValidationResult } from "@/lib/types";

interface HistoryCardProps {
  result: ValidationResult;
  promptText: string;
}

export function HistoryCard({ result, promptText }: HistoryCardProps) {
  const preview =
    promptText.length > 100 ? promptText.slice(0, 100) + "..." : promptText;

  return (
    <Link href={`/results/${result.promptId}`} className="block">
      <Card className="transition-colors hover:border-foreground/20">
        <CardHeader>
          <div className="space-y-1">
            <CardTitle className="text-base">{result.targetModel}</CardTitle>
            <CardDescription>
              {format(new Date(result.validatedAt), "yyyy년 M월 d일 HH:mm", {
                locale: ko,
              })}
            </CardDescription>
          </div>
          <CardAction>
            <ScoreBadge grade={result.grade} totalScore={result.totalScore} />
          </CardAction>
        </CardHeader>
        <div className="px-6 pb-2">
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {preview}
          </p>
        </div>
      </Card>
    </Link>
  );
}
