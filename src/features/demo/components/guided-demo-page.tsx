"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { useLanguage } from "@/i18n/context";

type DemoStep = {
  id: string;
  title: string;
  summary: string;
  detail: string;
};

type DemoContent = {
  scenario: string;
  researchTask: string;
  whatThisDemoShows: string[];
  steps: DemoStep[];
  messyArticle: string;
  cleanedArticle: string;
  templateCards: Array<{
    title: string;
    description: string;
    selected?: boolean;
  }>;
  codingPreview: Array<{
    label: string;
    value: string;
    kind?: "chips";
    chips?: string[];
  }>;
  summaryCards: Array<{
    label: string;
    value: string;
  }>;
  summaryDistributions: Array<{
    label: string;
    count: number;
    total: number;
  }>;
  exportFiles: Array<{
    filename: string;
    description: string;
  }>;
};

function BeforeAfterPanel({
  beforeLabel,
  afterLabel,
  beforeText,
  afterText
}: {
  beforeLabel: string;
  afterLabel: string;
  beforeText: string;
  afterText: string;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="surface-panel p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">{beforeLabel}</p>
        <pre className="mt-3 whitespace-pre-wrap rounded-[1rem] bg-[#fff8f2] p-4 text-sm leading-7 text-ink">
          {beforeText}
        </pre>
      </div>
      <div className="surface-panel p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">{afterLabel}</p>
        <pre className="mt-3 whitespace-pre-wrap rounded-[1rem] bg-[#f7fbf4] p-4 text-sm leading-7 text-ink">
          {afterText}
        </pre>
      </div>
    </div>
  );
}

function FakeChip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-line bg-[#fffdf8] px-3 py-1.5 text-sm text-ink">{children}</span>
  );
}

