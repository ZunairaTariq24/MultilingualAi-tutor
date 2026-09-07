"use client";

/**
 * TutorChat — the Ustad Sahab interactive teacher.
 *
 * The AI is called ONLY on explicit student actions: pressing "Start lesson",
 * sending a message, or finishing a spoken "Explain It Yourself" turn. No AI
 * call happens on mount, render or navigation, and failed requests are never
 * retried automatically.
 *
 * Session states (spec): NORMAL_TUTOR → EXPLAIN_IT_YOURSELF → LISTENING →
 * ANALYZING → COUNTER_QUESTION / CONFUSION_DETECTED → … →
 * UNDERSTANDING_CONFIRMED / SESSION_COMPLETE. The "I understood everything"
 * button flips the chat into a voice-only phase: the mic opens automatically,
 * the student explains aloud, and the transcript is analysed by the tutor.
 */

import Link from "next/link";
import * as React from "react";
import { Button } from "@/components/ui/Button";
import { uiFor } from "@/lib/i18n";
import { recordProgress } from "@/lib/progress";
import { markTopicAttended, recordLearningInsight, recordLessonConcepts } from "@/lib/learning-records";
import {
  speakText,
  speechRecognitionSupported,
  startListening,
  stopSpeaking,
  type SpeechErrorKind,
  type SpeechListener,
} from "@/lib/speech";
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
  WhiteboardAction,
} from "@/lib/types";

interface Bubble extends TutorTurn {
  id: string;
}

/** Frontend phase of the session — NORMAL chat vs voice-only explain phase. */
type SessionMode = "NORMAL" | "EXPLAIN";

