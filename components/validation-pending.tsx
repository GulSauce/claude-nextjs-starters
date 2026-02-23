import { Clock } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ValidationPending() {
  return (
    <Alert>
      <Clock className="h-4 w-4" />
      <AlertTitle>아직 검증이 완료되지 않았습니다</AlertTitle>
      <AlertDescription>
        <p>
          Claude Code 터미널에서{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-sm">
            /validate
          </code>{" "}
          커맨드를 실행한 후 이 페이지를 새로고침하세요.
        </p>
      </AlertDescription>
    </Alert>
  );
}
