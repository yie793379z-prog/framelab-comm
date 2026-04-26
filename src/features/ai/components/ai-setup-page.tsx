"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { useLanguage } from "@/i18n/context";
import type { Locale } from "@/i18n/types";

type SetupContent = {
  badge: string;
  title: string;
  description: string;
  publicDemoTitle: string;
  publicDemoBody: string;
  mockTitle: string;
  mockBody: string;
  geminiTitle: string;
  geminiBody: string;
  openAiTitle: string;
  openAiBody: string;
  localTitle: string;
  localSteps: string[];
  vercelTitle: string;
  vercelSteps: string[];
  browserTitle: string;
  browserBody: string;
  privacyTitle: string;
  privacyNotes: string[];
  copy: string;
  copied: string;
  environmentLabel: string;
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
      badge: "AI 提供方设置",
      title: "为什么公开演示默认使用模拟建议？",
      description:
        "FrameLab 的公开演示站默认保持 mock 模式，这样访问者不用准备 API Key，也不会因为试用而触发真实 AI 费用。如果你想用 Gemini 或 OpenAI，请在本地运行或自部署后，在服务端环境变量里配置自己的 Key。",
      publicDemoTitle: "公开演示为什么保持 mock 模式",
      publicDemoBody:
        "公开网站如果默认直连真实 AI，会带来费用、配额和隐私风险。mock 模式能完整演示工作流，但不会把访问者的文本发给外部提供方。",
      mockTitle: "模拟建议（公开 demo 推荐）",
      mockBody: "适合课堂演示、第一次试用和公开托管。无需 API Key，工作区和 guided demo 都能直接使用。",
      geminiTitle: "本地启用 Gemini",
      geminiBody: "如果你希望真实 AI 帮助生成建议，可以在自己的电脑或私有部署里配置 Gemini。Key 放在 `.env.local` 或 Vercel 环境变量里，不要放进网页表单，也不要提交到 GitHub。",
      openAiTitle: "本地启用 OpenAI",
      openAiBody: "OpenAI 的配置方式和 Gemini 一样：只在服务端环境变量里配置。公开站不建议默认打开，以免访客触发你的 API 费用。",
      localTitle: "本地运行时怎么启用真实 AI",
      localSteps: [
        "1. 在项目根目录创建 `.env.local`。",
        "2. 选择一个提供方，把对应示例粘进去并填入你自己的 API Key。",
        "3. 重新运行 `npm run dev`，再打开工作区。",
        "4. 如果配置正确，AI 建议区域会显示 Gemini 或 OpenAI 模式，而不是模拟建议。"
      ],
      vercelTitle: "自部署到 Vercel 时怎么启用",
      vercelSteps: [
        "1. 在 Vercel 项目设置中打开 Environment Variables。",
        "2. 添加 `AI_PROVIDER` 和对应的 API Key、模型名称。",
        "3. 保存后重新部署。",
        "4. 公开演示仍建议保持 `AI_PROVIDER=mock`；真实 AI 更适合你自己的私有站点。"
      ],
      browserTitle: "为什么不能直接在网页里输入 API Key",
      browserBody:
        "因为浏览器页面是公开给访问者看的。如果把 API Key 直接放进网页表单或前端代码，别人就可能拿到你的密钥。FrameLab 只在服务端读取这些密钥，不会把它们存到 localStorage，也不会用 `NEXT_PUBLIC_` 变量暴露出去。",
      privacyTitle: "隐私与费用提醒",
      privacyNotes: [
        "真实 AI 模式会把当前样本文本发送到你配置的提供方。",
        "如果数据包含隐私、敏感访谈内容或受限材料，请不要直接发送给真实 AI。",
        "OpenAI 和 Gemini 都可能产生费用，配额和价格也可能变化。",
        "即使启用了真实 AI，生成结果也只是可编辑起点，不是最终学术判断。"
      ],
      copy: "复制",
      copied: "已复制",
      environmentLabel: "环境变量示例",
      openWorkspace: "打开工作区",
      tryDemo: "查看交互式演示"
    };
  }

  return {
    badge: "AI provider setup",
    title: "Why does the public demo stay in mock mode?",
    description:
      "FrameLab’s public demo stays in mock mode by default so visitors can try the workflow without API keys, external provider traffic, or surprise costs. If you want Gemini or OpenAI, configure your own server-side keys in a local or self-hosted deployment.",
    publicDemoTitle: "Why the public demo uses mock mode",
    publicDemoBody:
      "A public site should not spend your provider credits for every visitor, and it should not send visitor text to external AI services by default. Mock mode keeps the workflow usable without those risks.",
    mockTitle: "Mock suggestions (recommended for public demo)",
    mockBody: "Best for classroom demos, first-time exploration, and public hosting. No API key is required, and both the workspace and guided demo remain usable.",
    geminiTitle: "Enable Gemini locally",
    geminiBody: "If you want real AI suggestions, configure Gemini in your own local or private deployment. Put the key in `.env.local` or Vercel environment variables, never in a web form or GitHub commit.",
    openAiTitle: "Enable OpenAI locally",
    openAiBody: "OpenAI works the same way as Gemini: configure it on the server side only. Public sites should usually keep mock mode unless you explicitly want to fund provider usage.",
    localTitle: "How to enable real AI locally",
    localSteps: [
      "1. Create a `.env.local` file in the project root.",
      "2. Choose one provider example below and replace the placeholder key with your own.",
      "3. Restart `npm run dev`, then reopen the workspace.",
      "4. If the setup is correct, the AI panel will show Gemini or OpenAI mode instead of mock mode."
    ],
    vercelTitle: "How to enable it on self-hosted Vercel",
    vercelSteps: [
      "1. Open your Vercel project settings and go to Environment Variables.",
      "2. Add `AI_PROVIDER` plus the matching provider key and model.",
      "3. Save the variables and redeploy.",
      "4. Public demo deployments should still usually keep `AI_PROVIDER=mock`; real AI is better suited to private deployments."
    ],
    browserTitle: "Why API keys are not entered in the public webpage",
    browserBody:
      "A browser page is visible to visitors. If API keys are entered or bundled there, they can be exposed. FrameLab reads provider keys only on the server side, does not store them in localStorage, and does not expose them through `NEXT_PUBLIC_` variables.",
    privacyTitle: "Privacy and cost notes",
    privacyNotes: [
      "Real AI mode sends the current sample text to the provider you configured.",
      "Do not send private, sensitive, or restricted research material to a real AI provider without review.",
      "OpenAI and Gemini usage may cost money, and pricing or free tiers can change.",
      "Even in real AI mode, suggestions remain editable starting points rather than final academic judgments."
    ],
    copy: "Copy",
    copied: "Copied",
    environmentLabel: "Environment example",
    openWorkspace: "Open workspace",
    tryDemo: "Try guided demo"
  };
}

