"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { LoadingScreen } from "@/components/LoadingScreen";
import { SelectionGrid } from "@/components/SelectionGrid";
import { Button } from "@/components/ui/Button";
import { LANGUAGES } from "@/lib/languages";
import { useSession } from "@/lib/store";

export default function SelectLanguagePage() {
  const router = useRouter();
  const { language, setLanguage, studentName, setStudentName } = useSession();
  const [selected, setSelected] = useState<string | null>(language);
  const [name, setName] = useState(studentName);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSelected(language);
    setName(studentName);
  }, [language, studentName]);

  if (!mounted) return <LoadingScreen />;

  return (
    <AppShell title="Choose your language" showBack>
      <div className="flex flex-col gap-6 pb-10">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Apni zabaan chunein 🌐</h1>
          <p className="mt-1 text-sm text-slate-500">
            Your AI ustad will teach, quiz and talk with you in this language. You can change it anytime.
          </p>
        </div>

        <SelectionGrid
          items={LANGUAGES.map((l) => ({
            id: l.code,
            title: l.name,
            subtitle: l.greeting,
            emoji: "💬",
            gradient: selected === l.code ? "from-emerald-100 to-teal-100" : "from-slate-100 to-slate-200",
          }))}
          selectedId={selected}
          onSelect={(id) => setSelected(id)}
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <label className="text-sm font-bold text-slate-700" htmlFor="student-name">
            Aap ka naam? (optional)
          </label>
          <input
            id="student-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ayesha, Ali, Fatima…"
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <Button
          size="lg"
          disabled={!selected}
          onClick={() => {
            if (!selected) return;
            setLanguage(selected);
            setStudentName(name.trim());
            router.push("/dashboard");
          }}
        >
          {selected ? "Continue → aagay barhein" : "Select a language first"}
        </Button>
      </div>
    </AppShell>
  );
}
