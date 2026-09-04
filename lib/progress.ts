import type { Difficulty } from "./types";

export interface ProgressEntry {
  topicId: string;
  subjectId: string;
  score: number;
  correct: number;
  total: number;
  difficultyReached: Difficulty;
  date: number;
}

const KEY = "hamzabaan-progress";

export function loadProgress(): ProgressEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ProgressEntry[]) : [];
  } catch {
    return [];
  }
}

export function recordProgress(entry: ProgressEntry): ProgressEntry[] {
  const all = loadProgress();
  all.unshift(entry);
  const trimmed = all.slice(0, 50);
  try {
    localStorage.setItem(KEY, JSON.stringify(trimmed));
  } catch {
    /* storage may be unavailable */
  }
  return trimmed;
}

export function clearProgress(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function bestScoreFor(topicId: string): number {
  return loadProgress()
    .filter((e) => e.topicId === topicId)
    .reduce((max, e) => Math.max(max, e.score), 0);
}
