# FrameLab

English | [简体中文](./README.zh-CN.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

CI badge placeholder:

```md
[![CI](https://github.com/<owner>/<repo>/actions/workflows/ci.yml/badge.svg)](https://github.com/<owner>/<repo>/actions/workflows/ci.yml)
```

Lightweight coding workspace for communication and media studies students.

**English**
FrameLab helps students move from raw texts to editable coding workflows for framing analysis, content analysis, interview pre-coding, and crisis communication review.

**简体中文**
FrameLab 帮助传播学与媒体研究学生把原始文本快速转化为可编辑的编码工作流，适用于框架分析、内容分析、访谈预编码和危机传播观察。

## Why FrameLab Exists

Communication and media studies students often sit between two unsatisfying options:

- generic AI writing tools that are not built for research coding
- heavy qualitative research software that can feel excessive for coursework, pilot studies, and early thesis exploration

FrameLab is positioned in the middle. It is not a replacement for careful methodology, and it is not a fully automated research tool. It is a lightweight, student-friendly workspace for trying a codebook, generating editable starting points, and exporting clear outputs for class discussion or early project organization.

## Why not just use ChatGPT or Gemini?

Direct LLM chat is useful for one-off analysis, brainstorming, or getting a quick first reading of a text. FrameLab is meant for a different job: structured, repeatable communication research workflows.

FrameLab does not claim to be smarter than ChatGPT or Gemini. Its value is in giving students a clearer workflow: built-in templates, consistent fields, editable coding forms, CSV/JSON/Markdown export, project reload, bilingual UI, and human-in-the-loop review. AI suggestions are optional and always editable. The main benefit is structure, reproducibility, and better usability for coursework and small research projects.

## Key Features

- Import multiple text samples into a local workspace
- Import from pasted text or local `.txt`, `.md`, and `.csv` files
- Switch between four communication-oriented templates
- Edit coding fields sample by sample
- Generate mock AI-assisted suggestions by default
- Optionally enable real OpenAI- or Gemini-backed suggestions with your own API key
- Export coded data as CSV, JSON, and Markdown
- Reload previously exported project JSON to continue editing
- Use the interface in English or Simplified Chinese
- Keep mock mode local-first, with real AI available only as an optional server-side integration

## Demo Workflow

1. Paste one or more text samples into the workspace, or choose a local TXT, Markdown, or CSV file.
2. Separate samples with blank lines.
3. Choose a template such as `News Framing Analysis` or `Crisis Communication Scan`.
4. Select a sample from the sample list.
5. Edit coding fields manually.
6. Optionally generate AI suggestions as editable starting points.
7. Export your workspace as CSV, JSON, or Markdown.

## Screenshots

Place release screenshots here:

- `public/screenshots/landing.png`
- `public/screenshots/workspace-en.png`
- `public/screenshots/workspace-zh.png`
- `public/screenshots/export-panel.png`

Use [docs/demo-script.md](./docs/demo-script.md) as the capture checklist.

Suggested future README image blocks:

```md
![Landing](public/screenshots/landing.png)
![Workspace English](public/screenshots/workspace-en.png)
![Workspace Chinese](public/screenshots/workspace-zh.png)
![Export Panel](public/screenshots/export-panel.png)
```

## Example Datasets

The repository includes fictional example materials under [`examples/`](./examples/):

- [news_sample.csv](./examples/news_sample.csv)
- [social_posts.csv](./examples/social_posts.csv)
- [interview_sample.txt](./examples/interview_sample.txt)
- [crisis_comm_sample.txt](./examples/crisis_comm_sample.txt)

See [examples/README.md](./examples/README.md) for suggested templates and quick import guidance.

## Import Formats

FrameLab currently supports local browser import for:

- pasted text
- `.txt`
- `.md`
- `.csv`

TXT and Markdown files use the same blank-line splitting logic as pasted text.

For CSV import, FrameLab looks for a text column with one of these names:

- `text`
- `content`
- `body`
- `message`
- `transcript`

If multiple matching columns exist, FrameLab uses the first one. CSV parsing happens locally in the browser, and paste import still works as before.

## Export Formats

- `CSV`: flattened coded data by sample, template, and field values
- `JSON`: workspace-style project export with samples, selected template, coding results, and export metadata that can be loaded back into FrameLab
- `Markdown`: a readable analysis report with methodology note, per-sample coding summary, and AI disclaimer

## Bilingual Interface

FrameLab currently supports:

- English
- Simplified Chinese (`zh-CN`)

The active interface language also affects exported reports and localized template labels.

## Getting Started

### Requirements

- Node.js 18+ recommended
- npm

### Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Optional Real AI Mode

FrameLab defaults to local mock suggestions. Real AI is optional.

To enable provider-based real AI suggestions, create a local `.env.local` file and set:

```bash
AI_PROVIDER=mock
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash-lite
```

Notes:

- `AI_PROVIDER=mock` keeps suggestions local
- `AI_PROVIDER=openai` uses the configured OpenAI API key and model
- `AI_PROVIDER=gemini` uses the configured Gemini API key and model
- mock mode remains the default
- users must provide their own provider API key in `.env.local`
- `.env.local` should not be committed to the repository
- `gemini-2.5-flash-lite` is the recommended Gemini test model for FrameLab
- if the chosen provider is missing a key or the real AI request fails, FrameLab falls back to mock suggestions
- Gemini and other providers may occasionally return temporary high-demand or unavailable errors
- FrameLab retries Gemini once for temporary unavailable errors, then falls back to mock suggestions if needed
- for backward compatibility, `AI_SUGGESTION_MODE=real` still maps to OpenAI when `AI_PROVIDER` is unset
- API keys must stay server-side and must not be committed to the repository
- real AI mode sends the selected sample text to the configured AI provider
- real AI mode may incur API costs on the user’s own account
- free tiers, quotas, and pricing for OpenAI and Gemini may change over time

Examples:

```bash
# Mock mode
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

## Project Structure

```text
src/
├─ app/                  # Next.js App Router pages and layout
├─ components/           # Shared layout and display components
├─ features/             # Feature modules: import, templates, coding, ai, export
├─ i18n/                 # Lightweight bilingual dictionary and language context
├─ lib/                  # Shared helpers and constants
└─ types/                # Shared TypeScript domain types

docs/                    # Methodology, roadmap, and research disclaimers
examples/                # Fictional datasets for quick demos
```

## Methodology and Research Use

FrameLab is designed to support introductory communication research workflows, not to replace research judgment.

- Read [docs/methodology.md](./docs/methodology.md) for a short explanation of content analysis, framing analysis, and human-in-the-loop coding.
- Read [docs/research-disclaimer.md](./docs/research-disclaimer.md) before treating AI-assisted outputs as analytical conclusions.

## Roadmap

See [docs/roadmap.md](./docs/roadmap.md).

Current direction:

- `v0.1`: local MVP workflow
- `v0.2`: usability and documentation polish
- `v0.3`: richer project persistence and custom codebooks
- `v0.4`: expanded AI configuration and provider options

## Contributing

Contributions are welcome, especially from:

- communication and media studies students
- HCI and education-focused contributors
- frontend developers interested in lightweight research tooling
- researchers who can improve templates, examples, and documentation

Good starting points:

- improve template wording
- expand example datasets
- tighten export formatting
- improve bilingual copy quality
- add student-friendly onboarding polish

See [CONTRIBUTING.md](./CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## Research Use Disclaimer

FrameLab is a learning and research-assistance tool.

- AI suggestions are editable aids, not final academic judgments.
- Mock mode keeps suggestion generation local.
- Optional real AI mode sends selected sample text to the configured AI provider.
- Users are responsible for their own API usage costs if they enable real AI mode.
- Users remain responsible for reviewing and revising all codes.
- Future AI integrations should not be used with sensitive or private data without proper safeguards.

## License

This repository is licensed under the MIT License. See [LICENSE](./LICENSE).
