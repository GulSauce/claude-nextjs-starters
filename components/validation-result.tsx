"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScoreBadge } from "@/components/score-badge";
import { RubricScoreCard } from "@/components/rubric-score-card";
import { ConsensusScoreCard } from "@/components/consensus-score-card";
import { AgentEvaluationPanel } from "@/components/agent-evaluation-panel";
import { DebateLog } from "@/components/debate-log";
import { Badge } from "@/components/ui/badge";
import { CopyableCodeBlock } from "@/components/copyable-code-block";
import type { ValidationResult as ValidationResultType } from "@/lib/types";

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
      {/* 헤더: 총점 + 등급 + 모드 뱃지 + 종합 피드백 */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-4xl font-bold">{result.totalScore}</span>
          <ScoreBadge grade={result.grade} />
          <span className="text-muted-foreground text-sm">/ 100점</span>
          {isDebateMode && (
            <Badge variant="secondary" className="text-xs">
              Debate
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">{result.overallFeedback}</p>
      </div>

      {/* 탭 UI: debate 모드 5탭 / single 모드 3탭 */}
      {isDebateMode ? (
        <Tabs defaultValue="consensus">
          <TabsList className="w-full overflow-x-auto">
            <TabsTrigger value="consensus">합의 결과</TabsTrigger>
            <TabsTrigger value="agent-evaluations">에이전트별 평가</TabsTrigger>
            <TabsTrigger value="debate-log">토론 로그</TabsTrigger>
            <TabsTrigger value="improved">개선된 프롬프트</TabsTrigger>
            <TabsTrigger value="original">원본 프롬프트</TabsTrigger>
          </TabsList>

          {/* 탭 1: 합의 결과 */}
          <TabsContent value="consensus" className="mt-4">
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
          <TabsContent value="agent-evaluations" className="mt-4">
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
          <TabsContent value="debate-log" className="mt-4">
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
          <TabsContent value="improved" className="mt-4">
            <CopyableCodeBlock content={result.improvedPrompt} />
          </TabsContent>

          {/* 탭 5: 원본 프롬프트 */}
          <TabsContent value="original" className="mt-4">
            <CopyableCodeBlock content={promptText} />
          </TabsContent>
        </Tabs>
      ) : (
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
            <CopyableCodeBlock content={result.improvedPrompt} />
          </TabsContent>

          {/* 탭 3: 원본 프롬프트 */}
          <TabsContent value="original" className="mt-4">
            <CopyableCodeBlock content={promptText} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
