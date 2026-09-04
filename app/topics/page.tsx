"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { getLanguage } from "@/lib/languages";
import { bestScoreFor } from "@/lib/progress";
import { getSubject } from "@/lib/subjects";
import { useSession } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function TopicsPage() {
  const router = useRouter();
  const { language, subjectId, selectTopic } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!language) router.replace("/select-language");
    else if (!subjectId) router.replace("/subjects");
  }, [language, subjectId, router]);

  const subject = getSubject(subjectId ?? undefined);
  const scores = useMemo(() => {
    const map: Record<string, number> = {};
    if (mounted && subject) {
      for (const t of subject.topics) map[t.id] = bestScoreFor(t.id);
    }
    return map;
  }, [mounted, subject]);

  if (!mounted || !language || !subject) return <LoadingScreen />;

  const lang = getLanguage(language);

  return (
    <AppShell title={`${subject.name} topics`} showBack>
      <div className="flex flex-col gap-6 pb-10">
        <div className="flex items-center gap-4">
          <span className={cn("flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-sm", subject.color)}>
            {subject.emoji}
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{subject.name} kaunsa topic?</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              {subject.nameUr} · Lessons will be in <strong>{lang?.name}</strong>
            </p>
          </div>
        </div>

        {subject.topics.length === 0 ? (
          <EmptyState emoji="📭" title="No topics yet" description="Topics for this subject are coming soon." />
        ) : (
          <div className="grid gap-3">
            {subject.topics.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  selectTopic(subject.id, t.id);
                  router.push("/learn");
                }}
                className="group flex items-center gap-4 rounded-2xl border-2 border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl transition group-hover:bg-emerald-50">
                  {t.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-bold text-slate-900">{t.name}</span>
                    <span className="font-urdu text-xs text-slate-400">{t.nameUr}</span>
                    {scores[t.id] > 0 && (
                      <Chip className="border-amber-200 bg-amber-50 text-amber-700">⭐ Best: {scores[t.id]}</Chip>
                    )}
                  </span>
                  <span className="mt-0.5 block text-sm text-slate-500">{t.description}</span>
                </span>
                <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-500">→</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
