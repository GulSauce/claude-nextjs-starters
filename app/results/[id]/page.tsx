import { ValidationResult } from "@/components/validation-result";
import { ValidationPending } from "@/components/validation-pending";
import { getResult, getPrompt } from "@/lib/data";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 서버 컴포넌트에서 직접 파일 조회
  const result = await getResult(id);
  const prompt = await getPrompt(id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          검증 결과
        </h1>
        <p className="text-muted-foreground text-sm">ID: {id}</p>
      </div>

      <div className="mt-8">
        {result && prompt ? (
          <ValidationResult result={result} promptText={prompt.promptText} />
        ) : (
          <ValidationPending />
        )}
      </div>
    </div>
  );
}
