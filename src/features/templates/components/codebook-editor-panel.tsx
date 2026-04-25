"use client";

import { useMemo } from "react";
import { useWorkspace } from "@/features/coding/state/workspace-context";
import {
  getBuiltInTemplateById,
  getProjectTemplateById,
  hasCustomProjectCodebook
} from "@/features/templates/utils/project-codebooks";
import { useLanguage } from "@/i18n/context";
import { getLocalizedText } from "@/i18n/utils";

export function CodebookEditorPanel() {
  const { state, dispatch } = useWorkspace();
  const { locale, messages } = useLanguage();

  const builtInTemplate = getBuiltInTemplateById(state.selectedTemplateId);
  const activeTemplate = getProjectTemplateById(state.selectedTemplateId, state.customProjectCodebooks);
  const isCustom = hasCustomProjectCodebook(state.selectedTemplateId, state.customProjectCodebooks);

  const fieldEditors = useMemo(() => {
    if (!activeTemplate) {
      return [];
    }

    return activeTemplate.fields;
  }, [activeTemplate]);

  function handleCustomize() {
    if (!builtInTemplate) {
      return;
    }

    dispatch({
      type: "CREATE_CUSTOM_CODEBOOK",
      payload: {
        templateId: builtInTemplate.id
      }
    });
  }

  function handleReset() {
    if (!builtInTemplate) {
      return;
    }

    const shouldReset = window.confirm(messages.codebookEditor.resetWarning);

    if (!shouldReset) {
      return;
    }

    dispatch({
      type: "RESET_CUSTOM_CODEBOOK",
      payload: {
        templateId: builtInTemplate.id
      }
    });
  }

  if (!builtInTemplate || !activeTemplate) {
    return (
      <section className="surface-card p-6 md:p-7">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-tight text-ink">{messages.codebookEditor.title}</h3>
          <p className="text-sm leading-7 text-muted">{messages.codebookEditor.noTemplateSelected}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="surface-card space-y-5 p-6 md:p-7">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-xl font-semibold tracking-tight text-ink">{messages.codebookEditor.title}</h3>
          {isCustom && (
            <span className="rounded-full bg-[#e8f0e6] px-3 py-1 text-xs font-medium text-ink">
              {messages.codebookEditor.customBadge}
            </span>
          )}
        </div>
        <p className="text-sm leading-7 text-muted">{messages.codebookEditor.description}</p>
      </div>

      <div className="surface-panel space-y-3 p-5">
        <p className="text-sm font-medium leading-7 text-ink">
          {isCustom
            ? messages.codebookEditor.usingCustomProjectCodebook
            : messages.codebookEditor.usingBuiltInTemplate}
        </p>
        <p className="text-sm leading-7 text-muted">{messages.codebookEditor.editableLabelsOnly}</p>
        <p className="text-sm leading-7 text-muted">{messages.codebookEditor.keysAndValuesStable}</p>
        {isCustom && <p className="text-sm leading-7 text-muted">{messages.codebookEditor.savedLocally}</p>}

        <div className="flex flex-wrap gap-3 pt-1">
          {!isCustom ? (
            <button type="button" onClick={handleCustomize} className="button-primary px-4 py-2.5">
              {messages.codebookEditor.customize}
            </button>
          ) : (
            <button type="button" onClick={handleReset} className="button-secondary px-4 py-2.5">
              {messages.codebookEditor.resetToBuiltIn}
            </button>
          )}
        </div>
      </div>

      {isCustom && (
        <details className="surface-panel overflow-hidden" open>
          <summary className="cursor-pointer list-none p-5 text-sm font-semibold text-ink">
            {messages.codebookEditor.editorSectionTitle}
          </summary>

          <div className="border-t border-line px-5 pb-5 pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="codebook-template-name" className="block text-sm font-semibold text-ink">
                  {messages.codebookEditor.templateName}
                </label>
                <input
                  id="codebook-template-name"
                  type="text"
                  value={activeTemplate.name[locale]}
                  onChange={(event) =>
                    dispatch({
                      type: "UPDATE_CUSTOM_CODEBOOK_TEMPLATE_TEXT",
                      payload: {
                        templateId: activeTemplate.id,
                        locale,
                        field: "name",
                        value: event.target.value
                      }
                    })
                  }
                  className="field-control mt-3"
                />
              </div>

              <div>
                <label htmlFor="codebook-use-case" className="block text-sm font-semibold text-ink">
                  {messages.codebookEditor.recommendedUseCase}
                </label>
                <textarea
                  id="codebook-use-case"
                  value={activeTemplate.researchUseCase[locale]}
                  onChange={(event) =>
                    dispatch({
                      type: "UPDATE_CUSTOM_CODEBOOK_TEMPLATE_TEXT",
                      payload: {
                        templateId: activeTemplate.id,
                        locale,
                        field: "researchUseCase",
                        value: event.target.value
                      }
                    })
                  }
                  className="field-textarea mt-3 min-h-28"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="codebook-template-description" className="block text-sm font-semibold text-ink">
                {messages.codebookEditor.templateDescription}
              </label>
              <textarea
                id="codebook-template-description"
                value={activeTemplate.shortDescription[locale]}
                onChange={(event) =>
                  dispatch({
                    type: "UPDATE_CUSTOM_CODEBOOK_TEMPLATE_TEXT",
                    payload: {
                      templateId: activeTemplate.id,
                      locale,
                      field: "shortDescription",
                      value: event.target.value
                    }
                  })
                }
                className="field-textarea mt-3 min-h-28"
              />
            </div>

            <div className="mt-6 space-y-4">
              {fieldEditors.map((field) => (
                <div key={field.id} className="surface-card space-y-4 p-4 shadow-none">
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-ink">{getLocalizedText(field.label, locale)}</p>
                    <p className="text-sm leading-7 text-muted">
                      {messages.codebook.fieldKey}: <code>{field.id}</code>
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-semibold text-ink">
                        {messages.codebookEditor.fieldLabel}
                      </label>
                      <input
                        type="text"
                        value={field.label[locale]}
                        onChange={(event) =>
                          dispatch({
                            type: "UPDATE_CUSTOM_CODEBOOK_FIELD_TEXT",
                            payload: {
                              templateId: activeTemplate.id,
                              fieldId: field.id,
                              locale,
                              field: "label",
                              value: event.target.value
                            }
                          })
                        }
                        className="field-control mt-3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-ink">
                        {messages.codebookEditor.helpText}
                      </label>
                      <textarea
                        value={field.description[locale]}
                        onChange={(event) =>
                          dispatch({
                            type: "UPDATE_CUSTOM_CODEBOOK_FIELD_TEXT",
                            payload: {
                              templateId: activeTemplate.id,
                              fieldId: field.id,
                              locale,
                              field: "description",
                              value: event.target.value
                            }
                          })
                        }
                        className="field-textarea mt-3 min-h-24"
                      />
                    </div>
                  </div>

                  {field.placeholder && (
                    <div>
                      <label className="block text-sm font-semibold text-ink">
                        {messages.codebookEditor.placeholder}
                      </label>
                      <input
                        type="text"
                        value={field.placeholder[locale]}
                        onChange={(event) =>
                          dispatch({
                            type: "UPDATE_CUSTOM_CODEBOOK_FIELD_TEXT",
                            payload: {
                              templateId: activeTemplate.id,
                              fieldId: field.id,
                              locale,
                              field: "placeholder",
                              value: event.target.value
                            }
                          })
                        }
                        className="field-control mt-3"
                      />
                    </div>
                  )}

                  {field.options?.length ? (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-ink">{messages.codebookEditor.optionLabel}</p>
                      <div className="grid gap-3">
                        {field.options.map((option) => (
                          <div key={option.value} className="rounded-[1rem] border border-line bg-white px-4 py-3">
                            <p className="text-xs uppercase tracking-[0.12em] text-muted">
                              {messages.codebook.optionValue}: <code>{option.value}</code>
                            </p>
                            <input
                              type="text"
                              value={option.label[locale]}
                              onChange={(event) =>
                                dispatch({
                                  type: "UPDATE_CUSTOM_CODEBOOK_OPTION_LABEL",
                                  payload: {
                                    templateId: activeTemplate.id,
                                    fieldId: field.id,
                                    optionValue: option.value,
                                    locale,
                                    value: event.target.value
                                  }
                                })
                              }
                              className="field-control mt-3"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </details>
      )}
    </section>
  );
}
