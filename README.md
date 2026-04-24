# FrameLab

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

## Key Features

- Import multiple text samples into a local workspace
- Switch between four communication-oriented templates
- Edit coding fields sample by sample
- Generate mock AI-assisted suggestions that only fill empty fields
- Export coded data as CSV, JSON, and Markdown
- Use the interface in English or Simplified Chinese
- Keep everything local in the current MVP

## Demo Workflow

1. Paste one or more text samples into the workspace.
2. Separate samples with blank lines.
3. Choose a template such as `News Framing Analysis` or `Crisis Communication Scan`.
4. Select a sample from the sample list.
5. Edit coding fields manually.
6. Optionally generate mock AI suggestions as editable starting points.
7. Export your workspace as CSV, JSON, or Markdown.

## Screenshots

Screenshot placeholders:

- Landing page
- Workspace with imported samples
- Coding form with template fields
- Export panel and generated outputs

## Example Datasets

The repository includes fictional example materials under [`examples/`](/Users/zhangchengjia/Desktop/Codex/framelab-comm/examples/):

- [news_sample.csv](/Users/zhangchengjia/Desktop/Codex/framelab-comm/examples/news_sample.csv)
- [social_posts.csv](/Users/zhangchengjia/Desktop/Codex/framelab-comm/examples/social_posts.csv)
- [interview_sample.txt](/Users/zhangchengjia/Desktop/Codex/framelab-comm/examples/interview_sample.txt)
- [crisis_comm_sample.txt](/Users/zhangchengjia/Desktop/Codex/framelab-comm/examples/crisis_comm_sample.txt)

See [examples/README.md](/Users/zhangchengjia/Desktop/Codex/framelab-comm/examples/README.md) for suggested templates and quick import guidance.

## Export Formats

- `CSV`: flattened coded data by sample, template, and field values
- `JSON`: workspace-style project export with samples, selected template, coding results, and export metadata
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

- Read [docs/methodology.md](/Users/zhangchengjia/Desktop/Codex/framelab-comm/docs/methodology.md) for a short explanation of content analysis, framing analysis, and human-in-the-loop coding.
- Read [docs/research-disclaimer.md](/Users/zhangchengjia/Desktop/Codex/framelab-comm/docs/research-disclaimer.md) before treating AI-assisted outputs as analytical conclusions.

## Roadmap

See [docs/roadmap.md](/Users/zhangchengjia/Desktop/Codex/framelab-comm/docs/roadmap.md).

Current direction:

- `v0.1`: local MVP workflow
- `v0.2`: usability and documentation polish
- `v0.3`: project save/load and custom codebooks
- `v0.4`: optional real AI integration

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

## Research Use Disclaimer

FrameLab is a learning and research-assistance tool.

- AI suggestions are editable aids, not final academic judgments.
- Users remain responsible for reviewing and revising all codes.
- Future AI integrations should not be used with sensitive or private data without proper safeguards.

## License

This repository is licensed under the MIT License. See [LICENSE](/Users/zhangchengjia/Desktop/Codex/framelab-comm/LICENSE).
