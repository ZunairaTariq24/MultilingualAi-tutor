"use client";

/**
 * TutorChat — the Ustad Sahab chatbot.
 *
 * The AI is called ONLY on explicit student actions: pressing "Start lesson"
 * or sending a message. No AI call happens on mount, render or navigation.
 * A failed request is never retried automatically — the student gets a
 * friendly localized message and may press "Try again" themselves.
 */

import Link from "next/link";
import * as React from "react";
import { Button } from "@/components/ui/Button";
import { fmt, uiFor } from "@/lib/i18n";
import { recordProgress } from "@/lib/progress";
import { useSession } from "@/lib/store";
import { cn, uid } from "@/lib/utils";
import type {
  Language,
  Subject,
  Topic,
  TutorReply,
  TutorRequest,
  TutorStage,
  TutorTurn,
} from "@/lib/types";

interface Bubble extends TutorTurn {
  id: string;
}

const ANSWER_STAGES: TutorStage[] = ["PRACTICE", "EVALUATION", "COUNTER_QUESTION", "RETRY"];

async function callTutor(body: TutorRequest): Promise<TutorReply> {
  const res = await fetch("/api/tutor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`tutor_${res.status}`);
  return (await res.json()) as TutorReply;
}

export function TutorChat({
  language,
  subject,
  topic,
}: {
  language: Language;
  subject: Subject;
  topic: Topic;
}) {
  const t = uiFor(language.code);
  const { addPoints, recordAnswer } = useSession();

  const [bubbles, setBubbles] = React.useState<Bubble[]>([]);
  const [stage, setStage] = React.useState<TutorStage>("INTRODUCTION");
  const [started, setStarted] = React.useState(false);
  const [completed, setCompleted] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [input, setInput] = React.useState("");
  const lastPayloadRef = React.useRef<TutorRequest | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [bubbles, busy]);

  const handleCompleted = React.useCallback(() => {
    setCompleted(true);
    const s = useSession.getState();
    recordProgress({
      topicId: topic.id,
      subjectId: subject.id,
      score: s.score,
      correct: s.questionsCorrect,
      total: s.questionsAnswered,
      difficultyReached: s.highestDifficulty,
      date: Date.now(),
    });
  }, [subject.id, topic.id]);

  const run = React.useCallback(
    async (payload: TutorRequest, isAnswer: boolean) => {
      setBusy(true);
      setError(false);
      lastPayloadRef.current = payload;
      try {
        const reply = await callTutor(payload);
        setBubbles((prev) => [...prev, { id: uid("m"), role: "tutor", content: reply.message }]);
        // REDIRECT keeps the lesson where it was — do not advance the flow.
        if (reply.stage !== "REDIRECT") setStage(reply.stage);
        if (isAnswer && reply.understandingLevel !== "UNKNOWN") {
          const good = reply.understandingLevel === "STRONG";
          const partial = reply.understandingLevel === "PARTIAL";
          recordAnswer(good || partial);
          if (good) addPoints(10);
          else if (partial) addPoints(5);
        }
        if (reply.stage === "COMPLETED" || !reply.shouldContinue) handleCompleted();
      } catch {
        setError(true);
      } finally {
        setBusy(false);
      }
    },
    [addPoints, recordAnswer, handleCompleted]
  );

  const historyFrom = (list: Bubble[]): TutorTurn[] =>
    list.slice(-12).map(({ role, content }) => ({ role, content }));

  /** Explicit student action — the first and only trigger of the lesson. */
  const startLesson = () => {
    setStarted(true);
    run(
      {
        language: language.code,
        subjectId: subject.id,
        topicId: topic.id,
        stage: "INTRODUCTION",
        message: "",
        history: [],
      },
      false
    );
  };

  const send = () => {
    const text = input.trim();
    if (!text || busy || completed) return;
    const mine: Bubble = { id: uid("m"), role: "student", content: text };
    const history = historyFrom(bubbles);
    setBubbles((prev) => [...prev, mine]);
    setInput("");
    run(
      {
        language: language.code,
        subjectId: subject.id,
        topicId: topic.id,
        stage,
        message: text,
        history,
      },
      ANSWER_STAGES.includes(stage)
    );
  };

  const retry = () => {
    if (lastPayloadRef.current && !busy) run(lastPayloadRef.current, ANSWER_STAGES.includes(lastPayloadRef.current.stage));
  };

  return (
    <div className="flex h-[540px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:h-[560px]">
      {/* Tutor header */}
      <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-amber-50/50 px-4 py-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-lg text-white shadow-sm">
          🧑‍🏫
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-extrabold text-slate-900">Ustad Sahab</p>
          <p className="truncate text-xs text-slate-500">
            {subject.name} · {topic.name} · {language.nativeName}
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm">
          <span className={cn("h-2 w-2 rounded-full", busy ? "animate-pulse bg-amber-400" : "bg-emerald-500")} />
          {busy ? t.thinking : t.online}
        </span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" dir={language.rtl ? "rtl" : "ltr"}>
        {!started ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <span className="text-5xl">{topic.emoji}</span>
            <p className={cn("max-w-sm text-sm leading-relaxed text-slate-600", language.rtl && "font-urdu")}>
              {language.greeting}
            </p>
            <Button onClick={startLesson} size="lg">
              {t.startLesson}
            </Button>
          </div>
        ) : (
          <>
            {bubbles.map((b) => (
              <div key={b.id} className={cn("flex", b.role === "student" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                    language.rtl && "font-urdu text-base",
                    b.role === "student"
                      ? "rounded-br-sm bg-emerald-600 text-white"
                      : "rounded-bl-sm bg-slate-100 text-slate-800"
                  )}
                >
                  {b.content}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                </div>
              </div>
            )}
            {error && !busy && (
              <div className="flex flex-col items-start gap-2">
                <div className={cn("rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700", language.rtl && "font-urdu")}>
                  {t.chatError}
                </div>
                <Button variant="outline" size="sm" onClick={retry}>
                  {t.tryAgain}
                </Button>
              </div>
            )}
            {completed && (
              <div className="flex flex-col items-center gap-2 py-2">
                <p className={cn("text-sm font-bold text-emerald-700", language.rtl && "font-urdu")}>{t.lessonComplete}</p>
                <Link href="/results">
                  <Button variant="secondary" size="sm">
                    {t.seeResults}
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-slate-100 p-3">
        <form
          className="flex items-end gap-2"
          dir={language.rtl ? "rtl" : "ltr"}
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={t.askAnything}
            rows={1}
            disabled={!started || busy || completed}
            className={cn(
              "max-h-28 min-h-[44px] flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:bg-white disabled:opacity-50",
              language.rtl && "font-urdu text-base"
            )}
          />
          <Button type="submit" disabled={!started || busy || completed || !input.trim()}>
            {t.send}
          </Button>
        </form>
      </div>
    </div>
  );
}
