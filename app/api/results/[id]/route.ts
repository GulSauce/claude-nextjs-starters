// 검증 결과 조회 API

import { NextResponse } from "next/server";
import { getResult } from "@/lib/data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const result = await getResult(id);

    if (!result) {
      return NextResponse.json(
        { error: "결과를 찾을 수 없습니다" },
        { status: 404 },
      );
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 },
    );
  }
}
