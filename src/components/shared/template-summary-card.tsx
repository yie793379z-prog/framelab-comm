"use client";

import type { AnalysisTemplate } from "@/types/template";
import { useLanguage } from "@/i18n/context";
import { getLocalizedText } from "@/i18n/utils";

type TemplateSummaryCardProps = {
  template: AnalysisTemplate;
};

export function TemplateSummaryCard({ template }: TemplateSummaryCardProps) {
  const { locale, messages } = useLanguage();

  return (
    <article className="surface-card p-6">
      <div className="space-y-3">
        <h3 className="text-xl font-semibold tracking-tight text-ink">{getLocalizedText(template.name, locale)}</h3>
        <p className="text-sm leading-7 text-muted">{getLocalizedText(template.shortDescription, locale)}</p>
        <p className="text-sm text-ink">
          <span className="font-medium">{messages.common.useCase}</span> {getLocalizedText(template.researchUseCase, locale)}
        </p>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {template.fields.slice(0, 4).map((field) => (
          <span key={field.id} className="rounded-full border border-line bg-[#fffdf8] px-3 py-1 text-xs text-muted">
            {getLocalizedText(field.label, locale)}
          </span>
        ))}
      </div>
    </article>
  );
}
