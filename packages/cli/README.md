# NachUI CLI

[English] | [Español](./README.es.md)

The official Command Line Interface for the NachUI ecosystem. Designed to help you seamlessly integrate, manage, and update high-fidelity React primitives directly into your codebase.

## Tech Stack

- **CLI Framework**: [Commander](https://github.com/tj/commander.js)
- **Interactive Prompts**: [@clack/prompts](https://github.com/natemoo-re/clack)
- **Console Styling**: [Kleur](https://github.com/lukeed/kleur)
- **Data Validation**: [Zod](https://zod.dev/)

## Key Features

### 1. Radically Simple Integration

Initialize NachUI in your workspace, configure your environment, and add beautifully crafted React components directly to your source files. You own the code.

### 2. Streamlined Workflow

Manage your complete component lifecycle from the terminal: list available primitives, add new ones, seamlessly update existing ones, or remove those you no longer need.

### 3. Developer Experience First

Built with gorgeous interactive prompts, helpful validation, and intuitive commands that respect your time.

## Usage

You can run the CLI directly via `npx` (or your package manager of choice) without installing it globally.

```bash
# Set up the theme tokens, nachui.json and the cn helper
npx nachui init

# Add components with every file they import
npx nachui add button hybrids/confirm

# List all available components
npx nachui list

# Update an installed component
npx nachui update button

# Remove an installed component
npx nachui remove button
```

`add` writes each file to `<baseDir>/<family folder>/<name>`, mirroring the NachUI source (`components/`, `layout/`, `ai/`, `hybrids/`, `icons/`, `lib/`), so relative imports such as `../lib/cn` resolve. `baseDir` lives in `nachui.json` and defaults to `src`.

Flags: `add --overwrite` replaces files that differ from the registry, `--yes` skips prompts on every command and never replaces files you changed (except `update --yes`, which updates the component you named).

Set `NACHUI_API_URL` to point the CLI at a local or self-hosted registry, for example `http://localhost:3001/api/v1`.

## Development

```bash
pnpm --filter nachui test         # vitest
pnpm --filter nachui check-types
pnpm --filter nachui lint
pnpm --filter nachui build
```

## Architecture

- `src/commands`: one file per command (`init`, `add`, `list`, `update`, `remove`).
- `src/lib`: the registry client, `nachui.json` parsing, the install layout, dependency tree resolution and package manager handling.
- `src/index.ts`: the entry point, which parses arguments with `commander`.
