// 프롬프트 저장 API

import { NextResponse } from "next/server";
import { promptInputSchema } from "@/lib/schemas";
import { savePrompt } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = promptInputSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "유효성 검사 실패", details: result.error.flatten() },
        { status: 400 },
      );
    }

    const prompt = await savePrompt(result.data);
    return NextResponse.json(prompt, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 },
    );
  }
}
