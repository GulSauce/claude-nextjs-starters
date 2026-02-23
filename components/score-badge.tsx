import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Grade } from "@/lib/types";

const gradeColorMap: Record<Grade, string> = {
  A: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  B: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  C: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  D: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  F: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

interface ScoreBadgeProps {
  grade: Grade;
  totalScore?: number;
}

export function ScoreBadge({ grade, totalScore }: ScoreBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent text-sm font-semibold",
        gradeColorMap[grade],
      )}
    >
      {totalScore !== undefined ? `${grade} (${totalScore}점)` : grade}
    </Badge>
  );
}
