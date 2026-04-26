"use client";

import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { TemplateSummaryCard } from "@/components/shared/template-summary-card";
import { analysisTemplates } from "@/features/templates/data/templates";
import { useLanguage } from "@/i18n/context";

export default function HomePage() {
  const { messages } = useLanguage();

  return (
    <PageShell className="space-y-16 py-16">
      <section className="surface-card grid gap-10 rounded-[2rem] p-8 md:grid-cols-[1.3fr_0.9fr] md:p-12">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
            {messages.landing.badge}
          </div>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
              {messages.landing.title}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted">
              {messages.landing.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/workspace" className="button-primary">
              {messages.landing.openWorkspace}
            </Link>
            <Link href="/ai-setup" className="button-secondary">
              {messages.landing.configureRealAi}
            </Link>
            <Link href="/demo" className="button-secondary">
              {messages.landing.tryGuidedDemo}
            </Link>
            <a href="#templates" className="button-secondary">
              {messages.landing.viewTemplates}
            </a>
          </div>
          <p className="text-sm leading-7 text-muted">{messages.landing.demoNoApiKeys}</p>
        </div>

        <div className="surface-panel space-y-4 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">{messages.landing.flowTitle}</p>
          <ol className="space-y-4 text-sm text-muted">
            <li className="surface-card rounded-2xl p-4 shadow-none">
              <span className="mb-2 block text-base font-semibold text-ink">{messages.landing.flowImportTitle}</span>
              {messages.landing.flowImportBody}
            </li>
            <li className="surface-card rounded-2xl p-4 shadow-none">
              <span className="mb-2 block text-base font-semibold text-ink">{messages.landing.flowTemplateTitle}</span>
              {messages.landing.flowTemplateBody}
            </li>
            <li className="surface-card rounded-2xl p-4 shadow-none">
              <span className="mb-2 block text-base font-semibold text-ink">{messages.landing.flowEditTitle}</span>
              {messages.landing.flowEditBody}
            </li>
            <li className="surface-card rounded-2xl p-4 shadow-none">
              <span className="mb-2 block text-base font-semibold text-ink">{messages.landing.flowExportTitle}</span>
              {messages.landing.flowExportBody}
            </li>
          </ol>
        </div>
      </section>

      <section id="templates" className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">{messages.landing.templatesEyebrow}</p>
          <h2 className="text-3xl font-semibold tracking-tight">{messages.landing.templatesTitle}</h2>
          <p className="max-w-3xl text-base leading-7 text-muted">
            {messages.landing.templatesDescription}
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
