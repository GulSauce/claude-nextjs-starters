---
description: Plan 모드가 accept된 후의 행동 제약 규칙
globs: ["**/*"]
---

# Plan 모드 Accept 후 행동 규칙

Plan이 accept되면 **코드 구현에 들어가지 않는다.** 대신 다음 순서를 따른다:

1. `docs/PRD.md`가 없으면 → `prd-generator` 에이전트를 먼저 호출하여 PRD 생성
2. PRD가 준비되면 → `development-planner` 에이전트를 호출하여 ROADMAP 생성
3. ROADMAP 생성이 완료되면 **종료**. 결과 요약만 출력할 것

## 금지 사항

- 코드 파일 생성/수정
- 패키지 설치
- 빌드/서버 실행
- Task 자동 구현
