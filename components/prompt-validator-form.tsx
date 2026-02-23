"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  promptInputSchema,
  TARGET_MODELS,
  type PromptInputFormValues,
} from "@/lib/schemas";

/** 모델 표시명 */
const modelLabels: Record<string, string> = {
  "gpt-4.1": "GPT-4.1",
  "gemini-3-flash": "Gemini 3 Flash",
  "claude-sonnet-4": "Claude Sonnet 4",
};

export function PromptValidatorForm() {
  const router = useRouter();
  const form = useForm<PromptInputFormValues>({
    resolver: zodResolver(promptInputSchema),
    defaultValues: {
      targetModel: undefined,
      promptText: "",
    },
  });

  const promptText = form.watch("promptText");
  const charCount = promptText?.length ?? 0;
  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: PromptInputFormValues) {
    try {
      const response = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("제출 실패");
      }

      const data = await response.json();
      toast("검증 요청이 접수되었습니다", {
        description: "터미널에서 /validate 커맨드를 실행하세요.",
      });
      router.push(`/results/${data.id}`);
    } catch {
      toast.error("제출에 실패했습니다", {
        description: "다시 시도해주세요.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 대상 모델 선택 */}
        <FormField
          control={form.control}
          name="targetModel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>대상 AI 모델</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="모델을 선택하세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TARGET_MODELS.map((model) => (
                    <SelectItem key={model} value={model}>
                      {modelLabels[model]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 메타프롬프트 입력 */}
        <FormField
          control={form.control}
          name="promptText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>메타프롬프트</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="퀴즈 생성용 메타프롬프트를 입력하세요..."
                  className="min-h-[240px]"
                  {...field}
                />
              </FormControl>
              <FormDescription className="flex justify-between">
                <span>최소 50자 이상 입력해주세요</span>
                <span className={charCount < 50 ? "text-destructive" : ""}>
                  {charCount}자
                </span>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 제출 버튼 */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              제출 중...
            </>
          ) : (
            "검증 요청 제출"
          )}
        </Button>
      </form>
    </Form>
  );
}
