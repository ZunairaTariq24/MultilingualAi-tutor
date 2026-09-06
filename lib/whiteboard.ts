/**
 * Whiteboard visuals — predefined, progressive teaching diagrams.
 *
 * The AI never generates HTML/CSS or image URLs. It only returns a
 * WhiteboardAction (LEVEL_1..LEVEL_5, NEXT_LEVEL, SIMPLIFY_DIAGRAM, …) and the
 * frontend maps that action onto the visual levels defined here.
 *
 * Visual complexity grows with understanding (level 1 = simplest picture,
 * level 5 = full diagram/equation). Confusion ⇒ the AI simplifies back down.
 */

import { getCurriculum } from "./curriculum";
import type { WhiteboardAction } from "./types";

export type VisualNodeKind = "input" | "process" | "output" | "note";

export interface VisualNode {
  emoji: string;
  text: string;
  kind: VisualNodeKind;
}

export interface VisualLevel {
  /** 1..5 */
  level: number;
  /** Short caption shown above the diagram (English + symbols, kept simple). */
  caption: string;
  nodes: VisualNode[];
  /** Render input → process → output flow arrows. */
  showFlow?: boolean;
  /** Optional equation rendered in a highlighted box. */
  equation?: string;
}

export interface BoardState {
  level: number; // 0 = empty board
  highlight: "inputs" | "outputs" | null;
}

export const EMPTY_BOARD: BoardState = { level: 0, highlight: null };

/* ------------------------- hand-crafted progressions ------------------------- */

const PHOTOSYNTHESIS_LEVELS: VisualLevel[] = [
  {
    level: 1,
    caption: "A green plant",
    nodes: [
      { emoji: "🌱", text: "Plant with green leaves", kind: "process" },
      { emoji: "🍃", text: "Leaf = tiny food factory", kind: "note" },
    ],
  },
  {
    level: 2,
    caption: "What the plant needs",
    nodes: [
      { emoji: "☀️", text: "Sunlight", kind: "input" },
      { emoji: "💧", text: "Water (H₂O)", kind: "input" },
      { emoji: "🌬️", text: "Carbon dioxide (CO₂)", kind: "input" },
      { emoji: "🌱", text: "Leaf factory", kind: "process" },
    ],
  },
  {
    level: 3,
    caption: "How the inputs reach the leaf",
    nodes: [
      { emoji: "🌬️", text: "CO₂ enters through the leaf", kind: "input" },
      { emoji: "💧", text: "Water comes up from the roots", kind: "input" },
      { emoji: "☀️", text: "Sunlight gives energy to chlorophyll", kind: "input" },
      { emoji: "🍃", text: "Chlorophyll (green colour) captures light", kind: "process" },
    ],
    showFlow: true,
  },
  {
    level: 4,
    caption: "The photosynthesis equation",
    nodes: [
      { emoji: "🌬️", text: "6CO₂", kind: "input" },
      { emoji: "💧", text: "6H₂O", kind: "input" },
      { emoji: "☀️", text: "Light energy", kind: "input" },
      { emoji: "🍬", text: "C₆H₁₂O₆ (glucose)", kind: "output" },
      { emoji: "🫧", text: "6O₂ (oxygen)", kind: "output" },
    ],
    showFlow: true,
    equation: "6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂",
  },
  {
    level: 5,
    caption: "The whole process connected",
    nodes: [
      { emoji: "🌬️", text: "CO₂ → enters the leaf", kind: "input" },
      { emoji: "💧", text: "H₂O → comes from the roots", kind: "input" },
      { emoji: "☀️", text: "Sunlight → provides energy", kind: "input" },
      { emoji: "🍃", text: "Chlorophyll turns them into food", kind: "process" },
      { emoji: "🍬", text: "Glucose → food / energy storage", kind: "output" },
      { emoji: "🫧", text: "O₂ → released for us to breathe", kind: "output" },
    ],
    showFlow: true,
    equation: "6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂",
  },
];