function getDemoContent(locale: "en" | "zh-CN"): DemoContent {
  if (locale === "zh-CN") {
    return {
      scenario:
        "演示场景是一篇关于某高校发布生成式 AI 使用规范的微信公众号文章。原文里故意保留了图片占位、关注提示、广告和“阅读原文”等常见噪音。",
      researchTask: "研究任务是观察这篇文章如何定义问题，以及提到了哪些解决/治理路径。",
      whatThisDemoShows: [
        "如何把一段脏文本放进 FrameLab",
        "如何先做保守清理，再开始编码",
        "如何选择“新闻框架分析”模板",
        "如何把 AI 建议当成可修改的起点，而不是最终判断",
        "如何看懂编码摘要与导出结果"
      ],
      steps: [
        {
          id: "import",
          title: "步骤 1：导入脏文本",
          summary: "先把一段很像真实微信公众号复制结果的文本放进导入区。",
          detail: "这里是静态演示界面，不会真的保存内容。重点是让你看到 FrameLab 期待什么样的输入。"
        },
        {
          id: "clean",
          title: "步骤 2：清理粘贴文本",
          summary: "对明显的噪音做保守清理，再人工复核一遍。",
          detail: "FrameLab 只会删掉独立存在的广告、图片占位、重复空行等明显噪音，不会替你做内容理解。"
        },
        {
          id: "template",
          title: "步骤 3：选择“新闻框架分析”",
          summary: "这一步决定后面会出现哪些编码字段。",
          detail: "如果你的任务是看新闻如何定义问题、强调责任或提出解决方案，通常先从新闻框架分析开始最稳。"
        },
        {
          id: "coding",
          title: "步骤 4：生成并编辑编码建议",
          summary: "AI 只提供一个初始版本，你仍然需要手动改。",
          detail: "这里展示的是示意性的建议内容。真实 AI 需要你自己配置提供方，模拟模式也同样适合课堂演示。"
        },
        {
          id: "summary",
          title: "步骤 5：查看编码摘要",
          summary: "摘要面板帮助你快速看进度和字段分布。",
          detail: "样本多了以后，这里会更有用。你可以很快看出哪些字段已经填得多，哪些分类出现得更频繁。"
        },
        {
          id: "export",
          title: "步骤 6：导出 Markdown / 编码手册 / JSON",
          summary: "最后把结果导出成课堂可读的文件，或留作下次继续。",
          detail: "Markdown 适合写研究笔记，编码手册适合方法说明，JSON 适合保存并重新打开项目。"
        }
      ],
      messyArticle: `高校发布生成式 AI 课程作业使用规范
[图片]
近日，海川大学发布《生成式人工智能课程使用指引》，要求学生在提交作业时说明 AI 使用情况。
点击关注
校方表示，教师可根据课程目标设定允许或禁止使用 AI 的具体情境。
广告
学院将提供 AI 素养培训，并建立人工复核与违规处理机制。
阅读原文`,
      cleanedArticle: `高校发布生成式 AI 课程作业使用规范

近日，海川大学发布《生成式人工智能课程使用指引》，要求学生在提交作业时说明 AI 使用情况。

校方表示，教师可根据课程目标设定允许或禁止使用 AI 的具体情境。

学院将提供 AI 素养培训，并建立人工复核与违规处理机制。`,
      templateCards: [
        {
          title: "新闻框架分析",
          description: "适合看新闻如何界定问题、归因责任，并提出解决方向。",
          selected: true
        },
        {
          title: "社交媒体内容分析",
          description: "适合微博、公众号评论、平台帖文等社交媒体文本。"
        },
        {
          title: "访谈预编码",
          description: "适合先整理访谈主题、角色、关键引文和初步主题。"
        },
        {
          title: "危机传播扫描",
          description: "适合观察回应姿态、责任承担与修复信号。"
        }
      ],
      codingPreview: [
        { label: "主导框架", value: "责任框架" },
        { label: "问题界定", value: "教学规范与学术诚信边界" },
        {
          label: "建议的解决路径",
          value: "",
          kind: "chips",
          chips: ["使用披露", "教师情境化规则", "AI 素养教育", "人工复核机制"]
        },
        { label: "文本备注", value: "这里的 AI 建议只是示意，研究者需要自己改。" }
      ],
      summaryCards: [
        { label: "样本总数", value: "1" },
        { label: "已编码样本", value: "1" },
        { label: "未编码样本", value: "0" },
        { label: "完成度", value: "100%" }
      ],
      summaryDistributions: [
        { label: "责任框架", count: 1, total: 1 },
        { label: "使用披露", count: 1, total: 1 },
        { label: "AI 素养教育", count: 1, total: 1 },
        { label: "人工复核机制", count: 1, total: 1 }
      ],
      exportFiles: [
        { filename: "framelab-analysis-report.md", description: "适合课堂讨论、研究备忘和早期论文整理。" },
        { filename: "framelab-codebook.md", description: "适合写方法部分或附录里的编码手册。" },
        { filename: "framelab-project.json", description: "适合保存项目，并在以后重新载入继续编码。" }
      ]
    };
  }

  return {
    scenario:
      "This demo uses a messy WeChat public account article about a university publishing generative AI usage guidance. The source text intentionally includes image markers, promo lines, and read-more noise.",
    researchTask:
      "The research task is to examine how the article frames the issue and which solutions or remedies it proposes.",
    whatThisDemoShows: [
      "How a messy copied article enters FrameLab",
      "How conservative text cleaning works before coding",
      "How to choose News Framing Analysis",
      "How AI suggestions remain editable starting points",
      "How the summary and export views support coursework"
    ],
    steps: [
      {
        id: "import",
        title: "Step 1: Import messy text",
        summary: "Start with a copied article that still contains common public-account noise.",
        detail: "This is a guided static demo. Nothing here is saved, uploaded, or processed as real user data."
      },
      {
        id: "clean",
        title: "Step 2: Clean pasted text",
        summary: "Remove obvious standalone noise, then review the text manually.",
        detail: "FrameLab only applies conservative cleaning. It does not decide meaning for you."
      },
      {
        id: "template",
        title: "Step 3: Choose News Framing Analysis",
        summary: "The active template decides which coding fields appear next.",
        detail:
          "For a news article about campus AI governance, News Framing Analysis is a practical starting point."
      },
      {
        id: "coding",
        title: "Step 4: Generate and edit coding suggestions",
        summary: "AI suggestions are only a first pass, and you can revise every field.",
        detail:
          "The suggestions shown here are illustrative. Real AI still requires your own configured provider, while mock mode remains available for demos."
      },
      {
        id: "summary",
        title: "Step 5: Review the coding summary",
        summary: "The summary helps you see progress and simple field distributions.",
        detail: "With larger datasets, this panel becomes a quick way to spot patterns and gaps in coding."
      },
      {
        id: "export",
        title: "Step 6: Export Markdown / Codebook / JSON",
        summary: "Finish by exporting readable files or saving a project you can reopen later.",
        detail: "Markdown is useful for course notes, Codebook export supports methods write-ups, and JSON lets you continue later."
      }
    ],
    messyArticle: `University publishes generative AI course-work policy
[Image]
Haichuan University released a new guideline asking students to disclose any use of AI in submitted assignments.
Follow us
The policy says instructors may decide when AI use is permitted or prohibited based on course goals.
Advertisement
The university will also offer AI literacy workshops and create a human review and misconduct response process.
Read more`,
    cleanedArticle: `University publishes generative AI course-work policy

Haichuan University released a new guideline asking students to disclose any use of AI in submitted assignments.

The policy says instructors may decide when AI use is permitted or prohibited based on course goals.

The university will also offer AI literacy workshops and create a human review and misconduct response process.`,
    templateCards: [
      {
        title: "News Framing Analysis",
        description: "Useful for examining how news defines problems, assigns responsibility, and proposes remedies.",
        selected: true
      },
      {
        title: "Social Media Content Analysis",
        description: "Useful for social posts, comments, and platform-native public communication."
      },
      {
        title: "Interview Pre-coding",
        description: "Useful for early theme grouping, speaker roles, and key quotes."
      },
      {
        title: "Crisis Communication Scan",
        description: "Useful for response stance, responsibility, and reputation repair signals."
      }
    ],
    codingPreview: [
      { label: "Dominant frame", value: "Responsibility frame" },
      { label: "Problem definition", value: "Academic integrity and policy clarity" },
      {
        label: "Suggested remedies",
        value: "",
        kind: "chips",
        chips: ["Disclosure requirement", "Instructor-level rules", "AI literacy education", "Human review mechanism"]
      },
      { label: "Memo note", value: "Illustrative AI output. Researcher review is still required." }
    ],
    summaryCards: [
      { label: "Total samples", value: "1" },
      { label: "Coded samples", value: "1" },
      { label: "Uncoded samples", value: "0" },
      { label: "Completion", value: "100%" }
    ],
    summaryDistributions: [
      { label: "Responsibility frame", count: 1, total: 1 },
      { label: "Disclosure requirement", count: 1, total: 1 },
      { label: "AI literacy education", count: 1, total: 1 },
      { label: "Human review mechanism", count: 1, total: 1 }
    ],
    exportFiles: [
      { filename: "framelab-analysis-report.md", description: "Good for classroom discussion, research notes, and early thesis organization." },
      { filename: "framelab-codebook.md", description: "Useful for methods documentation and appendix-style codebook notes." },
      { filename: "framelab-project.json", description: "Lets you save the project and reopen it later in FrameLab." }
    ]
  };
}

