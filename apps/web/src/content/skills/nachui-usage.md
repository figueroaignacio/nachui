---
name: 'nachui-usage'
description: 'Use when consuming, importing, or integrating NachUI components inside apps/web or any app that depends on @repo/ui.'
---

## NachUI Usage Guide

You are consuming components from the NachUI. Follow these rules precisely.

## Available Components

| Component      | Import Path                         |
| :------------- | :---------------------------------- |
| `Accordion`    | `@repo/ui/components/accordion`     |
| `Avatar`       | `@repo/ui/components/avatar`        |
| `Badge`        | `@repo/ui/components/badge`         |
| `Banner`       | `@repo/ui/components/banner`        |
| `Breadcrumb`   | `@repo/ui/components/breadcrumb`    |
| `Button`       | `@repo/ui/components/button`        |
| `Callout`      | `@repo/ui/components/callout`       |
| `Card`         | `@repo/ui/components/card`          |
| `Checkbox`     | `@repo/ui/components/checkbox`      |
| `Collapsible`  | `@repo/ui/components/collapsible`   |
| `Dialog`       | `@repo/ui/components/dialog`        |
| `Drawer`       | `@repo/ui/components/drawer`        |
| `DropdownMenu` | `@repo/ui/components/dropdown-menu` |
| `Input`        | `@repo/ui/components/input`         |
| `Kbd`          | `@repo/ui/components/kbd`           |
| `Label`        | `@repo/ui/components/label`         |
| `Popover`      | `@repo/ui/components/popover`       |
| `Progress`     | `@repo/ui/components/progress`      |
| `Select`       | `@repo/ui/components/select`        |
| `Separator`    | `@repo/ui/components/separator`     |
| `Skeleton`     | `@repo/ui/components/skeleton`      |
| `Spinner`      | `@repo/ui/components/spinner`       |
| `Switch`       | `@repo/ui/components/switch`        |
| `Table`        | `@repo/ui/components/table`         |
| `Tabs`         | `@repo/ui/components/tabs`          |
| `Toast`        | `@repo/ui/components/toast`         |
| `Tooltip`      | `@repo/ui/components/tooltip`       |
| `Typography`   | `@repo/ui/components/typography`    |

## Layout Primitives

Use layout primitives for spatial composition. Do not use raw `div` with Tailwind flex/grid unless you need something the primitives do not support.

```tsx
// Stack = vertical flex column
<Stack gap="4">
  <Typography variant="h2">Title</Typography>
  <Typography variant="p">Body text</Typography>
</Stack>

// Flex = horizontal flex row
<Flex align="center" justify="between" gap="3">
  <span>Left</span>
  <Button>Action</Button>
</Flex>

// Grid = CSS grid
<Grid columns="3" gap="6">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</Grid>

// Container = max-width wrapper with padding
<Container size="fluid">
  {/* page content */}
</Container>
```

### Container Sizes

| Size    | Max Width                      |
| :------ | :----------------------------- |
| `sm`    | 640px                          |
| `md`    | 768px                          |
| `lg`    | 1024px                         |
| `xl`    | 1280px                         |
| `fluid` | 100% (full width with padding) |

### Stack / Flex / Grid Gap Values

Accepted `gap` values: `"0" | "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12" | "16" | "20" | "24" | "32"`.

Do **not** pass arbitrary values like `gap="2.5"` — these will cause TypeScript errors.

## Button Usage

```tsx
import { Button } from '@repo/ui/components/button';

// Variants: default | destructive | outline | secondary | ghost | link
// Sizes: default | sm | lg | icon

<Button variant="default">Save</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button loading>Processing...</Button>
<Button leftIcon={<SomeIcon />}>With Icon</Button>

// Group
<Button.Group>
  <Button variant="outline">Left</Button>
  <Button variant="outline">Right</Button>
</Button.Group>

// Attached group
<Button.Group attached>
  <Button variant="outline">A</Button>
  <Button variant="outline">B</Button>
</Button.Group>
```

## Typography Usage

```tsx
import { Typography } from '@repo/ui/components/typography';

// Variants: h1 | h2 | h3 | h4 | p | lead | large | small | muted | code | blockquote
<Typography variant="h1">Page Title</Typography>
<Typography variant="p">Body paragraph text.</Typography>
<Typography variant="muted">Secondary note.</Typography>
```

## Icons

NachUI ships its own icon set: one self-contained React component per icon, installed with `npx nachui add icons/<name>` and imported from `@/components/ui/<name>` as `<Name>Icon`. Browse it at `/icons`. Components accept any icon through props, so another library is fine when a project already uses one, but do not add an icon dependency on your own.

```tsx
import { ArrowRightIcon } from '@/components/ui/arrow-right';
import { CopyIcon } from '@/components/ui/copy';

<ArrowRightIcon size={16} />
<CopyIcon className="h-4 w-4" strokeWidth={2} />
```

## Client vs Server Components

- Layout primitives (`Container`, `Stack`, `Flex`, `Grid`) are Server Component safe — no `'use client'` needed.
- Interactive components (`Button`, `Dialog`, `Accordion`, `Tabs`, etc.) are already marked `'use client'` internally — you do not need to add the directive when consuming them in a Server Component, Next.js handles the boundary automatically.
- Only add `'use client'` to your own component files when you use React hooks (`useState`, `useEffect`, `useRef`, etc.).

## `cn` Utility

Always use `cn` to merge class names. Never concatenate strings manually.

```tsx
import { cn } from '@/lib/cn';

<div className={cn('base-class', isActive && 'active-class', className)} />;
```
