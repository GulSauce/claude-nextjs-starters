# /validate - 퀴즈 메타프롬프트 검증 커맨드 (듀얼 에이전트 토론 모드)

`data/prompts/pending/` 디렉토리의 프롬프트를 찾아 2개 전문 에이전트의 독립 평가 → 교차 검토 → 개선 프롬프트 교차 검토 → 합의 도출 토론 프로세스를 통해 평가하고 결과를 저장합니다.

## 실행 절차

### 1. 대기 중인 프롬프트 탐색

- `data/prompts/pending/` 디렉토리의 모든 JSON 파일을 읽습니다
- 해당 파일이 없으면 "검증할 프롬프트가 없습니다"를 출력하고 종료합니다

### 2. Phase 1 - 병렬 독립 평가

두 에이전트를 **병렬로** 호출합니다. Task 도구를 사용하여 `general-purpose` 에이전트 2개를 동시에 실행합니다.

#### Agent A: 프롬프트 엔지니어

```
당신은 프롬프트 엔지니어링 관점의 퀴즈 프롬프트 평가 전문가입니다.

먼저 다음 2개 파일을 읽고 평가 기준을 숙지하세요:
1. `.claude/agents/evaluators/quiz-prompt-evaluator.md` (공통 평가 기준)
2. `.claude/agents/evaluators/prompt-engineer-evaluator.md` (프롬프트 엔지니어링 관점 가이드)

아래 프롬프트를 **프롬프트 엔지니어링 관점**에서 6개 루브릭 기준으로 평가해주세요.
구조적 완성도, 지시의 명확성, 모델 최적화, 출력 제어 등에 집중합니다.
단, 구조화된 출력 형식(JSON 스키마 등)은 시스템 프롬프트에서 개발자가 별도로 지정하므로 평가 대상에서 제외합니다.

**대상 모델**: {프롬프트의 targetModel}
**프롬프트 ID**: {프롬프트의 id}

**평가할 프롬프트:**
{프롬프트의 promptText}

## 평가 결과 형식

평가 완료 후, 아래 JSON 형식으로 결과를 `data/temp/agent-a-{프롬프트ID}.json` 파일에 저장하세요.

{
  "agentRole": "prompt-engineer",
  "rubricScores": [
    {
      "criterionId": "clarity",
      "criterionName": "명확성과 구체성",
      "score": (0-25),
      "maxScore": 25,
      "feedback": "프롬프트 엔지니어링 관점의 상세 피드백",
      "suggestion": "구조/형식 개선 제안"
    },
    {
      "criterionId": "document_grounding",
      "criterionName": "문서 기반 지시",
      "score": (0-20),
      "maxScore": 20,
      "feedback": "상세 피드백",
      "suggestion": "개선 제안"
    },
    {
      "criterionId": "difficulty_control",
      "criterionName": "난이도 제어",
      "score": (0-15),
      "maxScore": 15,
      "feedback": "상세 피드백",
      "suggestion": "개선 제안"
    },
    {
      "criterionId": "answer_quality",
      "criterionName": "정답 및 해설 품질",
      "score": (0-20),
      "maxScore": 20,
      "feedback": "상세 피드백",
      "suggestion": "개선 제안"
    },
    {
      "criterionId": "edge_cases",
      "criterionName": "예외 처리",
      "score": (0-10),
      "maxScore": 10,
      "feedback": "상세 피드백",
      "suggestion": "개선 제안"
    },
    {
      "criterionId": "model_optimization",
      "criterionName": "모델 최적화",
      "score": (0-10),
      "maxScore": 10,
      "feedback": "상세 피드백",
      "suggestion": "개선 제안"
    }
  ],
  "totalScore": (0-100, rubricScores의 score 합계),
  "grade": ("A"|"B"|"C"|"D"|"F" - A:90+, B:80+, C:70+, D:60+, F:60미만),
  "overallFeedback": "프롬프트 엔지니어링 관점의 종합 피드백",
  "improvedPrompt": "프롬프트 엔지니어링 관점에서 개선된 전체 프롬프트 텍스트"
}
```

#### Agent B: 교육 평가 전문가

