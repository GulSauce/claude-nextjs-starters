"use client";

import { useSyncExternalStore, useCallback } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScoreBadge } from "@/components/score-badge";
import { cn } from "@/lib/utils";
import type { ValidationResult } from "@/lib/types";

// localStorage 키 상수
const STORAGE_KEY = "reviewed-prompts";

// SSR 및 초기값으로 사용할 상수 빈 배열 (참조 동일성 보장)
const EMPTY_ARRAY: string[] = [];

// useSyncExternalStore가 요구하는 참조 안정성을 위한 캐시
// 이전 반환값과 내용이 동일하면 동일한 참조를 재사용
let cachedIds: string[] = EMPTY_ARRAY;
let cachedRaw: string | null = null;

function getReviewedIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // 원본 JSON 문자열이 바뀌지 않았으면 캐시된 배열 반환 (참조 동일성 유지)
    if (raw === cachedRaw) return cachedIds;
    cachedRaw = raw;
    cachedIds = raw ? JSON.parse(raw) : EMPTY_ARRAY;
    return cachedIds;
  } catch {
    return cachedIds;
  }
}

function subscribeToStorage(callback: () => void) {
  // 다른 탭에서 변경 시 동기화
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

// SSR에서는 상수 빈 배열 반환 (참조 동일성 보장)
function getServerSnapshot(): string[] {
  return EMPTY_ARRAY;
}

function getSnapshot(): string[] {
  return getReviewedIds();
}

interface HistoryCardProps {
  result: ValidationResult;
  promptText: string;
}

export function HistoryCard({ result, promptText }: HistoryCardProps) {
  // localStorage를 외부 스토어로 구독
  const reviewedIds = useSyncExternalStore(
    subscribeToStorage,
    getSnapshot,
    getServerSnapshot,
  );
  const isReviewed = reviewedIds.includes(result.promptId);

  const preview =
    promptText.length > 100 ? promptText.slice(0, 100) + "..." : promptText;

  // 체크박스 토글 핸들러
  const handleCheckboxChange = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();

      try {
        const current = getReviewedIds();
        const updated = isReviewed
          ? current.filter((id) => id !== result.promptId)
          : [...current, result.promptId];

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        // storage 이벤트는 같은 탭에서 발생하지 않으므로 수동 트리거
        window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
      } catch {
        // localStorage 쓰기 실패 시 무시
      }
    },
    [isReviewed, result.promptId],
  );

  return (
    <Link href={`/results/${result.promptId}`} className="block">
      {/* 검토 완료 시 border 색상, 배경, 왼쪽 강조선 변경하여 시각적으로 구분 */}
      <Card
        className={cn(
          "card-hover transition-colors hover:border-foreground/20",
          isReviewed &&
            "border-border/40 bg-muted/30 border-l-4 border-l-primary/30",
        )}
      >
        <CardHeader>
          {/* 체크박스 + 카드 콘텐츠를 가로로 배치 */}
          <div className="flex items-center gap-3 w-full">
            {/* 검토 완료 체크박스 - 클릭 이벤트 버블링 차단 */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              <Checkbox
                id={`reviewed-${result.promptId}`}
                checked={isReviewed}
                onClick={handleCheckboxChange}
                aria-label="검토 완료 표시"
                className="shrink-0"
              />
            </div>

            {/* 기존 카드 제목 영역 */}
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <CardTitle
                  className={cn(
                    "text-base",
                    isReviewed && "text-muted-foreground",
                  )}
                >
                  {result.targetModel}
                </CardTitle>
                {result.evaluationMode === "debate" && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0"
                  >
                    Debate
                  </Badge>
                )}
              </div>
              <CardDescription>
                {format(new Date(result.validatedAt), "yyyy년 M월 d일 HH:mm", {
                  locale: ko,
                })}
              </CardDescription>
            </div>
          </div>

          <CardAction>
            <ScoreBadge grade={result.grade} totalScore={result.totalScore} />
          </CardAction>
        </CardHeader>
        <div className="px-6 pb-2">
          <p
            className={cn(
              "line-clamp-2 text-sm",
              isReviewed ? "text-muted-foreground/60" : "text-muted-foreground",
            )}
          >
            {preview}
          </p>
        </div>
      </Card>
    </Link>
  );
}
