# 퀴즈 프롬프트 검증기 개발 로드맵 v2

> 프로젝트 개요 및 기능 명세는 `docs/PRD.md` 참조.
> 기술 스택 및 아키텍처는 `CLAUDE.md` 참조.
> 이전 로드맵(Phase 1~4, 완료)은 `docs/ROADMAP.md` 참조.

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 이 파일을 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `014-dual-agent-types.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오)
   - 초기 상태의 샘플로 `000-sample.md` 참조

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 완료된 작업을 완료 표시로 변경

---

## 개발 단계

### Phase 5: 듀얼 에이전트 토론 기반 평가 시스템

> **목표**: 단일 에이전트 평가의 편향성을 줄이기 위해 2개 에이전트(프롬프트 엔지니어 + 교육 평가 전문가)가 독립 평가 -> 교차 검토 -> 합의 도출하는 토론 프로세스를 구현한다. 모든 에이전트 간 대화를 로그로 저장하고 GUI에서 채팅 형태로 시각화한다.

#### Phase 5-1: 기반 구조

> **순서 근거**: 타입 정의(Task 014)와 에이전트 전문 문서(Task 015)는 서로 의존성이 없으므로 병렬 진행 가능하다. 이 둘이 완료되어야 커맨드 재작성(Task 016)과 UI 컴포넌트(Task 017~019) 개발을 시작할 수 있다.

- [x] **Task 014: 듀얼 에이전트 타입 확장** - 완료
  - `lib/types.ts`에 듀얼 에이전트 관련 타입 추가
  - `AgentRole` 타입 정의: `"prompt-engineer"` | `"education-evaluator"` | `"consensus-moderator"`
  - `DebateMessage` 인터페이스: agent, role, phase, content, timestamp 필드
  - `AgentEvaluation` 인터페이스: agentRole, rubricScores, totalScore, grade, overallFeedback, improvedPrompt 필드
  - `CrossReviewComment` 인터페이스: reviewerRole, targetRole, criterionId, originalScore, suggestedScore, comment 필드
  - `DebateRound` 인터페이스: phase, messages, startedAt, completedAt 필드
  - `EvaluationMode` 타입 정의: `"single"` | `"debate"`
  - `ValidationResult` 하위 호환 확장: evaluationMode?, agentEvaluations?, debateRounds?, debateLog?, consensusSummary? optional 필드 추가

- [x] **Task 015: 에이전트 전문 문서 작성** - 완료
  - `.claude/agents/docs/prompt-engineer-evaluator.md` 신규 생성
    - Agent A: 프롬프트 엔지니어링 관점 (구조, 명확성, 모델 최적화, 출력 제어)
    - 6개 루브릭 항목별 프롬프트 엔지니어링 시각의 평가 가이드라인
  - `.claude/agents/docs/education-evaluator.md` 신규 생성
    - Agent B: 교육 평가 전문가 관점 (블룸 택소노미, 문항 변별력, 교육적 타당성)
    - 6개 루브릭 항목별 교육학적 시각의 평가 가이드라인
  - `.claude/agents/docs/consensus-moderator.md` 신규 생성
    - 합의 조정자: 점수 차이 해소, 근거 기반 조정, consensusSummary 작성 가이드

#### Phase 5-2: 커맨드 재작성

> **순서 근거**: 타입 정의(Task 014)와 에이전트 문서(Task 015)가 모두 완료되어야 validate 커맨드에서 에이전트별 평가 로직과 결과 저장 형식을 정확히 구현할 수 있다.

- [x] **Task 016: validate 커맨드 듀얼 에이전트 재작성** - 완료
  - `.claude/commands/validate.md` 전면 재작성
  - Phase 1 - 병렬 독립 평가: Agent A/B 각각 6개 루브릭 평가 -> 임시 파일 저장 -> debateLog 기록
  - Phase 2 - 병렬 교차 검토: 상대 평가 검토 -> CrossReviewComment 생성 -> debateLog 기록
  - Phase 3 - 합의 도출: 합의 조정자가 최종 점수/피드백 결정 -> debateLog 기록
  - 결과 저장: `data/results/{id}.json` (evaluationMode="debate" + 전체 토론 데이터)
  - 임시 파일 정리 및 프롬프트 상태 업데이트 (`data/prompts/pending/` -> `data/prompts/complete/`)
  - Playwright MCP를 활용한 결과 저장 형식 검증 테스트

#### Phase 5-3: UI 컴포넌트

> **순서 근거**: 타입 정의(Task 014) 완료 후 3개 UI 컴포넌트를 병렬로 개발할 수 있다. 각 컴포넌트는 독립적인 단위이며, 더미 데이터를 활용하여 커맨드(Task 016) 완료를 기다리지 않고 UI를 먼저 완성한다.

- [x] **Task 017: 합의 결과 UI 구현** (`components/consensus-score-card.tsx`) - 완료
  - 합의 최종 점수 + 등급 뱃지 표시
  - Agent A/B 점수 비교 바 차트 (파란/보라/초록 색상 구분)
  - 루브릭 항목별 3자(Agent A / Agent B / 합의) 비교 테이블
  - consensusSummary 텍스트 영역 표시
  - 모바일 반응형 대응

- [x] **Task 018: 토론 로그 UI 구현** (`components/debate-log.tsx`) - 완료
  - 채팅/메신저 스타일 전체 토론 로그 레이아웃
  - Agent A 좌측 파란 말풍선 / Agent B 우측 보라 말풍선 / 합의 조정자 중앙 초록 말풍선
  - Phase 구분선 + 접기/펼치기 (Accordion)
  - 긴 메시지 "더 보기" 토글 기능
  - 모바일 반응형 대응

- [x] **Task 019: 개별 평가 패널 UI 구현** (`components/agent-evaluation-panel.tsx`) - 완료
  - 2컬럼 레이아웃 (Agent A / Agent B 나란히 표시)
  - 기존 `rubric-score-card.tsx` compact 모드 재사용
  - 점수 차이 시각적 강조 (배경색 또는 아이콘)
  - 모바일: 1컬럼 전환 (sm 브레이크포인트)

#### Phase 5-4: 결과 페이지 통합

> **순서 근거**: 커맨드(Task 016)와 UI 컴포넌트(Task 017~019) 모두 완료되어야 결과 페이지에서 실제 데이터와 UI를 연결할 수 있다. 기존 single 모드와의 하위 호환성을 보장하면서 debate 모드를 추가한다.

- [x] **Task 020: 결과 페이지 통합 및 E2E 테스트** - 완료
  - `components/validation-result.tsx` 수정: evaluationMode 분기 처리
  - debate 모드: 5탭 구성 (합의 결과 / 에이전트별 평가 / 토론 로그 / 개선된 프롬프트 / 원본)
  - single 모드: 기존 3탭 유지 (하위 호환 보장)
  - `components/rubric-score-card.tsx`에 compact prop 추가
  - `components/history-card.tsx`에 evaluationMode 뱃지 (Single/Debate) 추가
  - Playwright MCP를 활용한 E2E 테스트 수행
    - debate 모드 결과 페이지 5탭 전환 테스트
    - single 모드 하위 호환 검증 테스트
    - 히스토리 페이지 evaluationMode 뱃지 표시 테스트
    - 모바일 반응형 레이아웃 테스트

#### Phase 5-5: 문서 갱신

> **순서 근거**: 모든 기능 구현과 테스트가 완료된 후, 변경 사항을 문서에 반영하여 코드와 문서 간 일관성을 유지한다.

- [x] **Task 021: 문서 갱신** - 완료
  - `docs/PRD.md` 업데이트
    - 신규 기능 ID 추가 (F013: 듀얼 에이전트 토론 평가, F014: 토론 로그 시각화, F015: 합의 기반 점수 산정)
    - 데이터 모델 섹션에 DebateMessage, AgentEvaluation, CrossReviewComment, DebateRound 추가
    - 사용자 여정에 debate 모드 플로우 추가
    - 결과 상세 페이지 기능 명세에 5탭 구성 반영
  - `CLAUDE.md` 업데이트
    - 디렉토리 구조에 `.claude/agents/docs/`, `data/temp/` 추가
    - 핵심 데이터 플로우에 듀얼 에이전트 토론 프로세스 추가
    - 라우팅 구조 테이블에 변경 사항 반영 (필요 시)
  - `npm run lint` 에러 없음 확인
  - `npx next build` 최종 빌드 성공 확인

---

## Task 의존성 다이어그램

```
Task 014 (타입 확장) ─────┬──→ Task 016 (커맨드 재작성) ──┐
                          │                                │
Task 015 (에이전트 문서) ─┘                                │
                                                           │
Task 014 (타입 확장) ──┬──→ Task 017 (합의 결과 UI) ───┐   │
                       ├──→ Task 018 (토론 로그 UI) ───┤   │
                       └──→ Task 019 (개별 평가 패널) ─┤   │
                                                       │   │
                                                       ▼   ▼
                                                  Task 020 (결과 페이지 통합)
                                                       │
                                                       ▼
                                                  Task 021 (문서 갱신)
```

**병렬 개발 가능 그룹:**

- **그룹 A** (동시 착수): Task 014 + Task 015
- **그룹 B** (Task 014 완료 후, 단 Task 016은 Task 015도 필요): Task 016 + Task 017 + Task 018 + Task 019
- **그룹 C** (그룹 B 전체 완료 후): Task 020
- **그룹 D** (Task 020 완료 후): Task 021