```
당신은 교육학 및 평가 이론 관점의 퀴즈 프롬프트 평가 전문가입니다.

먼저 다음 2개 파일을 읽고 평가 기준을 숙지하세요:
1. `.claude/agents/evaluators/quiz-prompt-evaluator.md` (공통 평가 기준)
2. `.claude/agents/evaluators/education-evaluator.md` (교육 평가 전문가 관점 가이드)

아래 프롬프트를 **교육학적 관점**에서 6개 루브릭 기준으로 평가해주세요.
블룸 택소노미, 문항 변별력, 교육적 타당성, 학습 목표 정렬 등에 집중합니다.
단, 구조화된 출력 형식(JSON 스키마 등)은 시스템 프롬프트에서 개발자가 별도로 지정하므로 평가 대상에서 제외합니다.

**대상 모델**: {프롬프트의 targetModel}
**프롬프트 ID**: {프롬프트의 id}

**평가할 프롬프트:**
{프롬프트의 promptText}

## 평가 결과 형식

평가 완료 후, 아래 JSON 형식으로 결과를 `data/temp/agent-b-{프롬프트ID}.json` 파일에 저장하세요.

{
  "agentRole": "education-evaluator",
  "rubricScores": [
    {
      "criterionId": "clarity",
      "criterionName": "명확성과 구체성",
      "score": (0-25),
      "maxScore": 25,
      "feedback": "교육학적 관점의 상세 피드백",
      "suggestion": "교육적 개선 제안"
    },
    {
      "criterionId": "document_grounding",
      "criterionName": "문서 기반 지시",
      "score": (0-20),
      "maxScore": 20,
      "feedback": "상세 피드백",
      "suggestion": "개선 제안"
    },
    {
      "criterionId": "difficulty_control",
      "criterionName": "난이도 제어",
      "score": (0-15),
      "maxScore": 15,
      "feedback": "상세 피드백",
      "suggestion": "개선 제안"
    },
    {
      "criterionId": "answer_quality",
      "criterionName": "정답 및 해설 품질",
      "score": (0-20),
      "maxScore": 20,
      "feedback": "상세 피드백",
      "suggestion": "개선 제안"
    },
    {
      "criterionId": "edge_cases",
      "criterionName": "예외 처리",
      "score": (0-10),
      "maxScore": 10,
      "feedback": "상세 피드백",
      "suggestion": "개선 제안"
    },
    {
      "criterionId": "model_optimization",
      "criterionName": "모델 최적화",
      "score": (0-10),
      "maxScore": 10,
      "feedback": "상세 피드백",
      "suggestion": "개선 제안"
    }
  ],
  "totalScore": (0-100, rubricScores의 score 합계),
  "grade": ("A"|"B"|"C"|"D"|"F" - A:90+, B:80+, C:70+, D:60+, F:60미만),
  "overallFeedback": "교육학적 관점의 종합 피드백",
  "improvedPrompt": "교육학적 관점에서 개선된 전체 프롬프트 텍스트"
}
```

### 3. Phase 1 결과 확인 및 debateLog 기록

- `data/temp/agent-a-{프롬프트ID}.json`과 `data/temp/agent-b-{프롬프트ID}.json`을 읽습니다
- 각 파일의 JSON 스키마가 올바른지 검증합니다
- 각 에이전트의 `totalScore`가 `rubricScores`의 `score` 합계와 일치하는지 확인하고, 불일치 시 수정합니다
- `grade`가 등급 기준에 맞는지 확인하고, 불일치 시 수정합니다
- Phase 1 debateLog 메시지를 기록합니다 (각 에이전트의 평가 결과 요약을 DebateMessage 형식으로)

### 4. Phase 2 - 병렬 교차 검토

두 에이전트를 **병렬로** 호출합니다. 각 에이전트가 상대방의 평가 결과를 검토합니다.

#### Agent A가 Agent B 평가 검토

```
당신은 프롬프트 엔지니어링 관점의 평가 전문가입니다.

먼저 `.claude/agents/evaluators/prompt-engineer-evaluator.md` 파일을 읽고 전문 관점을 숙지하세요.

다른 전문가(교육 평가 전문가)의 평가 결과를 검토하고, 동의하지 않는 부분에 대해 교차 검토 코멘트를 작성해주세요.

**원본 프롬프트:**
{프롬프트의 promptText}

**교육 평가 전문가의 평가 결과:**
{data/temp/agent-b-{프롬프트ID}.json의 내용}

## 교차 검토 결과 형식

점수 차이가 있거나 의견이 다른 항목에 대해서만 코멘트를 작성하세요.
동의하는 항목은 포함하지 않습니다.

결과를 `data/temp/cross-review-a-{프롬프트ID}.json` 파일에 저장하세요:

{
  "reviewerRole": "prompt-engineer",
  "comments": [
    {
      "reviewerRole": "prompt-engineer",
      "targetRole": "education-evaluator",
      "criterionId": "(해당 루브릭 항목 ID)",
      "originalScore": (상대 에이전트의 점수),
      "suggestedScore": (제안하는 점수),
      "comment": "점수 조정 근거 (프롬프트 엔지니어링 관점)"
    }
  ]
}

의견 차이가 없으면 빈 배열로 저장하세요: { "reviewerRole": "prompt-engineer", "comments": [] }
```

