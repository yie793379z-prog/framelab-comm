# Deployment

This guide explains how to deploy FrameLab to Vercel as a safe public demo or a private AI-enabled deployment.

FrameLab also includes an in-app explanation page at `/ai-setup`. On a public deployment, keep that route available so visitors can understand why the hosted demo stays in mock mode and how real AI can be enabled on local or private deployments.

## Recommended Public Demo Mode

For a public Vercel demo, keep FrameLab in mock mode:

```bash
AI_PROVIDER=mock
```

This is the safest default because:

- the site works without OpenAI or Gemini API keys
- visitors can still try the workspace and guided demo
- no provider usage costs are triggered by public visitors
- no external AI provider receives sample text by default

If `AI_PROVIDER` is unset, FrameLab already falls back to mock mode. Setting it explicitly to `mock` in Vercel is still recommended for clarity.

## Deploy To Vercel From GitHub

1. Push the repository to GitHub.
2. Open [Vercel](https://vercel.com/).
3. Click `Add New...` -> `Project`.
4. Import the GitHub repository.
5. Keep the default Next.js framework detection.
6. In Environment Variables, add:

```bash
AI_PROVIDER=mock
```

7. Click `Deploy`.

For the public demo, you do **not** need:

- `OPENAI_API_KEY`
- `GEMINI_API_KEY`

## Private Deployment With Real AI

If you want a private deployment with real AI suggestions, add your own provider settings in Vercel:

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

Notes:

- real AI is optional
- sample text is sent to the configured provider in real AI mode
- provider usage may cost money
- public demo deployments should usually stay in mock mode
- after deployment, visitors can open `/ai-setup` to read the same setup guidance inside the web app

## Secret Safety

Do not put API keys in:

- GitHub commits
- `README.md`
- client-side code
- `NEXT_PUBLIC_*` variables

FrameLab reads provider keys only on the server side.

Use:

- Vercel Project Settings -> Environment Variables
- local `.env.local` for your own machine

Do **not** commit `.env.local`.

## Redeploy After Environment Changes

If you change environment variables in Vercel:

1. open the Vercel project
2. update the environment variables
3. trigger a redeploy

You can redeploy by:

- clicking `Redeploy` in the Vercel dashboard
- or pushing a new commit

The `/ai-setup` page will reflect the current configured mode after the new deployment is live.

## Default Build Commands

FrameLab works with standard Next.js defaults:

- Install: `npm install`
- Build: `npm run build`
- Start: `npm run start`

## Public Demo Positioning

For a hosted public demo, FrameLab should be presented as:

- a local-first coding workflow demo
- mock AI by default
- safe to explore without API keys
- not a promise of automated academic analysis
