---
name: 'nachui-component-development'
description: 'Use when creating, modifying, or refactoring React components in the packages/ui directory of NachUI.'
---

## NachUI Component Development Guide

You are an expert React 19 developer building components for the NachUI library. Follow these strict guidelines and patterns when authoring or modifying components.

## Technical Architecture

- **React 19 & Next.js compatibility**: Default to Server Components. Add the `'use client'` directive only if using React hooks (`useState`, `useEffect`, `useContext`, etc.) or accessing client-only DOM APIs.
- **Tailwind CSS v4**: Do NOT look for `tailwind.config.js`. Tailwind CSS v4 uses CSS variables defined in [globals.css](file:///home/ignaciofigueroa/Desktop/projects/ui/packages/ui/src/css/globals.css). Use these variable tokens (e.g., `var(--surface-muted)`) rather than literal hex/RGB codes.
- **Component Clones**: Ensure all primitives are dependency-free. Accept labels, descriptions, and icons via props rather than importing project-specific data models.

## Styling Patterns

1. **Class Name Derivation**: Always use the `cn(...)` utility helper to merge and conditionalize classes. Never build Tailwind strings manually.
2. **Class Ordering**: Maintain a consistent class order:
   `layout` (e.g., flex, grid) → `spacing` (e.g., p-4, m-2) → `typography` (e.g., text-sm) → `color` (e.g., text-foreground) → `effects` (e.g., shadow-md).
3. **CVA (class-variance-authority)**: Declare `cva` variant configurations outside the component function block. Export the configuration and its `VariantProps` type.

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);
```

## Animation (Framer Motion)

- Store all Framer Motion `variants` and `transitions` as top-level constants. This avoids unnecessary re-evaluation during render cycles and keeps code clean.
- Use CSS transitions/animations for simple hover states; reserve Motion for complex layouts, layout-transitions, or exit animations.

## Interactive Primitives (forwardRef)

- Always forward refs on interactive primitives.
- Provide an explicit type definition for props and ref, and set the component `displayName` at the bottom.

```typescript
import * as React from 'react';
import { cn } from '@/lib/cn';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
```

## Context Safety

- Context helpers must explicitly throw an descriptive error when consumed outside of their provider.

```typescript
const AlertContext = React.createContext<AlertContextValue | null>(null);

export const useAlertContext = () => {
  const context = React.useContext(AlertContext);
  if (!context) {
    throw new Error('useAlertContext must be used within an AlertProvider');
  }
  return context;
};
```

## Import Order Guidelines

Organize imports cleanly with groups separated by a single empty line:

1. Core platform modules (`react`, `next/navigation`).
2. Third-party dependencies (`motion`, `zod`, etc.).
3. Workspace aliases (`@repo/ui`, `@/lib`, `@/components`).
4. Relative imports (`./button-utils`, `../types`).
5. Type imports should use `import type { ... }` explicitly.
