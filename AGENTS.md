# AGENTS.md - NachUI Operator Manual

This guide outlines the essential commands and coding conventions for agents working inside the NachUI monorepo.

## Repository Snapshot

- Monorepo managed by pnpm 9 + Turbo on Node >= 18.
- apps/docs: Next.js 16 docs app with @content-collections (MDX pipeline) and Vercel AI SDK.
- apps/api: Backend API package.
- packages/ui: React 19 component catalog using Tailwind CSS v4, Vitest, and class-variance-authority.
- packages/ai: AI SDK helpers (Vercel AI SDK + Google Gemini).
- packages/cli: CLI utilities.
- packages/db: Database utilities.
- packages/typescript-config: strict base + react-library presets.

## Prerequisites

- Install dependencies once with `pnpm install`; lockfile is pnpm-lock.yaml.
- Use `pnpm --filter <target>` to scope commands instead of `cd`.
- Content collections cache lives in `apps/docs/.content-collections`; delete only when rebuild is required.
- Secrets (e.g., Google AI keys) belong in `apps/docs/.env`; never commit populated files.

## Root Scripts

Turbo fan-out commands available at repo root:

```bash
pnpm build        # Runs every workspace build (tsup, content-collections, next, vitest build targets)
pnpm dev          # Starts docs dev server + package watchers
pnpm lint         # Dispatches workspace lint tasks
pnpm start        # Launches production servers after build
pnpm format       # Prettier with Tailwind plugin
```

Use pnpm workspace filters for targeted work:

```bash
pnpm --filter @repo/ui lint
pnpm --filter docs dev
pnpm --filter @repo/ai build
```

## Workspace Commands

- apps/docs:
  - `pnpm --filter docs dev` runs `next dev`.
  - `pnpm --filter docs build` executes `next build`.
  - `pnpm --filter docs start` launches production Next.js (requires a prior build).
- apps/api:
  - `pnpm --filter api dev` runs the API server.
  - `pnpm --filter api build` builds the API.
- packages/ui:
  - `pnpm --filter @repo/ui lint` uses ESLint with `--max-warnings 0`.
  - `pnpm --filter @repo/ui type-check` invokes tsc with the react-library preset.
- packages/ai:
  - `pnpm --filter @repo/ai build` calls tsup for cjs/esm bundles plus declarations.
  - `pnpm --filter @repo/ai dev` runs tsup --watch for local iteration.
  - `pnpm --filter @repo/ai check-types` runs tsc --noEmit.

## Testing Playbook

- All automated tests live in `packages/ui` and use Vitest + React Testing Library.
- Common scripts (run from root or within the package):

```bash
pnpm --filter @repo/ui test             # Vitest watch mode
pnpm --filter @repo/ui test:run         # CI-style run
pnpm --filter @repo/ui test:coverage    # Coverage output
pnpm --filter @repo/ui test:ui          # Vitest UI dashboard
```

- Run a single spec via native vitest CLI:

```bash
pnpm --filter @repo/ui vitest run src/lib/cn.test.ts
pnpm --filter @repo/ui vitest run src/components/button.test.tsx -t "renders loading state"
```

- No automated tests exist for apps/docs or packages/ai yet.

## Formatting & Static Analysis

- Prettier (.prettierrc) => tabWidth 2, semi true, singleQuote true, trailingComma all, printWidth 100, arrowParens always, plus prettier-plugin-tailwindcss.
- Run `pnpm format` before shipping shared changes to keep Tailwind classes auto-sorted.
- ESLint currently targets packages/ui; fix warnings because the CLI enforces `--max-warnings 0`.
- TypeScript configs enable strict mode, isolated modules, and `noUncheckedIndexedAccess`; array access returns `T | undefined`.

## Import Ordering

1. Core platform modules (`react`, `next/navigation`).
2. Third-party packages (motion, zod, date-fns, lucide-react, etc.).
3. Workspace aliases (@repo/ui, @repo/ai, @/lib, @/features).
4. Relative paths (`./component`, `../lib/cn`).

- Separate groups with a blank line and prefer `import type { Foo }` for type-only references.

## React & Component Patterns

- Function components by default; add `'use client'` only when hooks or DOM APIs require it.
- Keep primitives dependency-free by accepting text/icons via props rather than importing docs data.
- Derive class strings via `cn(...)`; never build Tailwind strings manually.
- Declare CVA configs outside the component, export them, and share the associated `VariantProps`.
- Forward refs for interactive primitives and set `displayName`.
- Store Motion variants/transitions as top-level constants for memoization.
- Hooks live under `packages/ui/src/hooks`, use camelCase names prefixed with `use`.
- MDX-friendly components must be deterministic; avoid random IDs or Date.now defaults.
- Context helpers should throw when accessed outside providers:

```typescript
const ChatContext = React.createContext<ChatContextValue | null>(null);
export const useChatContext = () => {
  const ctx = React.useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider');
  return ctx;
};
```

## Styling & Tailwind

- Tailwind CSS v4 removes the config file; rely on utilities and CSS variables in `packages/ui/src/css/globals.css`.
- Keep class order semantic (layout → spacing → typography → color → effects) before Prettier re-sorts.
- Reuse CSS variables such as `var(--surface-muted)` instead of repeating literal hex values.
- Prefer responsive primitives (`grid-cols-[auto,1fr]`, `[mask-image:linear-gradient(...)]`) to custom CSS blocks.
- Use Motion transitions for animation timing; fall back to CSS keyframes only when necessary.

## Naming & File Organization

- Files: kebab-case for components (`mobile-menu.tsx`), camelCase for helpers, PascalCase for React exports.
- Components + props: `ComponentName` + `ComponentNameProps`; hooks always start with `use`.
- Constants default to camelCase; reserve SCREAMING_SNAKE_CASE for configuration objects.
- Tests live next to the source with the `.test.ts`/`.test.tsx` suffix.
- Demo/story content belongs under `packages/ui/src/demos`; docs import via the registry entry.

## Type Usage & Error Handling

- Provide explicit prop and return types; prefer `type` aliases for unions and use `interface` only when extension is needed.
- Validate user-supplied data (AI prompts, search queries) with Zod before invoking AI helpers.
- Model async flows with discriminated unions like `{ status: 'idle' | 'loading' | 'error' | 'ready' }`.
- Re-throw caught errors with contextual detail so downstream UI can surface actionable messages.
- Never swallow promise rejections; return the promise or handle it inside try/catch.
- Memoize expensive computations (content indexes, chat history) rather than mutating module scope.

## Git & Commit Rules

- Follow Conventional Commits enforced by `commitlint.config.ts` (feat, fix, docs, style, refactor, perf, test, chore).
- Keep commits tightly scoped; avoid formatting unrelated files just to appease linting.
- Never commit populated `.env` files or generated build output.

## AI Policy References

- Cursor-specific rules: none found in `.cursor/` or `.cursorrules`.
- Copilot instructions: none present under `.github/copilot-instructions.md`.
- Treat this document as the single source of truth for automated workflows.

Keep components copy-paste ready, run the listed commands before shipping, and default to clarity over cleverness.
