// 두 에이전트(Agent A / Agent B)의 개별 평가 결과를 나란히 보여주는 패널 컴포넌트
import { Code2, GraduationCap, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AgentEvaluation, AgentRole, CriterionId } from "@/lib/types";
import { ScoreBadge } from "@/components/score-badge";
import { RubricScoreCard } from "@/components/rubric-score-card";

interface AgentEvaluationPanelProps {
  agentEvaluations: AgentEvaluation[];
}

/** 에이전트 역할별 한국어 라벨 */
const agentRoleLabelMap: Record<AgentRole, string> = {
  "prompt-engineer": "프롬프트 엔지니어",
  "education-evaluator": "교육 평가 전문가",
  "consensus-moderator": "합의 중재자",
};

/** 에이전트 역할별 카드 테두리 색상 (CSS 변수 기반 시맨틱 클래스) */
const agentRoleBorderMap: Record<AgentRole, string> = {
  "prompt-engineer": "agent-a-border",
  "education-evaluator": "agent-b-border",
  "consensus-moderator": "agent-consensus-border",
};

/** 에이전트 역할별 아바타 아이콘 */
const agentRoleIconMap: Record<AgentRole, React.ReactNode> = {
  "prompt-engineer": (
    <span className="rounded-full p-2 agent-a-bg agent-a-text">
      <Code2 className="h-5 w-5" />
    </span>
  ),
  "education-evaluator": (
    <span className="rounded-full p-2 agent-b-bg agent-b-text">
      <GraduationCap className="h-5 w-5" />
    </span>
  ),
  "consensus-moderator": (
    <span className="rounded-full p-2 agent-consensus-bg agent-consensus-text">
      <Scale className="h-5 w-5" />
    </span>
  ),
};

/**
 * 두 에이전트 간 동일 루브릭 항목의 점수 차이를 계산하여
 * 차이가 3점 이상인 항목의 하이라이트 클래스를 반환한다.
 *
 * 반환 구조:
 * {
 *   [agentIndex]: {
 *     [criterionId]: "bg-green-50 dark:bg-green-950" | "bg-amber-50 dark:bg-amber-950" | undefined
 *   }
 * }
 */
function buildHighlightMap(
  evaluations: AgentEvaluation[],
): Record<number, Record<CriterionId, string | undefined>> {
  // 에이전트가 2개 미만이면 하이라이트 없음
  if (evaluations.length < 2) {
    return {};
  }

  const [evalA, evalB] = evaluations;
  const result: Record<number, Record<CriterionId, string | undefined>> = {
    0: {} as Record<CriterionId, string | undefined>,
    1: {} as Record<CriterionId, string | undefined>,
  };

  // Agent A의 루브릭 점수를 기준으로 순회
  for (const scoreA of evalA.rubricScores) {
    const scoreB = evalB.rubricScores.find(
      (s) => s.criterionId === scoreA.criterionId,
    );

    if (!scoreB) continue;

    const diff = Math.abs(scoreA.score - scoreB.score);

    // 점수 차이가 3점 미만이면 하이라이트 없음
    if (diff < 3) continue;

    const aIsHigher = scoreA.score > scoreB.score;

    result[0][scoreA.criterionId] = aIsHigher
      ? "bg-green-50 dark:bg-green-950" // Agent A가 더 높음
      : "bg-amber-50 dark:bg-amber-950"; // Agent A가 더 낮음

    result[1][scoreB.criterionId] = aIsHigher
      ? "bg-amber-50 dark:bg-amber-950" // Agent B가 더 낮음
      : "bg-green-50 dark:bg-green-950"; // Agent B가 더 높음
  }

  return result;
}

/** 단일 에이전트 평가 컬럼 */
function AgentEvaluationColumn({
  evaluation,
  highlightMap,
}: {
  evaluation: AgentEvaluation;
  highlightMap: Record<CriterionId, string | undefined>;
}) {
  const roleLabel =
    agentRoleLabelMap[evaluation.agentRole] ?? evaluation.agentRole;
  const borderClass =
    agentRoleBorderMap[evaluation.agentRole] ??
    "border-gray-200 dark:border-gray-700";

  return (
    <div className="flex flex-col gap-4">
      {/* 에이전트 헤더 카드: 아바타 아이콘 + 역할 이름 + 총점 + 등급 뱃지 */}
      <Card className={cn("border-2", borderClass)}>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          {/* 아바타 아이콘 + 역할 라벨 */}
          <div className="flex items-center gap-2">
            {agentRoleIconMap[evaluation.agentRole]}
            <CardTitle className="text-base">{roleLabel}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm font-medium">
              {evaluation.totalScore}점
            </span>
            <ScoreBadge grade={evaluation.grade} />
          </div>
        </CardHeader>
      </Card>

      {/* 루브릭 항목별 compact 점수 카드 목록 */}
      <div className="flex flex-col gap-2">
        {evaluation.rubricScores.map((rubricScore) => (
          <RubricScoreCard
            key={rubricScore.criterionId}
            rubricScore={rubricScore}
            compact
            highlightClassName={highlightMap[rubricScore.criterionId]}
          />
        ))}
      </div>

      {/* 종합 피드백 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">종합 피드백</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            {evaluation.overallFeedback}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/** 두 에이전트의 개별 평가 결과를 2컬럼으로 나란히 표시하는 패널 */
export function AgentEvaluationPanel({
  agentEvaluations,
}: AgentEvaluationPanelProps) {
  // 평가 데이터가 없는 경우 빈 상태 표시
  if (!agentEvaluations || agentEvaluations.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        에이전트 평가 결과가 없습니다.
      </p>
    );
  }

  const highlightMap = buildHighlightMap(agentEvaluations);

  return (
    // 모바일: 1컬럼, sm 이상: 2컬럼
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {agentEvaluations.map((evaluation, index) => (
        <AgentEvaluationColumn
          key={evaluation.agentRole}
          evaluation={evaluation}
          highlightMap={
            (highlightMap[index] as Record<CriterionId, string | undefined>) ??
            ({} as Record<CriterionId, string | undefined>)
          }
        />
      ))}
    </div>
  );
}
