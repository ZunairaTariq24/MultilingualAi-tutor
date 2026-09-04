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
import { getLanguage } from "@/lib/languages";
import { loadProgress } from "@/lib/progress";
import { SUBJECTS, getSubject, getTopic } from "@/lib/subjects";
import { useSession } from "@/lib/store";

export default function DashboardPage() {
  const router = useRouter();
  const { language, studentName, subjectId, topicId, resetTopicSession } = useSession();
  const [mounted, setMounted] = useState(false);
  const [entries, setEntries] = useState<ReturnType<typeof loadProgress>>([]);

  useEffect(() => {
    setMounted(true);
    setEntries(loadProgress());
  }, []);

  useEffect(() => {
    if (mounted && !language) router.replace("/select-language");
  }, [mounted, language, router]);

  if (!mounted || !language) return <LoadingScreen label="Loading your dashboard…" />;

  const lang = getLanguage(language);
  const continueSubject = getSubject(subjectId ?? undefined);
  const continueTopic = getTopic(subjectId ?? undefined, topicId ?? undefined);
  const totalSessions = entries.length;
  const bestScore = entries.reduce((m, e) => Math.max(m, e.score), 0);
  const totalCorrect = entries.reduce((s, e) => s + e.correct, 0);
  const totalQuestions = entries.reduce((s, e) => s + e.total, 0);

  return (
    <AppShell title="Dashboard">
      <div className="flex flex-col gap-6 pb-10">
        {/* Greeting */}
        <section className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white shadow-lg shadow-emerald-900/10 sm:p-8">
          <p className="text-sm font-medium text-emerald-100">Assalam o Alaikum{studentName ? `, ${studentName}` : ""}! 👋</p>
          <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Aaj kya seekhna hai?</h1>
          <p className="mt-2 max-w-lg text-sm text-emerald-50">
            Learning in <strong>{lang?.name}</strong>. Pick a subject below, or continue your last topic.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/select-language">
              <Chip className="border-white/30 bg-white/10 text-white">🌐 {lang?.nativeName}</Chip>
            </Link>
            <Chip className="border-white/30 bg-white/10 text-white">🏆 Best score: {bestScore}</Chip>
            <Chip className="border-white/30 bg-white/10 text-white">
              ✅ {totalCorrect}/{totalQuestions} answers correct
            </Chip>
          </div>
        </section>

        {/* Continue learning */}
        {continueSubject && continueTopic ? (
          <Card className="flex flex-col gap-3 border-emerald-200 bg-emerald-50/50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                {continueTopic.emoji}
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-600">Continue learning</p>
                <p className="text-base font-bold text-slate-900">
                  {continueTopic.name} · {continueSubject.name}
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                resetTopicSession();
                router.push("/learn");
              }}
            >
              ▶️ Resume
            </Button>
          </Card>
        ) : (
          <EmptyState
            emoji="🎒"
            title="No topic in progress"
            description="Choose a subject below to start your first lesson."
          />
        )}

        {/* Subjects quick-access */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900">Subjects 📚</h2>
            <Link href="/subjects" className="text-sm font-semibold text-emerald-600 hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {SUBJECTS.map((s) => (
              <Link
                key={s.id}
                href="/topics"
                onClick={() => useSession.getState().selectSubject(s.id)}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
              >
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} text-2xl shadow-sm`}>
                  {s.emoji}
                </span>
                <span className="text-sm font-bold text-slate-900">{s.name}</span>
                <span className="font-urdu text-xs text-slate-400">{s.nameUr}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent activity */}
        <section>
          <h2 className="mb-3 text-lg font-extrabold text-slate-900">Recent activity 🗒️</h2>
          {entries.length === 0 ? (
            <EmptyState
              emoji="🌱"
              title="Abhi kuch nahi"
              description="Your quiz and voice session results will appear here once you start learning."
            />
          ) : (
            <Card className="divide-y divide-slate-100">
              {entries.slice(0, 6).map((e, i) => {
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
                        {new Date(e.date).toLocaleDateString()} · {e.correct}/{e.total} correct · reached {e.difficultyReached}
                      </p>
                    </div>
                    <Chip className="border-emerald-200 bg-emerald-50 text-emerald-700">⭐ {e.score}</Chip>
                  </div>
                );
              })}
            </Card>
          )}
        </section>
      </div>
    </AppShell>
  );
}
