"use client";

import { useWorkspace } from "@/features/coding/state/workspace-context";
import { useLanguage } from "@/i18n/context";
import type { ProjectMetadata } from "@/types/project";

type MetadataFieldConfig = {
  field: keyof ProjectMetadata;
  label: string;
  placeholder: string;
  isTextarea?: boolean;
};

export function ProjectMetadataPanel() {
  const { state, dispatch } = useWorkspace();
  const { messages } = useLanguage();

  const metadataFields: MetadataFieldConfig[] = [
    {
      field: "projectTitle",
      label: messages.projectMetadata.projectTitle,
      placeholder: messages.projectMetadata.projectTitlePlaceholder
    },
    {
      field: "researchQuestion",
      label: messages.projectMetadata.researchQuestion,
      placeholder: messages.projectMetadata.researchQuestionPlaceholder
    },
    {
      field: "researcherName",
      label: messages.projectMetadata.researcherName,
      placeholder: messages.projectMetadata.researcherNamePlaceholder
    },
    {
      field: "courseContext",
      label: messages.projectMetadata.courseContext,
      placeholder: messages.projectMetadata.courseContextPlaceholder
    },
    {
      field: "datasetDescription",
      label: messages.projectMetadata.datasetDescription,
      placeholder: messages.projectMetadata.datasetDescriptionPlaceholder,
      isTextarea: true
    },
    {
      field: "methodNote",
      label: messages.projectMetadata.methodNote,
      placeholder: messages.projectMetadata.methodNotePlaceholder,
      isTextarea: true
    }
  ];

  const hasMetadataValue = Object.values(state.projectMetadata).some((value) => value.trim().length > 0);

  return (
    <details className="surface-card overflow-hidden" open={hasMetadataValue}>
      <summary className="cursor-pointer list-none p-6 md:p-7">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-semibold tracking-tight text-ink">{messages.projectMetadata.title}</h3>
            <span className="rounded-full bg-paper px-3 py-1 text-xs font-medium text-muted">
              {messages.projectMetadata.optional}
            </span>
          </div>
          <p className="text-sm leading-7 text-muted">{messages.projectMetadata.description}</p>
          <p className="text-sm leading-7 text-muted">{messages.projectMetadata.includedInExportedReport}</p>
        </div>
      </summary>

      <div className="border-t border-line px-6 pb-6 pt-2 md:px-7 md:pb-7">
        <div className="grid gap-4 md:grid-cols-2">
          {metadataFields.map((item) => (
            <div key={item.field} className={item.isTextarea ? "md:col-span-2" : ""}>
              <label htmlFor={`project-metadata-${item.field}`} className="block text-sm font-semibold text-ink">
                {item.label}
              </label>
              {item.isTextarea ? (
                <textarea
                  id={`project-metadata-${item.field}`}
                  value={state.projectMetadata[item.field]}
                  onChange={(event) =>
                    dispatch({
                      type: "UPDATE_PROJECT_METADATA",
                      payload: {
                        field: item.field,
                        value: event.target.value
                      }
                    })
                  }
                  placeholder={item.placeholder}
                  className="field-textarea mt-3 min-h-28"
                />
              ) : (
                <input
                  id={`project-metadata-${item.field}`}
                  type="text"
                  value={state.projectMetadata[item.field]}
                  onChange={(event) =>
                    dispatch({
                      type: "UPDATE_PROJECT_METADATA",
                      payload: {
                        field: item.field,
                        value: event.target.value
                      }
                    })
                  }
                  placeholder={item.placeholder}
                  className="field-control mt-3"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </details>
  );
}