function CopyableSnippet({
  title,
  body,
  code,
  copyLabel,
  copiedLabel,
  label
}: {
  title: string;
  body: string;
  code: string;
  copyLabel: string;
  copiedLabel: string;
  label: string;
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
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article className="surface-card space-y-4 p-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold tracking-tight text-ink">{title}</h3>
        <p className="text-sm leading-7 text-muted">{body}</p>
      </div>

      <div className="rounded-[1.25rem] border border-line bg-[#fffdf8] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
          <button type="button" onClick={handleCopy} className="button-secondary px-3 py-1.5 text-xs">
            {copied ? copiedLabel : copyLabel}
          </button>
        </div>
        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-sm leading-7 text-ink">
          <code>{code}</code>
        </pre>
      </div>
    </article>
  );
}

export function AiSetupPage() {
  const { locale, messages } = useLanguage();
  const content = getSetupContent(locale);

  return (
    <PageShell className="space-y-12 py-14 md:py-16">
      <section className="surface-card space-y-8 rounded-[2rem] p-8 md:p-10">
        <div className="space-y-4">
          <div className="inline-flex rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
            {content.badge}
          </div>
          <div className="space-y-3">
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-ink md:text-[3rem]">
              {content.title}
            </h1>
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
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="surface-panel p-5">
            <h2 className="text-lg font-semibold tracking-tight text-ink">{content.publicDemoTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{content.publicDemoBody}</p>
          </div>
          <div className="surface-panel p-5">
            <h2 className="text-lg font-semibold tracking-tight text-ink">{content.browserTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{content.browserBody}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <CopyableSnippet
          title={content.mockTitle}
          body={content.mockBody}
          code={mockSnippet}
          copyLabel={content.copy}
          copiedLabel={content.copied}
          label={content.environmentLabel}
        />
        <CopyableSnippet
          title={content.geminiTitle}
          body={content.geminiBody}
          code={geminiSnippet}
          copyLabel={content.copy}
          copiedLabel={content.copied}
          label={content.environmentLabel}
        />
        <CopyableSnippet
          title={content.openAiTitle}
          body={content.openAiBody}
          code={openAiSnippet}
          copyLabel={content.copy}
          copiedLabel={content.copied}
          label={content.environmentLabel}
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="surface-card p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-ink">{content.localTitle}</h2>
          <ol className="mt-4 space-y-3 text-sm leading-7 text-muted">
            {content.localSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>

        <article className="surface-card p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-ink">{content.vercelTitle}</h2>
          <ol className="mt-4 space-y-3 text-sm leading-7 text-muted">
            {content.vercelSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>
      </section>

      <section className="surface-card p-6 md:p-7">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">{content.privacyTitle}</h2>
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          {content.privacyNotes.map((note) => (
            <li key={note} className="surface-panel p-4 text-sm leading-7 text-muted">
              {note}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm leading-7 text-muted">
          {locale === "zh-CN"
            ? "如果你现在使用的是公开演示站，看到“模拟建议”是正常的。真实 AI 配置不会出现在网页里，而是在你自己的本地环境或自部署站点里完成。"
            : "If you are on the public demo, seeing mock suggestions is expected. Real AI setup happens in your own local or self-hosted environment, not inside the public webpage."}
        </p>
        <p className="mt-3 text-sm leading-7 text-muted">
          {locale === "zh-CN"
            ? "更详细的 Vercel 部署说明见仓库中的 `docs/deployment.md` 与 `docs/deployment.zh-CN.md`。"
            : "For fuller Vercel deployment notes, see `docs/deployment.md` and `docs/deployment.zh-CN.md` in the repository."}
        </p>
        <p className="mt-3 text-sm leading-7 text-muted">
          {locale === "zh-CN"
            ? "当前导航语言："
            : "Current interface language:"}{" "}
          <span className="font-medium text-ink">{messages.nav.languageLabel}</span>
        </p>
      </section>
    </PageShell>
  );
}
