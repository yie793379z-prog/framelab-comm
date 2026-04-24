# framelab-comm

FrameLab is a lightweight coding workspace for communication and media studies students.

The project is designed for coursework, small research projects, and thesis preparation. It helps students import texts, choose a communication-oriented analysis template, generate initial coding suggestions in later iterations, manually edit codes, and export classroom-ready results.

## MVP Focus

- Import text samples
- Choose an analysis template
- Review and edit coding fields
- Export results as CSV, JSON, or Markdown

## Product Principles

- Human-in-the-loop, not fully automated research
- AI suggestions must always be editable
- Simple, readable architecture for open-source contributors
- No authentication or database in v1

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Repository Structure

- `src/app`: routes and page shell
- `src/features`: feature-oriented UI and state
- `src/types`: shared domain types
- `docs`: project documentation
- `examples`: sample research assets and exported outputs
