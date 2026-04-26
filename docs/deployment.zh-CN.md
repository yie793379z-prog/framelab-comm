# 部署说明

这份文档说明如何把 FrameLab 部署到 Vercel，并区分：

- 安全的公开演示站
- 启用真实 AI 的私有部署

## 推荐的公开演示设置

如果你准备把 FrameLab 作为公开演示站部署，推荐使用：

```bash
AI_PROVIDER=mock
```

这样做最稳妥，因为：

- 不需要 OpenAI 或 Gemini API Key
- 访问者仍然可以体验工作区和交互式演示
- 不会因为公开访问触发真实 AI 费用
- 默认不会把样本文本发送到外部 AI 提供方

如果完全不设置 `AI_PROVIDER`，FrameLab 也会自动回退到 `mock`。但在 Vercel 里显式写成 `AI_PROVIDER=mock` 会更清楚。

## 如何从 GitHub 部署到 Vercel

1. 先把仓库推送到 GitHub
2. 打开 [Vercel](https://vercel.com/)
3. 点击 `Add New...` -> `Project`
4. 导入这个 GitHub 仓库
5. 保持 Vercel 默认识别 Next.js
6. 在 Environment Variables 里添加：

```bash
AI_PROVIDER=mock
```

7. 点击 `Deploy`

如果只是做公开演示，通常**不需要**配置：

- `OPENAI_API_KEY`
- `GEMINI_API_KEY`

## 如何启用真实 AI（私有部署）

如果你要做自己的私有部署，想启用真实 AI 建议，可以在 Vercel 环境变量里添加你自己的 provider 配置。

### OpenAI

```bash
AI_PROVIDER=openai
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1-mini
```

### Gemini

```bash
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash-lite
```

注意：

- 真实 AI 是可选项，不是必须项
- 启用真实 AI 后，样本文本会发送到已配置的提供方
- 真实 AI 调用可能产生费用
- 面向公开访问的演示站通常应该保持 `mock` 模式

## 密钥安全

不要把 API Key 放进：

- GitHub 提交记录
- `README.md`
- 客户端代码
- `NEXT_PUBLIC_*` 环境变量

FrameLab 只会在服务端读取 provider key。

推荐放置位置：

- Vercel 项目设置里的 Environment Variables
- 你自己电脑上的 `.env.local`

不要提交 `.env.local`。

## 修改环境变量后如何重新部署

如果你在 Vercel 里改了环境变量：

1. 打开对应项目
2. 更新环境变量
3. 触发一次重新部署

你可以通过以下方式重新部署：

- 在 Vercel 面板点击 `Redeploy`
- 或者重新推送一个新的 Git 提交

## 默认构建命令

FrameLab 使用标准的 Next.js 命令即可：

- 安装依赖：`npm install`
- 构建：`npm run build`
- 启动：`npm run start`

## 公开演示站的定位建议

如果你把它部署成公开可访问的演示站，建议明确说明：

- 这是一个本地优先研究工作流的在线演示
- 默认使用 mock 模式
- 不需要 API Key 也可以体验主要流程
- 它不是自动完成学术研究的工具
