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
}

/** 루브릭 기준 정의 */
export interface RubricCriterion {
  id: CriterionId;
  name: string;
  maxScore: number;
  description: string;
}
