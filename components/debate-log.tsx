"use client";

// 듀얼 에이전트 토론 로그를 채팅/메신저 스타일로 표시하는 컴포넌트
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  AgentRole,
  DebateMessage,
  DebatePhase,
  DebateRound,
} from "@/lib/types";

// ─── 상수 정의 ───

/** 역할별 한국어 라벨 */
const ROLE_LABEL: Record<AgentRole, string> = {
  "prompt-engineer": "프롬프트 엔지니어",
  "education-evaluator": "교육 평가 전문가",
  "consensus-moderator": "합의 조정자",
};

/** Phase별 한국어 제목 */
const PHASE_LABEL: Record<DebatePhase, string> = {
  "independent-evaluation": "Phase 1: 독립 평가",
  "cross-review": "Phase 2: 교차 검토",
  "prompt-cross-review": "Phase 2.5: 개선 프롬프트 교차 검토",
  consensus: "Phase 3: 합의 도출",
};

/** Phase 순서 (Accordion 렌더링 순서) */
const PHASE_ORDER: DebatePhase[] = [
  "independent-evaluation",
  "cross-review",
  "prompt-cross-review",
  "consensus",
];

/** 메시지 내용 최대 표시 글자 수 */
const CONTENT_MAX_LENGTH = 300;

// ─── Props 타입 ───

interface DebateLogProps {
  debateRounds: DebateRound[];
  debateLog: DebateMessage[];
}

// ─── 말풍선 정렬 및 색상 헬퍼 ───

/** 역할에 따른 말풍선 정렬 방향 반환 */
function getBubbleAlignment(role: AgentRole): "left" | "center" | "right" {
  if (role === "prompt-engineer") return "left";
  if (role === "education-evaluator") return "right";
  return "center"; // consensus-moderator
}

/** 역할에 따른 말풍선 색상 클래스 반환 */
function getBubbleColorClass(role: AgentRole): string {
  if (role === "prompt-engineer") {
    return "bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800";
  }
  if (role === "education-evaluator") {
    return "bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800";
  }
  // consensus-moderator
  return "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800";
}

/** 역할에 따른 뱃지 색상 클래스 반환 */
function getRoleBadgeClass(role: AgentRole): string {
  if (role === "prompt-engineer") {
    return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
  }
  if (role === "education-evaluator") {
    return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
  }
  return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
}

/** ISO 타임스탬프를 HH:mm 형식으로 변환 */
function formatTime(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return timestamp;
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return timestamp;
  }
}

// ─── 개별 메시지 말풍선 컴포넌트 ───

interface MessageBubbleProps {
  message: DebateMessage;
  /** 메시지 고유 키 (토글 상태 관리용) */
  messageKey: string;
  expandedKeys: Set<string>;
  onToggleExpand: (key: string) => void;
}

function MessageBubble({
  message,
  messageKey,
  expandedKeys,
  onToggleExpand,
}: MessageBubbleProps) {
  const alignment = getBubbleAlignment(message.role);
  const bubbleColor = getBubbleColorClass(message.role);
  const badgeColor = getRoleBadgeClass(message.role);
  const isLong = message.content.length > CONTENT_MAX_LENGTH;
  const isExpanded = expandedKeys.has(messageKey);

  /** 표시할 메시지 내용 (더 보기 상태에 따라 결정) */
  const displayContent =
    isLong && !isExpanded
      ? message.content.slice(0, CONTENT_MAX_LENGTH) + "..."
      : message.content;

  return (
    <div
      className={cn(
        "flex w-full",
        alignment === "left" && "justify-start",
        alignment === "right" && "justify-end",
        alignment === "center" && "justify-center",
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-1",
          // 모바일: 85%, 데스크탑: 70%
          "max-w-[85%] md:max-w-[70%]",
          // 합의 조정자는 중앙 정렬이므로 좌우 텍스트 기준도 중앙
          alignment === "center" && "items-center",
          alignment === "left" && "items-start",
          alignment === "right" && "items-end",
        )}
      >
        {/* 에이전트 이름 + 역할 뱃지 */}
        <div
          className={cn(
            "flex items-center gap-2",
            alignment === "right" && "flex-row-reverse",
          )}
        >
          <span className="text-xs font-semibold text-foreground">
            {message.agent}
          </span>
          <Badge
            variant="outline"
            className={cn(
              "border-transparent px-1.5 py-0 text-[10px] font-medium",
              badgeColor,
            )}
          >
            {ROLE_LABEL[message.role]}
          </Badge>
        </div>

        {/* 말풍선 본체 */}
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            bubbleColor,
            // 방향별 말풍선 모서리 조정
            alignment === "left" && "rounded-tl-sm",
            alignment === "right" && "rounded-tr-sm",
            alignment === "center" && "rounded-xl",
          )}
        >
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {displayContent}
          </p>

          {/* 더 보기 / 접기 토글 버튼 */}
          {isLong && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 h-auto px-0 py-0.5 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => onToggleExpand(messageKey)}
            >
              {/* TODO: 클릭 시 토글 로직 구현 - 상위 컴포넌트에서 onToggleExpand 호출 */}
              {isExpanded ? "접기" : "더 보기"}
            </Button>
          )}
        </div>

        {/* 타임스탬프 */}
        <span className="text-[10px] text-muted-foreground">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}

