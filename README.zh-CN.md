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

## 核心功能

- 通过粘贴文本导入多个样本
- 在同一工作区中切换 4 个内置传播研究模板
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

1. 打开工作区，粘贴一个或多个文本样本。
2. 使用空行分隔不同样本。
3. 选择最适合当前任务的内置模板。
4. 在样本列表中选择一个样本。
5. 手动编辑编码字段。
6. 如有需要，可生成 AI 建议作为可编辑起点。
7. 导出为 `CSV`、`JSON` 或 `Markdown`。
8. 若之后继续工作，可把导出的项目 `JSON` 再载入 FrameLab。

## 示例数据

仓库内提供了虚构但适合演示的示例材料，位于 [`examples/`](./examples/)：

- [news_sample.csv](./examples/news_sample.csv)
- [social_posts.csv](./examples/social_posts.csv)
- [interview_sample.txt](./examples/interview_sample.txt)
- [crisis_comm_sample.txt](./examples/crisis_comm_sample.txt)

可配合 [examples/README.md](./examples/README.md) 一起使用，里面说明了每个文件更适合搭配哪个模板，以及当前版本应如何导入。

需要注意的是：当前 MVP 仍然是“粘贴导入”流程，并不会直接解析 CSV 文件。使用 CSV 示例时，建议先打开文件，复制其中的文本内容，再按空行分隔粘贴进 FrameLab。

## 导出格式

- `CSV`：按样本、模板和字段值展开后的编码数据
- `JSON`：保留项目结构的工作区导出，包含样本、当前模板、编码结果和导出元数据
- `Markdown`：更适合课堂展示、讨论或整理笔记的分析摘要

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
GEMINI_MODEL=gemini-2.5-flash
```

说明：

- `AI_PROVIDER=mock` 时，建议保持本地生成
- `AI_PROVIDER=openai` 时，使用已配置的 OpenAI API Key 和模型
- `AI_PROVIDER=gemini` 时，使用已配置的 Gemini API Key 和模型
- 如果所选提供方缺少 Key，或真实 AI 请求失败，FrameLab 会自动回退到模拟建议
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
GEMINI_MODEL=gemini-2.5-flash
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
- `v0.3`：更完整的项目持久化与自定义 codebook
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
