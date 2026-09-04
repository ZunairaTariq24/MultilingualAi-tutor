"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { getLanguage } from "@/lib/languages";
import { useSession } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

export function AppShell({
  title,
  showBack = false,
  right,
  children,
  wide = false,
}: {
  title?: string;
  showBack?: boolean;
  right?: React.ReactNode;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const language = useSession((s) => s.language);
  const lang = getLanguage(language ?? undefined);
  const isHome = pathname === "/";

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-emerald-50/60 via-slate-50 to-amber-50/40">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className={cn("mx-auto flex h-16 items-center gap-3 px-4", wide ? "max-w-5xl" : "max-w-3xl")}>
          {showBack && !isHome ? (
            <button
              onClick={() => router.back()}
              aria-label="Go back"
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              ←
            </button>
          ) : (
            <span className="w-9" />
          )}
          <Link href={lang ? "/dashboard" : "/"} className="shrink-0">
            <Logo />
          </Link>
          {title && <h1 className="hidden flex-1 truncate text-center text-sm font-bold text-slate-700 sm:block">{title}</h1>}
          <div className="ml-auto flex items-center gap-2">
            {lang && (
              <Link
                href="/select-language"
                className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 sm:inline-flex"
              >
                🌐 {lang.nativeName}
              </Link>
            )}
            {right}
          </div>
        </div>
      </header>
      <main className={cn("mx-auto w-full flex-1 px-4 py-6", wide ? "max-w-5xl" : "max-w-3xl")}>{children}</main>
      <footer className="border-t border-slate-200/60 bg-white/60 py-4 text-center text-xs text-slate-400">
        HamZabaan AI — every child deserves to learn in their own zabaan 🇵🇰
      </footer>
    </div>
  );
}
