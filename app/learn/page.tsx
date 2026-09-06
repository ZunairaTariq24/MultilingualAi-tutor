"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { DrawingBoard } from "@/components/DrawingBoard";
import { LoadingScreen } from "@/components/LoadingScreen";
import { TeachingBoard } from "@/components/TeachingBoard";
import { TutorChat } from "@/components/TutorChat";
import { Chip } from "@/components/ui/Chip";
import { fmt, uiFor } from "@/lib/i18n";
import { getLanguage } from "@/lib/languages";
import { getSubject, getTopic } from "@/lib/subjects";
import { useSession } from "@/lib/store";
import { cn } from "@/lib/utils";
import { applyWhiteboardAction, EMPTY_BOARD, type BoardState } from "@/lib/whiteboard";
import type { WhiteboardAction } from "@/lib/types";

export default function LearnPage() {
  const router = useRouter();
  const { language, subjectId, topicId, score } = useSession();
  const [mounted, setMounted] = useState(false);
  const [boardOpen, setBoardOpen] = useState(false);
  // AI-controlled visual state — updated only via structured whiteboard actions.
  const [board, setBoard] = useState<BoardState>(EMPTY_BOARD);

  const handleWhiteboardAction = useCallback((action: WhiteboardAction) => {
    setBoard((prev) => applyWhiteboardAction(prev, action));
  }, []);

  useEffect(() => {
    setMounted(true);
    if (!language) router.replace("/select-language");
    else if (!subjectId) router.replace("/subjects");
    else if (!topicId) router.replace("/topics");
  }, [language, subjectId, topicId, router]);

  const lang = getLanguage(language ?? undefined);
  const subject = getSubject(subjectId ?? undefined);
  const topic = getTopic(subjectId ?? undefined, topicId ?? undefined);

  if (!mounted || !lang || !subject || !topic) return <LoadingScreen label="Preparing your lesson…" />;

  const t = uiFor(lang.code);

  return (
    <AppShell title={`${topic.name} · ${subject.name}`} showBack wide>
      <div className="flex flex-col gap-4 pb-10">
        {/* Topic header */}
        <section className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <span className={cn("flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-sm", subject.color)}>
              {topic.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-extrabold text-slate-900">{topic.name}</h1>
              <p className="truncate text-sm text-slate-500">
                {subject.name} · <span className="font-urdu">{topic.nameUr}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Chip className="border-emerald-200 bg-emerald-50 text-emerald-700">🌐 {fmt(t.learningIn, { language: lang.name })}</Chip>
            <Chip className="border-amber-200 bg-amber-50 text-amber-700">⭐ {score} {t.points}</Chip>
            {score > 0 && (
              <Link href="/results" className="text-xs font-bold text-emerald-600 hover:underline">
                📊 View results →
              </Link>
            )}
          </div>
        </section>

        {/* Desktop: chat beside whiteboard. Mobile: chat, then collapsible whiteboard. */}
        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
          <div className="min-w-0">
            <TutorChat
              language={lang}
              subject={subject}
              topic={topic}
              boardLevel={board.level}
              onWhiteboardAction={handleWhiteboardAction}
            />
          </div>

          {/* Whiteboard column: AI teaching visuals + student drawing area */}
          <div className="min-w-0 lg:sticky lg:top-20">
            <button
              type="button"
              onClick={() => setBoardOpen((v) => !v)}
              className="mb-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-emerald-300 lg:hidden"
            >
              {boardOpen ? t.hideBoard : t.showBoard}
            </button>
            {/* The teacher's visual is always visible — it is part of the lesson. */}
            <p className="mb-1.5 hidden text-xs font-bold uppercase tracking-wide text-slate-400 lg:block">
              🖊️ {t.whiteboard}
            </p>
            <TeachingBoard subject={subject} topic={topic} board={board} />
            {/* Student's own drawing canvas: toggle on mobile, below on desktop. */}
            <div className={cn(boardOpen ? "block" : "hidden", "mt-3 lg:block")}>
              <DrawingBoard />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
