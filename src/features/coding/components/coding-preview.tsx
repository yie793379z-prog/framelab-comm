"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { analysisTemplates } from "@/features/templates/data/templates";
import { useWorkspace } from "@/features/coding/state/workspace-context";

export function CodingPreview() {
  const { state } = useWorkspace();

  if (!state.selectedTemplateId) {
    return (
      <EmptyState
        title="Choose a template to start coding"
        description="The coding workspace will render editable rows after a template is selected."
      />
    );
  }

  const template = analysisTemplates.find((item) => item.id === state.selectedTemplateId);

  if (!template) {
    return (
      <EmptyState
        title="Template not found"
        description="The selected template could not be loaded. Re-select a template to continue."
      />
    );
  }

  return (
    <div className="space-y-4 rounded-[1.5rem] border border-line bg-white p-6 shadow-soft">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold tracking-tight text-ink">Coding workspace preview</h3>
        <p className="text-sm leading-7 text-muted">
          This scaffold shows the selected template structure. Editable per-sample coding rows come next.
        </p>
      </div>

      <div className="overflow-hidden rounded-[1.25rem] border border-line">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-[#fffdf8]">
            <tr>
              <th className="border-b border-line px-4 py-3 font-semibold text-ink">Field</th>
              <th className="border-b border-line px-4 py-3 font-semibold text-ink">Type</th>
              <th className="border-b border-line px-4 py-3 font-semibold text-ink">Description</th>
            </tr>
          </thead>
          <tbody>
            {template.fields.map((field) => (
              <tr key={field.id} className="align-top">
                <td className="border-b border-line px-4 py-3 font-medium text-ink">{field.label}</td>
                <td className="border-b border-line px-4 py-3 capitalize text-muted">{field.type}</td>
                <td className="border-b border-line px-4 py-3 text-muted">{field.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
