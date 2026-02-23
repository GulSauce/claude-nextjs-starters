# /validate - 퀴즈 메타프롬프트 검증 커맨드

`data/prompts/` 디렉토리에서 `status: "pending"` 상태인 프롬프트를 찾아 전문 평가 에이전트를 통해 루브릭 기반 평가를 수행하고 결과를 저장합니다.

## 실행 절차

1. **대기 중인 프롬프트 탐색**
   - `data/prompts/` 디렉토리의 모든 JSON 파일을 읽습니다
   - `status`가 `"pending"`인 파일을 찾습니다
   - 해당 파일이 없으면 "검증할 프롬프트가 없습니다"를 출력하고 종료합니다

2. **각 pending 프롬프트에 대해 평가 에이전트를 호출합니다**

   Task 도구를 사용하여 `general-purpose` 에이전트를 호출합니다. 에이전트에 전달할 프롬프트는 다음과 같이 구성합니다:

   ```
   당신은 퀴즈 프롬프트 평가 전문 에이전트입니다.

   먼저 `.claude/agents/docs/quiz-prompt-evaluator.md` 파일을 읽고, 그 내용의 전문 지식과 평가 기준을 숙지하세요.

   아래 프롬프트를 7개 루브릭 기준으로 평가해주세요.

   **대상 모델**: {프롬프트의 targetModel}
   **프롬프트 ID**: {프롬프트의 id}

   **평가할 프롬프트:**
   {프롬프트의 promptText}

   ## 평가 결과 형식

   평가 완료 후, 아래 JSON 형식으로 결과를 출력하세요.
   반드시 이 JSON 스키마를 정확히 따라야 합니다:

   {
     "id": "crypto.randomUUID()로 생성한 UUID",
     "promptId": "{프롬프트 ID}",
     "targetModel": "{대상 모델}",
     "totalScore": (0-100 정수),
     "grade": ("A"|"B"|"C"|"D"|"F" - A:90+, B:80+, C:70+, D:60+, F:60미만),
     "rubricScores": [
       {
         "criterionId": "clarity",
         "criterionName": "명확성과 구체성",
         "score": (0-20),
         "maxScore": 20,
         "feedback": "상세 피드백",
         "suggestion": "개선 제안"
       },
       {
         "criterionId": "document_grounding",
         "criterionName": "문서 기반 지시",
         "score": (0-15),
         "maxScore": 15,
         "feedback": "상세 피드백",
         "suggestion": "개선 제안"
       },
       {
         "criterionId": "output_format",
         "criterionName": "출력 형식 정의",
         "score": (0-15),
         "maxScore": 15,
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
         "score": (0-15),
         "maxScore": 15,
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
     "overallFeedback": "종합 피드백",
     "improvedPrompt": "개선된 전체 프롬프트 텍스트",
     "validatedAt": "ISO 8601 형식 타임스탬프"
   }

   결과 JSON을 `data/results/{프롬프트ID}.json` 파일에 저장하세요.
   ```

3. **에이전트 결과 확인**
   - 에이전트가 `data/results/{프롬프트ID}.json`에 결과를 저장했는지 확인합니다
   - 저장된 결과 파일을 읽어 스키마가 올바른지 검증합니다
   - `totalScore`가 `rubricScores` 배열의 `score` 합계와 일치하는지 확인합니다
   - `grade`가 등급 기준(A:90+, B:80+, C:70+, D:60+, F:60미만)에 맞는지 확인합니다
   - 불일치 시 직접 수정합니다

4. **프롬프트 상태 업데이트**
   - 해당 프롬프트 파일(`data/prompts/{id}.json`)의 `status`를 `"validated"`로 변경합니다

5. **완료 보고**
   - 평가된 프롬프트 ID, 총점, 등급을 요약하여 출력합니다
   - "결과 페이지를 새로고침하세요"라고 안내합니다
