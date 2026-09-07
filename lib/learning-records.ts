import type { LearningInsight } from "./types";
import { getCurriculum } from "./curriculum";

export interface QuizAttempt {
  score: number;
  totalQuestions: number;
  weakConcepts: string[];
  completedAt: number;
}

export interface StudentLearningRecord {
  subjectId: string;
  topicId: string;
  attended: boolean;
  understoodConcepts: string[];
  taughtConcepts: string[];
  revisionPoints: LearningInsight[];
  quizAttempts: QuizAttempt[];
}

const KEY = "hamzabaan-learning-records";

export function loadLearningRecords(): StudentLearningRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed) ? (parsed as StudentLearningRecord[]).map((record) => ({ ...record, understoodConcepts: record.understoodConcepts ?? [], taughtConcepts: record.taughtConcepts ?? [], revisionPoints: record.revisionPoints ?? [], quizAttempts: record.quizAttempts ?? [] })) : [];
  } catch {
    return [];
  }
}

export function getLearningRecord(subjectId: string, topicId: string): StudentLearningRecord | undefined {
  return loadLearningRecords().find((record) => record.subjectId === subjectId && record.topicId === topicId);
}

function write(records: StudentLearningRecord[]) {
  try { localStorage.setItem(KEY, JSON.stringify(records.slice(0, 100))); } catch { /* storage unavailable */ }
}

function update(subjectId: string, topicId: string, change: (record: StudentLearningRecord) => void) {
  const records = loadLearningRecords();
  let record = records.find((item) => item.subjectId === subjectId && item.topicId === topicId);
  if (!record) {
    record = { subjectId, topicId, attended: false, understoodConcepts: [], taughtConcepts: [], revisionPoints: [], quizAttempts: [] };
    records.unshift(record);
  }
  change(record);
  write(records);
  return record;
}

export function recordLearningInsight(subjectId: string, topicId: string, insight?: LearningInsight) {
  if (!insight?.concept.trim()) return;
  update(subjectId, topicId, (record) => {
    if (insight.status === "understood") {
      if (!record.understoodConcepts.includes(insight.concept)) record.understoodConcepts.push(insight.concept);
      record.revisionPoints = record.revisionPoints.filter((point) => point.concept.toLowerCase() !== insight.concept.toLowerCase());
      return;
    }
    record.understoodConcepts = record.understoodConcepts.filter((concept) => concept.toLowerCase() !== insight.concept.toLowerCase());
    const same = record.revisionPoints.findIndex((point) => point.concept.toLowerCase() === insight.concept.toLowerCase());
    if (same >= 0) record.revisionPoints[same] = insight;
    else record.revisionPoints.push(insight);
  });
}

export function recordLessonConcepts(subjectId: string, topicId: string, concepts: string[] = []) {
  if (!concepts.length) return;
  update(subjectId, topicId, (record) => {
    for (const concept of concepts) {
      if (concept.trim() && !record.taughtConcepts.some((item) => item.toLowerCase() === concept.toLowerCase())) record.taughtConcepts.push(concept.trim());
    }
  });
}

export function studentNotes(record: StudentLearningRecord) {
  const curriculum = getCurriculum(record.subjectId, record.topicId);
  const taught = record.taughtConcepts.length ? record.taughtConcepts : curriculum?.keyConcepts.slice(0, 3) ?? [];
  const takeaways = curriculum?.keyTakeaways?.filter((item) => taught.some((concept) => item.toLowerCase().includes(concept.toLowerCase()) || concept.toLowerCase().includes(item.toLowerCase()))) ?? [];
  const terms = curriculum?.importantTerms?.filter((term) => taught.some((concept) => concept.toLowerCase().includes(term.toLowerCase()) || term.toLowerCase().includes(concept.toLowerCase()))) ?? [];
  return {
    summary: curriculum?.studySummary ?? curriculum?.explanation.split(".").slice(0, 2).join(".") ?? "Review the ideas discussed with your tutor.",
    takeaways: takeaways.length ? takeaways : taught.slice(0, 5),
    terms: terms.length ? terms : taught.slice(0, 6),
  };
}

export function markTopicAttended(subjectId: string, topicId: string) {
  update(subjectId, topicId, (record) => { record.attended = true; });
}

export function recordQuizAttempt(subjectId: string, topicId: string, attempt: QuizAttempt) {
  update(subjectId, topicId, (record) => { record.quizAttempts.unshift(attempt); record.quizAttempts = record.quizAttempts.slice(0, 10); });
}
