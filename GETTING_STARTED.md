[简体中文](./GETTING_STARTED.zh-CN.md) | English

# Start Here: FrameLab Beginner Guide

This is the root-level beginner guide for first-time users.

If you are a non-technical communication, journalism, or media studies student, start here instead of trying to infer the workflow from the codebase.

## What FrameLab Is

FrameLab is a lightweight, local-first coding workspace for communication and media studies coursework and early research projects.

It helps you:

1. import text
2. choose a template
3. code sample by sample
4. review summaries
5. export results
6. reopen the same project later

## What It Can And Cannot Do

FrameLab can:

- import pasted text, TXT, Markdown, and CSV
- help you clean obviously noisy pasted text
- support manual coding
- provide mock or optional real AI suggestions
- export CSV, Markdown, Codebook Markdown, and JSON
- reopen JSON projects and restore local autosave

FrameLab cannot:

- scrape Weibo or other platforms
- automatically understand image meaning
- replace coder judgment
- safely automate large datasets without review

## First Files To Use

Start with these:

- [examples/projects/wechat-news-cleaning-demo.md](./examples/projects/wechat-news-cleaning-demo.md)
- [examples/projects/weibo-topic-analysis-demo.md](./examples/projects/weibo-topic-analysis-demo.md)
- [examples/projects/interview-coding-demo.md](./examples/projects/interview-coding-demo.md)

## What `npm install`, `npm run dev`, and `localhost:3000` Mean

- `npm install`: install the project dependencies
- `npm run dev`: start FrameLab locally on your own computer
- `localhost:3000`: the local browser address where FrameLab opens

## How To Start FrameLab

In the project folder:

```bash
npm install
npm run dev
```

Then open:

[http://localhost:3000](http://localhost:3000)

## Default Language

FrameLab now opens in Simplified Chinese by default for the current student audience.

If you want English:

1. open the app
2. use the `EN / 简中` switch in the header

## Recommended First Full Workflow

1. Open [examples/projects/wechat-news-cleaning-demo.md](./examples/projects/wechat-news-cleaning-demo.md)
2. Copy the messy WeChat-style article
3. Open FrameLab and click `打开工作区`
4. Paste the text
5. Click `清理粘贴文本`
6. Review the cleaned text manually
7. Click `载入工作区`
8. Choose `新闻框架分析`
9. Fill fields manually or click `生成建议`
10. Review the fields manually
11. Check the coding summary dashboard
12. Export Markdown
13. Export Codebook
14. Export JSON
15. Refresh and test local autosave
16. Reload the JSON project to confirm continuation works

## Safe AI Use

- AI suggestions are editable starting points, not final academic judgments.
- Do not upload sensitive private data to real AI providers.
- If Gemini or another real provider fails, FrameLab usually falls back to mock suggestions.

## More Help

- [GETTING_STARTED.zh-CN.md](./GETTING_STARTED.zh-CN.md)
- [examples/README.zh-CN.md](./examples/README.zh-CN.md)
- [docs/social-media-datasets.zh-CN.md](./docs/social-media-datasets.zh-CN.md)
