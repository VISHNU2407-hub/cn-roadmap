# CN Roadmap

A 4-week Computer Networks roadmap — 28 daily lessons with progress tracking, streaks and per-day checkpoints. Built with React 18 + TypeScript + Vite, backed by Firebase (Google sign-in + Firestore sync).

## Quick start

```bash
npm install
cp .env.example .env   # fill in your Firebase config (see below)
npm run dev            # http://localhost:5173
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Strict typecheck (`tsc -b`) + production build |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run unit tests (vitest) |

## Firebase setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. **Authentication → Sign-in method → Google → Enable → Save**
3. **Firestore Database → Create database** (production mode, nearest region)
4. **Firestore → Rules** → paste the contents of [`firestore.rules`](./firestore.rules) → **Publish**
5. The Firebase web config is **already baked into `src/lib/firebase.ts`** (public by design — it ships in the JS bundle), so deploys work out of the box. `.env` (`VITE_FIREBASE_*` keys) is optional and overrides the baked-in values.
6. **Authentication → Settings → Authorized domains** → make sure your deploy domain (e.g. `cn-roadmap.vercel.app`) and `localhost` are listed

### Security note

Your Firebase web API key is public by design (it ships in the bundle). Restrict abuse in
**Google Cloud Console → APIs & Services → Credentials → your browser key → Application restrictions → HTTP referrers**
and add your domains.

## Data model

```
users/{uid}/state/main
  → { completed: number[], streak: number, lastStudyDate: "YYYY-MM-DD",
      theme: "system" | "dark" | "light",
      checklist: { "d{lessonId}:{text}": boolean },
      updatedAt: number }
```

- Progress syncs in **realtime** across devices/tabs (`onSnapshot`)
- Theme defaults to the **OS preference**; the header toggle saves an explicit choice
- Nothing is stored in `localStorage` anymore

## Deploy

### Vercel (recommended)

1. Push to GitHub → [vercel.com/new](https://vercel.com/new) → import the repo (auto-detects Vite)
2. Deploy — no environment variables required (Firebase config is baked into `src/lib/firebase.ts`); still add the domain to Firebase **Authorized domains** (step 6 above)

### Firebase Hosting

```bash
npm i -g firebase-tools
firebase login
firebase init hosting   # public dir: dist, single-page app: yes
npm run build && firebase deploy
```

## Project structure

```
src/
  lib/firebase.ts     Firebase app, auth, Firestore init
  lib/state.ts        Pure state logic (sanitize, streaks, dates, themes)
  hooks/useAuth.tsx   AuthProvider: Google sign-in/out, onAuthStateChanged
  hooks/useAppState.ts Firestore realtime load/save + app actions
  components/         Header, Hero, StatsRow, Roadmap, LessonModal, SignInGate…
  data/lessons.ts     28 lessons (static content)
```
