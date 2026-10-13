# Security

## Reporting a vulnerability

Please don't open a public issue for security problems.

Report it privately through GitHub instead: go to the [Security tab](https://github.com/figueroaignacio/nachui/security) of this repo and click **Report a vulnerability**. That opens a private advisory that only you and I can see.

Helpful things to include:

- What's affected (the CLI, the API, the docs site, a component).
- How to reproduce it, or a proof of concept.
- What an attacker could do with it.

## What's in scope

- **The `nachui` CLI** (`packages/cli`), the package published on npm.
- **The API** (`apps/api`), which serves the registry, themes and the chat assistant.
- **The docs site** at [nachui.tech](https://nachui.tech) (`apps/web`).
- **Component source** in `packages/ui`, for things like XSS that a component makes easy to introduce in a user's app.

Out of scope: issues in third-party dependencies that are already public (please report those upstream), and code that you copied and then changed in your own project.

## What to expect

NachUI is maintained by one person, in my free time. I'll try to reply within a week, and I'll keep you posted while I work on a fix. Once it's fixed and released, I'm happy to credit you in the advisory if you want.

Only the latest version of the CLI and the current `main` branch get security fixes.
