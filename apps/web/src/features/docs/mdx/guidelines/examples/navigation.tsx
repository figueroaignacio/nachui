'use client';

import { Button } from '@repo/ui/components/button';
import { DropdownMenu } from '@repo/ui/components/dropdown-menu';
import { Tabs } from '@repo/ui/components/tabs';
import { ChevronDownIcon } from '@repo/ui/icons/chevron-down';
import { CopyIcon } from '@repo/ui/icons/copy';
import { MoreHorizontalIcon } from '@repo/ui/icons/more-horizontal';
import { PencilIcon } from '@repo/ui/icons/pencil';
import { TrashIcon } from '@repo/ui/icons/trash';

import { useCopy } from './use-copy';

export function DropdownForActions() {
  const t = useCopy({
    en: {
      meta: 'Updated 2 hours ago',
      trigger: 'Actions for acme-web',
      rename: 'Rename',
      duplicate: 'Duplicate',
      remove: 'Delete',
    },
    es: {
      meta: 'Actualizado hace 2 horas',
      trigger: 'Acciones de acme-web',
      rename: 'Renombrar',
      duplicate: 'Duplicar',
      remove: 'Eliminar',
    },
  });

  return (
    <div className="border-border bg-card flex w-72 max-w-full items-center justify-between gap-3 rounded-lg border p-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">acme-web</p>
        <p className="text-muted-foreground truncate text-xs">{t.meta}</p>
      </div>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button variant="ghost" size="icon" aria-label={t.trigger}>
            <MoreHorizontalIcon size={18} aria-hidden="true" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" className="w-44">
          <DropdownMenu.Item>
            <PencilIcon className="size-4" aria-hidden="true" />
            {t.rename}
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <CopyIcon className="size-4" aria-hidden="true" />
            {t.duplicate}
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item variant="destructive">
            <TrashIcon className="size-4" aria-hidden="true" />
            {t.remove}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
}

export function DropdownForPages() {
  const t = useCopy({
    en: { trigger: 'Go to', pages: ['Dashboard', 'Projects', 'Billing', 'Settings'] },
    es: { trigger: 'Ir a', pages: ['Panel', 'Proyectos', 'Facturación', 'Configuración'] },
  });

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline">
          {t.trigger}
          <ChevronDownIcon size={16} aria-hidden="true" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-44">
        {t.pages.map((page) => (
          <DropdownMenu.Item key={page}>{page}</DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}

export function TabsForViews() {
  const t = useCopy({
    en: {
      overview: 'Overview',
      logs: 'Build log',
      env: 'Environment',
      overviewBody: 'Ready in 42s. Serving production from iad1.',
      logsBody: '14:02:53 Deployment ready',
      envBody: '3 variables, 2 of them secret.',
    },
    es: {
      overview: 'Resumen',
      logs: 'Log de build',
      env: 'Entorno',
      overviewBody: 'Listo en 42 s. Sirviendo producción desde iad1.',
      logsBody: '14:02:53 Deploy listo',
      envBody: '3 variables, 2 de ellas secretas.',
    },
  });

  return (
    <Tabs defaultValue="overview" size="sm" className="w-80 max-w-full">
      <Tabs.List>
        <Tabs.Trigger value="overview">{t.overview}</Tabs.Trigger>
        <Tabs.Trigger value="logs">{t.logs}</Tabs.Trigger>
        <Tabs.Trigger value="env">{t.env}</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview">
        <p className="text-muted-foreground text-sm">{t.overviewBody}</p>
      </Tabs.Content>
      <Tabs.Content value="logs">
        <p className="text-muted-foreground font-mono text-xs">{t.logsBody}</p>
      </Tabs.Content>
      <Tabs.Content value="env">
        <p className="text-muted-foreground text-sm">{t.envBody}</p>
      </Tabs.Content>
    </Tabs>
  );
}

export function TabsForSiteSections() {
  const t = useCopy({
    en: {
      sections: [
        { value: 'home', label: 'Home', body: 'The landing page, rendered inside a tab panel.' },
        { value: 'pricing', label: 'Pricing', body: 'No URL of its own, so nobody can link here.' },
        { value: 'blog', label: 'Blog', body: 'Back leaves the site instead of going to Home.' },
      ],
    },
    es: {
      sections: [
        { value: 'home', label: 'Inicio', body: 'La home, metida dentro de un panel de tabs.' },
        { value: 'pricing', label: 'Precios', body: 'Sin URL propia, nadie puede compartirla.' },
        {
          value: 'blog',
          label: 'Blog',
          body: 'Atrás te saca del sitio en vez de volver a Inicio.',
        },
      ],
    },
  });

  return (
    <Tabs defaultValue="home" size="sm" className="w-80 max-w-full">
      <Tabs.List>
        {t.sections.map((section) => (
          <Tabs.Trigger key={section.value} value={section.value}>
            {section.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {t.sections.map((section) => (
        <Tabs.Content key={section.value} value={section.value}>
          <p className="text-muted-foreground text-sm">{section.body}</p>
        </Tabs.Content>
      ))}
    </Tabs>
  );
}
