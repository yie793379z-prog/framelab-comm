"use client";

import { analysisTemplates } from "@/features/templates/data/templates";
import { useWorkspace } from "@/features/coding/state/workspace-context";
import { useLanguage } from "@/i18n/context";
import { formatMessage, getLocalizedText } from "@/i18n/utils";

export function TemplatePicker() {
  const { state, dispatch } = useWorkspace();
  const { locale, messages } = useLanguage();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {analysisTemplates.map((template) => {
        const isSelected = state.selectedTemplateId === template.id;

        return (
          <button
            key={template.id}
            type="button"
            onClick={() => dispatch({ type: "SELECT_TEMPLATE", payload: template.id })}
            className={`rounded-[1.5rem] border p-5 text-left transition ${
              isSelected
                ? "border-ink bg-ink text-white shadow-soft"
                : "border-line bg-white hover:border-ink/40 hover:bg-[#fffdf8]"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold tracking-tight">{getLocalizedText(template.name, locale)}</h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    isSelected ? "bg-white/15 text-white" : "bg-paper text-muted"
                  }`}
                >
                  {formatMessage(messages.templatePicker.fieldCount, { count: template.fields.length })}
                </span>
              </div>
              <p className={`text-sm leading-7 ${isSelected ? "text-white/80" : "text-muted"}`}>
                {getLocalizedText(template.shortDescription, locale)}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