const WATER_CYCLE_LEVELS: VisualLevel[] = [
  {
    level: 1,
    caption: "Water on Earth",
    nodes: [
      { emoji: "🌊", text: "Rivers, lakes and the sea", kind: "process" },
      { emoji: "☀️", text: "The sun heats the water", kind: "note" },
    ],
  },
  {
    level: 2,
    caption: "Evaporation",
    nodes: [
      { emoji: "☀️", text: "Sun's heat", kind: "input" },
      { emoji: "🌊", text: "Water in rivers / sea", kind: "input" },
      { emoji: "💨", text: "Water vapour rises up", kind: "output" },
    ],
    showFlow: true,
  },
  {
    level: 3,
    caption: "Condensation — clouds form",
    nodes: [
      { emoji: "💨", text: "Vapour rises and cools", kind: "input" },
      { emoji: "☁️", text: "Tiny droplets form clouds", kind: "output" },
    ],
    showFlow: true,
  },
  {
    level: 4,
    caption: "Precipitation — rain falls",
    nodes: [
      { emoji: "☁️", text: "Heavy clouds", kind: "input" },
      { emoji: "🌧️", text: "Rain (or snow in Murree)", kind: "output" },
    ],
    showFlow: true,
  },
  {
    level: 5,
    caption: "The full water cycle",
    nodes: [
      { emoji: "☀️", text: "1. Evaporation — sun heats water", kind: "input" },
      { emoji: "☁️", text: "2. Condensation — clouds form", kind: "process" },
      { emoji: "🌧️", text: "3. Precipitation — rain falls", kind: "process" },
      { emoji: "🏞️", text: "4. Collection — back to the Indus & sea", kind: "output" },
    ],
    showFlow: true,
    equation: "Evaporation → Condensation → Precipitation → Collection → …",
  },
];

const CUSTOM_LEVELS: Record<string, VisualLevel[]> = {
  "science/photosynthesis": PHOTOSYNTHESIS_LEVELS,
  "science/water-cycle": WATER_CYCLE_LEVELS,
};

/* --------------------------- generic progressions --------------------------- */

/**
 * Topics without a hand-crafted diagram get an auto progression built from the
 * local curriculum: each level reveals more key concepts (never AI-invented).
 */
function genericLevels(subjectId: string, topicId: string, emoji: string, title: string): VisualLevel[] {
  const cur = getCurriculum(subjectId, topicId);
  const concepts = cur?.keyConcepts ?? [];
  const chunk = (count: number): VisualNode[] =>
    concepts.slice(0, count).map((c, i) => ({
      emoji: ["🔹", "🔸", "🟢", "🟡", "🔺", "⭐", "💠", "🧩"][i % 8],
      text: c,
      kind: "note" as const,
    }));
  const n = concepts.length;
  return [
    { level: 1, caption: title, nodes: [{ emoji, text: title, kind: "process" }] },
    { level: 2, caption: "First key ideas", nodes: chunk(Math.max(1, Math.ceil(n / 4))) },
    { level: 3, caption: "Building the picture", nodes: chunk(Math.max(2, Math.ceil(n / 2))) },
    { level: 4, caption: "Almost complete", nodes: chunk(Math.max(3, Math.ceil((3 * n) / 4))) },
    { level: 5, caption: "The complete picture", nodes: chunk(n), showFlow: false },
  ];
}

export function getVisualLevels(
  subjectId: string,
  topicId: string,
  topicEmoji: string,
  topicName: string
): VisualLevel[] {
  return CUSTOM_LEVELS[`${subjectId}/${topicId}`] ?? genericLevels(subjectId, topicId, topicEmoji, topicName);
}

/** One-line description of every level — embedded in the tutor prompt so the model picks actions contextually. */
export function describeVisualLevels(levels: VisualLevel[]): string {
  return levels
    .map((l) => `LEVEL_${l.level}: ${l.caption} (${l.nodes.map((nd) => nd.text).join("; ")}${l.equation ? `; equation: ${l.equation}` : ""})`)
    .join("\n");
}

/* ------------------------------ action reducer ------------------------------ */

export function applyWhiteboardAction(state: BoardState, action: WhiteboardAction): BoardState {
  switch (action) {
    case "CLEAR":
      return { level: 0, highlight: null };
    case "LEVEL_1":
    case "LEVEL_2":
    case "LEVEL_3":
    case "LEVEL_4":
    case "LEVEL_5":
      return { level: Number(action.slice(6)), highlight: null };
    case "NEXT_LEVEL":
      return { level: Math.min(5, state.level + 1), highlight: null };
    case "SIMPLIFY_DIAGRAM":
      return { level: Math.max(1, state.level - 1), highlight: null };
    case "HIGHLIGHT_INPUTS":
      return { ...state, level: Math.max(1, state.level), highlight: "inputs" };
    case "HIGHLIGHT_OUTPUTS":
      return { ...state, level: Math.max(1, state.level), highlight: "outputs" };
    case "NONE":
    default:
      return state;
  }
}
