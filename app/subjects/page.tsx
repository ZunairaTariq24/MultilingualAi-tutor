"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { LoadingScreen } from "@/components/LoadingScreen";
import { SelectionGrid } from "@/components/SelectionGrid";
import { Button } from "@/components/ui/Button";
import { SUBJECTS } from "@/lib/subjects";
import { useSession } from "@/lib/store";

export default function SubjectsPage() {
  const router = useRouter();
  const { language, subjectId, selectSubject } = useSession();
  const [selected, setSelected] = useState<string | null>(subjectId);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!language) router.replace("/select-language");
    setSelected(subjectId);
  }, [language, subjectId, router]);

  if (!mounted || !language) return <LoadingScreen />;

  return (
    <AppShell title="Choose a subject" showBack>
      <div className="flex flex-col gap-6 pb-10">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Kaunsa subject? 📚</h1>
          <p className="mt-1 text-sm text-slate-500">
            Pick what you want to learn today — your ustad already knows them all.
          </p>
        </div>

        <SelectionGrid
          items={SUBJECTS.map((s) => ({
            id: s.id,
            title: s.name,
            subtitle: `${s.nameUr} · ${s.topics.length} topics`,
            emoji: s.emoji,
            gradient: s.color,
          }))}
          selectedId={selected}
          onSelect={(id) => setSelected(id)}
        />

        <Button
          size="lg"
          disabled={!selected}
          onClick={() => {
            if (!selected) return;
            selectSubject(selected);
            router.push("/topics");
          }}
        >
          {selected ? "Choose a topic →" : "Select a subject first"}
        </Button>
      </div>
    </AppShell>
  );
}
