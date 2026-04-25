# FrameLab

[English](./README.md) | 简体中文

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

面向传播学、新闻学与媒体研究学生的轻量级文本编码工作区。

## 项目简介

FrameLab 是一个双语、开源、以本地工作流为主的研究辅助工具，帮助学生把原始文本快速整理成可编辑的编码流程。它适合做框架分析、内容分析、访谈预编码，以及小型危机传播观察。

当前 `v0.1.0` 的定位很明确：不是通用 AI 写作工具，也不是复杂的定性研究套件，而是一个更轻、更直接、更适合课堂与早期论文探索的研究工作区。

## 为什么做 FrameLab

很多传播学与媒体研究学生会卡在两个极端之间：

- 一类是通用 AI 工具，能生成文字，但并不真正适合研究编码
- 另一类是大型定性研究软件，功能强但对课程作业和小型研究来说往往太重

FrameLab 想做的是中间地带的那一层：保留结构化研究流程，又尽量降低上手门槛。它强调“人在回路中”的研究过程，帮助用户整理材料、尝试模板、修改初步编码，并导出清晰结果用于课堂讨论或早期研究整理。

## 为什么不直接用大语言模型？

直接和 ChatGPT、Gemini 这类大语言模型对话，当然适合做一次性的分析、头脑风暴，或者快速看看一段文本可能有哪些切入点。但 FrameLab 解决的是另一类问题：更结构化、可重复的传播研究工作流。

FrameLab 并不声称自己比通用大模型“更聪明”。它的价值主要不在模型本身，而在工作流和结构上：内置模板、统一字段、可编辑的编码表单、`CSV`/`JSON`/`Markdown` 导出、项目重新载入、中英双语界面，以及“人在回路中”的审阅过程。AI 建议只是可选功能，而且始终可以修改。FrameLab 更适合课堂练习、小型研究和前期论文整理，因为它强调的是结构、可复用性和研究使用场景，而不只是一次回答。

## 项目级自定义编码表

FrameLab `v0.1` 已支持轻量级的项目级编码表自定义流程。你可以把当前内置模板复制成项目内专用的编码表，然后根据自己的课程任务或研究问题修改用户可见的说明文字。

当前版本允许编辑：

- 模板名称
- 模板说明
- 推荐使用场景
- 字段标签
- 字段帮助文字
- 占位提示
- 选项标签

为避免破坏已有编码数据，FrameLab 目前不会开放字段 key、字段类型或选项 value 的修改。自定义编码表会保存在本地自动保存中，也会写入项目 JSON，并可在重新载入项目时恢复。

## 核心功能

- 通过粘贴文本导入多个样本
- 支持通过粘贴文本或本地 `.txt`、`.md`、`.csv` 文件导入样本
- 在同一工作区中切换 4 个内置传播研究模板
- 可将内置模板复制为项目级自定义编码表
- 可编辑模板名称、说明、字段标签、帮助文字、占位提示和选项标签
- 按样本逐条编辑编码字段
- 默认生成本地运行的模拟 AI 编码建议
- 可选接入使用者自己的 OpenAI 或 Gemini API Key 来启用真实 AI 建议
- 导出 `CSV`、`JSON`、`Markdown`
- 将导出的项目 `JSON` 再次载入 FrameLab 继续编辑
- 支持英文与简体中文界面
- 当前 MVP 保持本地优先；真实 AI 只是可选的服务端增强能力

## 适合谁使用

FrameLab 目前尤其适合：

- 传播学学生
- 新闻学学生
- 媒体研究学生
- 做内容分析或框架分析入门练习的同学
- 正在准备课程论文、研究计划或毕业论文前期材料的用户

如果你的需求是课堂练习、小型研究、方法训练或论文前期摸底，FrameLab 会比较合适。如果你需要大型团队协作、复杂资料管理或正式生产级研究系统，它还不是那个阶段的工具。

## 使用流程

1. 打开工作区，粘贴一个或多个文本样本，或选择本地 TXT、Markdown、CSV 文件。
2. 使用空行分隔不同样本。
3. 选择最适合当前任务的内置模板。
4. 如有需要，可先把当前模板复制成项目级自定义编码表并调整说明文字。
5. 在样本列表中选择一个样本。
6. 手动编辑编码字段。
7. 如有需要，可生成 AI 建议作为可编辑起点。
8. 导出为 `CSV`、`JSON` 或 `Markdown`。
9. 若之后继续工作，可把导出的项目 `JSON` 再载入 FrameLab。

## 示例数据

仓库内提供了虚构但适合演示的示例材料，位于 [`examples/`](./examples/)：

- [news_sample.csv](./examples/news_sample.csv)
- [social_posts.csv](./examples/social_posts.csv)
- [interview_sample.txt](./examples/interview_sample.txt)
- [crisis_comm_sample.txt](./examples/crisis_comm_sample.txt)

可配合 [examples/README.md](./examples/README.md) 一起使用，里面说明了每个文件更适合搭配哪个模板，以及当前版本应如何导入。

CSV 示例现在可以直接在浏览器中导入；TXT 和 Markdown 文件也支持本地读取。粘贴导入流程仍然保留。

## 导入格式

FrameLab 当前支持以下本地导入方式：

- 粘贴文本
- `.txt`
- `.md`
- `.csv`

TXT 和 Markdown 文件会沿用与粘贴导入相同的“按空行拆分样本”逻辑。

