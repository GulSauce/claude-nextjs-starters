"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScoreBadge } from "@/components/score-badge";
import { RubricScoreCard } from "@/components/rubric-score-card";
import type { ValidationResult as ValidationResultType } from "@/lib/types";

interface ValidationResultProps {
  result: ValidationResultType;
  promptText: string;
}

export function ValidationResult({
  result,
  promptText,
}: ValidationResultProps) {
  return (
    <div className="space-y-8">
      {/* 헤더: 총점 + 등급 + 종합 피드백 */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-4xl font-bold">{result.totalScore}</span>
          <ScoreBadge grade={result.grade} />
          <span className="text-muted-foreground text-sm">/ 100점</span>
        </div>
        <p className="text-muted-foreground">{result.overallFeedback}</p>
      </div>

      {/* 탭 UI */}
      <Tabs defaultValue="rubric-scores">
        <TabsList className="w-full overflow-x-auto">
          <TabsTrigger value="rubric-scores">항목별 점수</TabsTrigger>
          <TabsTrigger value="improved">개선된 프롬프트</TabsTrigger>
          <TabsTrigger value="original">원본 프롬프트</TabsTrigger>
        </TabsList>

        {/* 탭 1: 항목별 점수 */}
        <TabsContent value="rubric-scores" className="mt-4">
          <div className="grid gap-4">
            {result.rubricScores.map((score) => (
              <RubricScoreCard key={score.criterionId} rubricScore={score} />
            ))}
          </div>
        </TabsContent>

        {/* 탭 2: 개선된 프롬프트 */}
        <TabsContent value="improved" className="mt-4">
          <div className="bg-muted rounded-lg p-6">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed">
              {result.improvedPrompt}
            </pre>
          </div>
        </TabsContent>

        {/* 탭 3: 원본 프롬프트 */}
        <TabsContent value="original" className="mt-4">
          <div className="bg-muted rounded-lg p-6">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed">
              {promptText}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
