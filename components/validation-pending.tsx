// 검증 대기 상태 UI - 카드 기반 중앙 정렬 3단계 프로세스 표시
import { CheckCircle2, Clock, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ─── 단계 아이템 컴포넌트 ───

interface StepItemProps {
  icon: React.ReactNode;
  label: string;
  state: "done" | "active" | "pending";
}

function StepItem({ icon, label, state }: StepItemProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 text-xs",
        state === "done" && "text-muted-foreground",
        state === "active" && "text-primary",
        state === "pending" && "text-muted-foreground/50",
      )}
    >
      <div
        className={cn(
          "rounded-full p-2.5",
          state === "done" && "bg-muted",
          state === "active" && "bg-primary/10 animate-pulse-soft",
          state === "pending" && "bg-muted/50",
        )}
      >
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </div>
  );
}

// ─── 단계 사이 점선 구분자 ───

function StepDivider({ done }: { done: boolean }) {
  return (
    <div
      className={cn(
        "h-px w-8 sm:w-12 mt-[-12px]",
        done ? "bg-primary/30" : "bg-border",
      )}
    />
  );
}

// ─── 메인 대기 상태 컴포넌트 ───

export function ValidationPending() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      {/* 상단 클록 아이콘 */}
      <Clock className="h-12 w-12 text-muted-foreground/40 animate-float mb-6" />

      {/* 제목 */}
      <h2 className="text-lg font-semibold mb-2">검증 대기 중</h2>

      {/* 설명 */}
      <p className="text-sm text-muted-foreground mb-8 text-center max-w-sm">
        Claude Code 터미널에서{" "}
        <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-sm">
          /validate
        </code>{" "}
        커맨드를 실행한 후 이 페이지를 새로고침하세요.
      </p>

      {/* 3단계 진행 카드 */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-center gap-3 sm:gap-4 py-6 px-4">
            {/* 1단계: 프롬프트 제출 (완료) */}
            <StepItem
              icon={<CheckCircle2 className="h-5 w-5" />}
              label="프롬프트 제출"
              state="done"
            />

            {/* 구분자: 1단계 완료 */}
            <StepDivider done={true} />

            {/* 2단계: /validate 실행 (진행 중) */}
            <StepItem
              icon={<Clock className="h-5 w-5" />}
              label="/validate 실행"
              state="active"
            />

            {/* 구분자: 2단계 미완료 */}
            <StepDivider done={false} />

            {/* 3단계: 결과 확인 (대기) */}
            <StepItem
              icon={<Eye className="h-5 w-5" />}
              label="결과 확인"
              state="pending"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
