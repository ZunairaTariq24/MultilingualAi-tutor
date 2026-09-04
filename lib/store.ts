"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Difficulty } from "./types";

interface SessionState {
  language: string | null;
  studentName: string;
  subjectId: string | null;
  topicId: string | null;
  score: number;
  questionsAnswered: number;
  questionsCorrect: number;
  difficulty: Difficulty;
  highestDifficulty: Difficulty;

  setLanguage: (code: string) => void;
  setStudentName: (name: string) => void;
  selectSubject: (subjectId: string) => void;
  selectTopic: (subjectId: string, topicId: string) => void;
  addPoints: (points: number) => void;
  recordAnswer: (correct: boolean) => void;
  setDifficulty: (d: Difficulty) => void;
  resetTopicSession: () => void;
  resetAll: () => void;
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      language: null,
      studentName: "",
      subjectId: null,
      topicId: null,
      score: 0,
      questionsAnswered: 0,
      questionsCorrect: 0,
      difficulty: "easy",
      highestDifficulty: "easy",

      setLanguage: (code) => set({ language: code }),
      setStudentName: (name) => set({ studentName: name }),
      selectSubject: (subjectId) => set({ subjectId, topicId: null }),
      selectTopic: (subjectId, topicId) =>
        set({
          subjectId,
          topicId,
          score: 0,
          questionsAnswered: 0,
          questionsCorrect: 0,
          difficulty: "easy",
          highestDifficulty: "easy",
        }),
      addPoints: (points) => set((s) => ({ score: s.score + points })),
      recordAnswer: (correct) =>
        set((s) => ({
          questionsAnswered: s.questionsAnswered + 1,
          questionsCorrect: s.questionsCorrect + (correct ? 1 : 0),
        })),
      setDifficulty: (d) =>
        set((s) => ({
          difficulty: d,
          highestDifficulty:
            ["easy", "medium", "hard"].indexOf(d) >
            ["easy", "medium", "hard"].indexOf(s.highestDifficulty)
              ? d
              : s.highestDifficulty,
        })),
      resetTopicSession: () =>
        set({
          score: 0,
          questionsAnswered: 0,
          questionsCorrect: 0,
          difficulty: "easy",
          highestDifficulty: "easy",
        }),
      resetAll: () =>
        set({
          language: null,
          subjectId: null,
          topicId: null,
          score: 0,
          questionsAnswered: 0,
          questionsCorrect: 0,
          difficulty: "easy",
          highestDifficulty: "easy",
        }),
    }),
    { name: "hamzabaan-session" }
  )
);
