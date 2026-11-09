'use client';

import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { Field } from '@repo/ui/components/field';
import { Input } from '@repo/ui/components/input';
import { AlertCircleIcon } from '@repo/ui/icons/alert-circle';
import { CheckCircleIcon } from '@repo/ui/icons/check-circle';
import { ClockIcon } from '@repo/ui/icons/clock';
import { cn } from '@repo/ui/lib/cn';

import { useCopy } from './use-copy';

function DecisionCard({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-border bg-card flex w-80 max-w-full flex-col gap-4 rounded-lg border p-5">
      <div className="flex flex-col gap-1.5">
        <p className="text-base font-semibold">{title}</p>
        <p className="text-muted-foreground text-sm">{body}</p>
      </div>
      {children}
    </div>
  );
}

export function SpecificButtons() {
  const t = useCopy({
    en: {
      title: 'Delete 3 files?',
      body: 'They are removed for everyone in Design reviews. You cannot undo this.',
      cancel: 'Keep files',
      confirm: 'Delete files',
    },
    es: {
      title: '¿Eliminar 3 archivos?',
      body: 'Se borran para todas las personas de Revisiones de diseño. No se puede deshacer.',
      cancel: 'Conservar archivos',
      confirm: 'Eliminar archivos',
    },
  });

  return (
    <DecisionCard title={t.title} body={t.body}>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="outline">{t.cancel}</Button>
        <Button variant="destructive">{t.confirm}</Button>
      </div>
    </DecisionCard>
  );
}

export function GenericButtons() {
  const t = useCopy({
    en: {
      title: 'Are you sure?',
      body: 'This action cannot be undone.',
      cancel: 'Cancel',
      confirm: 'OK',
    },
    es: {
      title: '¿Estás seguro?',
      body: 'Esta acción no se puede deshacer.',
      cancel: 'Cancelar',
      confirm: 'Aceptar',
    },
  });

  return (
    <DecisionCard title={t.title} body={t.body}>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="outline">{t.cancel}</Button>
        <Button variant="destructive">{t.confirm}</Button>
      </div>
    </DecisionCard>
  );
}

function CardField({ error }: { error: string }) {
  const t = useCopy({
    en: { label: 'Card expiry' },
    es: { label: 'Vencimiento de la tarjeta' },
  });

  return (
    <Field invalid className="w-72 max-w-full">
      <Field.Label>{t.label}</Field.Label>
      <Field.Control>
        <Input defaultValue="09/26" inputMode="numeric" />
      </Field.Control>
      <Field.Error errors={[error]} />
    </Field>
  );
}

export function HelpfulError() {
  const error = useCopy({
    en: 'This card expired in September 2026. Use another card or update the date.',
    es: 'Esta tarjeta venció en septiembre de 2026. Usá otra o actualizá la fecha.',
  });

  return <CardField error={error} />;
}

export function VagueError() {
  const error = useCopy({
    en: 'Invalid input (error 422).',
    es: 'Entrada inválida (error 422).',
  });

  return <CardField error={error} />;
}

const RENEWAL = new Date(Date.UTC(2026, 11, 3));

export function IntlFormatted() {
  const t = useCopy({
    en: { locale: 'en-US', renews: 'Renews', seats: 'Seats', total: 'Total' },
    es: { locale: 'es-AR', renews: 'Se renueva', seats: 'Licencias', total: 'Total' },
  });

  const rows = [
    {
      label: t.renews,
      value: new Intl.DateTimeFormat(t.locale, { dateStyle: 'long', timeZone: 'UTC' }).format(
        RENEWAL,
      ),
    },
    { label: t.seats, value: new Intl.NumberFormat(t.locale).format(1240) },
    {
      label: t.total,
      value: new Intl.NumberFormat(t.locale, { style: 'currency', currency: 'USD' }).format(
        24180.5,
      ),
    },
  ];

  return <Summary rows={rows} />;
}

export function HardcodedFormat() {
  const t = useCopy({
    en: { renews: 'Renews', seats: 'Seats', total: 'Total' },
    es: { renews: 'Se renueva', seats: 'Licencias', total: 'Total' },
  });

  const rows = [
    { label: t.renews, value: '12/03/26' },
    { label: t.seats, value: '1240' },
    { label: t.total, value: '24180.5 USD' },
  ];

  return <Summary rows={rows} />;
}

function Summary({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <dl className="border-border bg-card grid w-72 max-w-full gap-2.5 rounded-lg border p-4 text-sm">
      {rows.map((row) => (
        <div key={row.label} className="flex items-baseline justify-between gap-4">
          <dt className="text-muted-foreground">{row.label}</dt>
          <dd className="font-medium tabular-nums" suppressHydrationWarning>
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

const DEPLOYS = ['web', 'api', 'worker'] as const;

export function StatusWithText() {
  const t = useCopy({
    en: { states: ['Ready', 'Building', 'Failed'] },
    es: { states: ['Listo', 'En curso', 'Falló'] },
  });

  const badges = [
    { variant: 'success', icon: CheckCircleIcon },
    { variant: 'secondary', icon: ClockIcon },
    { variant: 'destructive', icon: AlertCircleIcon },
  ] as const;

  return (
    <ul className="border-border bg-card divide-border w-64 max-w-full divide-y rounded-lg border">
      {DEPLOYS.map((name, index) => {
        const badge = badges[index] ?? badges[0];
        const Icon = badge.icon;
        return (
          <li key={name} className="flex items-center justify-between px-4 py-2.5 text-sm">
            <span className="font-mono">{name}</span>
            <Badge variant={badge.variant}>
              <Icon aria-hidden="true" />
              {t.states[index]}
            </Badge>
          </li>
        );
      })}
    </ul>
  );
}

export function StatusColorOnly() {
  const dots = ['bg-success', 'bg-warning', 'bg-destructive'];

  return (
    <ul className="border-border bg-card divide-border w-64 max-w-full divide-y rounded-lg border">
      {DEPLOYS.map((name, index) => (
        <li key={name} className="flex items-center justify-between px-4 py-2.5 text-sm">
          <span className="font-mono">{name}</span>
          <span className={cn('size-2.5 rounded-full', dots[index])} />
        </li>
      ))}
    </ul>
  );
}
