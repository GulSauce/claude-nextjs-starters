// 퀴즈 프롬프트 검증기 핵심 타입 정의

/** 대상 AI 모델 */
export type TargetModel = "gpt-4.1" | "gemini-3-flash" | "claude-sonnet-4";

/** 루브릭 항목 ID */
export type CriterionId =
  | "clarity"
  | "document_grounding"
  | "difficulty_control"
  | "answer_quality"
  | "edge_cases"
  | "model_optimization";

/** 등급 */
export type Grade = "A" | "B" | "C" | "D" | "F";

/** 프롬프트 상태 */
export type PromptStatus = "pending" | "validated";

/** 프롬프트 입력 (data/prompts/{id}.json) */
export interface PromptInput {
  id: string;
  targetModel: TargetModel;
  promptText: string;
  createdAt: string;
  status: PromptStatus;
}

/** 루브릭 항목별 점수 (ValidationResult.rubricScores 내 배열 요소) */
export interface RubricScore {
  criterionId: CriterionId;
  criterionName: string;
  score: number;
  maxScore: number;
  feedback: string;
  suggestion: string;
}

/** 검증 결과 (data/results/{id}.json) */
export interface ValidationResult {
  id: string;
  promptId: string;
  targetModel: string;
  totalScore: number;
  grade: Grade;
  rubricScores: RubricScore[];
  overallFeedback: string;
  improvedPrompt: string;
  validatedAt: string;
  // 듀얼 에이전트 토론 평가 확장 (하위 호환)
  evaluationMode?: EvaluationMode;
  agentEvaluations?: AgentEvaluation[];
  debateRounds?: DebateRound[];
  debateLog?: DebateMessage[];
  consensusSummary?: string;
}

/** 루브릭 기준 정의 */
export interface RubricCriterion {
  id: CriterionId;
  name: string;
  maxScore: number;
  description: string;
}

// ─── 듀얼 에이전트 토론 평가 관련 타입 ───

/** 에이전트 역할 */
export type AgentRole =
  | "prompt-engineer"
  | "education-evaluator"
  | "consensus-moderator";

/** 평가 모드 */
export type EvaluationMode = "single" | "debate";

/** 토론 단계 */
export type DebatePhase =
  | "independent-evaluation"
  | "cross-review"
  | "prompt-cross-review"
  | "consensus";

/** 토론 메시지 */
export interface DebateMessage {
  agent: string;
  role: AgentRole;
  phase: DebatePhase;
  content: string;
  timestamp: string;
}

/** 에이전트별 개별 평가 결과 */
export interface AgentEvaluation {
  agentRole: AgentRole;
  rubricScores: RubricScore[];
  totalScore: number;
  grade: Grade;
  overallFeedback: string;
  improvedPrompt: string;
}

/** 교차 검토 코멘트 */
export interface CrossReviewComment {
  reviewerRole: AgentRole;
  targetRole: AgentRole;
  criterionId: CriterionId;
  originalScore: number;
  suggestedScore: number;
  comment: string;
}

/** 개선 프롬프트 교차 검토 코멘트 (Phase 2.5) */
export interface PromptReviewComment {
  /** 검토자 역할 */
  reviewerRole: AgentRole;
  /** 검토 대상 역할 */
  targetRole: AgentRole;
  /** 강점 (1~5개) */
  strengths: string[];
  /** 약점 (1~5개) */
  weaknesses: string[];
  /** 개선안 (1~5개) */
  suggestions: string[];
  /** 필수 포함 요소 (1~5개) */
  mustIncludeElements: string[];
}

/** 토론 라운드 */
export interface DebateRound {
  phase: DebatePhase;
  messages: DebateMessage[];
  startedAt: string;
  completedAt: string;
}