对于 CSV，FrameLab 会优先识别以下文本列名：

- `text`
- `content`
- `body`
- `message`
- `transcript`

如果 CSV 中有多个可识别文本列，FrameLab 会使用第一个匹配列。所有文件解析都在浏览器本地完成，不会上传文件内容；原有的粘贴导入方式也仍然可用。

## 导出格式

- `CSV`：按样本、模板和字段值展开后的编码数据
- `JSON`：保留项目结构的工作区导出，包含样本、当前模板、项目元数据、自定义编码表、编码结果和导出元数据
- `Markdown`：更适合课堂展示、讨论或整理笔记的分析摘要，包含项目元数据、编码摘要与 codebook 部分

其中导出的项目 `JSON` 可以再次载入 FrameLab，继续原来的编辑流程。

## 中英双语界面

FrameLab 当前支持：

- English
- 简体中文（`zh-CN`）

界面语言不仅影响操作界面，也会影响部分导出内容的呈现方式。README.md 仍然是主英文说明文档，而本文件提供面向中文用户的补充入口。

## 快速开始

### 环境要求

- Node.js 18+
- npm

### 本地运行

```bash
npm install
npm run dev
```

然后打开 [http://localhost:3000](http://localhost:3000)。

### 可选的真实 AI 模式

FrameLab 默认使用本地模拟建议。真实 AI 只是可选项。

如果你想启用基于不同提供方的真实建议，请在本地创建 `.env.local`：

```bash
AI_PROVIDER=mock
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash-lite
```

说明：

- `AI_PROVIDER=mock` 时，建议保持本地生成
- `AI_PROVIDER=openai` 时，使用已配置的 OpenAI API Key 和模型
- `AI_PROVIDER=gemini` 时，使用已配置的 Gemini API Key 和模型
- 模拟模式仍然是默认选项
- 使用者需要在 `.env.local` 中配置自己的 API Key
- `.env.local` 不应提交到仓库
- `gemini-2.5-flash-lite` 是当前更推荐用于 FrameLab 测试的 Gemini 模型
- 如果所选提供方缺少 Key，或真实 AI 请求失败，FrameLab 会自动回退到模拟建议
- Gemini 或其他提供方有时会出现临时高负载或不可用情况
- 遇到临时不可用时，FrameLab 会对 Gemini 自动重试一次；如果仍失败，则回退到模拟建议
- 为兼容旧配置，如果未设置 `AI_PROVIDER` 且 `AI_SUGGESTION_MODE=real`，FrameLab 仍会按 OpenAI 方式处理
- API Key 只应保存在本地服务器环境中，不能提交到仓库
- 启用真实 AI 后，当前选中的样本文本会发送到所配置的 AI 提供方
- 使用真实 AI 可能产生相关 API 调用费用，由用户自行承担
- OpenAI 与 Gemini 的免费额度、配额和价格未来都可能变化

示例：

```bash
# 模拟模式
AI_PROVIDER=mock
```

```bash
# OpenAI
AI_PROVIDER=openai
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1-mini
```

```bash
# Gemini
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash-lite
```

## 项目结构

```text
src/
├─ app/                  # Next.js App Router 页面与布局
├─ components/           # 共享布局与展示组件
├─ features/             # import、templates、coding、ai、export 等功能模块
├─ i18n/                 # 轻量级中英双语词典与语言状态
├─ lib/                  # 公共工具与常量
└─ types/                # 共享 TypeScript 类型

docs/                    # 方法说明、路线图、研究免责声明等
examples/                # 用于演示的虚构示例数据
```

## 研究使用说明 / 免责声明

FrameLab 的目标是帮助学习和整理研究流程，而不是替代研究判断。

- AI 建议只是可编辑的辅助起点，不应被视为最终学术判断。
- 默认 AI 建议是本地运行的模拟建议；如果用户自行配置，也可以启用真实 AI 建议。
- 启用真实 AI 后，当前选中的样本文本会发送到所配置的 AI 提供方。
- 若启用真实 AI，相关 API 调用费用由用户自行承担。
- 用户仍需自行审查、修改并解释最终编码结果。
- 工具输出不能替代方法训练、理论阅读、教师反馈或研究设计本身。

如果你把 FrameLab 用于课程作业、研究计划或论文前期探索，建议同时阅读：

- [docs/methodology.md](./docs/methodology.md)
- [docs/research-disclaimer.md](./docs/research-disclaimer.md)

## 路线图

当前方向可见 [docs/roadmap.md](./docs/roadmap.md)。

现阶段大致为：

- `v0.1`：本地优先的 MVP 工作流
- `v0.2`：可用性与文档继续打磨
- `v0.3`：更完整的 schema 编辑能力与项目工作流控制
- `v0.4`：更丰富的 AI 配置与提供方支持

## 贡献方式

欢迎贡献，尤其欢迎以下方向：

- 示例数据补充与改进
- 模板字段与说明优化
- 文档与新手引导完善
- UI 可读性与可访问性细节打磨
- 导出报告格式改进
- 中英双语文案优化

如果贡献涉及模板、方法说明、AI 建议描述或研究相关文案，请保持谨慎，不要夸大工具的学术有效性。

贡献前可先阅读：

- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)

## 开源协议

本项目使用 [MIT License](./LICENSE) 开源。
