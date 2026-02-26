# 퀴즈 프롬프트 검증기 개발 로드맵 v3

> 프로젝트 개요 및 기능 명세는 `docs/PRD.md` 참조.
> 기술 스택 및 아키텍처는 `CLAUDE.md` 참조.
> 이전 로드맵(Phase 1~4, 완료)은 `docs/roadmaps/[COMP] ROADMAP.md` 참조.
> 이전 로드맵(Phase 5, 완료)은 `docs/roadmaps/[COMP] ROADMAP_v2.md` 참조.

## 개발 워크플로우

> 일반 작업 실행 규칙(Phase 순서, 중단 시점, 우선순위)은 `.claude/rules/task-workflow.md` 참조.

1. **작업 생성**
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `022-prompt-cross-review-types.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오)
   - 초기 상태의 샘플로 `000-sample.md` 참조

2. **작업 구현**
   - 작업 파일의 명세서를 따름
   - API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트

3. **로드맵 업데이트**
   - 완료된 작업을 완료 표시로 변경

---

## 개발 단계

### Phase 6: 개선 프롬프트 교차 검토 (Phase 2.5 추가)

> **목표**: 현재 듀얼 에이전트 토론 프로세스(Phase 1: 독립 평가 -> Phase 2: 점수 교차 검토 -> Phase 3: 합의 도출)에서 각 에이전트의 `improvedPrompt`가 합의 조정자에게 직접 전달되어, 구체적인 교차 피드백 없이 통합되는 한계가 있다. Phase 2(점수 교차 검토)와 Phase 3(합의) 사이에 "Phase 2.5: 개선 프롬프트 교차 검토" 단계를 삽입하여, 합의 조정자가 양쪽의 근거 있는 피드백을 바탕으로 더 높은 품질의 최종 개선 프롬프트를 도출하도록 한다.

#### Phase 6-1: 타입 및 UI 확장

> **순서 근거**: 타입 정의(Task 022)는 모든 후속 작업의 전제 조건이므로 가장 먼저 수행한다. UI 컴포넌트 상수 업데이트(Task 023)는 타입 변경에 의존하며, 독립적인 UI 변경이므로 타입 완료 직후 바로 착수한다.

- **Task 022: DebatePhase 타입 확장 및 PromptReviewComment 인터페이스 추가** - 우선순위
  - `lib/types.ts` 수정
  - `DebatePhase` 타입에 `"prompt-cross-review"` 리터럴 추가
  - `PromptReviewComment` 인터페이스 신규 정의
    - `reviewerRole: AgentRole` - 검토자 역할
    - `targetRole: AgentRole` - 검토 대상 역할
    - `strengths: string[]` - 강점 (최소 1개, 최대 5개)
    - `weaknesses: string[]` - 약점 (최소 1개, 최대 5개)
    - `suggestions: string[]` - 개선안 (최소 1개, 최대 5개)
    - `mustIncludeElements: string[]` - 필수 포함 요소 (최소 1개, 최대 5개)
  - 하위 호환성: 기존 3-phase 결과는 `prompt-cross-review` 라운드가 없을 뿐 정상 동작

- **Task 023: 토론 로그 UI Phase 2.5 상수 추가**
  - `components/debate-log.tsx` 수정
  - `PHASE_LABEL` 상수에 `"prompt-cross-review": "Phase 2.5: 개선 프롬프트 교차 검토"` 추가
  - `PHASE_ORDER` 배열에 `"prompt-cross-review"`를 `"cross-review"`와 `"consensus"` 사이에 삽입
  - 기존 `getMessagesForPhase` 로직은 변경 불필요 (해당 phase 메시지가 없으면 빈 배열 반환)

#### Phase 6-2: 에이전트 문서 및 커맨드 재작성

> **순서 근거**: 합의 조정자 문서(Task 024)와 validate 커맨드(Task 025)는 모두 타입 정의(Task 022) 완료를 전제로 한다. 합의 조정자 문서는 커맨드에서 참조하므로 Task 024를 먼저 완료한 뒤 Task 025를 수행한다.

- **Task 024: 합의 조정자 에이전트 문서 확장**
  - `.claude/agents/evaluators/consensus-moderator.md` 수정
  - Step 4 "개선 프롬프트 작성" 확장
    - 개선 프롬프트 교차 검토 결과를 핵심 참고 자료로 활용하는 지침 추가
    - 프롬프트 구조/형식: Agent A 우선, Agent B 교차 검토의 교육적 내용 누락 반영
    - 교육적 내용: Agent B 우선, Agent A 교차 검토의 기술적 문제 반영
    - 양쪽 `mustIncludeElements` 확인 및 최종 프롬프트에 포함
    - 상충 제안은 교차 검토의 strengths/weaknesses 분석 근거로 판단
  - `consensusSummary`에 "개선 프롬프트 통합 근거" 섹션 추가
    - Agent A의 improvedPrompt에서 채택한 요소와 근거
    - Agent B의 improvedPrompt에서 채택한 요소와 근거
    - 양쪽 공통 지적 필수 요소 반영 여부
    - 채택하지 않은 제안과 그 사유

- **Task 025: validate 커맨드 Phase 2.5 삽입 및 재작성**
  - `.claude/commands/validate.md` 수정
  - 신규 섹션 6 삽입: Phase 2.5 - 개선 프롬프트 병렬 교차 검토
    - Agent A/B 병렬 호출: 상대방의 improvedPrompt를 자신의 전문 관점에서 검토
    - Agent A 결과 -> `data/temp/prompt-review-a-{프롬프트ID}.json` 저장
    - Agent B 결과 -> `data/temp/prompt-review-b-{프롬프트ID}.json` 저장
    - JSON 스키마: PromptReviewComment 인터페이스 준수
  - 신규 섹션 7 삽입: Phase 2.5 결과 확인 및 debateLog 기록
  - Phase 3 합의 프롬프트에 교차 검토 결과 입력 추가 (기존 섹션 6 -> 새 섹션 8)
  - 전체 섹션 번호 재조정 (1~5 유지, 6~7 신규, 기존 6~11 -> 8~13)
  - 임시 파일 정리 목록 확장 (5개 -> 7개: prompt-review-a/b 추가)
  - debateRounds 검증 항목 4개로 업데이트 (independent-evaluation, cross-review, prompt-cross-review, consensus)
  - ## 테스트 체크리스트
    - `/validate` 실행 후 `data/results/{id}.json`에서 debateRounds 4개 phase 포함 확인
    - debateLog에 `prompt-cross-review` phase 메시지 존재 확인
    - `data/temp/prompt-review-a-*.json`, `data/temp/prompt-review-b-*.json` 임시 파일 생성 및 정리 확인
    - consensusSummary에 "개선 프롬프트 통합 근거" 섹션 포함 확인

#### Phase 6-3: 문서 갱신 및 통합 검증

> **순서 근거**: 모든 코드 변경(Task 022~025)이 완료된 후 문서를 갱신하고 전체 빌드/테스트를 수행하여 일관성을 확보한다.

- **Task 026: 문서 갱신 및 통합 검증**
  - `CLAUDE.md` 업데이트
    - 핵심 데이터 플로우의 4번 항목에 "Phase 2.5: 개선 프롬프트 교차 검토" 추가
    - 데이터 플로우: Phase 1 -> Phase 2 -> Phase 2.5 -> Phase 3 순서로 갱신
  - `docs/PRD.md` 업데이트
    - 기능 명세 테이블에 F016 추가 (개선 프롬프트 교차 검토)
    - 데이터 모델에 `PromptReviewComment` 인터페이스 추가
    - `DebateMessage.phase` 타입에 `"prompt-cross-review"` 추가
    - 사용자 여정의 `/validate` 설명에 Phase 2.5 단계 반영
  - `npm run lint` 에러 없음 확인
  - `npx next build` 최종 빌드 성공 확인
  - Playwright MCP를 활용한 E2E 검증
    - 결과 페이지 토론 로그 UI에 Phase 2.5 섹션 표시 확인
    - 기존 3-phase 결과(Phase 2.5 없음)의 하위 호환 렌더링 확인

---

## Task 의존성 다이어그램

```
Task 022 (타입 확장) ──┬──→ Task 023 (토론 로그 UI 상수)
                       │
                       ├──→ Task 024 (합의 조정자 문서) ──→ Task 025 (validate 커맨드)
                       │
                       └──→ Task 026은 022~025 전체 완료 후 착수

Task 023 (UI 상수) ────────────────────────────────────┐
Task 024 (조정자 문서) ──→ Task 025 (커맨드 재작성) ───┤
                                                       ▼
                                                  Task 026 (문서 갱신 + 통합 검증)
```

**병렬 개발 가능 그룹:**

- **그룹 A** (즉시 착수): Task 022
- **그룹 B** (Task 022 완료 후, 병렬 가능): Task 023 + Task 024
- **그룹 C** (Task 024 완료 후): Task 025
- **그룹 D** (Task 023 + Task 025 모두 완료 후): Task 026
