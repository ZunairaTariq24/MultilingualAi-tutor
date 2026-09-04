import type { Subject, Topic } from "./types";

export const SUBJECTS: Subject[] = [
  {
    id: "maths",
    name: "Mathematics",
    nameUr: "ریاضی",
    emoji: "📐",
    color: "from-sky-500 to-blue-600",
    topics: [
      { id: "fractions", name: "Fractions", nameUr: "کسر", emoji: "🍕", description: "Parts of a whole, adding and comparing fractions" },
      { id: "algebra-basics", name: "Basic Algebra", nameUr: "بنیادی الجبرا", emoji: "🧮", description: "Variables, simple equations and solving for x" },
      { id: "percentages", name: "Percentages", nameUr: "فیصد", emoji: "💯", description: "Percent, ratios and real-life discount problems" },
      { id: "geometry", name: "Geometry Basics", nameUr: "ہندسہ", emoji: "📏", description: "Angles, triangles, area and perimeter" },
      { id: "tables", name: "Multiplication Tables", nameUr: "جدول ضرب", emoji: "✖️", description: "Times tables and fast multiplication tricks" },
    ],
  },
  {
    id: "science",
    name: "Science",
    nameUr: "سائنس",
    emoji: "🔬",
    color: "from-emerald-500 to-teal-600",
    topics: [
      { id: "photosynthesis", name: "Photosynthesis", nameUr: "ضیائی تالیف", emoji: "🌱", description: "How plants make their own food using sunlight" },
      { id: "water-cycle", name: "Water Cycle", nameUr: "آبی دورانیہ", emoji: "💧", description: "Evaporation, clouds, rain and how water circulates" },
      { id: "solar-system", name: "Solar System", nameUr: "نظام شمسی", emoji: "🪐", description: "Planets, the sun, moon and orbits" },
      { id: "human-body", name: "Human Body Systems", nameUr: "اعضائے جسم", emoji: "🫀", description: "Heart, lungs, digestion and how the body works" },
      { id: "electricity", name: "Electricity Basics", nameUr: "بجلی", emoji: "⚡", description: "Current, circuits, conductors and safety" },
    ],
  },
  {
    id: "english",
    name: "English",
    nameUr: "انگریزی",
    emoji: "📖",
    color: "from-violet-500 to-purple-600",
    topics: [
      { id: "parts-of-speech", name: "Parts of Speech", nameUr: "اقسامِ کلام", emoji: "🗣️", description: "Nouns, verbs, adjectives and adverbs" },
      { id: "tenses", name: "Tenses", nameUr: "زمانے", emoji: "⏰", description: "Past, present and future tense usage" },
      { id: "sentence-making", name: "Sentence Making", nameUr: "جملہ سازی", emoji: "✍️", description: "Building correct and meaningful sentences" },
      { id: "vocabulary", name: "Everyday Vocabulary", nameUr: "روزمرہ الفاظ", emoji: "🔤", description: "Common English words used in daily life" },
    ],
  },
  {
    id: "pak-studies",
    name: "Pakistan Studies",
    nameUr: "مطالعہ پاکستان",
    emoji: "🇵🇰",
    color: "from-green-600 to-emerald-700",
    topics: [
      { id: "independence", name: "Independence Movement", nameUr: "تحریکِ آزادی", emoji: "🕊️", description: "The struggle for Pakistan from 1857 to 1947" },
      { id: "quaid-e-azam", name: "Quaid-e-Azam", nameUr: "قائدِ اعظم", emoji: "🌙", description: "Life and leadership of Muhammad Ali Jinnah" },
      { id: "geography", name: "Geography of Pakistan", nameUr: "جغرافیہ پاکستان", emoji: "🏔️", description: "Mountains, rivers, provinces and climate" },
      { id: "national-symbols", name: "National Symbols", nameUr: "قومی علامات", emoji: "🦅", description: "Flag, anthem, national poet and symbols" },
    ],
  },
  {
    id: "islamiat",
    name: "Islamiat",
    nameUr: "اسلامیات",
    emoji: "🕌",
    color: "from-amber-500 to-orange-600",
    topics: [
      { id: "pillars", name: "Five Pillars of Islam", nameUr: "ارکانِ اسلام", emoji: "🕋", description: "Shahadah, Salah, Zakat, Sawm and Hajj" },
      { id: "akhlaq", name: "Good Character (Akhlaq)", nameUr: "اخلاق", emoji: "🤝", description: "Honesty, respect and kindness in Islam" },
      { id: "seerat", name: "Seerat-un-Nabi ﷺ", nameUr: "سیرت النبی ﷺ", emoji: "🌟", description: "Key events from the life of the Prophet ﷺ" },
      { id: "dua", name: "Daily Duas", nameUr: "روزمرہ دعائیں", emoji: "🤲", description: "Everyday supplications and their meanings" },
    ],
  },
  {
    id: "computer",
    name: "Computer Science",
    nameUr: "کمپیوٹر سائنس",
    emoji: "💻",
    color: "from-slate-600 to-slate-800",
    topics: [
      { id: "computer-parts", name: "Computer Parts", nameUr: "کمپیوٹر کے حصے", emoji: "🖥️", description: "Hardware, software, input and output devices" },
      { id: "internet-safety", name: "Internet Safety", nameUr: "انٹرنیٹ حفاظت", emoji: "🔐", description: "Passwords, privacy and staying safe online" },
      { id: "coding-basics", name: "Coding Basics", nameUr: "کوڈنگ کی بنیاد", emoji: "🧩", description: "What programs are and how logic works" },
      { id: "data-types", name: "Data & Files", nameUr: "ڈیٹا اور فائلیں", emoji: "📁", description: "Types of data, files and storage" },
    ],
  },
];

export function getSubject(id: string | null | undefined): Subject | undefined {
  return SUBJECTS.find((s) => s.id === id);
}

export function getTopic(subjectId: string | null | undefined, topicId: string | null | undefined): Topic | undefined {
  return getSubject(subjectId)?.topics.find((t) => t.id === topicId);
}
