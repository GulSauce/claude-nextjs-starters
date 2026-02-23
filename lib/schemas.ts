// 폼 검증용 Zod 스키마 정의

import { z } from "zod";

/** 대상 모델 목록 상수 */
export const TARGET_MODELS = [
  "gpt-4.1",
  "gemini-3-flash",
  "claude-sonnet-4",
] as const;

/** 프롬프트 입력 폼 검증 스키마 */
export const promptInputSchema = z.object({
  targetModel: z.enum(TARGET_MODELS, {
    message: "대상 모델을 선택해주세요",
  }),
  promptText: z.string().min(50, "프롬프트는 최소 50자 이상이어야 합니다"),
});

/** 폼 입력값 타입 */
export type PromptInputFormValues = z.infer<typeof promptInputSchema>;
