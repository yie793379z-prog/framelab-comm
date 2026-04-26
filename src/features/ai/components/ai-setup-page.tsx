"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { useLanguage } from "@/i18n/context";
import type { Locale } from "@/i18n/types";
import {
  repoDeploymentEnUrl,
  repoDeploymentZhUrl,
  repoReadmeEnUrl,
  repoReadmeZhUrl
} from "@/lib/constants/app";

type SetupCardContent = {
  title: string;
  whenToUse: string;
  note: string;
  code: string;
};

type SetupContent = {
  title: string;
  description: string;
  environmentLabel: string;
  copy: string;
  copied: string;
  cards: SetupCardContent[];
  docsNote: string;
  links: Array<{ label: string; href: string }>;
  openWorkspace: string;
  tryDemo: string;
};

const mockSnippet = `AI_PROVIDER=mock`;
const geminiSnippet = `AI_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash-lite`;
const openAiSnippet = `AI_PROVIDER=openai
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1-mini`;

function getSetupContent(locale: Locale): SetupContent {
  if (locale === "zh-CN") {
    return {
      title: "AI 配置",
      description:
        "公开演示默认使用模拟建议，不需要 API Key。若要使用真实 AI，请本地运行或自部署后配置你自己的 provider key。",
      environmentLabel: "环境变量",
      copy: "复制",
      copied: "已复制",
      cards: [
        {
          title: "模拟建议",
          whenToUse: "适合公开演示、课堂展示和第一次试用。",
          note: "不需要 API Key，默认最稳妥。",
          code: mockSnippet
        },
        {
          title: "Gemini",
          whenToUse: "适合你自己的本地环境或私有部署，需要真实 AI 建议时使用。",
          note: "样本文本会发送到 Gemini，可能产生费用。",
          code: geminiSnippet
        },
        {
          title: "OpenAI",
          whenToUse: "适合你自己的本地环境或私有部署，需要真实 AI 建议时使用。",
          note: "样本文本会发送到 OpenAI，可能产生费用。",
          code: openAiSnippet
        }
      ],
      docsNote: "API Key 出于安全考虑通过服务端环境变量配置。更详细的说明请看部署文档。",
      links: [
        { label: "README.md", href: repoReadmeEnUrl },
        { label: "README.zh-CN.md", href: repoReadmeZhUrl },
        { label: "docs/deployment.md", href: repoDeploymentEnUrl },
        { label: "docs/deployment.zh-CN.md", href: repoDeploymentZhUrl }
      ],
      openWorkspace: "打开工作区",
      tryDemo: "查看交互式演示"
    };
  }

  return {
    title: "AI Setup",
    description:
      "Public demo uses mock suggestions by default and does not need an API key. To use real AI, run locally or self-host and configure your own provider key.",
    environmentLabel: "Environment",
    copy: "Copy",
    copied: "Copied",
    cards: [
      {
        title: "Mock mode",
        whenToUse: "Use this for the public demo, classroom walkthroughs, and first-time trials.",
        note: "No API key required. Safest default.",
        code: mockSnippet
      },
      {
        title: "Gemini",
        whenToUse: "Use this in your own local or private deployment when you want real AI suggestions.",
        note: "Sample text is sent to Gemini and provider usage may cost money.",
        code: geminiSnippet
      },
      {
        title: "OpenAI",
        whenToUse: "Use this in your own local or private deployment when you want real AI suggestions.",
        note: "Sample text is sent to OpenAI and provider usage may cost money.",
        code: openAiSnippet
      }
    ],
    docsNote: "API keys are configured through server-side environment variables for safety. See deployment docs for details.",
    links: [
      { label: "README.md", href: repoReadmeEnUrl },
      { label: "README.zh-CN.md", href: repoReadmeZhUrl },
      { label: "docs/deployment.md", href: repoDeploymentEnUrl },
      { label: "docs/deployment.zh-CN.md", href: repoDeploymentZhUrl }
    ],
    openWorkspace: "Open workspace",
    tryDemo: "Try guided demo"
  };
}

function SetupCard({
  card,
  label,
  copyLabel,
  copiedLabel
}: {
  card: SetupCardContent;
  label: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(card.code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article className="surface-card space-y-4 p-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight text-ink">{card.title}</h2>
        <p className="text-sm leading-7 text-muted">{card.whenToUse}</p>
        <p className="text-sm leading-7 text-muted">{card.note}</p>
      </div>

      <div className="rounded-[1.25rem] border border-line bg-[#fffdf8] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
          <button type="button" onClick={handleCopy} className="button-secondary px-3 py-1.5 text-xs">
            {copied ? copiedLabel : copyLabel}
          </button>
        </div>
        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-sm leading-7 text-ink">
          <code>{card.code}</code>
        </pre>
      </div>
    </article>
  );
}

export function AiSetupPage() {
  const { locale } = useLanguage();
  const content = getSetupContent(locale);

  return (
    <PageShell className="space-y-8 py-14 md:py-16">
      <section className="surface-card space-y-5 rounded-[2rem] p-8 md:p-10">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-ink md:text-[3rem]">{content.title}</h1>
          <p className="max-w-3xl text-base leading-8 text-muted">{content.description}</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/workspace" className="button-primary">
            {content.openWorkspace}
          </Link>
          <Link href="/demo" className="button-secondary">
            {content.tryDemo}
          </Link>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {content.cards.map((card) => (
          <SetupCard
            key={card.title}
            card={card}
            label={content.environmentLabel}
            copyLabel={content.copy}
            copiedLabel={content.copied}
          />
        ))}
      </section>

      <section className="surface-panel space-y-3 p-5">
        <p className="text-sm leading-7 text-muted">{content.docsNote}</p>
        <div className="flex flex-wrap gap-3 text-sm">
          {content.links.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-line bg-white px-3 py-1.5 text-ink transition hover:border-ink/25 hover:bg-[#fffdf8]"
            >
              {item.label}
            </a>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
