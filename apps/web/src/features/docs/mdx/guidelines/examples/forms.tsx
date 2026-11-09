'use client';

import { useMemo, useState } from 'react';
import { z } from 'zod';

import { Button } from '@repo/ui/components/button';
import { Field } from '@repo/ui/components/field';
import { Form } from '@repo/ui/components/form';
import { Input } from '@repo/ui/components/input';
import { Textarea } from '@repo/ui/components/textarea';

import { useCopy } from './use-copy';

export function FormWithSummary() {
  const [created, setCreated] = useState<string | null>(null);
  const t = useCopy({
    en: {
      summary: 'Check these fields',
      name: 'Project name',
      nameHint: 'Lowercase letters, numbers and dashes. It becomes the URL.',
      nameError: 'Use lowercase letters, numbers and dashes, like acme-web.',
      email: 'Billing email',
      emailError: 'Enter an email like ana@northwind.dev.',
      notes: 'Notes',
      optional: '(optional)',
      cancel: 'Cancel',
      submit: 'Create project',
      done: (name: string) => `Created ${name}.`,
    },
    es: {
      summary: 'Revisá estos campos',
      name: 'Nombre del proyecto',
      nameHint: 'Minúsculas, números y guiones. Se usa en la URL.',
      nameError: 'Usá minúsculas, números y guiones, como acme-web.',
      email: 'Email de facturación',
      emailError: 'Escribí un email como ana@northwind.dev.',
      notes: 'Notas',
      optional: '(opcional)',
      cancel: 'Cancelar',
      submit: 'Crear proyecto',
      done: (name: string) => `Creaste ${name}.`,
    },
  });

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, t.nameError),
        email: z.email(t.emailError),
        notes: z.string().optional(),
      }),
    [t.nameError, t.emailError],
  );

  return (
    <Form
      schema={schema}
      onSubmit={(data) => setCreated(data.name)}
      onReset={() => setCreated(null)}
      className="border-border bg-card w-full max-w-sm gap-5 rounded-lg border p-5"
    >
      <Form.ErrorSummary title={t.summary} />
      <Form.Field name="name">
        <Field.Label>{t.name}</Field.Label>
        <Field.Control>
          <Input autoComplete="off" required />
        </Field.Control>
        <Field.Description>{t.nameHint}</Field.Description>
        <Field.Error />
      </Form.Field>
      <Form.Field name="email">
        <Field.Label>{t.email}</Field.Label>
        <Field.Control>
          <Input type="email" autoComplete="email" required />
        </Field.Control>
        <Field.Error />
      </Form.Field>
      <Form.Field name="notes">
        <Field.Label>
          {t.notes} <span className="text-muted-foreground font-normal">{t.optional}</span>
        </Field.Label>
        <Field.Control>
          <Textarea rows={2} />
        </Field.Control>
        <Field.Error />
      </Form.Field>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="reset" variant="outline">
          {t.cancel}
        </Button>
        <Form.Submit>{t.submit}</Form.Submit>
      </div>
      {created ? (
        <p role="status" className="text-muted-foreground text-sm">
          {t.done(created)}
        </p>
      ) : null}
    </Form>
  );
}

export function VisibleLabel() {
  const t = useCopy({
    en: { label: 'Company', placeholder: 'Northwind' },
    es: { label: 'Empresa', placeholder: 'Northwind' },
  });

  return (
    <Field className="w-64 max-w-full">
      <Field.Label>{t.label}</Field.Label>
      <Field.Control>
        <Input placeholder={t.placeholder} defaultValue="Northwind Tra" />
      </Field.Control>
    </Field>
  );
}

export function PlaceholderAsLabel() {
  const t = useCopy({
    en: { label: 'Company' },
    es: { label: 'Empresa' },
  });

  return (
    <div className="flex w-64 max-w-full flex-col gap-3">
      <Input placeholder={t.label} aria-label={t.label} />
      <Input placeholder={t.label} aria-label={t.label} defaultValue="Northwind Tra" />
    </div>
  );
}

export function FooterOneAction() {
  const t = useCopy({
    en: {
      title: 'Invite 3 people to Northwind?',
      body: 'They get an email with a link that works for 7 days.',
      cancel: 'Cancel',
      confirm: 'Send invites',
    },
    es: {
      title: '¿Invitar a 3 personas a Northwind?',
      body: 'Les llega un email con un link que vale 7 días.',
      cancel: 'Cancelar',
      confirm: 'Enviar invitaciones',
    },
  });

  return (
    <div className="border-border bg-card flex w-80 max-w-full flex-col gap-4 rounded-lg border p-5">
      <div className="flex flex-col gap-1.5">
        <p className="text-base font-semibold">{t.title}</p>
        <p className="text-muted-foreground text-sm">{t.body}</p>
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="outline">{t.cancel}</Button>
        <Button>{t.confirm}</Button>
      </div>
    </div>
  );
}

export function FooterCompetingActions() {
  const t = useCopy({
    en: {
      title: 'Invite 3 people to Northwind?',
      body: 'They get an email with a link that works for 7 days.',
      confirm: 'OK',
      cancel: 'Cancel',
    },
    es: {
      title: '¿Invitar a 3 personas a Northwind?',
      body: 'Les llega un email con un link que vale 7 días.',
      confirm: 'Aceptar',
      cancel: 'Cancelar',
    },
  });

  return (
    <div className="border-border bg-card flex w-80 max-w-full flex-col gap-4 rounded-lg border p-5">
      <div className="flex flex-col gap-1.5">
        <p className="text-base font-semibold">{t.title}</p>
        <p className="text-muted-foreground text-sm">{t.body}</p>
      </div>
      <div className="flex gap-2">
        <Button>{t.confirm}</Button>
        <Button>{t.cancel}</Button>
      </div>
    </div>
  );
}
