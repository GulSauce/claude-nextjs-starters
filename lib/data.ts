// 파일시스템 기반 데이터 CRUD 유틸리티

import fs from "fs/promises";
import path from "path";
import type {
  PromptInput,
  PromptStatus,
  TargetModel,
  ValidationResult,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const PROMPTS_DIR = path.join(DATA_DIR, "prompts");
const PENDING_DIR = path.join(PROMPTS_DIR, "pending");
const COMPLETE_DIR = path.join(PROMPTS_DIR, "complete");
const RESULTS_DIR = path.join(DATA_DIR, "results");

/** 디렉토리 존재 확인 및 생성 */
async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

/** 프롬프트 저장 */
export async function savePrompt(input: {
  targetModel: TargetModel;
  promptText: string;
}): Promise<PromptInput> {
  const prompt: PromptInput = {
    id: crypto.randomUUID(),
    targetModel: input.targetModel,
    promptText: input.promptText,
    createdAt: new Date().toISOString(),
    status: "pending",
  };

  await ensureDir(PENDING_DIR);
  await fs.writeFile(
    path.join(PENDING_DIR, `${prompt.id}.json`),
    JSON.stringify(prompt, null, 2),
  );

  return prompt;
}

/** 프롬프트 조회 (pending → complete 순서로 탐색) */
export async function getPrompt(id: string): Promise<PromptInput | null> {
  const fileName = `${id}.json`;
  for (const dir of [PENDING_DIR, COMPLETE_DIR]) {
    try {
      const data = await fs.readFile(path.join(dir, fileName), "utf-8");
      return JSON.parse(data) as PromptInput;
    } catch {
      // 해당 디렉토리에 없으면 다음 디렉토리 탐색
    }
  }
  return null;
}

/** 검증 결과 조회 */
export async function getResult(id: string): Promise<ValidationResult | null> {
  try {
    const data = await fs.readFile(
      path.join(RESULTS_DIR, `${id}.json`),
      "utf-8",
    );
    return JSON.parse(data) as ValidationResult;
  } catch {
    return null;
  }
}

/** 전체 검증 결과 목록 조회 (최신순 정렬) */
export async function getAllResults(): Promise<ValidationResult[]> {
  await ensureDir(RESULTS_DIR);

  const files = await fs.readdir(RESULTS_DIR);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  const resultsWithMtime = await Promise.all(
    jsonFiles.map(async (file) => {
      const filePath = path.join(RESULTS_DIR, file);
      const [data, stat] = await Promise.all([
        fs.readFile(filePath, "utf-8"),
        fs.stat(filePath),
      ]);
      return {
        result: JSON.parse(data) as ValidationResult,
        mtime: stat.mtimeMs,
      };
    }),
  );

  // 파일 수정 시각 기준 최신순 정렬
  return resultsWithMtime
    .sort((a, b) => b.mtime - a.mtime)
    .map(({ result }) => result);
}

/** 프롬프트 상태 업데이트 (validated 시 pending → complete로 파일 이동) */
export async function updatePromptStatus(
  id: string,
  status: PromptStatus,
): Promise<void> {
  const prompt = await getPrompt(id);
  if (!prompt) {
    throw new Error(`프롬프트를 찾을 수 없습니다: ${id}`);
  }

  const updated: PromptInput = { ...prompt, status };
  const fileName = `${id}.json`;

  if (status === "validated") {
    await ensureDir(COMPLETE_DIR);
    await fs.writeFile(
      path.join(COMPLETE_DIR, fileName),
      JSON.stringify(updated, null, 2),
    );
    // pending 디렉토리에서 삭제 (없어도 무시)
    await fs.unlink(path.join(PENDING_DIR, fileName)).catch(() => {});
  } else {
    await ensureDir(PENDING_DIR);
    await fs.writeFile(
      path.join(PENDING_DIR, fileName),
      JSON.stringify(updated, null, 2),
    );
  }
}
