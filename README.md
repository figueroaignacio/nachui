# NachUI

[English] | [Español](./README.es.md)

React components you copy into your project and own. No package to install, no wrapper to fight, just source files you can read and change.

The catalog has five parts:

- **UI elements**: buttons, inputs, dialogs, menus, tabs, frames and the rest of the basics.
- **AI elements**: pieces for chat and agent interfaces (prompt input, reasoning, tool calls, sources, context window). They take data through props, so they work with whatever SDK you use.
- **Layout elements**: stack, grid, split, section.
- **Hybrids**: several elements fused into one piece, like a whole chat, a composer or an agent run.
- **Icons**: one self-contained file per icon, so you only copy the ones you use.

Everything is plain React 19 and Tailwind CSS v4, animated with [Motion](https://motion.dev). It works in Next.js, Vite, TanStack Start or React Router.

The docs are also written for the agent sitting next to you in the editor. Every page is published as markdown too, so Claude Code, Cursor or anything else can read the real API instead of guessing it.

Live site: **[nachui.tech](https://nachui.tech)**

## Using the components

Right now the recommended path is copying by hand:

1. Follow the [installation guide](https://nachui.tech/en/docs/installation) once. It sets up Tailwind, the `cn` helper and the theme tokens.
2. Open a component in the docs, copy its source into your project and use it.

That's it. Each file only depends on `clsx`, `tailwind-merge` and, for some components, `motion`, `class-variance-authority` or `zod`.

There is also a CLI (`npx nachui add button`), but I'm reworking it, so for now the manual path is the safer bet. Its docs are at [nachui.tech/en/docs/concepts/cli](https://nachui.tech/en/docs/concepts/cli).

## Docs for AI agents

| URL                                                   | What you get                                                  |
| :---------------------------------------------------- | :------------------------------------------------------------ |
| [`/llms.txt`](https://nachui.tech/llms.txt)           | Index of every published page, linking to its markdown.       |
| `/{locale}/docs/**.md`                                | Add `.md` to any docs URL and you get the raw page.           |
| [`/api/docs`](https://nachui.tech/api/docs)           | The whole catalog as JSON, if you want to index it.           |
| [Skills](https://nachui.tech/en/docs/concepts/skills) | Installable instructions that teach an agent the conventions. |

The [llms.txt guide](https://nachui.tech/en/docs/concepts/llms-txt) shows how to set it up in each tool.

## Repo map

pnpm + Turborepo monorepo.

| Path                         | Filter                    | What it is                                                                           |
| :--------------------------- | :------------------------ | :----------------------------------------------------------------------------------- |
| `apps/web`                   | `web`                     | The docs site. Next.js 16, next-intl (`en`/`es`), MDX via content-collections.       |
| `apps/api`                   | `api`                     | NestJS server (port 3001). Serves the registry, themes, docs and the chat assistant. |
| `packages/ui`                | `@repo/ui`                | The components themselves, plus demos, icons and their tests.                        |
| `packages/ai`                | `@repo/ai`                | The docs assistant: Vercel AI SDK + Gemini, prompts and the RAG ingest script.       |
| `packages/db`                | `@repo/db`                | Drizzle ORM + Postgres schema and migrations.                                        |
| `packages/cli`               | `nachui`                  | The published `nachui` CLI.                                                          |
| `packages/eslint-config`     | `@repo/eslint-config`     | Shared ESLint config.                                                                |
| `packages/typescript-config` | `@repo/typescript-config` | Shared strict tsconfig presets.                                                      |
| `scripts`                    |                           | `registry:sync`, which pushes component source into Postgres.                        |

## Local development

You need Node >= 22.22.1 and pnpm 9.

```bash
pnpm install
pnpm --filter web dev    # just the docs site, enough for component work
pnpm dev                 # everything, including the API
```

Use `pnpm --filter <name>` to run anything in one workspace.

### Environment variables

Working on components and docs pages doesn't need any of these. They are for the chat assistant, the database and the registry. Each workspace that needs one has a `.env.example` next to where the `.env` goes; copy it and fill it in.

| File               | Used by                                          | Variables                                                                                                |
| :----------------- | :----------------------------------------------- | :------------------------------------------------------------------------------------------------------- |
| `apps/web/.env`    | docs site, `@repo/ai` ingest                     | `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_URL`, `GOOGLE_GENERATIVE_AI_API_KEY`                             |
| `apps/api/.env`    | API                                              | `PORT`, `FRONTEND_URL`, `FRONTEND_URLS`, `PORTFOLIO_URL`, `POSTGRES_URL`, `GOOGLE_GENERATIVE_AI_API_KEY` |
| `packages/db/.env` | drizzle-kit, migrations, `registry:sync`, ingest | `POSTGRES_URL`                                                                                           |

The CLI reads `NACHUI_API_KEY` at build time. You only need it if you are building the CLI yourself.

### The registry

`packages/ui/scripts/generate-registry.mjs` scans the component, demo, example, brick and icon folders and writes the registry files the docs import. After adding or renaming one of those, run `pnpm --filter @repo/ui generate:registry`; the web build fails if the generated files are stale.

## Tests and checks

```bash
pnpm test                              # all workspaces
pnpm --filter @repo/ui test:run        # component tests (Vitest + Testing Library)
pnpm --filter api test                 # API tests (Jest)
pnpm lint                              # ESLint, --max-warnings 0
pnpm --filter <name> check-types       # tsc in one workspace
pnpm --filter web checks               # registry, navigation and demo checks
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). For security issues, see [SECURITY.md](./SECURITY.md).

## License

[MIT](./LICENSE). Made por amor al arte by [Ignacio Figueroa](https://github.com/figueroaignacio).
