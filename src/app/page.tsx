"use client";

import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { TemplateSummaryCard } from "@/components/shared/template-summary-card";
import { analysisTemplates } from "@/features/templates/data/templates";
import { useLanguage } from "@/i18n/context";
import { publicDemoUrl, repoGettingStartedEnUrl, repoGettingStartedZhUrl } from "@/lib/constants/app";

export default function HomePage() {
  const { locale, messages } = useLanguage();
  const quickSteps = [
    messages.landing.quickStep1,
    messages.landing.quickStep2,
    messages.landing.quickStep3,
    messages.landing.quickStep4,
    messages.landing.quickStep5,
    messages.landing.quickStep6,
    messages.landing.quickStep7
  ];
  const orientationCards = [
    {
      title: messages.landing.whatItIsTitle,
      body: messages.landing.whatItIsBody
    },
    {
      title: messages.landing.whoItIsForTitle,
      body: messages.landing.whoItIsForBody
    },
    {
      title: messages.landing.notDoTitle,
      body: messages.landing.notDoBody
    }
  ];

  const beginnerGuideUrl = locale === "zh-CN" ? repoGettingStartedZhUrl : repoGettingStartedEnUrl;

  return (
    <PageShell className="space-y-14 py-14 md:space-y-16 md:py-16">
      <section className="surface-card grid gap-8 rounded-[2rem] p-8 md:grid-cols-[1.18fr_0.82fr] md:p-10">
        <div className="space-y-5">
          <div className="inline-flex rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
            {messages.landing.badge}
          </div>
          <div className="space-y-3">
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
              {messages.landing.title}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted md:text-lg">
              {messages.landing.description}
            </p>
            <p className="text-sm leading-7 text-muted">{messages.landing.supportLine}</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/workspace" className="button-primary">
              {messages.landing.openWorkspace}
            </Link>
            <Link href="/demo" className="button-secondary">
              {messages.landing.tryGuidedDemo}
            </Link>
            <a href={beginnerGuideUrl} className="button-secondary" target="_blank" rel="noreferrer">
              {messages.landing.beginnerGuide}
            </a>
          </div>
          <div className="space-y-2 text-sm leading-7 text-muted">
            <a href={publicDemoUrl} target="_blank" rel="noreferrer" className="inline-flex font-medium text-ink underline-offset-4 hover:underline">
              {messages.landing.onlineDemo}
            </a>
          </div>
          <p className="text-sm leading-7 text-muted">
            {messages.landing.demoNoApiKeys}{" "}
            <Link href="/ai-setup" className="font-medium text-ink underline-offset-4 hover:underline">
              {messages.landing.configureRealAi}
            </Link>
          </p>
        </div>

        <div className="surface-panel space-y-4 p-5 md:p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">{messages.landing.orientationTitle}</p>
          <div className="space-y-3">
            {orientationCards.map((card) => (
              <div key={card.title} className="surface-card rounded-2xl p-4 shadow-none">
                <span className="mb-1 block text-base font-semibold text-ink">{card.title}</span>
                <p className="text-sm leading-7 text-muted">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">{messages.landing.quickStartEyebrow}</p>
          <h2 className="text-3xl font-semibold tracking-tight">{messages.landing.quickStartTitle}</h2>
          <p className="max-w-3xl text-base leading-7 text-muted">
            {messages.landing.quickStartDescription}
          </p>
        </div>

        <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickSteps.map((step, index) => (
            <li key={step} className="surface-card rounded-[1.25rem] p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                {index + 1}
              </p>
              <p className="mt-2 text-base font-semibold text-ink">{step}</p>
            </li>
          ))}
        </ol>
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
