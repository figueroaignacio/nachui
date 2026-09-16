# Plan: catálogo de iconos de NachUI (`/icons`)

Estado: fases 0, 1 y 2 implementadas el 2026-09-15, y el mismo día se retiró hugeicons
del repo entero (primitivos con SVG inline, demos y web importando el set). El detalle
de cada icono abre en un Drawer desde la derecha. De la fase 3 quedan los deep links,
las variantes filled y los iconos animados.

## Objetivo

Un set de iconos propio, parte del sistema de diseño de NachUI, servido igual que
los componentes: copy-paste, CLI y catálogo navegable. La primera entrega es un
catálogo tipo radix-ui.com/icons: grilla por categorías, buscador, y al hacer
click en un icono un popover con el icono grande, su nombre, y botones para
copiar el SVG, copiar el JSX y copiar el comando del CLI.

Los iconos son opcionales para quien usa la librería. Los componentes siguen
recibiendo iconos por props, así que hugeicons, lucide o cualquier otro set
siguen funcionando.

## Estado actual que condiciona el diseño

- `packages/ui` importa exclusivamente `@hugeicons/react` en 66 archivos. La
  página de instalación (`apps/web/src/content/docs/en/installation.mdx:44`)
  dice lucide-react, y `lucide-react` está declarado en `packages/ui/package.json`
  sin usarse. Corregir ambas cosas es el primer paso.
- Ya existe el patrón de galería raíz con detalle en `/sprites`
  (`apps/web/src/app/[locale]/sprites`, `features/sprites`). Iconos sigue ese molde.
- El generador `packages/ui/scripts/generate-registry.mjs` escanea familias y
  emite `registry.ts`. Hay que sumar una entrada `ICON_REGISTRY` separada, no
  meter iconos en `COMPONENT_REGISTRY`, porque ese mapa alimenta docs y galería
  de componentes y pediría una página MDX por icono.
- `scripts/sync-registry.ts` itera `FAMILIES` y sube a Postgres con
  `type: family`. La API ya resuelve `GET /registry/:family/:name`, así que
  `nachui add icons/search` funciona sin tocar el CLI una vez que existan las
  filas con slug `icons/<nombre>`.
- `ComponentFamily` en `packages/db/src/schema.ts` es un type sobre columna
  `text`, no un enum de Postgres. Agregar `'icons'` no requiere migración.
- La web ya lee código fuente por path con `fs` en
  `features/docs/lib/get-component-code.ts`. El copy de JSX y SVG se resuelve
  del mismo modo, en server component, sin `react-dom/server`.

## Reglas del set (van a `DESIGN.md`, sección nueva "Icons")

- Grilla de 24x24 con 2px de margen de seguridad: nada dibuja fuera de 2..22.
- Trazo 1.5, `stroke-linecap="round"`, `stroke-linejoin="round"`, `fill="none"`.
- Esquinas con radio 2, ángulos a 45 o 90, círculos perfectos, nada a mano alzada.
- Siempre `stroke="currentColor"`. Sin colores, sin ids, sin `<defs>`, sin
  transforms. Solo `path`, `circle`, `rect`, `line`, `polyline`.
- Ópticamente alineados a la grilla de 24, no matemáticamente centrados cuando
  el peso visual lo pide (flechas, play, etc.).
- Nombre kebab-case, sustantivo o verbo simple: `search`, `chevron-down`,
  `arrow-up-right`, `external-link`. Variantes con sufijo: `-filled` en fase 2.

## Formato de cada icono

Un archivo por icono en `packages/ui/src/icons/<nombre>.tsx`, autocontenido,
sin importar un `Icon` base, para que copy-paste y CLI entreguen un solo archivo.

```tsx
import * as React from 'react';

export type SearchIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

export function SearchIcon({ size = 24, strokeWidth = 1.5, ...props }: SearchIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
```

La plantilla es estricta a propósito: el catálogo deriva el SVG plano del JSX
con una transformación fija (`strokeWidth` a `stroke-width`, `{size}` a `24`,
quitar `{...props}` y `aria-hidden`). Sin comentarios en el archivo, el código
se muestra en la web tal cual.

Metadatos (categoría, tags, alias de búsqueda) no van en el archivo del icono.
Van en `apps/web/src/features/icons/lib/icons.ts`, el equivalente de
`features/sprites/lib/cast.ts`. Un test de la web verifica que cada archivo en
`packages/ui/src/icons` tiene entrada en ese catálogo y viceversa.

## Primer lote (40 a 50 iconos)

Los que los componentes ya necesitan, agrupados como los mostrará la grilla:

- Arrows: arrow-up, arrow-down, arrow-left, arrow-right, arrow-up-right,
  chevron-up, chevron-down, chevron-left, chevron-right, chevrons-up-down.
- Actions: plus, minus, x, check, search, copy, trash, pencil, download,
  upload, external-link, refresh, filter, more-horizontal, more-vertical.
- Interface: menu, settings, home, user, users, bell, calendar, clock, eye,
  eye-off, lock, star, heart, bookmark.
- Feedback: info, alert-circle, alert-triangle, check-circle, x-circle,
  help-circle, loader.
