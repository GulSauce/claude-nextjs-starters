import { HistoryCard } from "@/components/history-card";
import { getAllResults, getPrompt } from "@/lib/data";

export default async function HistoryPage() {
  const results = await getAllResults();

  // 각 결과에 대응하는 프롬프트 텍스트 조회
  const resultsWithPrompt = await Promise.all(
    results.map(async (result) => {
      const prompt = await getPrompt(result.promptId);
      return {
        result,
        promptText: prompt?.promptText ?? "",
      };
    }),
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          검증 히스토리
        </h1>
        <p className="text-muted-foreground text-lg">
          이전 검증 결과를 확인하고 비교하세요.
        </p>
      </div>

      <div className="mt-8">
        {resultsWithPrompt.length > 0 ? (
          <div className="grid gap-4">
            {resultsWithPrompt.map(({ result, promptText }) => (
              <HistoryCard
                key={result.id}
                result={result}
                promptText={promptText}
              />
            ))}
          </div>
        ) : (
          <div className="border-muted rounded-lg border border-dashed p-12 text-center">
            <p className="text-muted-foreground text-sm">
              아직 검증 결과가 없습니다. 메인 페이지에서 프롬프트를
              제출해보세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
