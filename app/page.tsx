import { MessagesSquare, ClipboardCheck, Sparkles } from "lucide-react";
import { PromptValidatorForm } from "@/components/prompt-validator-form";

export default function Home() {
  return (
    /* 히어로 그라디언트 메시 + 노이즈 텍스처 배경 */
    <div className="hero-gradient noise-overlay">
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-16 sm:px-6">
        {/* 히어로 텍스트 영역 */}
        <div className="text-center">
          {/* 메인 제목 — 두 줄 구성 */}
          <h1 className="animate-slide-up delay-0 text-4xl font-bold tracking-tight sm:text-5xl">
            AI 퀴즈 프롬프트의
            <br />
            {/* 두 번째 줄: primary→accent 그라디언트 강조 */}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              품질을 검증합니다
            </span>
          </h1>

          {/* 부제목 */}
          <p className="animate-slide-up delay-1 text-muted-foreground mx-auto mt-4 max-w-xl text-lg">
            듀얼 에이전트 토론 기반 평가로 메타프롬프트의 강점과 개선점을
            정밀하게 분석합니다.
          </p>
        </div>

        {/* 핵심 특징 3개 그리드 */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* 특징 카드 1 — 듀얼 에이전트 토론 */}
          <div className="animate-slide-up delay-2 card-hover rounded-xl border bg-card/80 p-5 shadow-sm backdrop-blur-sm">
            <MessagesSquare className="mb-3 h-8 w-8 text-primary" />
            <p className="text-sm font-semibold">듀얼 에이전트 토론</p>
            <p className="text-muted-foreground mt-1 text-xs">
              프롬프트 엔지니어와 교육 평가 전문가가 교차 검토하여 합의를
              도출합니다.
            </p>
          </div>

          {/* 특징 카드 2 — 루브릭 분석 */}
          <div className="animate-slide-up delay-3 card-hover rounded-xl border bg-card/80 p-5 shadow-sm backdrop-blur-sm">
            <ClipboardCheck className="mb-3 h-8 w-8 text-primary" />
            <p className="text-sm font-semibold">6가지 루브릭 분석</p>
            <p className="text-muted-foreground mt-1 text-xs">
              명확성, 구체성, 교육 정렬도 등 6개 기준으로 정량 점수를
              산출합니다.
            </p>
          </div>

          {/* 특징 카드 3 — 개선 프롬프트 생성 */}
          <div className="animate-slide-up delay-4 card-hover rounded-xl border bg-card/80 p-5 shadow-sm backdrop-blur-sm">
            <Sparkles className="mb-3 h-8 w-8 text-primary" />
            <p className="text-sm font-semibold">개선 프롬프트 생성</p>
            <p className="text-muted-foreground mt-1 text-xs">
              평가 결과를 바탕으로 즉시 사용 가능한 개선된 프롬프트를
              제안합니다.
            </p>
          </div>
        </div>

        {/* 입력 폼 — scale-in 애니메이션으로 등장 */}
        <div className="animate-scale-in delay-5 mt-12">
          <PromptValidatorForm />
        </div>
      </div>
    </div>
  );
}