const ANSWER_STAGES: TutorStage[] = ["PRACTICE", "EVALUATION", "COUNTER_QUESTION", "RETRY"];
/** Stages after which "I understood everything" makes sense. */
const UNDERSTOOD_BTN_STAGES: TutorStage[] = [
  "EXPLANATION",
  "PRACTICE",
  "EVALUATION",
  "COUNTER_QUESTION",
  "RETRY",
];

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
  boardLevel,
  onWhiteboardAction,
}: {
  language: Language;
  subject: Subject;
  topic: Topic;
  /** Level currently shown on the teaching board (0 = empty). */
  boardLevel: number;
  /** Structured whiteboard commands coming back from the tutor. */
  onWhiteboardAction: (action: WhiteboardAction) => void;
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

  // --- Explain It Yourself state ---
  const [mode, setMode] = React.useState<SessionMode>("NORMAL");
  const [quizMode, setQuizMode] = React.useState(false);
  const [listening, setListening] = React.useState(false);
  const [voiceError, setVoiceError] = React.useState<SpeechErrorKind | null>(null);
  const [transcript, setTranscript] = React.useState({ final: "", interim: "" });
  const listenerRef = React.useRef<SpeechListener | null>(null);
  const transcriptRef = React.useRef({ final: "", interim: "" });
  const modeRef = React.useRef<SessionMode>("NORMAL");
  modeRef.current = mode;

  const lastPayloadRef = React.useRef<TutorRequest | null>(null);
  // React state updates are asynchronous, so `busy` alone cannot prevent two
  // rapid browser events from entering run() before the next render.
  const requestInFlightRef = React.useRef(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const boardLevelRef = React.useRef(boardLevel);
  boardLevelRef.current = boardLevel;

  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [bubbles, busy, listening]);

  // Clean up mic + speaker when the component goes away.
  React.useEffect(
    () => () => {
      listenerRef.current?.stop();
      stopSpeaking();
    },
    []
  );

  /* ------------------------------- microphone ------------------------------- */

  const stopMic = React.useCallback(() => {
    listenerRef.current?.stop();
    listenerRef.current = null;
  }, []);

  const startMic = React.useCallback(() => {
    stopMic();
    setVoiceError(null);
    transcriptRef.current = { final: "", interim: "" };
    setTranscript({ final: "", interim: "" });
    if (!speechRecognitionSupported()) {
      setVoiceError("unsupported");
      return;
    }
    const listener = startListening(language.recognitionLocale, {
      onTranscript: (final, interim) => {
        transcriptRef.current = { final, interim };
        setTranscript({ final, interim });
      },
      onError: (kind) => setVoiceError(kind),
      onEnd: () => setListening(false),
    });
    if (listener) {
      listenerRef.current = listener;
      setListening(true);
    }
  }, [language.recognitionLocale, stopMic]);

  /* -------------------------------- tutor call ------------------------------- */

  const handleCompleted = React.useCallback(() => {
    setCompleted(true);
    setMode("NORMAL");
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
    markTopicAttended(subject.id, topic.id);
  }, [subject.id, topic.id]);

const run = React.useCallback(
  async (payload: TutorRequest, isAnswer: boolean) => {
    if (requestInFlightRef.current) return;
    requestInFlightRef.current = true;
    setBusy(true);
    setError(false);
    lastPayloadRef.current = payload;

    try {
      const reply = await callTutor(payload);

      recordLessonConcepts(subject.id, topic.id, reply.lessonConcepts);
      if (isAnswer) recordLearningInsight(subject.id, topic.id, reply.learningInsight);

      setBubbles((prev) => [
        ...prev,
        {
          id: uid("m"),
          role: "tutor",
          content: reply.message,
        },
      ]);

      // REDIRECT keeps the lesson where it was — do not advance the flow.
      if (reply.stage !== "REDIRECT") {
        setStage(reply.stage);
      }

      // Structured whiteboard command → predefined frontend visual.
      if (reply.whiteboardAction !== "NONE") {
        onWhiteboardAction(reply.whiteboardAction);
      }

      if (isAnswer && reply.understandingLevel !== "UNKNOWN") {
        const good = reply.understandingLevel === "STRONG";
        const partial = reply.understandingLevel === "PARTIAL";

        recordAnswer(good || partial);

        if (good) {
          addPoints(10);
        } else if (partial) {
          addPoints(5);
        }
      }

      const done =
        reply.stage === "COMPLETED" || !reply.shouldContinue;

      if (done) {
        handleCompleted();
      } else if (modeRef.current === "EXPLAIN") {
        if (reply.teachingState === "UNDERSTOOD") {
          // Student demonstrated understanding.
          // Return to normal tutoring after the AI response.
          setMode("NORMAL");

          speakText(reply.message, language.ttsLocale);
        } else {
          // Ustad Sahab gives feedback first.
          // ONLY after TTS finishes do we reopen the microphone.
          speakText(reply.message, language.ttsLocale, () => {
            if (!completed) {
              startMic();
            }
          });
        }
      }
    } catch {
      setError(true);
    } finally {
      requestInFlightRef.current = false;
      setBusy(false);
    }
  },
  [
    addPoints,
    recordAnswer,
    handleCompleted,
    onWhiteboardAction,
    language.ttsLocale,
    startMic,
    subject.id,
    topic.id,
  ]
);
const historyFrom = (list: Bubble[]): TutorTurn[] =>
  list.slice(-6).map(({ role, content }) => ({
    role,
    content: content.slice(0, 420),
  }));
  const basePayload = () => ({
    language: language.code,
    subjectId: subject.id,
    topicId: topic.id,
    boardLevel: boardLevelRef.current,
  });

  /** Explicit student action — the first and only trigger of the lesson. */
  const startLesson = () => {
    if (started || requestInFlightRef.current) return;
    setStarted(true);
    run({ ...basePayload(), stage: "INTRODUCTION", message: "", history: [], intent: "START" }, false);
  };
const startQuiz = () => {
  if (busy || completed || requestInFlightRef.current) return;

  setQuizMode(true);

  const history = historyFrom(bubbles);

  run(
    {
      ...basePayload(),
      stage: "PRACTICE",
      message: "Start a conceptual quiz.",
      history,
      intent: "QUIZ",
    },
    false
  );
};
const send = () => {
  const text = input.trim();
  if (!text || busy || completed || requestInFlightRef.current) return;

  const mine: Bubble = {
    id: uid("m"),
    role: "student",
    content: text,
  };

  const history = historyFrom(bubbles);

  setBubbles((prev) => [...prev, mine]);
  setInput("");

  run(
    {
      ...basePayload(),
      stage: quizMode ? "PRACTICE" : stage,
      message: text,
      history,
      intent: quizMode ? "QUIZ" : "CHAT",
    },
    ANSWER_STAGES.includes(stage) || quizMode
  );
};
  const retry = () => {
    if (lastPayloadRef.current && !busy && !requestInFlightRef.current)
      run(lastPayloadRef.current, ANSWER_STAGES.includes(lastPayloadRef.current.stage));
  };

  /* --------------------------- Explain It Yourself --------------------------- */

  /** "I understood everything" — flips to the voice-only explain phase. */
  const beginExplainPhase = () => {
    if (busy || completed) return;
    setMode("EXPLAIN");
    setBubbles((prev) => [...prev, { id: uid("m"), role: "tutor", content: t.explainYourselfPrompt }]);
    speakText(t.explainYourselfPrompt, language.ttsLocale);
    startMic();
  };

  /** Student finished speaking — send the transcript for analysis. */
  const submitExplanation = (typedFallback?: string) => {
    if (busy || completed || requestInFlightRef.current) return;
    stopMic();
    stopSpeaking();
    const spoken = `${transcriptRef.current.final} ${transcriptRef.current.interim}`.trim();
    const text = (typedFallback ?? spoken).trim();
    if (!text) return;
    transcriptRef.current = { final: "", interim: "" };
    setTranscript({ final: "", interim: "" });
    const mine: Bubble = { id: uid("m"), role: "student", content: `🎙️ ${text}` };
    const history = historyFrom(bubbles);
    setBubbles((prev) => [...prev, mine]);
    setInput("");
    run({ ...basePayload(), stage, message: text, history, intent: "SELF_EXPLANATION" }, true);
  };

  const exitExplainPhase = () => {
    stopMic();
    stopSpeaking();
    setMode("NORMAL");
    setVoiceError(null);
  };

  /* ----------------------------------- UI ----------------------------------- */

  const liveText = `${transcript.final} ${transcript.interim}`.trim();
  const analyzing = busy && mode === "EXPLAIN";
  const showUnderstoodBtn =
    started &&
    !completed &&
    !busy &&
    !error &&
    mode === "NORMAL" &&
    UNDERSTOOD_BTN_STAGES.includes(stage);

  const voiceErrorText =
    voiceError === "unsupported"
      ? t.voiceErrorUnsupported
      : voiceError === "permission"
        ? t.voiceErrorPermission
        : voiceError === "network"
          ? t.voiceErrorNetwork
          : voiceError
            ? t.voiceErrorGeneric
            : null;

  const statusLabel = analyzing
    ? t.analyzing
    : busy
      ? t.thinking
      : listening
        ? t.listening
        : t.online;

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
        <span className="flex max-w-[45%] items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm">
          <span
            className={cn(
              "h-2 w-2 shrink-0 rounded-full",
              busy ? "animate-pulse bg-amber-400" : listening ? "animate-pulse bg-rose-500" : "bg-emerald-500"
            )}
          />
          <span className={cn("truncate", language.rtl && "font-urdu")}>{statusLabel}</span>
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
            <Button onClick={startLesson} size="lg" disabled={busy}>
              {t.startLesson}
            </Button>
          </div>
        ) : (
          <>
            {bubbles.map((b) => (
              <div key={b.id} className={cn("flex", b.role === "student" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "group relative max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                    language.rtl && "font-urdu text-base",
                    b.role === "student"
                      ? "rounded-br-sm bg-emerald-600 text-white"
                      : "rounded-bl-sm bg-slate-100 text-slate-800"
                  )}
                >
                  {b.content}
                  {b.role === "tutor" && (
                    <button
                      type="button"
                      title={t.hearAgain}
                      onClick={() => speakText(b.content, language.ttsLocale)}
                      className="ms-2 inline-block align-middle text-xs opacity-40 transition hover:opacity-100"
                    >
                      🔊
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Live "I'm listening" indicator with the growing transcript */}
            {mode === "EXPLAIN" && listening && (
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-sm border-2 border-dashed border-rose-300 bg-rose-50 px-4 py-2.5">
                  <p className="flex items-center gap-2 text-xs font-bold text-rose-600">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
                    </span>
                    🎙️ <span className={cn(language.rtl && "font-urdu")}>{t.listening}</span>
                  </p>
                  {liveText && (
                    <p className={cn("mt-1.5 text-sm text-slate-700", language.rtl && "font-urdu text-base")}>
                      {liveText}
                    </p>
                  )}
                </div>
              </div>
            )}

            {busy && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                  {analyzing && (
                    <span className={cn("text-xs text-slate-500", language.rtl && "font-urdu")}>{t.analyzing}</span>
                  )}
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

      {/* Footer: normal input, or voice-only controls in the explain phase */}
      <div className="border-t border-slate-100 p-3">
        {mode === "EXPLAIN" && !completed ? (
          <div className="flex flex-col gap-2" dir={language.rtl ? "rtl" : "ltr"}>
            {voiceErrorText && (
              <p className={cn("rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700", language.rtl && "font-urdu")}>
                {voiceErrorText}
              </p>
            )}
            {voiceError === "unsupported" || voiceError === "permission" ? (
              /* Graceful fallback: mic is unavailable, let them type the explanation. */
              <form
                className="flex items-end gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  submitExplanation(input);
                }}
              >
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t.explainInOwnWords}
                  rows={2}
                  disabled={busy}
                  className={cn(
                    "max-h-28 flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-400 focus:bg-white disabled:opacity-50",
                    language.rtl && "font-urdu text-base"
                  )}
                />
                <Button type="submit" disabled={busy || !input.trim()}>
                  {t.send}
                </Button>
              </form>
            ) : (
             <div className="flex flex-col gap-3">
  {/* Recording status */}
  <div
    className={cn(
      "flex items-center justify-center gap-3 rounded-xl px-4 py-3",
      listening
        ? "border border-rose-200 bg-rose-50"
        : "border border-slate-200 bg-slate-50"
    )}
  >
    <span
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full text-lg",
        listening
          ? "animate-pulse bg-rose-500 text-white"
          : "bg-slate-200 text-slate-600"
      )}
    >
      🎙️
    </span>

    <div className="text-center">
      <p
        className={cn(
          "text-sm font-bold",
          listening
            ? "text-rose-700"
            : "text-slate-700",
          language.rtl && "font-urdu"
        )}
      >
        {listening
          ? t.listening
          : t.explainInOwnWords}
      </p>

      {liveText && (
        <p
          className={cn(
            "mt-1 text-xs text-slate-500",
            language.rtl && "font-urdu"
          )}
        >
          {liveText}
        </p>
      )}
    </div>
  </div>

  {/* Voice controls */}
  <div className="flex gap-2">
    {listening ? (
      <Button
        type="button"
        onClick={() => submitExplanation()}
        disabled={busy || !liveText}
        className="flex-1"
      >
        ⏹️ {t.doneExplaining}
      </Button>
    ) : (
      <Button
        type="button"
        onClick={startMic}
        disabled={busy}
        className="flex-1"
      >
        🎙️ {t.listening}
      </Button>
    )}

    <Button
      type="button"
      variant="outline"
      onClick={exitExplainPhase}
      disabled={busy}
      title="Back to typing"
    >
      ⌨️
    </Button>
  </div>
</div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {showUnderstoodBtn && (
              <Button
                variant="secondary"
                onClick={beginExplainPhase}
                className={cn("w-full", language.rtl && "font-urdu")}
              >
                {t.understoodEverything}
              </Button>
            )}
            
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
        )}
      </div>
    </div>
  );
}
