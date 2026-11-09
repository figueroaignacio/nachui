'use client';

import { Banner } from '@repo/ui/components/banner';
import { Button } from '@repo/ui/components/button';
import { Callout } from '@repo/ui/components/callout';
import { Empty } from '@repo/ui/components/empty';
import { Field } from '@repo/ui/components/field';
import { Input } from '@repo/ui/components/input';
import { toastVariants } from '@repo/ui/components/toast';
import { AlertCircleIcon } from '@repo/ui/icons/alert-circle';
import { CheckCircleIcon } from '@repo/ui/icons/check-circle';
import { FileTextIcon } from '@repo/ui/icons/file-text';
import { XIcon } from '@repo/ui/icons/x';
import { cn } from '@repo/ui/lib/cn';

import { useCopy } from './use-copy';

interface ToastSnapshotProps {
  variant?: 'default' | 'success' | 'error';
  title: string;
  description?: string;
  action?: string;
}

const SNAPSHOT_ICONS = {
  default: undefined,
  success: CheckCircleIcon,
  error: AlertCircleIcon,
} as const;

function ToastSnapshot({ variant = 'default', title, description, action }: ToastSnapshotProps) {
  const Icon = SNAPSHOT_ICONS[variant];

  return (
    <div className={cn(toastVariants({ variant }), 'w-72 max-w-full flex-col')}>
      <div className="flex w-full items-center gap-2">
        {Icon ? <Icon className="shrink-0" size={18} aria-hidden="true" /> : null}
        <p className="flex-1 text-sm font-semibold">{title}</p>
        <XIcon size={16} aria-hidden="true" className="text-muted-foreground shrink-0" />
      </div>
      {description || action ? (
        <div className="text-muted-foreground w-full">
          {description ? <p className="text-sm">{description}</p> : null}
          {action ? (
            <span className="mt-2 inline-flex rounded-md border px-3 py-1.5 text-xs font-medium">
              {action}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function InlineFieldError() {
  const t = useCopy({
    en: {
      label: 'Work email',
      hint: 'We send the invoice here.',
      error: 'Enter an email like ana@northwind.dev.',
      submit: 'Continue',
    },
    es: {
      label: 'Email de trabajo',
      hint: 'Te mandamos la factura acá.',
      error: 'Escribí un email como ana@northwind.dev.',
      submit: 'Continuar',
    },
  });

  return (
    <div className="flex w-72 max-w-full flex-col gap-4">
      <Field invalid>
        <Field.Label>{t.label}</Field.Label>
        <Field.Control>
          <Input type="email" defaultValue="ana@northwind" />
        </Field.Control>
        <Field.Description>{t.hint}</Field.Description>
        <Field.Error errors={[t.error]} />
      </Field>
      <Button className="self-start">{t.submit}</Button>
    </div>
  );
}

export function ToastFieldError() {
  const t = useCopy({
    en: { label: 'Work email', submit: 'Continue', toast: 'Invalid email' },
    es: { label: 'Email de trabajo', submit: 'Continuar', toast: 'Email inválido' },
  });

  return (
    <div className="flex w-72 max-w-full flex-col gap-4">
      <Field>
        <Field.Label>{t.label}</Field.Label>
        <Field.Control>
          <Input type="email" defaultValue="ana@northwind" />
        </Field.Control>
      </Field>
      <Button className="self-start">{t.submit}</Button>
      <ToastSnapshot variant="error" title={t.toast} />
    </div>
  );
}

export function UndoWithFallback() {
  const t = useCopy({
    en: {
      title: '3 conversations archived',
      description: 'Find them in Archive whenever you need them.',
      action: 'Undo',
    },
    es: {
      title: '3 conversaciones archivadas',
      description: 'Las encontrás en Archivo cuando las necesites.',
      action: 'Deshacer',
    },
  });

  return <ToastSnapshot variant="success" {...t} />;
}

export function UndoOnlyInToast() {
  const t = useCopy({
    en: {
      title: 'Project deleted',
      description: 'acme-web and its 14 deployments are gone.',
      action: 'Undo',
    },
    es: {
      title: 'Proyecto eliminado',
      description: 'acme-web y sus 14 deploys ya no existen.',
      action: 'Deshacer',
    },
  });

  return <ToastSnapshot {...t} />;
}

export function BannerAppWide() {
  const t = useCopy({
    en: {
      title: 'Your workspace is read only until 14:00 UTC',
      description:
        'We are moving it to a new region. Nothing is lost, and editing comes back on its own.',
      action: 'Status page',
    },
    es: {
      title: 'Tu espacio de trabajo es de solo lectura hasta las 14:00 UTC',
      description: 'Lo estamos moviendo a otra región. No se pierde nada y la edición vuelve sola.',
      action: 'Página de estado',
    },
  });

  return (
    <Banner variant="warning" dismissible={false} className="w-full max-w-md">
      <Banner.Content>
        <Banner.Title>{t.title}</Banner.Title>
        <Banner.Description>{t.description}</Banner.Description>
      </Banner.Content>
      <Banner.Action href="#status">{t.action}</Banner.Action>
    </Banner>
  );
}

export function BannerLocalTip() {
  const t = useCopy({
    en: {
      title: 'Tip',
      description: 'Drag the column headers of this table to reorder them.',
    },
    es: {
      title: 'Tip',
      description: 'Arrastrá los encabezados de esta tabla para reordenarlos.',
    },
  });

  return (
    <Banner variant="info" className="w-full max-w-md">
      <Banner.Content>
        <Banner.Title>{t.title}</Banner.Title>
        <Banner.Description>{t.description}</Banner.Description>
      </Banner.Content>
    </Banner>
  );
}

export function CalloutInContext() {
  const t = useCopy({
    en: {
      title: 'Rotating the key signs everyone out',
      body: 'Active sessions end within a minute. Schedule it outside working hours.',
    },
    es: {
      title: 'Rotar la clave cierra todas las sesiones',
      body: 'Las sesiones activas terminan en menos de un minuto. Hacelo fuera del horario laboral.',
    },
  });

  return (
    <Callout variant="warning" className="w-full max-w-md">
      <Callout.Title>{t.title}</Callout.Title>
      <Callout.Content>{t.body}</Callout.Content>
    </Callout>
  );
}

export function EmptyWithNextStep() {
  const t = useCopy({
    en: {
      title: 'No invoices yet',
      description: 'Invoices show up here after your first payment. Add a card to start the plan.',
      action: 'Add payment method',
    },
    es: {
      title: 'Todavía no hay facturas',
      description:
        'Las facturas aparecen acá después del primer pago. Agregá una tarjeta para activar el plan.',
      action: 'Agregar medio de pago',
    },
  });

  return (
    <Empty variant="outline" className="w-full max-w-sm">
      <Empty.Header>
        <Empty.Media variant="icon">
          <FileTextIcon size={24} />
        </Empty.Media>
        <Empty.Title>{t.title}</Empty.Title>
        <Empty.Description>{t.description}</Empty.Description>
      </Empty.Header>
      <Empty.Content>
        <Button size="sm">{t.action}</Button>
      </Empty.Content>
    </Empty>
  );
}

export function EmptyDeadEnd() {
  const t = useCopy({
    en: { title: 'No data' },
    es: { title: 'Sin datos' },
  });

  return (
    <Empty variant="outline" className="w-full max-w-sm">
      <Empty.Header>
        <Empty.Title>{t.title}</Empty.Title>
      </Empty.Header>
    </Empty>
  );
}
