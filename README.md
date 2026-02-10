# AI Fashion Model — VOGUE.AI

A Vite + React + TypeScript app that generates fashion photoshoot variations using Gemini.

## Local development

1. Install dependencies:

```bash
npm install
```

2. Create your env file:

```bash
cp .env.example .env.local
```

3. Add your Gemini API key in `.env.local`:

```env
VITE_GEMINI_API_KEY=YOUR_KEY_HERE
```

4. Start dev server:

```bash
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
```

## Deploy to Vercel

- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `VITE_GEMINI_API_KEY`

`vercel.json` includes an SPA rewrite so client-side routing works.
