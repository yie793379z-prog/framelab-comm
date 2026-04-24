"use client";

import Link from "next/link";
import { appNavigation } from "@/lib/constants/app";
import { useLanguage } from "@/i18n/context";
import type { Locale } from "@/i18n/types";

export function AppHeader() {
  const { locale, setLocale, messages } = useLanguage();

  return (
    <header className="border-b border-line/80 bg-white/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink text-sm font-semibold text-white">
            FL
          </div>
          <div>
            <p className="text-base font-semibold tracking-tight text-ink">FrameLab</p>
            <p className="text-sm text-muted">framelab-comm</p>
          </div>
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium text-muted">
          {appNavigation.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-ink">
              {messages.nav[item.labelKey]}
            </Link>
          ))}

          <div className="flex items-center gap-2 rounded-full border border-line bg-[#fffdf8] p-1">
            <span className="px-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              {messages.nav.languageLabel}
            </span>
            {[
              { value: "en", label: "EN" },
              { value: "zh-CN", label: "简中" }
            ].map((option: { value: Locale; label: string }) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setLocale(option.value)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  locale === option.value ? "bg-ink text-white" : "text-ink hover:bg-paper"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
