import { PromptValidatorForm } from "@/components/prompt-validator-form";

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          검증하기
        </h1>
        <p className="text-muted-foreground text-lg">
          AI 퀴즈 생성용 메타프롬프트를 입력하고 품질을 검증받으세요.
        </p>
      </div>

      <div className="mt-8">
        <PromptValidatorForm />
      </div>
    </div>
  );
}