export function GuidedDemoPage() {
  const { locale, messages } = useLanguage();
  const content = useMemo(() => getDemoContent(locale), [locale]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = content.steps[activeStepIndex];

  function renderStepPanel() {
    if (activeStep.id === "import") {
      return (
        <div className="surface-panel p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
            {locale === "zh-CN" ? "模拟导入面板" : "Mock import panel"}
          </p>
          <div className="mt-4 rounded-[1.25rem] border border-line bg-white p-4">
            <p className="text-sm font-semibold text-ink">{locale === "zh-CN" ? "文本样本" : "Text samples"}</p>
            <pre className="mt-3 whitespace-pre-wrap rounded-[1rem] bg-[#fff8f2] p-4 text-sm leading-7 text-ink">
              {content.messyArticle}
            </pre>
            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-sm text-muted">
                {locale === "zh-CN" ? "检测到 1 条样本" : "1 sample detected"}
              </p>
              <button type="button" className="button-primary px-4 py-2.5">
                {locale === "zh-CN" ? "载入工作区" : "Load into workspace"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeStep.id === "clean") {
      return (
        <BeforeAfterPanel
          beforeLabel={locale === "zh-CN" ? "清理前" : "Before cleaning"}
          afterLabel={locale === "zh-CN" ? "清理后" : "After cleaning"}
          beforeText={content.messyArticle}
          afterText={content.cleanedArticle}
        />
      );
    }

    if (activeStep.id === "template") {
      return (
        <div className="grid gap-4 md:grid-cols-2">
          {content.templateCards.map((template) => (
            <div
              key={template.title}
              className={`rounded-[1.5rem] border p-5 ${
                template.selected ? "border-ink bg-ink text-white" : "border-line bg-white"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-lg font-semibold tracking-tight">{template.title}</p>
                  {template.selected && (
                    <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                      {locale === "zh-CN" ? "已选择" : "Selected"}
                    </span>
                  )}
                </div>
                <p className={`text-sm leading-7 ${template.selected ? "text-white/80" : "text-muted"}`}>
                  {template.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeStep.id === "coding") {
      return (
        <div className="surface-panel p-5">
          <div className="rounded-[1.25rem] border border-accent/30 bg-accent/10 p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
              {locale === "zh-CN" ? "AI 建议示意" : "Illustrative AI suggestions"}
            </p>
            <p className="mt-2 text-sm leading-7 text-ink">
              {locale === "zh-CN"
                ? "这里只展示“像什么样子”，不是实时调用 AI。"
                : "This shows what the interface feels like, without making a live AI call."}
            </p>
          </div>
          <div className="mt-4 grid gap-4">
            {content.codingPreview.map((field) => (
              <div key={field.label} className="rounded-[1rem] border border-line bg-white p-4">
                <p className="text-sm font-semibold text-ink">{field.label}</p>
                {field.kind === "chips" ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {field.chips?.map((chip) => <FakeChip key={chip}>{chip}</FakeChip>)}
                  </div>
                ) : (
                  <p className="mt-3 rounded-[1rem] bg-[#fffdf8] px-4 py-3 text-sm leading-7 text-ink">
                    {field.value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeStep.id === "summary") {
      return (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {content.summaryCards.map((card) => (
              <div key={card.label} className="metric-card">
                <p className="text-sm text-muted">{card.label}</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">{card.value}</p>
              </div>
            ))}
          </div>
          <div className="surface-panel p-5">
            <p className="text-sm font-semibold text-ink">
              {locale === "zh-CN" ? "字段分布预览" : "Field distribution preview"}
            </p>
            <div className="mt-4 space-y-3">
              {content.summaryDistributions.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm text-ink">{item.label}</p>
                    <p className="text-sm text-muted">{item.count}</p>
                  </div>
                  <div className="h-2 rounded-full bg-paper">
                    <div
                      className="h-2 rounded-full bg-accent"
                      style={{ width: `${(item.count / item.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="surface-panel p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
          {locale === "zh-CN" ? "导出结果预览" : "Export preview"}
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {content.exportFiles.map((item) => (
            <div key={item.filename} className="surface-card p-4 shadow-none">
              <p className="text-base font-semibold text-ink">{item.filename}</p>
              <p className="mt-2 text-sm leading-7 text-muted">{item.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-[1rem] border border-line bg-[#fffdf8] p-4 text-sm leading-7 text-muted">
          {locale === "zh-CN"
            ? "导出 JSON 后，下次可以通过“载入项目 JSON”继续工作；如果只是刷新页面，本地自动保存也会帮助你恢复进度。"
            : "After exporting JSON, you can continue later through “Load Project JSON”. If you only refresh the page, local autosave can also help restore progress."}
        </div>
      </div>
    );
  }

  return (
    <PageShell className="space-y-12 py-14 md:py-16">
      <section className="surface-card space-y-8 rounded-[2rem] p-8 md:p-10">
        <div className="space-y-4">
          <div className="inline-flex rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
            {messages.demoPage.badge}
          </div>
          <div className="space-y-3">
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-ink md:text-[3rem]">
              {messages.demoPage.title}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-muted">{messages.demoPage.description}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
          <div className="surface-panel p-5">
            <p className="text-sm font-semibold text-ink">{messages.demoPage.scenarioLabel}</p>
            <p className="mt-2 text-sm leading-7 text-muted">{content.scenario}</p>
            <p className="mt-4 text-sm font-semibold text-ink">{messages.demoPage.researchTaskLabel}</p>
            <p className="mt-2 text-sm leading-7 text-muted">{content.researchTask}</p>
          </div>

          <div className="surface-panel p-5">
            <p className="text-sm font-semibold text-ink">{messages.demoPage.whatThisDemoShows}</p>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-muted">
              {content.whatThisDemoShows.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 inline-flex rounded-full border border-line bg-[#fffdf8] px-3 py-1.5 text-sm text-ink">
              {messages.demoPage.noApiKeys}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.42fr_0.58fr]">
        <div className="surface-card space-y-4 p-6 md:p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            {messages.demoPage.whatThisDemoShows}
          </p>
          <div className="grid gap-3">
            {content.steps.map((step, index) => {
              const isActive = index === activeStepIndex;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStepIndex(index)}
                  aria-current={isActive ? "step" : undefined}
                  className={`rounded-[1.25rem] border p-4 text-left transition ${
                    isActive
                      ? "border-ink bg-ink text-white"
                      : "border-line bg-white text-ink hover:border-ink/30 hover:bg-[#fffdf8]"
                  }`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                        isActive ? "bg-white/15 text-white" : "bg-paper text-ink"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">{step.title}</p>
                      <p className={`text-sm leading-7 ${isActive ? "text-white/80" : "text-muted"}`}>{step.summary}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="surface-card space-y-5 p-6 md:p-7">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
              {activeStep.title}
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">{activeStep.summary}</h2>
            <p className="text-sm leading-7 text-muted">{activeStep.detail}</p>
          </div>

          {renderStepPanel()}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveStepIndex((current) => Math.max(current - 1, 0))}
              disabled={activeStepIndex === 0}
              className="button-secondary px-4 py-2.5"
            >
              {messages.demoPage.previousStep}
            </button>

            <div className="text-sm text-muted">
              {activeStepIndex + 1} / {content.steps.length}
            </div>

            <button
              type="button"
              onClick={() =>
                setActiveStepIndex((current) => Math.min(current + 1, content.steps.length - 1))
              }
              disabled={activeStepIndex === content.steps.length - 1}
              className="button-primary px-4 py-2.5"
            >
              {messages.demoPage.nextStep}
            </button>
          </div>
        </div>
      </section>

      <section className="surface-card space-y-4 p-6 md:p-7">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">{messages.demoPage.safetyTitle}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="surface-panel p-4 text-sm leading-7 text-muted">{messages.demoPage.guidedNote}</div>
          <div className="surface-panel p-4 text-sm leading-7 text-muted">{messages.demoPage.aiIllustrative}</div>
          <div className="surface-panel p-4 text-sm leading-7 text-muted">{messages.demoPage.providerNote}</div>
          <div className="surface-panel p-4 text-sm leading-7 text-muted">{messages.demoPage.scrapingNote}</div>
          <div className="surface-panel p-4 text-sm leading-7 text-muted md:col-span-2">{messages.demoPage.imageNote}</div>
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          <Link href="/workspace" className="button-primary">
            {messages.demoPage.openWorkspace}
          </Link>
          <Link href="/" className="button-secondary">
            {locale === "zh-CN" ? "返回首页" : "Back to home"}
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
