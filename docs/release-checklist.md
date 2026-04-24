# Release Checklist

Use this checklist before a public GitHub release or version tag.

## Local Checks

- `npm install` succeeds
- `npm run lint` succeeds
- `npm run build` succeeds
- the app starts locally with `npm run dev`

## README Checks

- project description matches current MVP
- setup instructions are correct
- example dataset links work
- roadmap section matches actual plans
- screenshot guidance still matches expected file paths

## Docs Checks

- methodology docs are accurate and not overstated
- roadmap is current
- research disclaimer is visible and consistent with product behavior
- contribution docs remain beginner-friendly

## Example Data Checks

- all example datasets are fictional
- no private or identifiable real-world data is included
- example files still fit the built-in templates
- example instructions match the current paste-based import flow

## Bilingual UI Checks

- English mode reads naturally
- Simplified Chinese mode reads naturally
- key buttons and empty states are localized
- template names, field labels, and help text are localized
- export/import messages are localized

## Export / Import Checks

- CSV export works
- JSON export works
- Markdown export works
- exported JSON can be loaded back into the workspace
- invalid JSON shows a clear error
- replace-current-project confirmation appears before loading

## Accessibility Sanity Checks

- keyboard navigation works for major actions
- buttons have clear labels
- form fields remain readable on desktop and mobile
- contrast is acceptable in the main workflow

## GitHub Metadata Checks

- repository description is set
- topics/tags are set
- license is recognized by GitHub
- issue templates appear correctly
- PR template appears correctly
- CI workflow runs on push and pull request
