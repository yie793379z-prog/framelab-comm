"use client";

import Link from "next/link";
import { appNavigation } from "@/lib/constants/app";
import { useLanguage } from "@/i18n/context";
import type { Locale } from "@/i18n/types";

export function AppHeader() {
  const { locale, setLocale, messages } = useLanguage();
  const languageOptions: Array<{ value: Locale; label: string }> = [
    { value: "en", label: "EN" },
    { value: "zh-CN", label: "简中" }
  ];

  return (
    <header className="border-b border-line/80 bg-white/75 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink text-sm font-semibold text-white">
            FL
          </div>
          <div>
            <p className="text-base font-semibold tracking-tight text-ink">FrameLab</p>
            <p className="text-sm text-muted">framelab-comm</p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-muted">
          {appNavigation.map((item) => (
            <Link key={item.href} href={item.href} className="button-quiet px-3 py-2">
              {messages.nav[item.labelKey]}
            </Link>
          ))}

          <div className="flex items-center gap-2 rounded-full border border-line bg-[#fffdf8] p-1.5">
            <span className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              {messages.nav.languageLabel}
            </span>
            {languageOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setLocale(option.value)}
                aria-pressed={locale === option.value}
                aria-label={`${messages.nav.languageLabel}: ${option.label}`}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/15 ${
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