- Objects: file, folder, image, mail, link, globe, code, terminal.

Se dibujan sobre las reglas de arriba. Los componentes de `packages/ui` no se
migran en esta fase: siguen con hugeicons y aceptan iconos por props.

## Fases

### Fase 0: corregir la doc actual

1. `installation.mdx` en `en` y `es`: la dependencia de iconos es hugeicons, y
   los iconos de NachUI son opcionales.
2. Quitar `lucide-react` de `packages/ui/package.json` si `pnpm --filter
@repo/ui type-check` y el build de web pasan sin él.

### Fase 1: base del set y pipeline

1. Crear `packages/ui/src/icons/` con la plantilla y el primer lote.
2. Exponer `./icons/*` en `exports` y `typesVersions` de `packages/ui/package.json`.
3. Generador: escanear `src/icons`, emitir `ICON_REGISTRY` y `IconName` en
   `registry.ts`, y un `apps/web/src/features/icons/lib/icon-registry.tsx`
   generado con los imports React, igual que `demo-registry.tsx`. Sumar el
   conteo al resumen y al `--check`.
4. `sync-registry.ts`: procesar `src/icons` con `type: 'icons'` y slug
   `icons/<nombre>`. Agregar `'icons'` a `ComponentFamily` en `packages/db`.
5. CLI: verificar que `nachui add icons/search` y `nachui list` muestran la
   familia. Si `list` agrupa por familia con etiquetas fijas, agregar la etiqueta.
6. Test en `packages/ui`: cada archivo de `src/icons` renderiza un `<svg>` con
   `viewBox="0 0 24 24"`, `stroke="currentColor"` y sin `fill` distinto de
   `none`. Es la guardia de las reglas del set.

### Fase 2: catálogo `/icons`

1. Rutas: `app/[locale]/icons/page.tsx` con metadata, alternates y
   `setRequestLocale`, siguiendo `sprites/page.tsx`.
2. `features/icons/lib/icons.ts`: catálogo con `name`, `category`, `tags`.
3. `features/icons/views/icons-view.tsx` (server): lee los fuentes con `fs`
   por `ICON_REGISTRY`, deriva JSX y SVG por icono, y pasa al cliente un array
   plano `{ name, category, tags, jsx, svg }`.
4. `features/icons/components/icons-grid.tsx` (client): buscador, filtro por
   categoría, controles de tamaño y stroke que afectan a toda la grilla, y
   celdas que abren el popover.
5. `features/icons/components/icon-popover.tsx` (client): `Popover` de
   `@repo/ui`, icono grande, nombre, categoría, y tres acciones con
   `useCopyToClipboard`: copiar SVG, copiar JSX, copiar `npx nachui add
icons/<nombre>`. El comando se muestra con `Snippet`.
6. Encabezado con instalación: qué es el set, que es opcional, y el comando.
7. Locales: `sections.icons` en `en` y `es` (`eyebrow`, `title`, `subtitle`,
   `search`, `categories.*`, `copySvg`, `copyJsx`, `copyCli`, `copied`,
   `empty`). Sumar la entrada "Icons" en `ui.json` dentro de `elementsMenu`
   en ambos idiomas.
8. Navbar: marcar `/icons` como activo dentro de `isElementsActive`.
9. Sitemap: agregar `/icons` a `staticPages`.
10. Versión markdown: extender `/api/docs` y `llms.txt` con la lista de iconos
    y el import de cada uno, para que los agentes conozcan el catálogo.

### Fase 3: después del catálogo

- Ruta `/icons/[name]` con `generateStaticParams` para deep links y SEO,
  abriendo la galería con el popover ya visible.
- Variante `filled` como archivo hermano (`search-filled.tsx`).
- Iconos animados con `motion` como componentes aparte, no dentro del set.
- Migrar progresivamente los demos de `packages/ui` a iconos propios.
- Badge `new` en la navegación mientras el catálogo sea reciente.

## Verificación por fase

- `pnpm --filter @repo/ui generate:registry` y luego `check:registry`.
- `pnpm --filter @repo/ui type-check` y `pnpm --filter @repo/ui test:run`.
- `pnpm --filter web check-types` y `pnpm --filter web build` (corre los checks
  de navegación y demos).
- ESLint no corre localmente por el crash con TS 7, así que la verificación de
  estilo queda en tsc, vitest y los checks de web.
- Con la API y Postgres levantados: `pnpm registry:sync` y `nachui add
icons/search` en un proyecto de prueba.

## Decisiones tomadas

- Set propio, dibujado sobre reglas fijas, no un wrapper sobre hugeicons.
- Catálogo en `/icons` a nivel raíz, no en `/docs/icons`.
- Un archivo por icono, sin componente base compartido.
- Metadatos en la web, no en `packages/ui`, para que los iconos no carguen
  datos de la app.
- Registro separado (`ICON_REGISTRY`) para no forzar páginas MDX por icono.

## Preguntas abiertas

- Nombre del prefijo en el CLI: `icons/search` (familia) o `icon-search`
  (nombre plano). La API ya soporta la familia, así que se propone `icons/`.
- Si el primer lote reemplaza también los iconos del navbar y footer de la web,
  o eso queda para fase 3.
