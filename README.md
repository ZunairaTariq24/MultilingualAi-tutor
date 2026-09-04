# HamZabaan AI 🇵🇰

A multilingual AI learning/tutoring web app for Pakistani students. An AI tutor teaches in the
student's preferred language (Urdu, Roman Urdu, Punjabi, Pashto, Sindhi, Saraiki, Balochi, English),
generates adaptive quizzes, and verifies real understanding through voice conversations with
counter-questions.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

The app is fully functional without an API key (realistic demo data + heuristics). To enable
real AI responses, copy `.env.example` to `.env.local` and add your key:

```
GEMINI_API_KEY=your_key_here
```

Get a free key at https://aistudio.google.com/apikey

## Core flow

Landing → Language selection → Dashboard → Subject → Topic → Learn (AI Tutor chat / adaptive Quiz /
Voice learning) → Results & progress.

## Features

- True multilingual AI: 8 languages with RTL support. The selected language is a strict Gemini system instruction — explanations, quizzes, feedback, chat, counter-questions, diagram labels and captions are composed natively in that language (never English-first translation). Roman Urdu stays in Roman script.
- Adaptive AI teacher: explain → real-life example → question → analyse answer → detect misconceptions → feedback → counter-question, with difficulty moving up/down based on understanding
- AI Visual Whiteboard: Gemini decides when a concept needs a visual and returns a structured spec (flowchart, cycle, timeline, equation, comparison, fraction, labeled diagram) rendered dynamically
- Whiteboard controls: zoom, pan, reset, fullscreen, step-by-step caption player with node highlighting and per-language TTS
- AI-generated MCQ quizzes with adaptive difficulty (easy → medium → hard)
- Wrong answer? Misconception detection + explanation + simpler retry question
- Voice mode: speech-to-text (Web Speech API), natural counter-questions that follow the student's words, understanding score, TTS output in the selected language with graceful voice fallback
- Progress/score tracking persisted in the browser
- Loading, error and empty states everywhere; mobile-first responsive UI (tutor screen: explanation left, whiteboard right; stacked on mobile)

## Architecture

```
/app        Next.js App Router screens + /app/api/* route handlers
/api        Server-side route handler logic (chat, quiz, evaluate, explain, voice)
/components Reusable UI (buttons, cards, states, grids), AI Whiteboard + learning mode components
/lib        Types (incl. VisualSpec), language/subject data, AI service, Gemini client, quiz logic,
            speech helpers, zustand store, progress persistence
```

AI requests are made **server-side only** in API routes — the Gemini key never reaches the browser.

## Tech stack

Next.js 15 · React 19 · TypeScript · Tailwind CSS v4 · Zustand · Google Gemini API · Web Speech API
