export type LanguageCode =
  | "urdu"
  | "roman-urdu"
  | "punjabi"
  | "pashto"
  | "sindhi"
  | "saraiki"
  | "balochi"
  | "english";

export type Difficulty = "easy" | "medium" | "hard";

export type Verdict = "correct" | "partial" | "incorrect";

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  greeting: string;
  rtl: boolean;
  ttsLocale: string;
  recognitionLocale: string;
  /** Preferred writing script, e.g. "Shahmukhi", "Arabic-based", "Latin", "English" */
  script: string;
  /** Style guidance fed to the AI alongside the tutor instruction */
  style: string;
  /** Instruction given to the AI about how to write in this language */
  aiInstruction: string;
}

/* ---------------- AI tutor (Ustad Sahab) ---------------- */

/** Learning-flow stages the tutor moves through. REDIRECT is response-only:
 *  it is returned when the student asked something outside the lesson. */
export type TutorStage =
  | "INTRODUCTION"
  | "EXPLANATION"
  | "PRACTICE"
  | "EVALUATION"
  | "COUNTER_QUESTION"
  | "RETRY"
  | "COMPLETED"
  | "REDIRECT";

export type UnderstandingLevel = "STRONG" | "PARTIAL" | "WEAK" | "UNKNOWN";

/** One turn of the tutor conversation (kept client-side, replayed to the API). */
export interface TutorTurn {
  role: "student" | "tutor";
  content: string;
}

/** Request body for POST /api/tutor. */
export interface TutorRequest {
  language: string;
  subjectId: string;
  topicId: string;
  stage: TutorStage;
  /** Empty for the explicit "start lesson" action. */
  message: string;
  history: TutorTurn[];
}

/** Structured tutor reply — the backend never returns raw model text blindly. */
export interface TutorReply {
  message: string;
  stage: TutorStage;
  understandingLevel: UnderstandingLevel;
  shouldContinue: boolean;
}

export interface Topic {
  id: string;
  name: string;
  nameUr: string;
  emoji: string;
  description: string;
}

export interface Subject {
  id: string;
  name: string;
  nameUr: string;
  emoji: string;
  color: string;
  topics: Topic[];
}

