# NachUI

[English](./README.md) | [Español]

Componentes de React que copiás a tu proyecto y son tuyos. No hay paquete para instalar ni wrapper con el que pelearte: son archivos de código que podés leer y cambiar.

El catálogo tiene cinco partes:

- **Elementos UI**: botones, inputs, diálogos, menús, tabs, frames y el resto de lo básico.
- **Elementos AI**: piezas para interfaces de chat y agentes (prompt input, razonamiento, tool calls, fuentes, ventana de contexto). Reciben los datos por props, así que funcionan con el SDK que uses.
- **Elementos de layout**: stack, grid, split, section.
- **Hybrids**: varios elementos fusionados en una sola pieza, como un chat completo, un composer o la corrida de un agente.
- **Íconos**: un archivo autocontenido por ícono, así copiás solo los que usás.

Todo es React 19 y Tailwind CSS v4, animado con [Motion](https://motion.dev). Funciona en Next.js, Vite, TanStack Start o React Router.

Los docs también están escritos para el agente que tenés al lado en el editor. Cada página se publica además como markdown, así que Claude Code, Cursor o lo que uses puede leer la API real en vez de adivinarla.

Sitio: **[nachui.tech](https://nachui.tech)**

## Cómo usar los componentes

Por ahora el camino recomendado es copiar a mano:

1. Seguí la [guía de instalación](https://nachui.tech/es/docs/installation) una vez. Configura Tailwind, el helper `cn` y los tokens del tema.
2. Abrí un componente en los docs, copiá su código a tu proyecto y usalo.

Nada más. Cada archivo depende solo de `clsx`, `tailwind-merge` y, en algunos componentes, de `motion`, `class-variance-authority` o `zod`.

También hay una CLI (`npx nachui add button`), pero la estoy rehaciendo, así que por ahora el camino manual es el más seguro. Sus docs están en [nachui.tech/es/docs/concepts/cli](https://nachui.tech/es/docs/concepts/cli).

## Docs para agentes de IA

| URL                                                   | Qué obtenés                                                          |
| :---------------------------------------------------- | :------------------------------------------------------------------- |
| [`/llms.txt`](https://nachui.tech/llms.txt)           | Índice de todas las páginas publicadas, con link a su markdown.      |
| `/{locale}/docs/**.md`                                | Agregale `.md` a cualquier URL de los docs y te llega la página.     |
| [`/api/docs`](https://nachui.tech/api/docs)           | El catálogo completo en JSON, por si lo querés indexar.              |
| [Skills](https://nachui.tech/es/docs/concepts/skills) | Instrucciones instalables que le enseñan las convenciones al agente. |

La [guía de llms.txt](https://nachui.tech/es/docs/concepts/llms-txt) muestra cómo configurarlo en cada herramienta.

## Mapa del repo

Monorepo con pnpm y Turborepo.

| Ruta                         | Filtro                    | Qué es                                                                                    |
| :--------------------------- | :------------------------ | :---------------------------------------------------------------------------------------- |
| `apps/web`                   | `web`                     | El sitio de docs. Next.js 16, next-intl (`en`/`es`), MDX con content-collections.         |
| `apps/api`                   | `api`                     | Servidor NestJS (puerto 3001). Sirve el registry, los temas y el asistente de chat.       |
| `packages/ui`                | `@repo/ui`                | Los componentes, con sus demos, íconos y tests.                                           |
| `packages/ai`                | `@repo/ai`                | El asistente de los docs: Vercel AI SDK + Gemini, prompts y el script de ingesta del RAG. |
| `packages/db`                | `@repo/db`                | Schema y migraciones de Drizzle ORM + Postgres.                                           |
| `packages/cli`               | `nachui`                  | La CLI `nachui` que se publica en npm.                                                    |
| `packages/eslint-config`     | `@repo/eslint-config`     | Config compartida de ESLint.                                                              |
| `packages/typescript-config` | `@repo/typescript-config` | Presets estrictos de tsconfig compartidos.                                                |
| `scripts`                    |                           | `registry:sync`, que sube el código de los componentes a Postgres.                        |

## Desarrollo local

Necesitás Node >= 22.22.1 y pnpm 9.

```bash
pnpm install
pnpm --filter web dev    # solo el sitio de docs, alcanza para trabajar en componentes
pnpm dev                 # todo, incluida la API
```

Usá `pnpm --filter <nombre>` para correr cualquier cosa en un solo workspace.

### Variables de entorno

Para trabajar en componentes y páginas de docs no hace falta ninguna. Son para el asistente de chat, la base de datos y el registry. Cada workspace que necesita una tiene un `.env.example` donde va el `.env`: copialo y completalo.

| Archivo            | Lo usa                                             | Variables                                                                        |
| :----------------- | :------------------------------------------------- | :------------------------------------------------------------------------------- |
| `apps/web/.env`    | el sitio de docs                                   | `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_URL` (las dos opcionales)                |
| `apps/api/.env`    | la API, que no arranca si falta una obligatoria    | `POSTGRES_URL`, `GOOGLE_GENERATIVE_AI_API_KEY`, `FRONTEND_URLS`, `PORT` opcional |
| `packages/db/.env` | drizzle-kit, migraciones, `registry:sync`, ingesta | `POSTGRES_URL`                                                                   |
| `packages/ai/.env` | la ingesta del RAG                                 | `GOOGLE_GENERATIVE_AI_API_KEY`, `FRONTEND_URL` (el sitio de docs corriendo)      |

La CLI no necesita nada al compilarse. Para apuntarla a otra API, definí `NACHUI_API_URL` cuando la corrés.

### El registry

`packages/ui/scripts/generate-registry.mjs` recorre las carpetas de componentes, demos, ejemplos, bricks e íconos y escribe los archivos de registry que importan los docs. Después de agregar o renombrar alguno, corré `pnpm --filter @repo/ui generate:registry`; el build de la web falla si los archivos generados están desactualizados.

## Tests y chequeos

```bash
pnpm test                              # todos los workspaces
pnpm lint                              # ESLint, --max-warnings 0
pnpm check-types                       # tsc en todos los workspaces
pnpm checks                            # registry, comentarios, navegación, idiomas y demos
pnpm --filter <nombre> test            # tests de un solo workspace
```

## Contribuir

Mirá [CONTRIBUTING.md](./CONTRIBUTING.md) (en inglés). Para problemas de seguridad, [SECURITY.md](./SECURITY.md).

## Licencia

[MIT](./LICENSE). Hecho por amor al arte por [Ignacio Figueroa](https://github.com/figueroaignacio).
