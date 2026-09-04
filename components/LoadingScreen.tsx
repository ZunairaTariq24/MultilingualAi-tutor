import { AppShell } from "./AppShell";
import { Spinner } from "./ui/Spinner";

export function LoadingScreen({ label = "Loading…" }: { label?: string }) {
  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center gap-4 py-32 text-slate-500">
        <Spinner className="h-10 w-10 text-emerald-600" />
        <p className="text-sm font-medium">{label}</p>
      </div>
    </AppShell>
  );
}
