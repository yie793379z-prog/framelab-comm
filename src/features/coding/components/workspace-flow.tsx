"use client";

import { SectionHeading } from "@/components/shared/section-heading";
import { TextImportPanel } from "@/features/import/components/text-import-panel";
import { SampleList } from "@/features/import/components/sample-list";
import { TemplatePicker } from "@/features/templates/components/template-picker";
import { CodingForm } from "@/features/coding/components/coding-form";
import { CodingPreview } from "@/features/coding/components/coding-preview";
import { ExportPanel } from "@/features/export/components/export-panel";
import { useWorkspace } from "@/features/coding/state/workspace-context";
import { analysisTemplates } from "@/features/templates/data/templates";

export function WorkspaceFlow() {
  const { state } = useWorkspace();
  const activeTemplate = analysisTemplates.find((template) => template.id === state.selectedTemplateId);
  const activeSample = state.samples.find((sample) => sample.id === state.selectedSampleId);

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
              {activeTemplate ? activeTemplate.name : "None yet"}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-line bg-[#fffdf8] p-5">
            <p className="text-sm text-muted">Active sample</p>
            <p className="mt-2 text-lg font-semibold tracking-tight text-ink">
              {activeSample ? activeSample.title : "None yet"}
            </p>
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
          title="Select a sample"
          description="Choose the sample you want to code. The editor and preview follow the current sample selection."
        />
        <SampleList />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <SectionHeading
            eyebrow="Step 4"
            title="Code the selected sample"
            description="The form is generated from the active template, and every edit is stored in local reducer state."
          />
          <CodingForm />
        </div>

        <div className="space-y-4">
          <SectionHeading
            eyebrow="Step 5"
            title="Live preview"
            description="Review the current sample's coded values as a compact summary while you work."
          />
          <CodingPreview />
        </div>
      </div>

      <div className="space-y-4">
        <SectionHeading
          eyebrow="Step 6"
          title="Export"
          description="Exports stay local in v1. The UI placeholder is already aligned with CSV, JSON, and Markdown output."
        />
        <ExportPanel />
      </div>
    </div>
  );
}
