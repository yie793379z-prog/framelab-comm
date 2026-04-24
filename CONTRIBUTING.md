# Contributing to FrameLab

Thanks for your interest in contributing to FrameLab.

FrameLab is an open-source project for communication and media studies students. The project aims to stay lightweight, approachable, and methodologically careful. Contributions do not need to be large to be useful.

## Good Contribution Areas

Helpful contributions include:

- improving example datasets
- refining built-in templates and field wording
- tightening documentation and onboarding
- polishing the UI for readability and accessibility
- improving CSV, JSON, and Markdown exports
- refining bilingual English and Simplified Chinese copy

## Before You Start

Please keep these project principles in mind:

- FrameLab is human-in-the-loop, not fully automated research.
- AI suggestions should remain editable starting points.
- Documentation and UI copy should avoid overstating academic validity.
- Research-oriented wording should stay cautious, clear, and student-friendly.

## Local Setup

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run lint
npm run build
```

## Contribution Workflow

1. Fork the repository.
2. Create a focused branch.
3. Keep the change small and easy to review.
4. Run lint and build locally if your change affects code.
5. Open a pull request with a short explanation of:
   - what changed
   - why it helps users or contributors
   - what you tested

## Guidance for Research-Related Changes

If your change affects:

- templates
- methodology docs
- example datasets
- AI suggestion wording
- export/report language

Please avoid:

- implying that the tool makes final academic judgments
- treating AI output as methodologically sufficient on its own
- presenting fictional example data as real cases

Prefer wording that supports learning, early exploration, and careful review.

## Pull Request Tips

Strong PRs usually:

- solve one clear problem
- include concise reasoning
- avoid unrelated refactors
- preserve beginner-friendly readability
- respect the bilingual interface where relevant

## Need an Easy Starting Point?

Good first contributions:

- add one more fictional example dataset
- improve one template description
- polish one section of the README
- improve Chinese or English UI wording
- tighten export formatting for Markdown reports

## Questions

If you are unsure whether an idea fits the project, open an issue first. That is especially helpful for methodology-sensitive changes.