#### Agent B가 Agent A 평가 검토

```
당신은 교육학 및 평가 이론 관점의 평가 전문가입니다.

먼저 `.claude/agents/evaluators/education-evaluator.md` 파일을 읽고 전문 관점을 숙지하세요.

다른 전문가(프롬프트 엔지니어)의 평가 결과를 검토하고, 동의하지 않는 부분에 대해 교차 검토 코멘트를 작성해주세요.

**원본 프롬프트:**
{프롬프트의 promptText}

**프롬프트 엔지니어의 평가 결과:**
{data/temp/agent-a-{프롬프트ID}.json의 내용}

## 교차 검토 결과 형식

점수 차이가 있거나 의견이 다른 항목에 대해서만 코멘트를 작성하세요.
동의하는 항목은 포함하지 않습니다.

결과를 `data/temp/cross-review-b-{프롬프트ID}.json` 파일에 저장하세요:

{
  "reviewerRole": "education-evaluator",
  "comments": [
    {
      "reviewerRole": "education-evaluator",
      "targetRole": "prompt-engineer",
      "criterionId": "(해당 루브릭 항목 ID)",
      "originalScore": (상대 에이전트의 점수),
      "suggestedScore": (제안하는 점수),
      "comment": "점수 조정 근거 (교육학적 관점)"
    }
  ]
}

의견 차이가 없으면 빈 배열로 저장하세요: { "reviewerRole": "education-evaluator", "comments": [] }
```

### 5. Phase 2 결과 확인 및 debateLog 기록

- `data/temp/cross-review-a-{프롬프트ID}.json`과 `data/temp/cross-review-b-{프롬프트ID}.json`을 읽습니다
- Phase 2 debateLog 메시지를 기록합니다

### 6. Phase 2.5 - 개선 프롬프트 병렬 교차 검토

두 에이전트를 **병렬로** 호출합니다. 각 에이전트가 상대방의 `improvedPrompt`를 자신의 전문 관점에서 검토합니다.

#### Agent A가 Agent B의 개선 프롬프트 검토

```
당신은 프롬프트 엔지니어링 관점의 평가 전문가입니다.

먼저 `.claude/agents/evaluators/prompt-engineer-evaluator.md` 파일을 읽고 전문 관점을 숙지하세요.

다른 전문가(교육 평가 전문가)가 작성한 개선 프롬프트를 프롬프트 엔지니어링 관점에서 검토해주세요.
구조적 완성도, 지시의 명확성, 모델 최적화, 출력 제어 측면에서 강점, 약점, 개선안을 제시합니다.

**원본 프롬프트:**
{프롬프트의 promptText}

**교육 평가 전문가의 개선 프롬프트:**
{data/temp/agent-b-{프롬프트ID}.json의 improvedPrompt}

## 검토 결과 형식

결과를 `data/temp/prompt-review-a-{프롬프트ID}.json` 파일에 저장하세요:

{
  "reviewerRole": "prompt-engineer",
  "targetRole": "education-evaluator",
  "strengths": ["강점 1", "강점 2", ...],
  "weaknesses": ["약점 1", "약점 2", ...],
  "suggestions": ["개선안 1", "개선안 2", ...],
  "mustIncludeElements": ["필수 포함 요소 1", "필수 포함 요소 2", ...]
}

각 배열은 1~5개 항목으로 작성하세요.
```

#### Agent B가 Agent A의 개선 프롬프트 검토

```
당신은 교육학 및 평가 이론 관점의 평가 전문가입니다.

먼저 `.claude/agents/evaluators/education-evaluator.md` 파일을 읽고 전문 관점을 숙지하세요.

다른 전문가(프롬프트 엔지니어)가 작성한 개선 프롬프트를 교육학적 관점에서 검토해주세요.
블룸 택소노미, 문항 변별력, 교육적 타당성, 학습 목표 정렬 측면에서 강점, 약점, 개선안을 제시합니다.

**원본 프롬프트:**
{프롬프트의 promptText}

**프롬프트 엔지니어의 개선 프롬프트:**
{data/temp/agent-a-{프롬프트ID}.json의 improvedPrompt}

## 검토 결과 형식

결과를 `data/temp/prompt-review-b-{프롬프트ID}.json` 파일에 저장하세요:

{
  "reviewerRole": "education-evaluator",
  "targetRole": "prompt-engineer",
  "strengths": ["강점 1", "강점 2", ...],
  "weaknesses": ["약점 1", "약점 2", ...],
  "suggestions": ["개선안 1", "개선안 2", ...],
  "mustIncludeElements": ["필수 포함 요소 1", "필수 포함 요소 2", ...]
}

각 배열은 1~5개 항목으로 작성하세요.
```

