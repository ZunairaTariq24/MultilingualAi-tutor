import type { Difficulty } from "./types";

export const QUESTIONS_PER_SESSION = 5;
export const MAX_WRONG_ATTEMPTS = 3;

export const DIFFICULTY_ORDER: Difficulty[] = ["easy", "medium", "hard"];

/** Adaptive difficulty: correct answers raise it, wrong answers lower it. */
export function nextDifficulty(current: Difficulty, correct: boolean): Difficulty {
  const idx = DIFFICULTY_ORDER.indexOf(current);
  if (correct) return DIFFICULTY_ORDER[Math.min(idx + 1, DIFFICULTY_ORDER.length - 1)];
  return DIFFICULTY_ORDER[Math.max(idx - 1, 0)];
}

export function simplerDifficulty(current: Difficulty): Difficulty {
  const idx = DIFFICULTY_ORDER.indexOf(current);
  return DIFFICULTY_ORDER[Math.max(idx - 1, 0)];
}

export function pointsFor(difficulty: Difficulty): number {
  switch (difficulty) {
    case "easy":
      return 10;
    case "medium":
      return 15;
    case "hard":
      return 20;
  }
}

export function difficultyLabel(d: Difficulty): string {
  return d === "easy" ? "Easy" : d === "medium" ? "Medium" : "Hard";
}

export function difficultyColor(d: Difficulty): string {
  return d === "easy"
    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
    : d === "medium"
      ? "bg-amber-100 text-amber-700 border-amber-200"
      : "bg-rose-100 text-rose-700 border-rose-200";
}