// ─── Phase 섹션 내 메시지 목록 컴포넌트 ───

interface PhaseMessagesProps {
  messages: DebateMessage[];
  phaseIndex: number;
  expandedKeys: Set<string>;
  onToggleExpand: (key: string) => void;
}

function PhaseMessages({
  messages,
  phaseIndex,
  expandedKeys,
  onToggleExpand,
}: PhaseMessagesProps) {
  if (messages.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        이 단계의 메시지가 없습니다.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-2">
      {messages.map((message, msgIndex) => {
        // 메시지별 고유 키: phaseIndex-msgIndex-timestamp
        const messageKey = `${phaseIndex}-${msgIndex}-${message.timestamp}`;
        return (
          <MessageBubble
            key={messageKey}
            message={message}
            messageKey={messageKey}
            expandedKeys={expandedKeys}
            onToggleExpand={onToggleExpand}
          />
        );
      })}
    </div>
  );
}

// ─── 메인 DebateLog 컴포넌트 ───

export function DebateLog({ debateRounds, debateLog }: DebateLogProps) {
  // 각 메시지의 "더 보기" 토글 상태를 Set으로 관리
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  /** 메시지 더 보기 / 접기 토글 핸들러 */
  const handleToggleExpand = (key: string) => {
    // TODO: 실제 토글 상태 업데이트 로직
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Phase별 메시지 수집: debateRounds에서 우선 조합, 없으면 debateLog에서 필터링
  const getMessagesForPhase = (phase: DebatePhase): DebateMessage[] => {
    // debateRounds에서 해당 phase의 라운드를 찾아 messages 반환
    const round = debateRounds.find((r) => r.phase === phase);
    if (round && round.messages.length > 0) {
      return round.messages;
    }
    // 폴백: debateLog 전체에서 phase로 필터링
    return debateLog.filter((msg) => msg.phase === phase);
  };

  // 모든 Phase가 Accordion에서 기본으로 열린 상태
  const defaultOpenValues = PHASE_ORDER.map((phase) => `phase-${phase}`);

  return (
    <div className="w-full space-y-2">
      <Accordion
        type="multiple"
        defaultValue={defaultOpenValues}
        className="w-full"
      >
        {PHASE_ORDER.map((phase, phaseIndex) => {
          const messages = getMessagesForPhase(phase);
          const round = debateRounds.find((r) => r.phase === phase);

          return (
            <AccordionItem
              key={phase}
              value={`phase-${phase}`}
              className="rounded-lg border px-2 mb-2 last:mb-0"
            >
              <AccordionTrigger className="py-3 hover:no-underline">
                <div className="flex items-center gap-2">
                  {/* Phase 번호 뱃지 */}
                  <Badge
                    variant="outline"
                    className="shrink-0 border-muted-foreground/30 text-xs font-mono text-muted-foreground"
                  >
                    {phaseIndex + 1}
                  </Badge>
                  {/* Phase 제목 */}
                  <span className="font-medium text-sm">
                    {PHASE_LABEL[phase]}
                  </span>
                  {/* 메시지 수 표시 */}
                  <span className="text-xs text-muted-foreground">
                    ({messages.length}개)
                  </span>
                  {/* 완료 여부 표시 */}
                  {round?.completedAt && (
                    <Badge
                      variant="outline"
                      className="border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 text-[10px] px-1.5 py-0"
                    >
                      완료
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-1 pb-3">
                <PhaseMessages
                  messages={messages}
                  phaseIndex={phaseIndex}
                  expandedKeys={expandedKeys}
                  onToggleExpand={handleToggleExpand}
                />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* 메시지가 전혀 없는 경우 안내 메시지 */}
      {debateRounds.length === 0 && debateLog.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">토론 로그가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
