"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { loadProgress } from "@/lib/progress";
import { difficultyLabel } from "@/lib/quiz";
import { getSubject, getTopic } from "@/lib/subjects";
import { useSession } from "@/lib/store";

function gradeFor(score: number): { emoji: string; label: string } {
  if (score >= 80) return { emoji: "🏆", label: "Shabash! Outstanding — ustad sahab is proud of you!" };
  if (score >= 55) return { emoji: "🌟", label: "Bohat acha! Strong work — keep practicing to master it." };
  if (score >= 30) return { emoji: "👍", label: "Good start! Review the topic and try once more." };
  return { emoji: "🌱", label: "Every expert was once a beginner. Let's learn it again, step by step." };
}

export default function ResultsPage() {
  const router = useRouter();
  const { language, subjectId, topicId, score, questionsAnswered, questionsCorrect, highestDifficulty, resetTopicSession } =
    useSession();
  const [mounted, setMounted] = useState(false);
  const [sessions, setSessions] = useState<ReturnType<typeof loadProgress>>([]);

  useEffect(() => {
    setMounted(true);
    setSessions(loadProgress());
    if (!language) router.replace("/select-language");
  }, [language, router]);

  if (!mounted || !language) return <LoadingScreen />;

  const subject = getSubject(subjectId ?? undefined);
  const topic = getTopic(subjectId ?? undefined, topicId ?? undefined);
  const accuracy = questionsAnswered > 0 ? Math.round((questionsCorrect / questionsAnswered) * 100) : 0;
  const grade = gradeFor(score);
  const hasCurrentSession = questionsAnswered > 0 || score > 0;

  return (
    <AppShell title="Your results" showBack>
      <div className="flex flex-col gap-6 pb-10">
        {!hasCurrentSession && sessions.length === 0 ? (
          <EmptyState
            emoji="📊"
            title="No results yet"
            description="Complete a quiz or a voice session to see your score and progress here."
            action={
              <Link href={topic ? "/learn" : "/dashboard"}>
                <Button>Start learning →</Button>
              </Link>
            }
          />
        ) : (
          <>
            {/* Current topic summary */}
            <Card className="flex flex-col items-center gap-4 p-8 text-center">
              <span className="text-6xl">{grade.emoji}</span>
              <h1 className="text-2xl font-extrabold text-slate-900">
                {topic ? `Your ${topic.name} results` : "Your progress"}
              </h1>
              <p className="text-5xl font-black text-emerald-600">⭐ {score}</p>
              <p className="max-w-md text-sm leading-relaxed text-slate-600">{grade.label}</p>

              <div className="grid w-full max-w-md grid-cols-3 gap-3 pt-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xl font-extrabold text-slate-900">
                    {questionsCorrect}/{questionsAnswered}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-400">CORRECT ANSWERS</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xl font-extrabold text-slate-900">{accuracy}%</p>
                  <p className="text-[11px] font-semibold text-slate-400">ACCURACY</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xl font-extrabold text-slate-900">{difficultyLabel(highestDifficulty)}</p>
                  <p className="text-[11px] font-semibold text-slate-400">LEVEL REACHED</p>
                </div>
              </div>

              {questionsAnswered > 0 && <ProgressBar value={questionsCorrect} max={questionsAnswered} className="w-full max-w-md" />}

              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {topic && (
                  <>
                    <Button
                      onClick={() => {
                        resetTopicSession();
                        router.push("/learn");
                      }}
                    >
                      🔁 Practice again
                    </Button>
                    <Link href="/topics">
                      <Button variant="outline">📚 New topic</Button>
                    </Link>
                  </>
                )}
                <Link href="/dashboard">
                  <Button variant="ghost">🏠 Dashboard</Button>
                </Link>
              </div>
            </Card>

            {/* History */}
            {sessions.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-extrabold text-slate-900">All your sessions 🗒️</h2>
                <Card className="divide-y divide-slate-100">
                  {sessions.slice(0, 10).map((e, i) => {
                    const s = getSubject(e.subjectId);
                    const t = getTopic(e.subjectId, e.topicId);
                    return (
                      <div key={i} className="flex items-center gap-3 p-4">
                        <span className="text-xl">{t?.emoji ?? "📘"}</span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-slate-800">
                            {t?.name ?? e.topicId} · {s?.name ?? e.subjectId}
                          </p>
                          <p className="text-xs text-slate-400">
                            {new Date(e.date).toLocaleDateString()} · {e.correct}/{e.total} correct · {difficultyLabel(e.difficultyReached)} level
                          </p>
                        </div>
                        <Chip className="border-emerald-200 bg-emerald-50 text-emerald-700">⭐ {e.score}</Chip>
                      </div>
                    );
                  })}
                </Card>
              </section>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
