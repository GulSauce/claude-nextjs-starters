import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { RubricScore } from "@/lib/types";

interface RubricScoreCardProps {
  rubricScore: RubricScore;
}

export function RubricScoreCard({ rubricScore }: RubricScoreCardProps) {
  const ratio = rubricScore.score / rubricScore.maxScore;
  const ratioColor =
    ratio >= 0.8
      ? "text-green-600 dark:text-green-400"
      : ratio >= 0.6
        ? "text-yellow-600 dark:text-yellow-400"
        : "text-red-600 dark:text-red-400";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{rubricScore.criterionName}</CardTitle>
        <CardAction>
          <span className={cn("text-lg font-bold", ratioColor)}>
            {rubricScore.score}/{rubricScore.maxScore}
          </span>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* 프로그레스 바 */}
        <div className="bg-muted h-2 overflow-hidden rounded-full">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              ratio >= 0.8
                ? "bg-green-500"
                : ratio >= 0.6
                  ? "bg-yellow-500"
                  : "bg-red-500",
            )}
            style={{ width: `${ratio * 100}%` }}
          />
        </div>

        {/* 피드백 */}
        <div>
          <p className="text-muted-foreground text-sm font-medium">피드백</p>
          <p className="text-sm">{rubricScore.feedback}</p>
        </div>

        {/* 개선 제안 */}
        <div>
          <p className="text-muted-foreground text-sm font-medium">개선 제안</p>
          <p className="text-sm">{rubricScore.suggestion}</p>
        </div>
      </CardContent>
    </Card>
  );
}
