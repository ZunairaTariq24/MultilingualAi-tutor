"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { LANGUAGES } from "@/lib/languages";
import { useSession } from "@/lib/store";

const FEATURES = [
  { emoji: "🗣️", title: "Apni zabaan, apna andaaz", text: "Full lessons and feedback in your mother language — from Urdu to Balochi." },
  { emoji: "👨‍🏫", title: "Friendly AI ustad", text: "A patient Pakistani teacher who asks questions, finds misconceptions and guides you step by step." },
  { emoji: "📝", title: "Adaptive quizzes", text: "Questions get harder when you shine, simpler when you struggle. Always at your level." },
  { emoji: "🎙️", title: "Voice learning", text: "Explain concepts out loud — the AI listens, asks counter-questions and checks real understanding." },
];

export default function LandingPage() {
  const language = useSession((s) => s.language);

  return (
    <AppShell right={language ? <Link href="/dashboard" className="text-sm font-semibold text-emerald-700 hover:underline">My dashboard →</Link> : undefined}>
      <div className="flex flex-col gap-10 pb-10">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 px-6 py-14 text-center text-white shadow-xl shadow-emerald-900/10 sm:px-12">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-amber-300/10" />
          <p className="font-urdu mb-3 text-2xl leading-loose sm:text-3xl">اپنی زبان میں سیکھو 🇵🇰</p>
          <h1 className="mx-auto max-w-2xl text-3xl font-black tracking-tight sm:text-5xl">
            Learn anything in <span className="text-amber-300">your own zabaan</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-emerald-50 sm:text-base">
            HamZabaan AI is your personal Pakistani AI tutor. It teaches in the language you think in, quizzes you
            at your own level, and even listens when you explain out loud.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/select-language">
              <Button variant="secondary" size="lg">
                🚀 Start learning — shuru karo
              </Button>
            </Link>
            {language && (
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="border-white/40 bg-transparent text-white hover:border-white hover:text-white">
                  Continue where you left off
                </Button>
              </Link>
            )}
          </div>
        </section>

        {/* Languages strip */}
        <section className="flex flex-wrap items-center justify-center gap-2">
          {LANGUAGES.map((l) => (
            <Chip key={l.code} className="px-4 py-1.5 text-sm">
              {l.nativeName}
            </Chip>
          ))}
        </section>

        {/* Features */}
        <section className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <Card key={f.title} className="p-6">
              <span className="text-3xl">{f.emoji}</span>
              <h3 className="mt-3 text-base font-bold text-slate-900">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{f.text}</p>
            </Card>
          ))}
        </section>

        {/* How it works */}
        <section className="rounded-3xl border border-emerald-100 bg-white p-6 sm:p-8">
          <h2 className="text-center text-lg font-extrabold text-slate-900">How it works</h2>
          <div className="mt-6 grid gap-6 text-center sm:grid-cols-4">
            {[
              ["1", "🌐", "Choose your language"],
              ["2", "📚", "Pick a subject & topic"],
              ["3", "🧠", "Learn by chat, quiz or voice"],
              ["4", "🏆", "Watch your score grow"],
            ].map(([step, emoji, label]) => (
              <div key={step} className="flex flex-col items-center gap-2">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl">{emoji}</span>
                <p className="text-xs font-bold text-emerald-600">STEP {step}</p>
                <p className="text-sm font-semibold text-slate-700">{label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
