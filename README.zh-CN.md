# FrameLab

[English](./README.md) | 简体中文

新手从这里开始：[GETTING_STARTED.zh-CN.md](./GETTING_STARTED.zh-CN.md)

Start here: [GETTING_STARTED.md](./GETTING_STARTED.md)

在线演示：[https://framelab-comm.vercel.app](https://framelab-comm.vercel.app)

交互式演示：[https://framelab-comm.vercel.app/demo](https://framelab-comm.vercel.app/demo)

工作区：[https://framelab-comm.vercel.app/workspace](https://framelab-comm.vercel.app/workspace)

AI 配置说明：[https://framelab-comm.vercel.app/ai-setup](https://framelab-comm.vercel.app/ai-setup)

查看交互式演示（本地启动后打开）：[http://localhost:3000/demo](http://localhost:3000/demo)

查看真实 AI 配置方法（本地启动后打开）：[http://localhost:3000/ai-setup](http://localhost:3000/ai-setup)

部署说明：[docs/deployment.zh-CN.md](./docs/deployment.zh-CN.md)

Deployment guide: [docs/deployment.md](./docs/deployment.md)

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

直接和 ChatGPT、Gemini 这类大语言模型对话，当然适合做一次性的分析、头脑风暴，或者快速看看一段文本可能有哪些切入点。但 FrameLab 解决的是另一类问题：更结构化、可重复、可导出的传播研究工作流。

FrameLab 并不声称自己比通用大模型“更聪明”。它的价值主要不在模型本身，而在工作流和结构上：内置模板、项目编码表、可编辑的编码表单、批量建议、编码摘要、导出、自动保存和项目重新载入。AI 建议只是可选功能，而且始终可以修改。FrameLab 更适合课堂练习、小型研究和前期论文整理，因为它强调的是结构、可复用性和研究使用场景，而不只是一次回答。

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
- 可对粘贴的杂乱文本做保守清理
- 支持在样本较多时进行搜索、筛选和排序
- 在同一工作区中切换 4 个内置传播研究模板
- 可将内置模板复制为项目级自定义编码表
- 可编辑模板名称、说明、字段标签、帮助文字、占位提示和选项标签
- 按样本逐条编辑编码字段
- 默认生成本地运行的模拟 AI 编码建议
- 可选接入使用者自己的 OpenAI 或 Gemini API Key 来启用真实 AI 建议
- 支持对未编码样本做批量建议
- 提供当前模板下的编码摘要面板
- 导出 `CSV`、`JSON`、`Markdown` 报告和 `Markdown` 编码手册
- 支持本地自动保存与恢复
- 默认界面为简体中文，同时保留英文切换

## 入门指南

- [零基础使用指南（简体中文）](./GETTING_STARTED.zh-CN.md)
- [Beginner guide (English)](./GETTING_STARTED.md)
- [在线演示](https://framelab-comm.vercel.app)
- [交互式演示（无需 API Key）](https://framelab-comm.vercel.app/demo)
- [工作区](https://framelab-comm.vercel.app/workspace)
- [真实 AI 配置说明](https://framelab-comm.vercel.app/ai-setup)
- [部署说明](./docs/deployment.zh-CN.md)
- [社交媒体数据导入指南](./docs/social-media-datasets.zh-CN.md)
- [Social media dataset guide](./docs/social-media-datasets.md)
- [产品灵感与定位](./docs/inspirations.zh-CN.md)
- [Project inspirations](./docs/inspirations.md)

## 在线 Demo

公开演示地址：[https://framelab-comm.vercel.app](https://framelab-comm.vercel.app)

建议公开演示站保持以下设置：

- 部署到 Vercel
- 使用 `AI_PROVIDER=mock`
- 不要求访问者提供 OpenAI 或 Gemini API Key
- 即使不开启真实 AI，也能正常体验 guided demo 和工作区
- 保留 `/ai-setup` 页面，向访问者说明真实 AI 需要本地运行或私有部署后自行配置

如果你想在私有部署中启用真实 AI，请自行在服务端配置 provider key。详见 [docs/deployment.zh-CN.md](./docs/deployment.zh-CN.md)。

快速入口：

- [首页](https://framelab-comm.vercel.app)
- [交互式演示](https://framelab-comm.vercel.app/demo)
- [工作区](https://framelab-comm.vercel.app/workspace)
- [AI 配置说明](https://framelab-comm.vercel.app/ai-setup)

## 适合谁使用

- 想快速体验传播学文本编码流程的新闻学、传播学、媒体研究学生
- 想做课堂演示、课程作业、小型 pilot study 或论文前期整理的使用者
- 不想先学复杂定性研究软件，但又希望保留结构化工作流的人

## 可以怎么试

- 先打开线上首页或交互式演示，不需要 API Key
- 再进入工作区，粘贴一段示例文本
- 点击“清理粘贴文本”
- 选择“新闻框架分析”
- 点“生成建议”，再人工复核
- 导出 Markdown 报告、编码手册或 JSON 项目

## 当前限制

- 公开演示默认使用 mock 模式，不直接调用真实 AI
- 如果想用 Gemini 或 OpenAI，需要你自己在本地或自部署环境里配置 API Key
- FrameLab 不会自动抓取微信或微博内容
- FrameLab 不会自动理解图片
- AI 建议只是可编辑起点，不是最终学术判断

## 欢迎反馈

- 如果你是从小红书、微信群、课堂分享或朋友转发点进来的，欢迎直接试一遍最短流程
- 如果哪一步让你困惑，或你觉得某个传播学场景还不够顺手，欢迎提 issue 或反馈给项目维护者

## 全流程示例项目

- [examples/README.zh-CN.md](./examples/README.zh-CN.md)
- [examples/README.md](./examples/README.md)
- [微信公众号文章清理与编码示例](./examples/projects/wechat-news-cleaning-demo.md)
- [微博议题分析示例](./examples/projects/weibo-topic-analysis-demo.md)
- [访谈预编码示例](./examples/projects/interview-coding-demo.md)

## 使用流程

1. 打开工作区，粘贴一个或多个文本样本，或选择本地 TXT、Markdown、CSV 文件。
2. 使用空行分隔不同样本；如果文本很乱，可以先点“清理粘贴文本”。
3. 选择最适合当前任务的内置模板。
4. 如有需要，可先把当前模板复制成项目级自定义编码表并调整说明文字。
5. 在样本列表中选择一个样本。
6. 手动编辑编码字段。
7. 如有需要，可生成 AI 建议作为可编辑起点。
8. 导出为 `CSV`、`JSON`、`Markdown` 或 `Markdown` 编码手册。
9. 若之后继续工作，可把导出的项目 `JSON` 再载入 FrameLab。

## 截图

正式发布时可把截图放在这里：

- `public/screenshots/landing.png`
- `public/screenshots/workspace-en.png`
- `public/screenshots/workspace-zh.png`
- `public/screenshots/export-panel.png`

如果暂时还没有真实截图，请继续把这些路径当作占位说明。`/demo` 页面里的界面是演示用 mockup，不是真实产品截图。

截图拍摄步骤可参考 [docs/demo-script.md](./docs/demo-script.md)。

## 示例数据

仓库内提供了虚构但适合演示的示例材料，位于 [`examples/`](./examples/)：

- [news_sample.csv](./examples/news_sample.csv)
- [social_posts.csv](./examples/social_posts.csv)
- [interview_sample.txt](./examples/interview_sample.txt)
- [crisis_comm_sample.txt](./examples/crisis_comm_sample.txt)

如果你想要一步一步照着点，可以直接看：

- [examples/README.zh-CN.md](./examples/README.zh-CN.md)

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

对于微信公众号文章、宣传稿、复制出来很乱的网页文本，FrameLab 还提供了一个保守的“清理粘贴文本”按钮。它只会删除明显独立存在的噪音，例如重复空行、图片占位、广告或免责声明提示。清理结果仍然需要你自己再看一遍，确认没有删掉有研究意义的内容。

## 导出格式

- `CSV`：按样本、模板和字段值展开后的编码数据
- `JSON`：保留项目结构的工作区导出，包含样本、当前模板、项目元数据、自定义编码表、编码结果和导出元数据
- `Markdown`：更适合课堂展示、讨论或整理笔记的分析摘要，包含项目元数据、编码摘要、codebook 和逐样本编码结果
- `Markdown` 编码手册：单独导出当前模板/编码表，便于课程方法说明或研究记录

其中导出的项目 `JSON` 可以再次载入 FrameLab，继续原来的编辑流程。

## 中英双语界面

FrameLab 当前支持：

- 简体中文（`zh-CN`，默认）
- English

目前默认界面是简体中文，更适合当前主要用户群体；如果你需要英文界面，可以在顶部导航栏一键切换。界面语言还会影响部分导出内容的呈现方式。

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

如果你不熟悉 `npm`、本地运行或 `localhost` 的含义，建议直接看：

- [GETTING_STARTED.zh-CN.md](./GETTING_STARTED.zh-CN.md)

### 可选的真实 AI 模式

FrameLab 默认使用本地模拟建议。真实 AI 只是可选项。

如果是面对公众的在线演示站，建议默认保持 `mock` 模式。

如果你想看网页内的配置说明，可在本地启动后打开 [http://localhost:3000/ai-setup](http://localhost:3000/ai-setup)。

### 在启用真实 AI 之前

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
- 不要把敏感、隐私或受限研究材料直接发送给真实 AI 提供方

## 项目结构

```text
src/
├─ app/                  # Next.js App Router 页面与布局
├─ components/           # 共享布局与展示组件
├─ features/             # import、templates、coding、ai、export 等功能模块
├─ i18n/                 # 轻量级中英双语词典与语言状态
├─ lib/                  # 公共工具与常量
└─ types/                # 共享 TypeScript 类型

docs/                    # 入门指南、方法说明、路线图、研究说明等
examples/                # 演示数据与全流程示例项目
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

- [GETTING_STARTED.zh-CN.md](./GETTING_STARTED.zh-CN.md)
- [docs/methodology.md](./docs/methodology.md)
- [docs/research-disclaimer.md](./docs/research-disclaimer.md)
- [docs/social-media-datasets.zh-CN.md](./docs/social-media-datasets.zh-CN.md)

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
