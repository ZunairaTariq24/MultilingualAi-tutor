import * as React from "react";
import { cn } from "@/lib/utils";

export function Chip({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600",
        className
      )}
    >
      {children}
    </span>
  );
}
