"use client";

/**
 * TeachingBoard — the AI-controlled half of the whiteboard.
 *
 * Renders the predefined visual level the tutor requested via a structured
 * whiteboardAction (see lib/whiteboard.ts). The teacher "builds" the diagram
 * step by step: level 1 is the simplest picture, level 5 the full process
 * with equation. HIGHLIGHT_* pulses the input/output nodes.
 */

import * as React from "react";
import { getVisualLevels, type BoardState, type VisualNode } from "@/lib/whiteboard";
import { cn } from "@/lib/utils";
import type { Subject, Topic } from "@/lib/types";

const KIND_STYLES: Record<VisualNode["kind"], string> = {
  input: "border-sky-200 bg-sky-50 text-sky-800",
  process: "border-emerald-200 bg-emerald-50 text-emerald-800",
  output: "border-amber-200 bg-amber-50 text-amber-800",
  note: "border-slate-200 bg-slate-50 text-slate-700",
};

export function TeachingBoard({
  subject,
  topic,
  board,
  className,
}: {
  subject: Subject;
  topic: Topic;
  board: BoardState;
  className?: string;
}) {
  const levels = React.useMemo(
    () => getVisualLevels(subject.id, topic.id, topic.emoji, topic.name),
    [subject.id, topic.id, topic.emoji, topic.name]
  );
  const visual = levels.find((l) => l.level === board.level) ?? null;

  const inputs = visual?.nodes.filter((n) => n.kind === "input") ?? [];
  const processes = visual?.nodes.filter((n) => n.kind === "process") ?? [];
  const outputs = visual?.nodes.filter((n) => n.kind === "output") ?? [];
  const notes = visual?.nodes.filter((n) => n.kind === "note") ?? [];

  const nodeChip = (n: VisualNode, i: number, pulse: boolean) => (
    <span
      key={`${n.text}-${i}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold shadow-sm transition",
        KIND_STYLES[n.kind],
        pulse && "animate-pulse ring-2 ring-offset-1",
        pulse && n.kind === "input" && "ring-sky-400",
        pulse && n.kind === "output" && "ring-amber-400"
      )}
      dir="auto"
    >
      <span className="text-base leading-none">{n.emoji}</span>
      {n.text}
    </span>
  );

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all",
        className
      )}
      dir="ltr"
    >
      {!visual ? (
        <div className="flex min-h-[120px] flex-col items-center justify-center gap-2 text-center">
          <span className="text-3xl opacity-60">{topic.emoji}</span>
          <p className="text-xs text-slate-400">Ustad Sahab will draw here as the lesson goes on…</p>
        </div>
      ) : (
        <div key={`${board.level}-${board.highlight}`} className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{visual.caption}</p>
            <span className="flex items-center gap-1" title={`Detail level ${visual.level} of 5`}>
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    s <= visual.level ? "bg-emerald-500" : "bg-slate-200"
                  )}
                />
              ))}
            </span>
          </div>

          {visual.showFlow && (inputs.length > 0 || outputs.length > 0) ? (
            <div className="flex flex-col items-stretch gap-2">
              <div className="flex flex-wrap justify-center gap-2">
                {inputs.map((n, i) => nodeChip(n, i, board.highlight === "inputs"))}
              </div>
              {(processes.length > 0 || outputs.length > 0) && (
                <div className="text-center text-lg leading-none text-slate-400">↓</div>
              )}
              {processes.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                  {processes.map((n, i) => nodeChip(n, i, false))}
                </div>
              )}
              {processes.length > 0 && outputs.length > 0 && (
                <div className="text-center text-lg leading-none text-slate-400">↓</div>
              )}
              <div className="flex flex-wrap justify-center gap-2">
                {outputs.map((n, i) => nodeChip(n, i, board.highlight === "outputs"))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-2">
              {visual.nodes.map((n, i) =>
                nodeChip(
                  n,
                  i,
                  (board.highlight === "inputs" && n.kind === "input") ||
                    (board.highlight === "outputs" && n.kind === "output")
                )
              )}
            </div>
          )}

          {visual.showFlow && notes.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">{notes.map((n, i) => nodeChip(n, i, false))}</div>
          )}

          {visual.equation && (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-3 py-2 text-center text-sm font-bold text-emerald-800">
              {visual.equation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
