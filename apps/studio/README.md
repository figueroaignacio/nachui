# NachUI Studio

Describe a screen and an agent builds it with NachUI components only. You watch the plan, the tool calls and the code arrive, the screen renders next to the chat, and you take it home with the CLI, as files or as a pull request.

## How it fits together

- **This app** (`apps/studio`, Next.js, port 3002). Sign in, home, projects, settings and the workspace. The chat uses `useChat` from the AI SDK and every message part is drawn with a NachUI AI Element: Plan, Tool, Code Block, Terminal, File Tree, Checkpoint, Stack Trace.
- **The API** (`apps/api`). GitHub sign in, sessions, projects, versions and the chat stream. The thread lives in Postgres, so the browser only sends the new message.
- **The agent** (`packages/ai/src/studio`). A `ToolLoopAgent` with `setPlan`, `listComponents`, `getComponentCode`, `searchKnowledgeBase`, `readFile`, `writeFile`, `deleteFile` and `runChecks`. It can only write into `screens/`, and `runChecks` parses every file and verifies that each import points at a real NachUI file and a real export before the turn ends.
- **The preview** runs in an iframe with `sandbox="allow-scripts"` and an opaque origin: no cookies, no storage, no access to the app. The app compiles the files with Sucrase, the frame loads them as modules, and React, motion and Tailwind come from pinned CDN builds (`src/features/preview/runtime.ts`). NachUI sources are served by this app from `packages/ui/src`, so the preview always matches the catalog.

## Run it

1. Create a GitHub OAuth app. Callback URL: `http://localhost:3001/api/v1/auth/github/callback`.
2. In `apps/api/.env` set `STUDIO_URL=http://localhost:3002`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` and `STUDIO_SECRET` (32 or more random characters). `STUDIO_DAILY_LIMIT` defaults to 20 generations per account.
3. Apply the migration: `pnpm --filter @repo/db db:migrate`.
4. Copy `apps/studio/.env.example` to `apps/studio/.env.local`.
5. `pnpm --filter api dev` and `pnpm --filter studio dev`, then open http://localhost:3002.

`/example` shows a finished project without signing in, and works without the API.

## Exporting

- **CLI**: `npx nachui add` with the items the screen imports, then copy the files from `screens/`.
- **Files**: download each file of the project.
- **Pull request**: the first time, GitHub asks for repository access (`repo` scope). The token is stored encrypted with `STUDIO_SECRET`. The PR adds the screen and the NachUI files it needs at the paths the CLI uses; files the repo already has are left as they are.
