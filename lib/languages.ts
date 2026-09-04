import type { Language, LanguageCode } from "./types";

/**
 * Centralized language configuration — the ONE language system.
 * Every AI request, speech recognition and TTS voice reads from here.
 * Never assume "language = X" makes the LLM respond in X: the script,
 * instruction and style below enforce it, and lib/tutor.ts validates the output.
 */
export const LANGUAGES: Language[] = [
  {
    code: "urdu",
    name: "Urdu",
    nativeName: "اردو",
    greeting: "السلام علیکم! میں آپ کا استاد ہوں۔",
    rtl: true,
    ttsLocale: "ur-PK",
    recognitionLocale: "ur-PK",
    script: "Nastaliq (Arabic-based Urdu script)",
    style: "Warm school-teacher tone, short sentences, everyday Urdu vocabulary.",
    aiInstruction:
      "Write your ENTIRE reply natively in Urdu script (اردو). Compose your thoughts DIRECTLY in Urdu — never write English first and translate it. Never answer in Roman Urdu or English sentences. Use simple, natural everyday Urdu that a Pakistani school student understands. Keep English technical terms only when no common Urdu word exists.",
  },
  {
    code: "roman-urdu",
    name: "Roman Urdu",
    nativeName: "Roman Urdu",
    greeting: "Assalam o Alaikum! Main aap ka ustad hoon.",
    rtl: false,
    ttsLocale: "en-PK",
    recognitionLocale: "ur-PK",
    script: "Latin letters (Roman)",
    style: "Exactly how a Pakistani student speaks in Roman Urdu — natural, friendly, conversational.",
    aiInstruction:
      "Write your ENTIRE reply in Roman Urdu ONLY — Urdu words in English letters, e.g. 'Paani dhoop se bhaap banta hai'. NEVER use Urdu/Arabic script and never switch to English sentences. Compose directly in Roman Urdu, exactly like a Pakistani student speaks.",
  },
  {
    code: "punjabi",
    name: "Punjabi",
    nativeName: "پنجابی",
    greeting: "اسلام علیکم! میں تہاڈا استاد آں۔",
    rtl: true,
    ttsLocale: "pa-PK",
    recognitionLocale: "pa-PK",
    script: "Shahmukhi",
    style: "Natural Pakistani Punjabi as spoken in Punjab — warm, simple, student-friendly.",
    aiInstruction:
      "Teach naturally in Pakistani Punjabi using Shahmukhi script, e.g. 'سورج دی روشنی نال پاݨی بھاء بݨدا اے'. Compose DIRECTLY in Punjabi — never Urdu, never Roman Urdu, never English sentences. Punjabi is NOT Urdu: use Punjabi grammar and words (اے، نال، تسی، کرو، دسو).",
  },
  {
    code: "pashto",
    name: "Pashto",
    nativeName: "پښتو",
    greeting: "السلام عليکم! زه ستاسو ښوونکی یم.",
    rtl: true,
    ttsLocale: "ps-PK",
    recognitionLocale: "ps-PK",
    script: "Pashto (Arabic-based, with ښ ږ ړ ټ ډ ڼ ې ۍ)",
    style: "Simple Pashto as spoken in KPK, school-student level.",
    aiInstruction:
      "Write your ENTIRE reply natively in Pashto as spoken in Pakistan (KPK), e.g. 'د لمر په رڼا کې اوبه په بخار بدلېږي'. Compose DIRECTLY in Pashto — never Urdu, Roman Urdu or English sentences. Use the Pashto letters (ښ، ږ، ړ، ټ، ډ، ڼ) where required. Use simple words a school student understands.",
  },
  {
    code: "sindhi",
    name: "Sindhi",
    nativeName: "سنڌي",
    greeting: "السلام عليڪم! مان توهان جو استاد آهيان.",
    rtl: true,
    ttsLocale: "sd-PK",
    recognitionLocale: "sd-PK",
    script: "Sindhi (Arabic-based, with ٻ ڄ ڳ ڱ ڻ ٿ ٽ ٺ ڊ ڍ ڏ ڦ ڃ ڪ گھ)",
    style: "Simple friendly Sindhi for school students.",
    aiInstruction:
      "Write your ENTIRE reply natively in Sindhi (Arabic-based Sindhi script), e.g. 'سج جي روشنيءَ سان پاڻي ٻاڦ بڻجي ٿو'. Compose DIRECTLY in Sindhi — never Urdu, Roman Urdu or English sentences. Sindhi is NOT Urdu: use Sindhi letters (ڪ، ٻ، ڄ، ڳ، ٿ) and Sindhi grammar.",
  },
  {
    code: "saraiki",
    name: "Saraiki",
    nativeName: "سرائیکی",
    greeting: "السلام علیکم! میں تیݙا استاد ہاں۔",
    rtl: true,
    ttsLocale: "ur-PK",
    recognitionLocale: "ur-PK",
    script: "Saraiki (Arabic-based, with ݙ ٻ ڄ ڳ)",
    style: "Simple Saraiki as spoken in South Punjab.",
    aiInstruction:
      "Write your ENTIRE reply natively in Saraiki (Arabic-based script) as spoken in South Punjab, Pakistan, e.g. 'سورج دی دھپ نال پاݨی بھا بݨ ویندے'. Compose DIRECTLY in Saraiki — never Urdu, Roman Urdu or English sentences. Saraiki is NOT Urdu: use Saraiki words and letters (ݙ، ٻ، ڄ، ڳ).",
  },
  {
    code: "balochi",
    name: "Balochi",
    nativeName: "بلوچی",
    greeting: "سلام! من شماے استاد ئے.",
    rtl: true,
    ttsLocale: "ur-PK",
    recognitionLocale: "ur-PK",
    script: "Balochi (Arabic-based)",
    style: "Simple Balochi as spoken in Balochistan, school-student level.",
    aiInstruction:
      "Write your ENTIRE reply natively in Balochi (Arabic-based script) as spoken in Balochistan, Pakistan. Compose DIRECTLY in Balochi — never Urdu, Roman Urdu or English sentences. Balochi is NOT Urdu. If a scientific term has no common Balochi word, keep that single term simple and explain it in Balochi.",
  },
  {
    code: "english",
    name: "English",
    nativeName: "English",
    greeting: "Assalam o Alaikum! I am your teacher.",
    rtl: false,
    ttsLocale: "en-PK",
    recognitionLocale: "en-PK",
    script: "English (Latin)",
    style: "Clear, short sentences; no jargon; Pakistani school context.",
    aiInstruction:
      "Write your ENTIRE reply in clear, simple English suitable for a Pakistani school student. Short sentences, no jargon.",
  },
];

export function getLanguage(code: string | null | undefined): Language | undefined {
  return LANGUAGES.find((l) => l.code === code);
}

export function requireLanguage(code: string | null | undefined): Language {
  const lang = getLanguage(code);
  if (!lang) throw new Error(`Unknown language: ${code}`);
  return lang;
}

export const isRtl = (code: LanguageCode | string | null | undefined) =>
  getLanguage(code)?.rtl ?? false;
