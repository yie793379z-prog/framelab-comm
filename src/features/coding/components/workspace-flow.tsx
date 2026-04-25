"use client";

import { SectionHeading } from "@/components/shared/section-heading";
import { TextImportPanel } from "@/features/import/components/text-import-panel";
import { SampleList } from "@/features/import/components/sample-list";
import { TemplatePicker } from "@/features/templates/components/template-picker";
import { CodebookEditorPanel } from "@/features/templates/components/codebook-editor-panel";
import { CodingForm } from "@/features/coding/components/coding-form";
import { CodingPreview } from "@/features/coding/components/coding-preview";
import { ExportPanel } from "@/features/export/components/export-panel";
import { BatchSuggestionsPanel } from "@/features/ai/components/batch-suggestions-panel";
import { useWorkspace } from "@/features/coding/state/workspace-context";
import { LocalAutosaveBanner } from "@/features/project/components/local-autosave-banner";
import { ProjectMetadataPanel } from "@/features/project/components/project-metadata-panel";
import { CodingSummaryPanel } from "@/features/summary/components/coding-summary-panel";
import { getProjectTemplateById } from "@/features/templates/utils/project-codebooks";
import { useLanguage } from "@/i18n/context";
import { formatLocaleDate, formatMessage, getLocalizedText } from "@/i18n/utils";

export function WorkspaceFlow() {
  const { state, autosave } = useWorkspace();
  const { locale, messages } = useLanguage();
  const activeTemplate = getProjectTemplateById(state.selectedTemplateId, state.customProjectCodebooks);
  const activeSample = state.samples.find((sample) => sample.id === state.selectedSampleId);

  return (
    <div className="space-y-12">
      <LocalAutosaveBanner />

      <section className="surface-card space-y-5 rounded-[2rem] p-8 md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">{messages.workspace.eyebrow}</p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink md:text-[2.8rem]">{messages.workspace.title}</h1>
        <p className="max-w-3xl text-base leading-8 text-muted">{messages.workspace.description}</p>
        {autosave.lastSavedAt && (
          <p className="text-sm leading-7 text-muted">
            {formatMessage(messages.workspace.lastSavedLocally, {
              savedAt: formatLocaleDate(new Date(autosave.lastSavedAt), locale)
            })}
          </p>
        )}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="metric-card">
            <p className="text-sm text-muted">{messages.common.samples}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-ink">{state.samples.length}</p>
          </div>
          <div className="metric-card">
            <p className="text-sm text-muted">{messages.common.selectedTemplate}</p>
            <p className="mt-2 text-lg font-semibold tracking-tight text-ink">
              {activeTemplate ? getLocalizedText(activeTemplate.name, locale) : messages.common.noneYet}
            </p>
          </div>
          <div className="metric-card">
            <p className="text-sm text-muted">{messages.common.activeSample}</p>
            <p className="mt-2 text-lg font-semibold tracking-tight text-ink">
              {activeSample ? activeSample.title : messages.common.noneYet}
            </p>
          </div>
        </div>
      </section>

      <div className="space-y-5">
        <SectionHeading
          eyebrow={messages.workspace.step1Eyebrow}
          title={messages.workspace.step1Title}
          description={messages.workspace.step1Description}
        />
        <TextImportPanel />
      </div>

      <div className="space-y-5">
        <SectionHeading
          eyebrow={messages.workspace.step2Eyebrow}
          title={messages.workspace.step2Title}
          description={messages.workspace.step2Description}
        />
        <TemplatePicker />
        <CodebookEditorPanel />
      </div>

      <div className="space-y-5">
        <SectionHeading
          eyebrow={messages.workspace.step3Eyebrow}
          title={messages.workspace.step3Title}
          description={messages.workspace.step3Description}
        />
        <SampleList />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <SectionHeading
            eyebrow={messages.workspace.step4Eyebrow}
            title={messages.workspace.step4Title}
            description={messages.workspace.step4Description}
          />
          <CodingForm />
        </div>

        <div className="space-y-5">
          <SectionHeading
            eyebrow={messages.workspace.step5Eyebrow}
            title={messages.workspace.step5Title}
            description={messages.workspace.step5Description}
          />
          <CodingPreview />
          <CodingSummaryPanel />
          <BatchSuggestionsPanel />
        </div>
      </div>

      <div className="space-y-5">
        <SectionHeading
          eyebrow={messages.workspace.step6Eyebrow}
          title={messages.workspace.step6Title}
          description={messages.workspace.step6Description}
        />
        <ProjectMetadataPanel />
        <ExportPanel />
      </div>
    </div>
  );
}
