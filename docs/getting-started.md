[简体中文](./getting-started.zh-CN.md) | English

# FrameLab Beginner Guide

This guide is written for students who want to use FrameLab without needing to understand the codebase.

## What FrameLab Is

FrameLab is a lightweight coding workspace for communication, journalism, and media studies students.

It helps you move from raw text to a simple research workflow:

1. import text
2. choose a template
3. code sample by sample
4. review summaries
5. export files you can keep using later

It is not a full qualitative analysis suite, and it is not a general AI chat tool. It is a smaller workspace designed for coursework, pilot studies, and early thesis preparation.

## Who It Is For

FrameLab is especially useful for:

- communication studies students
- journalism students
- media studies students
- students trying framing analysis or content analysis for the first time
- anyone who wants structure without a heavy software setup

## What `npm install` Means

When you see:

```bash
npm install
```

you can think of it as:

**“prepare the tools this project needs before it can run.”**

It usually only needs to be done once when you first set up the project on a computer.

## What `npm run dev` Means

When you see:

```bash
npm run dev
```

you can think of it as:

**“start FrameLab on this computer so I can open it in a browser.”**

It does not publish the app to the public internet. It starts a local preview for your own machine.

## What `localhost:3000` Means

After the app starts, you usually open:

[http://localhost:3000](http://localhost:3000)

`localhost` means “this same computer,” and `3000` is the temporary port number the app is using.

## How To Run FrameLab Locally

In the project folder:

```bash
npm install
npm run dev
```

Then open:

[http://localhost:3000](http://localhost:3000)

## How To Enter The Workspace

After the app opens:

1. go to `Workspace`
2. look for the import panel
3. either paste text or choose a local file

## How To Paste Text

If you already copied text from an article, transcript, or post collection:

1. paste it into the large text box
2. leave one blank line between separate samples
3. check the detected sample count
4. click `Load into workspace`

## How To Import Files

FrameLab currently supports:

- `.txt`
- `.md`
- `.csv`

For CSV files, it looks for a text column named:

- `text`
- `content`
- `body`
- `message`
- `transcript`

All file parsing happens locally in your browser.

## How To Choose Templates

A simple starting rule:

- news texts: `News Framing Analysis`
- social posts: `Social Media Content Analysis`
- interview excerpts: `Interview Pre-coding`
- public statements / crisis responses: `Crisis Communication Scan`

You can also copy a built-in template into a project-level custom codebook and change the user-facing labels and help text.

## How To Use AI Suggestions

AI suggestions are optional.

They are meant to give you an editable first pass, not a final answer.

Important:

- suggestions only fill empty fields
- your own edits are preserved
- you should review every suggestion manually

By default, FrameLab uses local mock suggestions. If you later configure a real AI provider, the selected sample text will be sent to that provider.

## How To Revise Codes Manually

You can always click into the coding form and change:

- selected options
- notes
- text fields
- number fields

FrameLab is designed for human-in-the-loop review. The point is not to accept the first suggestion without reading it.

## How To Export Reports

FrameLab supports:

- `CSV`
- `JSON`
- `Markdown`
- `Codebook Markdown`

Use them like this:

- `CSV` for spreadsheet work
- `JSON` to save and reopen the project later
- `Markdown` for research notes or class discussion
- `Codebook` for methods documentation

## How To Reopen A Saved JSON Project

If you exported `framelab-project.json` earlier:

1. open the workspace
2. go to the export/load panel
3. choose the JSON file
4. confirm replacement of the current workspace

Your samples, coding rows, project metadata, and custom project codebook will be restored.

## What Not To Do

- do not treat AI suggestions as final academic judgment
- do not upload sensitive or private data to real AI providers unless you fully understand the privacy implications
- do not assume imported CSV data is clean; remove duplicates, spam, and irrelevant rows first
- do not expect FrameLab to read meaning from images automatically

## Good First Practice Run

If you want the easiest first test:

1. import `examples/news_sample.csv`
2. choose `News Framing Analysis`
3. code one sample manually
4. generate suggestions for the next sample
5. export Markdown
6. export JSON
7. reload that JSON file

After that, you will understand the main FrameLab workflow.
