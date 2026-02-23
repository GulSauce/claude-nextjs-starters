// 프롬프트 상태 조회 API

import { NextResponse } from "next/server";
import { getPrompt } from "@/lib/data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const prompt = await getPrompt(id);

    if (!prompt) {
      return NextResponse.json(
        { error: "프롬프트를 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    return NextResponse.json({ status: prompt.status });
  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 },
    );
  }
}
