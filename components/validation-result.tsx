"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScoreBadge } from "@/components/score-badge";
import { RubricScoreCard } from "@/components/rubric-score-card";
import { ConsensusScoreCard } from "@/components/consensus-score-card";
import { AgentEvaluationPanel } from "@/components/agent-evaluation-panel";
import { DebateLog } from "@/components/debate-log";
import { Badge } from "@/components/ui/badge";
import { CopyableCodeBlock } from "@/components/copyable-code-block";
import {
  Scale,
  Users,
  MessagesSquare,
  Sparkles,
  FileText,
  ClipboardCheck,
} from "lucide-react";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import type { ValidationResult as ValidationResultType } from "@/lib/types";
import type { Grade } from "@/lib/types";

// 등급별 SVG 게이지 stroke 색상 (oklch 값)
const gradeGaugeColorMap: Record<Grade, string> = {
  A: "oklch(0.55 0.18 145)",
  B: "oklch(0.55 0.18 245)",
  C: "oklch(0.65 0.18 85)",
  D: "oklch(0.60 0.18 50)",
  F: "oklch(0.55 0.22 25)",
};

interface ValidationResultProps {
  result: ValidationResultType;
  promptText: string;
}

export function ValidationResult({
  result,
  promptText,
}: ValidationResultProps) {
  const isDebateMode = result.evaluationMode === "debate";

  return (
    <div className="space-y-8">
      {/* 헤더: SVG 원형 게이지 + 등급 + 모드 뱃지 + 종합 피드백 */}
      <div className="space-y-4">
        <div className="flex items-center gap-6">
          {/* SVG 원형 게이지 — 100x100 viewBox, radius=42, circumference≈264 */}
          <div className="relative inline-flex shrink-0 items-center justify-center">
            <svg
              width="100"
              height="100"
              viewBox="0 0 100 100"
              aria-label={`총점 ${result.totalScore}점, 등급 ${result.grade}`}
              role="img"
            >
              {/* 배경 트랙 원 */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted"
              />
              {/* 점수 채움 원 — 애니메이션 적용 */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={gradeGaugeColorMap[result.grade]}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * result.totalScore) / 100}
                transform="rotate(-90 50 50)"
                className="animate-gauge-fill"
                style={
                  { "--gauge-circumference": "264" } as React.CSSProperties
                }
              />
            </svg>
            {/* 중앙 텍스트: 점수 + 등급 뱃지 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
              <span className="font-mono text-3xl font-bold leading-none tabular-nums">
                {result.totalScore}
              </span>
              <ScoreBadge grade={result.grade} />
            </div>
          </div>

          {/* 우측: / 100점 + Debate 뱃지 */}
          <div className="flex flex-col gap-1.5">
            <span className="text-muted-foreground text-sm">/ 100점</span>
            {isDebateMode && (
              <Badge variant="secondary" className="w-fit text-xs">
                Debate
              </Badge>
            )}
          </div>
        </div>
        <MarkdownRenderer
          content={result.overallFeedback}
          size="base"
          className="text-muted-foreground"
        />
      </div>

      {/* 탭 UI: debate 모드 5탭 / single 모드 3탭 */}
      {isDebateMode ? (
        <Tabs defaultValue="consensus">
          <TabsList className="w-full overflow-x-auto">
            {/* 합의 결과 탭 */}
            <TabsTrigger value="consensus">
              <Scale className="mr-1.5 inline h-4 w-4" />
              합의 결과
            </TabsTrigger>
            {/* 에이전트별 평가 탭 */}
            <TabsTrigger value="agent-evaluations">
              <Users className="mr-1.5 inline h-4 w-4" />
              에이전트별 평가
            </TabsTrigger>
            {/* 토론 로그 탭 */}
            <TabsTrigger value="debate-log">
              <MessagesSquare className="mr-1.5 inline h-4 w-4" />
              토론 로그
            </TabsTrigger>
            {/* 개선된 프롬프트 탭 */}
            <TabsTrigger value="improved">
              <Sparkles className="mr-1.5 inline h-4 w-4" />
              개선된 프롬프트
            </TabsTrigger>
            {/* 원본 프롬프트 탭 */}
            <TabsTrigger value="original">
              <FileText className="mr-1.5 inline h-4 w-4" />
              원본 프롬프트
            </TabsTrigger>
          </TabsList>

          {/* 탭 1: 합의 결과 */}
          <TabsContent value="consensus" className="animate-fade-in mt-4">
            {result.agentEvaluations && result.consensusSummary ? (
              <ConsensusScoreCard
                totalScore={result.totalScore}
                grade={result.grade}
                rubricScores={result.rubricScores}
                agentEvaluations={result.agentEvaluations}
                consensusSummary={result.consensusSummary}
              />
            ) : (
              <div className="grid gap-4">
                {result.rubricScores.map((score) => (
                  <RubricScoreCard
                    key={score.criterionId}
                    rubricScore={score}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* 탭 2: 에이전트별 평가 */}
          <TabsContent
            value="agent-evaluations"
            className="animate-fade-in mt-4"
          >
            {result.agentEvaluations ? (
              <AgentEvaluationPanel
                agentEvaluations={result.agentEvaluations}
              />
            ) : (
              <p className="text-muted-foreground text-sm">
                에이전트별 평가 데이터가 없습니다.
              </p>
            )}
          </TabsContent>

          {/* 탭 3: 토론 로그 */}
          <TabsContent value="debate-log" className="animate-fade-in mt-4">
            {result.debateRounds && result.debateLog ? (
              <DebateLog
                debateRounds={result.debateRounds}
                debateLog={result.debateLog}
              />
            ) : (
              <p className="text-muted-foreground text-sm">
                토론 로그 데이터가 없습니다.
              </p>
            )}
          </TabsContent>

          {/* 탭 4: 개선된 프롬프트 */}
          <TabsContent value="improved" className="animate-fade-in mt-4">
            <CopyableCodeBlock content={result.improvedPrompt} />
          </TabsContent>

          {/* 탭 5: 원본 프롬프트 */}
          <TabsContent value="original" className="animate-fade-in mt-4">
            <CopyableCodeBlock content={promptText} />
          </TabsContent>
        </Tabs>
      ) : (
        <Tabs defaultValue="rubric-scores">
          <TabsList className="w-full overflow-x-auto">
            {/* 항목별 점수 탭 */}
            <TabsTrigger value="rubric-scores">
              <ClipboardCheck className="mr-1.5 inline h-4 w-4" />
              항목별 점수
            </TabsTrigger>
            {/* 개선된 프롬프트 탭 */}
            <TabsTrigger value="improved">
              <Sparkles className="mr-1.5 inline h-4 w-4" />
              개선된 프롬프트
            </TabsTrigger>
            {/* 원본 프롬프트 탭 */}
            <TabsTrigger value="original">
              <FileText className="mr-1.5 inline h-4 w-4" />
              원본 프롬프트
            </TabsTrigger>
          </TabsList>

          {/* 탭 1: 항목별 점수 */}
          <TabsContent value="rubric-scores" className="animate-fade-in mt-4">
            <div className="grid gap-4">
              {result.rubricScores.map((score) => (
                <RubricScoreCard key={score.criterionId} rubricScore={score} />
              ))}
            </div>
          </TabsContent>

          {/* 탭 2: 개선된 프롬프트 */}
          <TabsContent value="improved" className="animate-fade-in mt-4">
            <CopyableCodeBlock content={result.improvedPrompt} />
          </TabsContent>

          {/* 탭 3: 원본 프롬프트 */}
          <TabsContent value="original" className="animate-fade-in mt-4">
            <CopyableCodeBlock content={promptText} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
