"use client";

// 듀얼 에이전트 토론 평가의 합의 결과를 보여주는 카드 컴포넌트

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScoreBadge } from "@/components/score-badge";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import type { Grade, RubricScore, AgentEvaluation } from "@/lib/types";

// 에이전트 역할 한국어 라벨
const agentRoleLabel: Record<string, string> = {
  "prompt-engineer": "프롬프트 엔지니어",
  "education-evaluator": "교육 평가 전문가",
  "consensus-moderator": "합의 조정자",
};

interface ConsensusScoreCardProps {
  totalScore: number;
  grade: Grade;
  rubricScores: RubricScore[]; // 합의 점수
  agentEvaluations: AgentEvaluation[]; // Agent A, B 개별 평가
  consensusSummary: string;
}

export function ConsensusScoreCard({
  totalScore,
  grade,
  rubricScores,
  agentEvaluations,
  consensusSummary,
}: ConsensusScoreCardProps) {
  // Agent A: prompt-engineer, Agent B: education-evaluator 순서로 매핑
  const agentA = agentEvaluations.find(
    (e) => e.agentRole === "prompt-engineer",
  );
  const agentB = agentEvaluations.find(
    (e) => e.agentRole === "education-evaluator",
  );

  // 수평 바 차트 데이터 구성 — CSS 변수 기반 인라인 스타일 사용
  const barChartItems = [
    {
      label: agentRoleLabel["prompt-engineer"],
      score: agentA?.totalScore ?? 0,
      barStyle: { backgroundColor: "var(--agent-a)" } as React.CSSProperties,
    },
    {
      label: agentRoleLabel["education-evaluator"],
      score: agentB?.totalScore ?? 0,
      barStyle: { backgroundColor: "var(--agent-b)" } as React.CSSProperties,
    },
    {
      label: "합의",
      score: totalScore,
      barStyle: {
        backgroundColor: "var(--agent-consensus)",
      } as React.CSSProperties,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── 1. 합의 최종 점수 + 등급 뱃지 ── */}
      <Card>
        <CardHeader>
          <CardTitle>합의 최종 평가</CardTitle>
          <CardDescription>
            두 에이전트의 토론을 통해 도출된 최종 합의 점수입니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3">
            {/* 큰 글씨 합의 점수 */}
            <span className="text-5xl font-bold tabular-nums">
              {totalScore}
            </span>
            <span className="text-muted-foreground mb-1 text-xl">/100점</span>
            {/* 등급 뱃지 */}
            <div className="mb-1 ml-2">
              <ScoreBadge grade={grade} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 2. Agent A/B 점수 비교 바 차트 ── */}
      <Card>
        <CardHeader>
          <CardTitle>에이전트별 점수 비교</CardTitle>
          <CardDescription>
            각 에이전트의 독립 평가 점수와 합의 점수를 비교합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {barChartItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              {/* 라벨 */}
              <span className="text-muted-foreground w-36 shrink-0 text-right text-sm">
                {item.label}
              </span>
              {/* 바 트랙 — relative로 내부 레이블 포지셔닝 */}
              <div className="bg-muted relative h-7 flex-1 overflow-hidden rounded-full">
                <div
                  className="animate-bar-grow h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.score}%`,
                    ...item.barStyle,
                  }}
                  role="progressbar"
                  aria-valuenow={item.score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${item.label} 점수 ${item.score}점`}
                >
                  {/* 점수 15 이상일 때만 바 내부에 점수 표시 */}
                  {item.score >= 15 && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-white">
                      {item.score}
                    </span>
                  )}
                </div>
              </div>
              {/* 점수 */}
              <span className="w-14 shrink-0 text-sm font-semibold tabular-nums">
                {item.score}/100
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── 3. 루브릭 항목별 3자 비교 테이블 ── */}
      <Card>
        <CardHeader>
          <CardTitle>루브릭 항목별 점수 비교</CardTitle>
          <CardDescription>
            항목별 Agent A · B · 합의 점수를 비교합니다. 3점 이상 차이가 있는
            항목은 강조 표시됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 모바일에서 수평 스크롤 */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-muted-foreground py-2 pr-4 text-left font-medium">
                    항목
                  </th>
                  <th className="text-muted-foreground px-3 py-2 text-center font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      {/* Agent A 색상 dot — CSS 변수 사용 */}
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: "var(--agent-a)" }}
                      />
                      Agent A
                    </span>
                  </th>
                  <th className="text-muted-foreground px-3 py-2 text-center font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      {/* Agent B 색상 dot — CSS 변수 사용 */}
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: "var(--agent-b)" }}
                      />
                      Agent B
                    </span>
                  </th>
                  <th className="text-muted-foreground px-3 py-2 text-center font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      {/* 합의 색상 dot — CSS 변수 사용 */}
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: "var(--agent-consensus)" }}
                      />
                      합의
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rubricScores.map((consensus) => {
                  // Agent A, B에서 동일 criterionId 항목 추출
                  const scoreA = agentA?.rubricScores.find(
                    (s) => s.criterionId === consensus.criterionId,
                  );
                  const scoreB = agentB?.rubricScores.find(
                    (s) => s.criterionId === consensus.criterionId,
                  );

                  const rawA = scoreA?.score ?? 0;
                  const rawB = scoreB?.score ?? 0;
                  const rawConsensus = consensus.score;
                  const max = consensus.maxScore;

                  // 3점 이상 차이 여부 계산
                  const diffAB = Math.abs(rawA - rawB);
                  const diffAConsensus = Math.abs(rawA - rawConsensus);
                  const diffBConsensus = Math.abs(rawB - rawConsensus);

                  const highlightA = diffAB >= 3 || diffAConsensus >= 3;
                  const highlightB = diffAB >= 3 || diffBConsensus >= 3;
                  const highlightConsensus =
                    diffAConsensus >= 3 || diffBConsensus >= 3;

                  return (
                    <tr
                      key={consensus.criterionId}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      {/* 항목명 */}
                      <td className="py-2.5 pr-4 font-medium">
                        {consensus.criterionName}
                      </td>
                      {/* Agent A 점수 */}
                      <td
                        className={cn(
                          "px-3 py-2.5 text-center tabular-nums",
                          highlightA && "bg-amber-50 dark:bg-amber-950",
                        )}
                      >
                        {rawA}/{max}
                      </td>
                      {/* Agent B 점수 */}
                      <td
                        className={cn(
                          "px-3 py-2.5 text-center tabular-nums",
                          highlightB && "bg-amber-50 dark:bg-amber-950",
                        )}
                      >
                        {rawB}/{max}
                      </td>
                      {/* 합의 점수 */}
                      <td
                        className={cn(
                          "px-3 py-2.5 text-center font-semibold tabular-nums",
                          highlightConsensus && "bg-amber-50 dark:bg-amber-950",
                        )}
                      >
                        {rawConsensus}/{max}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* 범례 */}
          <p className="text-muted-foreground mt-3 text-xs">
            * 에이전트 간 3점 이상 차이가 있는 항목은 배경색으로 강조됩니다.
          </p>
        </CardContent>
      </Card>

      {/* ── 4. 합의 요약 텍스트 ── */}
      <Card>
        <CardHeader>
          <CardTitle>합의 요약</CardTitle>
          <CardDescription>
            토론 과정에서 도출된 최종 합의 내용입니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MarkdownRenderer content={consensusSummary} />
        </CardContent>
      </Card>
    </div>
  );
}
