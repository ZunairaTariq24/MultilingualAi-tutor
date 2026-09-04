"use client";

import { Button } from "./Button";

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  retryLabel = "Try again",
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-12 text-center">
      <span className="text-4xl">😕</span>
      <h3 className="text-lg font-bold text-rose-700">{title}</h3>
      {message && <p className="max-w-sm text-sm text-rose-600/80">{message}</p>}
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
