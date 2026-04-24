"use client";

import { analysisTemplates } from "@/features/templates/data/templates";
import { useWorkspace } from "@/features/coding/state/workspace-context";
import { useLanguage } from "@/i18n/context";
import { formatMessage, getLocalizedText } from "@/i18n/utils";

export function TemplatePicker() {
  const { state, dispatch } = useWorkspace();
  const { locale, messages } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="helper-note space-y-1">
        <p className="font-semibold text-ink">{messages.templatePicker.description}</p>
        <p className="text-muted">{messages.templatePicker.helper}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {analysisTemplates.map((template) => {
          const isSelected = state.selectedTemplateId === template.id;
          const localizedName = getLocalizedText(template.name, locale);

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => dispatch({ type: "SELECT_TEMPLATE", payload: template.id })}
              aria-pressed={isSelected}
              aria-label={formatMessage(messages.templatePicker.selectAction, { title: localizedName })}
              className={`rounded-[1.5rem] border p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/15 ${
                isSelected
                  ? "border-ink bg-ink text-white shadow-soft"
                  : "border-line bg-white hover:border-ink/40 hover:bg-[#fffdf8]"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold tracking-tight">{localizedName}</h3>
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
    </div>
  );
}