### 7. Phase 2.5 결과 확인 및 debateLog 기록

- `data/temp/prompt-review-a-{프롬프트ID}.json`과 `data/temp/prompt-review-b-{프롬프트ID}.json`을 읽습니다
- 각 파일의 JSON 스키마가 PromptReviewComment 인터페이스에 맞는지 검증합니다
- Phase 2.5 debateLog 메시지를 기록합니다 (각 에이전트의 프롬프트 교차 검토 내용을 DebateMessage 형식으로)

### 8. Phase 3 - 합의 도출

합의 조정자 에이전트를 호출합니다:

```
당신은 퀴즈 프롬프트 평가의 합의 조정자입니다.

먼저 `.claude/agents/evaluators/consensus-moderator.md` 파일을 읽고 합의 도출 프로세스를 숙지하세요.

두 전문가의 독립 평가와 교차 검토 결과를 바탕으로, 근거 기반의 최종 합의 점수와 피드백을 도출해주세요.

**원본 프롬프트:**
{프롬프트의 promptText}

**대상 모델**: {프롬프트의 targetModel}

**Agent A (프롬프트 엔지니어) 평가:**
{data/temp/agent-a-{프롬프트ID}.json의 내용}

**Agent B (교육 평가 전문가) 평가:**
{data/temp/agent-b-{프롬프트ID}.json의 내용}

**Agent A의 교차 검토 (Agent B에 대한):**
{data/temp/cross-review-a-{프롬프트ID}.json의 내용}

**Agent B의 교차 검토 (Agent A에 대한):**
{data/temp/cross-review-b-{프롬프트ID}.json의 내용}

**Agent A의 개선 프롬프트 교차 검토 (Agent B 프롬프트에 대한):**
{data/temp/prompt-review-a-{프롬프트ID}.json의 내용}

**Agent B의 개선 프롬프트 교차 검토 (Agent A 프롬프트에 대한):**
{data/temp/prompt-review-b-{프롬프트ID}.json의 내용}

## 합의 결과 형식

결과를 `data/temp/consensus-{프롬프트ID}.json` 파일에 저장하세요:

{
  "rubricScores": [
    {
      "criterionId": "clarity",
      "criterionName": "명확성과 구체성",
      "score": (0-25, 합의 점수),
      "maxScore": 25,
      "feedback": "양쪽 관점을 통합한 피드백",
      "suggestion": "통합된 개선 제안"
    },
    ... (6개 항목 모두)
  ],
  "totalScore": (0-100, rubricScores의 score 합계),
  "grade": ("A"|"B"|"C"|"D"|"F"),
  "overallFeedback": "양쪽 관점을 통합한 종합 피드백",
  "improvedPrompt": "최종 개선 프롬프트 (아래 작성 규칙 필수 준수)",
  "consensusSummary": "합의 요약 (점수 조정 내역, 주요 합의 사항, 관점 차이 해소, 최종 판정 포함)"
}

### improvedPrompt 작성 규칙 (반드시 준수)

1. **권고사항 실제 적용**: 위 rubricScores의 각 suggestion과 overallFeedback에서 제시한 개선 권고를 improvedPrompt에 **실제로 반영**하세요. 권고만 하고 적용하지 않는 것은 금지합니다.
2. **완전한 프롬프트**: '원본과 동일', '위와 같음' 등의 축약 표현 없이, 모든 섹션(역할, 규칙, 평가 맥락, 난이도 제어, 오답 유형, Step 1~6, 참고 예시, 출력 형식, 예외 처리, 최종 확인)을 빠짐없이 포함한 완전한 프롬프트를 작성하세요.
3. **길이 최적화**: 중복 제거, 섹션 통합 등을 통해 원본 대비 프롬프트 길이를 실질적으로 축소하세요. 새로운 내용을 추가하더라도 중복 제거로 상쇄하여 전체 길이가 늘어나지 않도록 하세요.
4. **양쪽 장점 통합**: Agent A(프롬프트 엔지니어)의 구조/형식 개선과 Agent B(교육 평가 전문가)의 교육적 내용 개선을 모두 반영하세요.
5. **교차 검토 반영**: Phase 2.5에서 양쪽이 지적한 mustIncludeElements를 가능한 한 포함하세요.
```

