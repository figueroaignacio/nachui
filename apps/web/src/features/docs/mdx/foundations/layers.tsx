import { cn } from '@repo/ui/lib/cn';

import type { Locale } from './theme';

const layers = [
  { z: 'z-9999', key: 'toast' },
  { z: 'z-500', key: 'portal' },
  { z: 'z-50', key: 'fixed' },
  { z: 'z-20', key: 'raisedTop' },
  { z: 'z-10', key: 'raised' },
  { z: 'auto', key: 'flow' },
] as const;

const copy = {
  en: {
    toast: { title: 'Toasts', examples: 'Toaster viewport' },
    portal: {
      title: 'Portal layers',
      examples: 'Dialog, alert dialog, sheet, drawer, popover, menus, select, tooltip',
    },
    fixed: {
      title: 'Sticky chrome and in-flow popups',
      examples: 'Sticky banner, dock, navigation menu panel, context usage card',
    },
    raisedTop: { title: 'Raised, second step', examples: 'Tab label above its pill, sidebar rail' },
    raised: {
      title: 'Raised inside a component',
      examples: 'Tab pill, switch thumb, slider focus, timeline dots, scroll button',
    },
    flow: { title: 'Document flow', examples: 'Everything else' },
  },
  es: {
    toast: { title: 'Toasts', examples: 'Viewport del toaster' },
    portal: {
      title: 'Capas en portal',
      examples: 'Dialog, alert dialog, sheet, drawer, popover, menús, select, tooltip',
    },
    fixed: {
      title: 'Elementos sticky y popups en el flujo',
      examples: 'Banner sticky, dock, panel del navigation menu, card de uso de contexto',
    },
    raisedTop: {
      title: 'Elevado, segundo paso',
      examples: 'Texto del tab sobre su pastilla, borde del sidebar',
    },
    raised: {
      title: 'Elevado dentro de un componente',
      examples:
        'Pastilla de tabs, thumb del switch, foco del slider, puntos del timeline, botón de scroll',
    },
    flow: { title: 'Flujo del documento', examples: 'Todo lo demás' },
  },
} as const;

export function LayerStack({ locale = 'en' }: { locale?: Locale }) {
  const t = copy[locale];

  return (
    <div className="bg-surface-muted border-border my-8 rounded-lg border px-4 py-6 sm:px-6">
      <ol className="flex flex-col">
        {layers.map((layer, index) => {
          const depth = layers.length - 1 - index;
          const text = t[layer.key];
          const floating = layer.key === 'toast' || layer.key === 'portal';
          return (
            <li
              key={layer.key}
              className={cn(
                'border-border relative flex items-center justify-between gap-4 rounded-md border px-4 py-3',
                index > 0 && '-mt-1.5',
                floating ? 'bg-popover shadow-md' : 'bg-card shadow-sm',
                layer.key === 'flow' && 'bg-background border-dashed shadow-none',
              )}
              style={{
                zIndex: layers.length - index,
                marginInlineStart: `${depth * 0.5}rem`,
                marginInlineEnd: `${(layers.length - 1 - depth) * 0.5}rem`,
              }}
            >
              <div className="min-w-0">
                <div className="text-foreground text-sm font-medium">{text.title}</div>
                <div className="text-muted-foreground text-xs leading-relaxed">{text.examples}</div>
              </div>
              <code className="text-foreground bg-muted shrink-0 rounded-sm px-1.5 py-0.5 font-mono text-[11px]">
                {layer.z}
              </code>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
