"use client";

import { cn } from "@/lib/utils";

export interface SelectionItem {
  id: string;
  title: string;
  subtitle?: string;
  emoji?: string;
  badge?: string;
  gradient?: string;
}

export function SelectionGrid({
  items,
  onSelect,
  selectedId,
  columns = 2,
  disabled = false,
}: {
  items: SelectionItem[];
  onSelect: (id: string) => void;
  selectedId?: string | null;
  columns?: 1 | 2 | 3;
  disabled?: boolean;
}) {
  const colClass = columns === 1 ? "grid-cols-1" : columns === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2";
  return (
    <div className={cn("grid gap-3", colClass)}>
      {items.map((item) => {
        const selected = item.id === selectedId;
        return (
          <button
            key={item.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(item.id)}
            className={cn(
              "group relative flex items-center gap-4 rounded-2xl border-2 bg-white p-4 text-left transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
              selected
                ? "border-emerald-500 bg-emerald-50/60 shadow-md shadow-emerald-500/10"
                : "border-slate-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md",
              disabled && "opacity-60"
            )}
          >
            {item.emoji && (
              <span
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-2xl",
                  item.gradient ?? "from-slate-100 to-slate-200"
                )}
              >
                {item.emoji}
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-base font-bold text-slate-900">{item.title}</span>
              {item.subtitle && <span className="mt-0.5 block truncate text-sm text-slate-500">{item.subtitle}</span>}
              {item.badge && (
                <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  {item.badge}
                </span>
              )}
            </span>
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition",
                selected ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 text-transparent"
              )}
            >
              ✓
            </span>
          </button>
        );
      })}
    </div>
  );
}
