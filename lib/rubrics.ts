// 루브릭 기준 상수, 모델별 최적화 가이드, 등급 계산 함수

import type { Grade, RubricCriterion, TargetModel } from "./types";

/** 6개 루브릭 평가 기준 (총 100점) */
export const RUBRIC_CRITERIA: RubricCriterion[] = [
  {
    id: "clarity",
    name: "명확성과 구체성",
    maxScore: 25,
    description: "퀴즈 유형, 난이도, 문항 수 등이 구체적으로 명시되었는가",
  },
  {
    id: "document_grounding",
    name: "문서 기반 지시",
    maxScore: 20,
    description:
      '"제공된 문서 내용만으로" 퀴즈를 생성하라는 명시적 지시가 있는가',
  },
  {
    id: "difficulty_control",
    name: "난이도 제어",
    maxScore: 15,
    description:
      "난이도 단계 정의, 블룸 택소노미 등 교육학적 프레임워크 활용 여부",
  },
  {
    id: "answer_quality",
    name: "정답 및 해설 품질",
    maxScore: 20,
    description: "정답, 오답 선지, 해설 생성에 대한 명확한 지시 여부",
  },
  {
    id: "edge_cases",
    name: "예외 처리",
    maxScore: 10,
    description:
      "문서 내용 부족 시 처리 방법, 모호한 문제 회피 등 예외 상황 대응 지시 여부",
  },
  {
    id: "model_optimization",
    name: "모델 최적화",
    maxScore: 10,
    description: "대상 모델 특성에 맞는 프롬프트 패턴 사용 여부",
  },
];

/** 모델별 최적화 가이드 */
export const MODEL_OPTIMIZATION_GUIDE: Record<TargetModel, { tips: string[] }> =
  {
    "gpt-4.1": {
      tips: [
        "system/user 역할 분리를 활용하세요",
        "JSON 모드를 명시적으로 요청하세요",
        "명확한 지시문과 예시를 포함하세요",
      ],
    },
    "gemini-3-flash": {
      tips: [
        "문서를 프롬프트 앞부분에 배치하세요",
        "명시적 섹션 구분을 사용하세요",
        "단계별 사고 과정을 요청하세요",
      ],
    },
    "claude-sonnet-4": {
      tips: [
        "XML 태그를 활용하여 구조를 명확히 하세요",
        "구체적인 예시를 포함하세요",
        "역할과 목적을 명확히 설정하세요",
      ],
    },
  };

/** 총점 기준 등급 계산 */
export function calculateGrade(totalScore: number): Grade {
  if (totalScore >= 90) return "A";
  if (totalScore >= 80) return "B";
  if (totalScore >= 70) return "C";
  if (totalScore >= 60) return "D";
  return "F";
}
