"use client";

import { useWorkspace } from "@/features/coding/state/workspace-context";
import { useLanguage } from "@/i18n/context";
import { formatLocaleDate, formatMessage } from "@/i18n/utils";

export function LocalAutosaveBanner() {
  const { autosave } = useWorkspace();
  const { locale, messages } = useLanguage();

  if (!autosave.pendingRestore) {
    return null;
  }

  return (
    <section className="surface-panel flex flex-col gap-4 border-accent/30 bg-accent/10 p-5 md:flex-row md:items-center md:justify-between">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          {messages.workspace.autosaveEyebrow}
        </p>
        <h2 className="text-lg font-semibold tracking-tight text-ink">{messages.workspace.restorePromptTitle}</h2>
        <p className="text-sm leading-7 text-muted">
          {formatMessage(messages.workspace.restorePromptDescription, {
            savedAt: formatLocaleDate(new Date(autosave.pendingRestore.savedAt), locale)
          })}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={autosave.restorePreviousWorkspace}
          className="button-primary px-4 py-2.5"
        >
          {messages.workspace.restoreAction}
        </button>
        <button
          type="button"
          onClick={autosave.startFresh}
          className="button-secondary px-4 py-2.5"
        >
          {messages.workspace.startFreshAction}
        </button>
      </div>
    </section>
  );
}
