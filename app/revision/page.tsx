"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { getLearningRecord, recordQuizAttempt, studentNotes, type StudentLearningRecord } from "@/lib/learning-records";
import { getSubject, getTopic } from "@/lib/subjects";
import { useSession } from "@/lib/store";
import type { QuizQuestion, TutorReply } from "@/lib/types";

export default function RevisionPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { language, subjectId, topicId } = useSession();
  const [mounted, setMounted] = useState(false);
  const [record, setRecord] = useState<StudentLearningRecord | undefined>();
  const [tab, setTab] = useState<"notes" | "quiz">(params.get("tab") === "quiz" ? "quiz" : "notes");
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [generating, setGenerating] = useState(false);
  const [quizError, setQuizError] = useState(false);
  const requestRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    if (!language) router.replace("/select-language");
    else if (!subjectId || !topicId) router.replace("/topics");
    else setRecord(getLearningRecord(subjectId, topicId));
  }, [language, subjectId, topicId, router]);

  if (!mounted || !language || !subjectId || !topicId) return <LoadingScreen />;
  const subject = getSubject(subjectId);
  const topic = getTopic(subjectId, topicId);
  if (!subject || !topic || !record?.attended) return <LoadingScreen label="Preparing your revision…" />;

  const generateQuiz = async () => {
    if (requestRef.current) return;
    requestRef.current = true;
    setGenerating(true); setQuizError(false);
    try {
      const profile = [...record.revisionPoints, ...record.understoodConcepts.map((concept) => ({ concept, status: "understood" as const }))];
      const res = await fetch("/api/tutor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ language, subjectId, topicId, stage: "PRACTICE", message: "", history: [], intent: "PERSONALIZED_QUIZ", learningProfile: profile }) });
      if (!res.ok) throw new Error("quiz_failed");
      const reply = await res.json() as TutorReply;
      if (!reply.quiz || reply.quiz.length !== 5) throw new Error("invalid_quiz");
      setQuiz(reply.quiz); setAnswers({});
    } catch { setQuizError(true); }
    finally { requestRef.current = false; setGenerating(false); }
  };

  const chooseAnswer = (question: QuizQuestion, option: number) => {
    if (answers[question.id] !== undefined) return;
    const next = { ...answers, [question.id]: option };
    setAnswers(next);
    if (Object.keys(next).length === quiz.length) {
      const weakConcepts = quiz.filter((item) => next[item.id] !== item.correctOption).map((item) => item.concept);
      recordQuizAttempt(subjectId, topicId, { score: quiz.length - weakConcepts.length, totalQuestions: quiz.length, weakConcepts, completedAt: Date.now() });
      setRecord(getLearningRecord(subjectId, topicId));
    }
  };

  const completed = quiz.length > 0 && Object.keys(answers).length === quiz.length;
  const score = quiz.filter((question) => answers[question.id] === question.correctOption).length;
  const notes = studentNotes(record);

  return <AppShell title={`${topic.name} revision`} showBack>
    <div className="flex flex-col gap-5 pb-10">
      <div><h1 className="text-2xl font-extrabold text-slate-900">My Learning Notes</h1><p className="mt-1 text-sm text-slate-500">{subject.name} · {topic.name}</p></div>
      <div className="flex gap-2"><Button variant={tab === "notes" ? "primary" : "outline"} onClick={() => setTab("notes")}>🗒️ Revise</Button><Button variant={tab === "quiz" ? "primary" : "outline"} onClick={() => setTab("quiz")}>🧠 Take Test</Button></div>
      {tab === "notes" ? <>
        <Card className="p-5"><h2 className="text-lg font-extrabold text-slate-900">Topic Summary</h2><p className="mt-2 text-sm leading-relaxed text-slate-600">{notes.summary}</p></Card>
        <Card className="p-5"><h2 className="text-lg font-extrabold text-slate-900">Key Takeaways</h2><ul className="mt-3 list-inside list-disc space-y-2 text-sm text-slate-700">{notes.takeaways.map((takeaway) => <li key={takeaway}>{takeaway}</li>)}</ul></Card>
        <Card className="p-5"><h2 className="text-lg font-extrabold text-slate-900">Important Terms</h2><div className="mt-3 flex flex-wrap gap-2">{notes.terms.map((term) => <span key={term} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">{term}</span>)}</div></Card>
        <Card className="p-5"><h2 className="text-lg font-extrabold text-slate-900">Your Revision Points</h2>{record.revisionPoints.length ? <div className="mt-3 space-y-3">{record.revisionPoints.map((point, index) => <div key={`${point.concept}-${index}`} className="rounded-xl bg-amber-50 p-3"><p className="font-bold text-amber-900">⚠️ Revise: {point.concept}</p><p className="mt-1 text-sm text-amber-800">{point.keyPoint ?? "Review this idea with your tutor."}</p><p className="mt-2 text-xs font-semibold text-amber-700">Remember this correction when you revise.</p></div>)}</div> : <p className="mt-2 text-sm text-slate-500">Your tutor has not found a revision point yet. Keep practising to build your notes.</p>}</Card>
        <Card className="p-5"><h2 className="text-lg font-extrabold text-slate-900">You showed understanding</h2>{record.understoodConcepts.length ? <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-emerald-700">{record.understoodConcepts.map((concept) => <li key={concept}>{concept}</li>)}</ul> : <p className="mt-2 text-sm text-slate-500">Your confirmed strengths will appear here as you answer.</p>}</Card>
      </> : <>
        {!quiz.length && !quizError && <Card className="p-5"><h2 className="text-lg font-extrabold text-slate-900">Personalized 5-question test</h2><p className="mt-1 text-sm text-slate-500">It focuses on the ideas your tutor marked for revision.</p><Button className="mt-4" onClick={generateQuiz} loading={generating}>Generate my test</Button></Card>}
        {quizError && <EmptyState emoji="⚠️" title="Test unavailable" description="We could not generate your test. You can retry when ready." action={<Button onClick={generateQuiz} loading={generating}>Try again</Button>} />}
        {quiz.map((question, index) => <Card key={question.id} className="p-5"><p className="text-xs font-bold uppercase tracking-wide text-emerald-600">Question {index + 1} · {question.concept}</p><h2 className="mt-2 font-bold text-slate-900">{question.question}</h2><div className="mt-3 grid gap-2">{question.options.map((option, optionIndex) => { const chosen = answers[question.id]; const answered = chosen !== undefined; const state = answered ? optionIndex === question.correctOption ? "border-emerald-400 bg-emerald-50" : optionIndex === chosen ? "border-rose-400 bg-rose-50" : "border-slate-200" : "border-slate-200 hover:border-emerald-400"; return <button key={option} disabled={answered} onClick={() => chooseAnswer(question, optionIndex)} className={`rounded-xl border-2 p-3 text-left text-sm ${state}`}>{option}</button>; })}</div>{answers[question.id] !== undefined && <p className="mt-3 text-sm text-slate-600">{question.explanation}</p>}</Card>)}
        {completed && <Card className="p-5 text-center"><p className="text-4xl font-black text-emerald-600">{score}/{quiz.length}</p><h2 className="mt-2 text-lg font-extrabold text-slate-900">Test complete</h2><p className="mt-1 text-sm text-slate-600">{score === quiz.length ? "Excellent work!" : "Review the notes above for the concepts that need more practice."}</p><div className="mt-4 grid gap-3 text-left sm:grid-cols-2"><div className="rounded-xl bg-emerald-50 p-3"><p className="text-sm font-bold text-emerald-800">Strengths</p><p className="mt-1 text-xs text-emerald-700">{quiz.filter((item) => answers[item.id] === item.correctOption).map((item) => item.concept).join(", ") || "Keep practising"}</p></div><div className="rounded-xl bg-amber-50 p-3"><p className="text-sm font-bold text-amber-800">Revise</p><p className="mt-1 text-xs text-amber-700">{quiz.filter((item) => answers[item.id] !== item.correctOption).map((item) => item.concept).join(", ") || "None — excellent!"}</p></div></div><Button className="mt-4" variant="outline" onClick={() => setTab("notes")}>Review my notes</Button></Card>}
      </>}
    </div>
  </AppShell>;
}
