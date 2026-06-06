# Husky Snow

Husky Snow is a multiplayer text RPG built with Vite, React, Firebase, and a Husky-specific Cloudflare Worker for AI storytelling.

This repository consolidates the older single-file `husky-snow` prototype and the newer Vite `huskys-snow` app into one canonical codebase.

## Architecture

```
Browser / GitHub Pages
  -> Firebase Auth + Firestore for multiplayer session state
  -> Cloudflare Worker for Gemini storytelling
  -> Gemini API, with the API key stored only as a Worker secret
```

The browser app must not contain a Gemini API key. The Worker expects `GEMINI_API_KEY` as a Cloudflare secret.

If Firestore rules reject game writes, the app falls back to a same-browser local game mode using `local-...` game IDs. That keeps the RPG playable while Firebase rules are corrected, but cross-device multiplayer still requires Firestore permissions.

## Local Setup

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Copy the example environment file and fill in the Firebase web config:

   ```bash
   cp .env.example .env.local
   ```

3. Run the app:

   ```bash
   npm run dev
   ```

The default local app URL is `http://localhost:3000`.

## Required GitHub Variables

Set these repository variables for the GitHub Pages build:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_HUSKY_AI_WORKER_URL`

## Required GitHub Secrets

Set these repository secrets for Worker deployment:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `GEMINI_API_KEY`

The Worker deploy workflow also accepts `Neurology_API` as a fallback secret name for the Gemini key to match the older Band-Aid six setup, but the Worker prompt and app persona remain Husky Snow only.

## Commands

```bash
npm ci
npm audit --audit-level=moderate
npm run build
npx wrangler deploy --dry-run
```

## Legacy Backup

A redacted copy of the old one-file prototype is preserved in `docs/legacy/index.redacted.html`. Exposed Google API key values were removed before committing the backup.
