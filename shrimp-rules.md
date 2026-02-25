# Development Guidelines

> 이 파일은 Shrimp Task Manager MCP가 참조하는 AI 행동 규칙 포인터이다.
> **진실의 원천은 `.claude/rules/` 디렉토리에 있으며, 이 파일은 요약 및 참조용이다.**

## 규칙 원천 참조

| 규칙 영역                      | 진실의 원천 파일                      |
| ------------------------------ | ------------------------------------- |
| 금지 사항, 주의 사항           | `.claude/rules/constraints.md`        |
| 작업 실행 규칙, 우선순위       | `.claude/rules/task-workflow.md`      |
| 코딩 컨벤션, 구현 방식 선택    | `.claude/rules/coding-conventions.md` |
| 문서 연동/갱신 트리거          | `.claude/rules/document-sync.md`      |
| 전용 에이전트 사용 규칙        | `.claude/rules/agent-delegation.md`   |
| Plan 모드 행동 규칙            | `.claude/rules/plan-mode.md`          |
| 기술 스택, 아키텍처, 명령어    | `CLAUDE.md`                           |
| 기능 명세, 데이터 모델, 루브릭 | `docs/PRD.md`                         |
| Phase/Task 계획, 진행 상태     | `docs/roadmaps/ROADMAP_v*.md`         |

## 작업 실행 규칙 (요약)

> 상세: `.claude/rules/task-workflow.md`

- 모든 작업은 `docs/roadmaps/`의 활성 ROADMAP 기준으로 실행 (`[COMP]` 접두사 없는 파일)
- Phase/Task 순서 준수, 이전 Phase 완료 후 다음 Phase 진행
- 각 단계 완료 후 중단하고 추가 지시를 기다린다

## 금지 사항 (요약)

> 상세: `.claude/rules/constraints.md`

- 외부 DB 도입 금지 (로컬 JSON만)
- 인증/권한 시스템 구현 금지
- `components/ui/` 직접 수정 금지
- `any` 타입, 인라인 스타일, CSS 직접 작성 금지
- 로드맵 순서 무시 금지

## 주요 파일 상호작용 규칙 (요약)

> 상세: `.claude/rules/document-sync.md`

| 변경 대상        | 함께 수정해야 할 파일              |
| ---------------- | ---------------------------------- |
| 라우트 추가/삭제 | `CLAUDE.md` (라우팅 구조)          |
| 데이터 모델 변경 | `lib/types.ts`, `docs/PRD.md`      |
| 루브릭 기준 변경 | `lib/rubrics.ts`, `docs/PRD.md`    |
| Task 완료/추가   | 활성 `docs/roadmaps/ROADMAP_v*.md` |
