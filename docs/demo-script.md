# Demo Script

Use this short capture flow when preparing FrameLab screenshots for a public release. The goal is to show a calm, readable workflow rather than every feature at once.

## Before You Capture

- Run the app locally with `npm run dev`.
- Use the example datasets in [examples/README.md](/Users/zhangchengjia/Desktop/Codex/framelab-comm/examples/README.md) or a short fictional dataset of your own.
- Keep the browser zoom at `100%`.
- Use a clean browser window with minimal extensions or bookmarks visible.
- Aim for a window size that shows the main content without excessive empty space.

## 1. Landing Page Screenshot

- Open `/`.
- Keep the language in English.
- Confirm the hero title, workflow panel, and template cards are visible.
- Capture and save as `public/screenshots/landing.png`.

## 2. English Workspace Screenshot

- Open `/workspace`.
- Import 3 to 4 short samples separated by blank lines.
- Choose a template such as `News Framing Analysis`.
- Select one sample and fill several fields.
- Generate mock suggestions so the coding form and live preview both contain values.
- Keep the interface in English.
- Capture and save as `public/screenshots/workspace-en.png`.

## 3. Chinese Workspace Screenshot

- Stay on `/workspace`.
- Switch the interface to `简中`.
- Keep the same project loaded so the screenshot shows a realistic in-progress analysis.
- Confirm the selected template, coding form, and live preview all show Chinese labels.
- Capture and save as `public/screenshots/workspace-zh.png`.

## 4. Export / Import Panel Screenshot

- Scroll to the export section in the workspace.
- Keep sample counts and coding rows visible.
- Show the export buttons and the `Load Project JSON` area in the same frame.
- If helpful, paste a small portion of project JSON into the text area so the import path is visible.
- Capture and save as `public/screenshots/export-panel.png`.

## Final Check

- Confirm the screenshots do not contain private data.
- Confirm the UI language matches the file name.
- Confirm the screenshots reflect the current release candidate UI, not an older build.
