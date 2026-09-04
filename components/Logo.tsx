import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-lg shadow-sm">
        🗣️
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block text-base font-extrabold tracking-tight text-slate-900">
            Ham<span className="text-emerald-600">Zabaan</span> AI
          </span>
          <span className="block text-[10px] font-medium text-slate-400">Apni zabaan mein seekho</span>
        </span>
      )}
    </span>
  );
}
