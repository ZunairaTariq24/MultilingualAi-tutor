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

/** The tutor's live diagnosis of the student's current understanding state. */
export type TeachingState =
  | "UNDERSTOOD"
  | "PARTIALLY_UNDERSTOOD"
  | "CONFUSED"
  | "MISCONCEPTION"
  | "OFF_TRACK"
  | "NEEDS_EXAMPLE"
  | "NEEDS_VISUAL"
  | "NEEDS_SIMPLIFICATION"
  | "UNKNOWN";

/** What the tutor plans to do next (drives adaptive teaching, not a script). */
export type NextStrategy =
  | "TEACH"
  | "COUNTER_QUESTION"
  | "SIMPLIFY"
  | "EXAMPLE"
  | "VISUAL"
  | "ADVANCE"
  | "CONFIRM"
  | "NONE";

/**
 * Structured whiteboard commands the model may request. Each maps to a
 * predefined frontend visual — the AI never generates markup or image URLs.
 */
export type WhiteboardAction =
  | "NONE"
  | "CLEAR"
  | "LEVEL_1"
  | "LEVEL_2"
  | "LEVEL_3"
  | "LEVEL_4"
  | "LEVEL_5"
  | "NEXT_LEVEL"
  | "SIMPLIFY_DIAGRAM"
  | "HIGHLIGHT_INPUTS"
  | "HIGHLIGHT_OUTPUTS";

/** Why the student message is being sent to the tutor. */
export type TutorIntent = "START" | "CHAT" | "SELF_EXPLANATION" | "QUIZ" | "PERSONALIZED_QUIZ";

export type LearningInsightStatus = "understood" | "partial" | "misconception" | "confused";

export interface LearningInsight {
  concept: string;
  status: LearningInsightStatus;
  keyPoint?: string;
  studentEvidence?: string;
}

export interface QuizQuestion {
  id: string;
  concept: string;
  question: string;
  options: string[];
  correctOption: number;
  explanation: string;
}

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
  /** START = start lesson, CHAT = normal message, SELF_EXPLANATION = spoken "explain it yourself" transcript. */
  intent?: TutorIntent;
  /** Whiteboard level currently shown to the student (0 = empty board). */
  boardLevel?: number;
  /** Local, compact learning profile used only for one explicit quiz generation request. */
  learningProfile?: LearningInsight[];
}

/** Structured tutor reply — the backend never returns raw model text blindly. */
export interface TutorReply {
  message: string;
  stage: TutorStage;
  understandingLevel: UnderstandingLevel;
  shouldContinue: boolean;
  teachingState: TeachingState;
  whiteboardAction: WhiteboardAction;
  nextStrategy: NextStrategy;
  /** Concept tracking extracted from the student's explanation. */
  conceptsUnderstood: string[];
  misconceptions: string[];
  missingConcepts: string[];
  /** Concepts actually explained or checked in this response, for local student notes. */
  lessonConcepts?: string[];
  /** Insight from this student's submitted response; absent for lesson start. */
  learningInsight?: LearningInsight;
  /** Present only for the explicit personalized-quiz request. */
  quiz?: QuizQuestion[];
}

export interface Topic {
  id: string;
  name: string;
  nameUr: string;
  emoji: string;
  description: string;
  /** Optional smaller ideas that can be covered within the lesson. */
  subtopics?: string[];
}

export interface SubjectCategory {
  id: string;
  name: string;
  nameUr: string;
  emoji: string;
  topics: Topic[];
}

export interface Subject {
  id: string;
  name: string;
  nameUr: string;
  emoji: string;
  color: string;
  /** Organizes the selection experience without changing tutor identifiers. */
  categories: SubjectCategory[];
  /** Flattened category topics retained for existing consumers and lookups. */
  topics: Topic[];
}

