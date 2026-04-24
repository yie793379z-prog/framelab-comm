import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { TemplateSummaryCard } from "@/components/shared/template-summary-card";
import { analysisTemplates } from "@/features/templates/data/templates";

export default function HomePage() {
  return (
    <PageShell className="space-y-16 py-16">
      <section className="grid gap-10 rounded-[2rem] border border-line/80 bg-white/80 p-8 shadow-soft backdrop-blur md:grid-cols-[1.3fr_0.9fr] md:p-12">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
            Communication research workflow for students
          </div>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
              FrameLab helps students move from raw texts to editable analysis workspaces.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted">
              Import text samples, choose a communication-oriented template, review initial coding structure,
              and export classroom-ready outputs without the overhead of a large qualitative suite.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/workspace"
              className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white hover:bg-ink/90"
            >
              Open workspace
            </Link>
            <a
              href="#templates"
              className="rounded-full border border-line bg-white px-5 py-3 text-sm font-medium text-ink hover:border-ink/40"
            >
              View templates
            </a>
          </div>
        </div>

        <div className="space-y-4 rounded-[1.5rem] border border-line bg-[#fffdf8] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">MVP flow</p>
          <ol className="space-y-4 text-sm text-muted">
            <li className="rounded-2xl border border-line bg-white p-4">
              <span className="mb-2 block text-base font-semibold text-ink">1. Import text samples</span>
              Paste or load a small text corpus for coursework or thesis preparation.
            </li>
            <li className="rounded-2xl border border-line bg-white p-4">
              <span className="mb-2 block text-base font-semibold text-ink">2. Choose a template</span>
              Start with a communication-specific schema rather than a generic AI prompt.
            </li>
            <li className="rounded-2xl border border-line bg-white p-4">
              <span className="mb-2 block text-base font-semibold text-ink">3. Edit coding results</span>
              Keep researchers in control with fully editable fields and notes.
            </li>
            <li className="rounded-2xl border border-line bg-white p-4">
              <span className="mb-2 block text-base font-semibold text-ink">4. Export results</span>
              Produce CSV, JSON, or Markdown outputs for classroom use.
            </li>
          </ol>
        </div>
      </section>

      <section id="templates" className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Included templates</p>
          <h2 className="text-3xl font-semibold tracking-tight">Start with four communication-oriented workflows</h2>
          <p className="max-w-3xl text-base leading-7 text-muted">
            The initial scaffold includes templates for framing, social media coding, interview pre-coding, and crisis communication scanning.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {analysisTemplates.map((template) => (
            <TemplateSummaryCard key={template.id} template={template} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