### 9. 최종 결과 조립 및 저장

Phase 3의 합의 결과와 전체 토론 데이터를 조합하여 최종 결과를 `data/results/{프롬프트ID}.json`에 저장합니다.

최종 결과 JSON 스키마:

```json
{
  "id": "crypto.randomUUID()로 생성한 UUID",
  "promptId": "{프롬프트 ID}",
  "targetModel": "{대상 모델}",
  "totalScore": (합의 totalScore),
  "grade": "(합의 grade)",
  "rubricScores": (합의 rubricScores),
  "overallFeedback": "(합의 overallFeedback)",
  "improvedPrompt": "(합의 improvedPrompt)",
  "validatedAt": "ISO 8601 형식 타임스탬프",
  "evaluationMode": "debate",
  "agentEvaluations": [
    {
      "agentRole": "prompt-engineer",
      "rubricScores": (Agent A의 rubricScores),
      "totalScore": (Agent A의 totalScore),
      "grade": "(Agent A의 grade)",
      "overallFeedback": "(Agent A의 overallFeedback)",
      "improvedPrompt": "(Agent A의 improvedPrompt)"
    },
    {
      "agentRole": "education-evaluator",
      "rubricScores": (Agent B의 rubricScores),
      "totalScore": (Agent B의 totalScore),
      "grade": "(Agent B의 grade)",
      "overallFeedback": "(Agent B의 overallFeedback)",
      "improvedPrompt": "(Agent B의 improvedPrompt)"
    }
  ],
  "debateRounds": [
    {
      "phase": "independent-evaluation",
      "messages": [...],
      "startedAt": "...",
      "completedAt": "..."
    },
    {
      "phase": "cross-review",
      "messages": [...],
      "startedAt": "...",
      "completedAt": "..."
    },
    {
      "phase": "prompt-cross-review",
      "messages": [...],
      "startedAt": "...",
      "completedAt": "..."
    },
    {
      "phase": "consensus",
      "messages": [...],
      "startedAt": "...",
      "completedAt": "..."
    }
  ],
  "debateLog": [
    (Phase 1~3(Phase 2.5 포함)의 모든 DebateMessage를 시간순으로 정렬)
  ],
  "consensusSummary": "(합의 consensusSummary)"
}
```

debateLog의 각 DebateMessage 형식:

```json
{
  "agent": "Agent A" | "Agent B" | "합의 조정자",
  "role": "prompt-engineer" | "education-evaluator" | "consensus-moderator",
  "phase": "independent-evaluation" | "cross-review" | "prompt-cross-review" | "consensus",
  "content": "에이전트의 평가/검토/합의 내용 요약",
  "timestamp": "ISO 8601 형식"
}
```

### 10. 데이터 검증

- 최종 결과 파일을 읽어 스키마가 올바른지 검증합니다
- `totalScore`가 `rubricScores`의 `score` 합계와 일치하는지 확인합니다
- `grade`가 등급 기준에 맞는지 확인합니다
- `evaluationMode`가 `"debate"`인지 확인합니다
- `agentEvaluations`에 2개 에이전트의 평가가 모두 포함되었는지 확인합니다
- `debateRounds`에 4개 phase(independent-evaluation, cross-review, prompt-cross-review, consensus)가 모두 포함되었는지 확인합니다
- 불일치 시 직접 수정합니다

### 11. 임시 파일 정리

- `data/temp/` 디렉토리의 해당 프롬프트 관련 임시 파일을 모두 삭제합니다:
  - `data/temp/agent-a-{프롬프트ID}.json`
  - `data/temp/agent-b-{프롬프트ID}.json`
  - `data/temp/cross-review-a-{프롬프트ID}.json`
  - `data/temp/cross-review-b-{프롬프트ID}.json`
  - `data/temp/prompt-review-a-{프롬프트ID}.json`
  - `data/temp/prompt-review-b-{프롬프트ID}.json`
  - `data/temp/consensus-{프롬프트ID}.json`

### 12. 프롬프트 상태 업데이트

- `lib/data.ts`의 `updatePromptStatus(id, "validated")`를 호출하여 프롬프트를 `data/prompts/pending/`에서 `data/prompts/complete/`로 이동합니다

### 13. 완료 보고

- 평가된 프롬프트 ID, 평가 모드(debate), 합의 총점, 등급을 요약하여 출력합니다
- Agent A/B의 개별 점수도 함께 표시합니다
- "결과 페이지를 새로고침하세요"라고 안내합니다
