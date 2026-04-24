"use client";

import { SectionHeading } from "@/components/shared/section-heading";
import { TextImportPanel } from "@/features/import/components/text-import-panel";
import { TemplatePicker } from "@/features/templates/components/template-picker";
import { CodingPreview } from "@/features/coding/components/coding-preview";
import { ExportPanel } from "@/features/export/components/export-panel";
import { useWorkspace } from "@/features/coding/state/workspace-context";

export function WorkspaceFlow() {
  const { state } = useWorkspace();

  return (
    <div className="space-y-10">
      <section className="space-y-4 rounded-[2rem] border border-line/80 bg-white/80 p-8 shadow-soft backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Workspace</p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink">Research coding workflow</h1>
        <p className="max-w-3xl text-base leading-8 text-muted">
          This first batch keeps the workflow explicit: import source texts, choose a communication-oriented template,
          preview the coding structure, and prepare for local export.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-line bg-[#fffdf8] p-5">
            <p className="text-sm text-muted">Loaded samples</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-ink">{state.samples.length}</p>
          </div>
          <div className="rounded-[1.5rem] border border-line bg-[#fffdf8] p-5">
            <p className="text-sm text-muted">Selected template</p>
            <p className="mt-2 text-lg font-semibold tracking-tight text-ink">
              {state.selectedTemplateId ? state.selectedTemplateId : "None yet"}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-line bg-[#fffdf8] p-5">
            <p className="text-sm text-muted">Coding rows</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-ink">{state.codingRows.length}</p>
          </div>
        </div>
      </section>

      <div className="space-y-4">
        <SectionHeading
          eyebrow="Step 1"
          title="Import"
          description="Paste a small text corpus directly into the browser. For the MVP, local state is enough."
        />
        <TextImportPanel />
      </div>

      <div className="space-y-4">
        <SectionHeading
          eyebrow="Step 2"
          title="Choose a template"
          description="Start with a communication-specific schema rather than a generic blank coding table."
        />
        <TemplatePicker />
      </div>

      <div className="space-y-4">
        <SectionHeading
          eyebrow="Step 3"
          title="Review coding structure"
          description="This placeholder keeps the next implementation step obvious: render editable rows per sample and field."
        />
        <CodingPreview />
      </div>

      <div className="space-y-4">
        <SectionHeading
          eyebrow="Step 4"
          title="Export"
          description="Exports stay local in v1. The UI placeholder is already aligned with CSV, JSON, and Markdown output."
        />
        <ExportPanel />
      </div>
    </div>
  );
}
