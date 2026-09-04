"use client";

/**
 * DrawingBoard — a lightweight, functional whiteboard for the tutor page.
 * Supports freehand drawing, eraser, pen colour/size, undo and clear.
 * Strokes are stored in normalized coordinates so the board survives resizes.
 */

import * as React from "react";
import { cn } from "@/lib/utils";

interface Point {
  x: number; // 0..1
  y: number; // 0..1
}

interface Stroke {
  color: string;
  /** line width relative to a 600px-wide board */
  size: number;
  points: Point[];
}

const COLORS = [
  { value: "#0f172a", label: "Black" },
  { value: "#059669", label: "Green" },
  { value: "#2563eb", label: "Blue" },
  { value: "#dc2626", label: "Red" },
];

const SIZES = [
  { value: 3, label: "Thin" },
  { value: 6, label: "Medium" },
  { value: 12, label: "Thick" },
];

const ERASER_COLOR = "#ffffff";
const ERASER_SIZE = 28;

export function DrawingBoard({ className }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const strokesRef = React.useRef<Stroke[]>([]);
  const currentRef = React.useRef<Stroke | null>(null);

  const [color, setColor] = React.useState(COLORS[0].value);
  const [size, setSize] = React.useState(SIZES[1].value);
  const [eraser, setEraser] = React.useState(false);
  const [, forceRender] = React.useState(0);

  const redraw = React.useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const scale = w / 600;
    const all = currentRef.current
      ? [...strokesRef.current, currentRef.current]
      : strokesRef.current;
    for (const stroke of all) {
      if (stroke.points.length < 2) {
        const p = stroke.points[0];
        if (!p) continue;
        ctx.fillStyle = stroke.color;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, (stroke.size * scale) / 2, 0, Math.PI * 2);
        ctx.fill();
        continue;
      }
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size * scale;
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x * w, stroke.points[0].y * h);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x * w, stroke.points[i].y * h);
      }
      ctx.stroke();
    }
  }, []);

  // Keep the canvas backing store in sync with its displayed size (and DPR).
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      redraw();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [redraw]);

  const pointFromEvent = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)),
    };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    currentRef.current = {
      color: eraser ? ERASER_COLOR : color,
      size: eraser ? ERASER_SIZE : size,
      points: [pointFromEvent(e)],
    };
    redraw();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!currentRef.current) return;
    currentRef.current.points.push(pointFromEvent(e));
    redraw();
  };

  const endStroke = () => {
    if (!currentRef.current) return;
    strokesRef.current.push(currentRef.current);
    currentRef.current = null;
    forceRender((n) => n + 1);
  };

  const undo = () => {
    strokesRef.current.pop();
    redraw();
    forceRender((n) => n + 1);
  };

  const clear = () => {
    strokesRef.current = [];
    currentRef.current = null;
    redraw();
    forceRender((n) => n + 1);
  };

  const hasStrokes = strokesRef.current.length > 0;

  return (
    <div className={cn("flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm", className)}>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-slate-50/70 px-3 py-2" dir="ltr">
        <div className="flex items-center gap-1">
          {COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              title={c.label}
              aria-label={`Pen colour: ${c.label}`}
              onClick={() => {
                setColor(c.value);
                setEraser(false);
              }}
              className={cn(
                "h-6 w-6 rounded-full border-2 transition",
                !eraser && color === c.value ? "scale-110 border-slate-500" : "border-white shadow"
              )}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
        <span className="h-5 w-px bg-slate-200" />
        <div className="flex items-center gap-1">
          {SIZES.map((s) => (
            <button
              key={s.value}
              type="button"
              title={s.label}
              aria-label={`Pen size: ${s.label}`}
              onClick={() => {
                setSize(s.value);
                setEraser(false);
              }}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-lg transition",
                !eraser && size === s.value ? "bg-emerald-100 ring-1 ring-emerald-400" : "hover:bg-slate-100"
              )}
            >
              <span
                className="rounded-full bg-slate-700"
                style={{ width: 4 + s.value, height: 4 + s.value }}
              />
            </button>
          ))}
        </div>
        <span className="h-5 w-px bg-slate-200" />
        <button
          type="button"
          title="Eraser"
          aria-pressed={eraser}
          onClick={() => setEraser((v) => !v)}
          className={cn(
            "rounded-lg px-2 py-1 text-sm transition",
            eraser ? "bg-amber-100 ring-1 ring-amber-400" : "hover:bg-slate-100"
          )}
        >
          🧽
        </button>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            title="Undo"
            onClick={undo}
            disabled={!hasStrokes}
            className="rounded-lg px-2 py-1 text-sm transition hover:bg-slate-100 disabled:opacity-30"
          >
            ↩️
          </button>
          <button
            type="button"
            title="Clear board"
            onClick={clear}
            disabled={!hasStrokes}
            className="rounded-lg px-2 py-1 text-sm transition hover:bg-rose-50 disabled:opacity-30"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="h-64 w-full touch-none bg-white sm:h-72 lg:h-[340px]"
        style={{ cursor: eraser ? "cell" : "crosshair" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endStroke}
        onPointerLeave={endStroke}
        onPointerCancel={endStroke}
      />
    </div>
  );
}
