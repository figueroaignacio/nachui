'use client';

import { useId, useState } from 'react';

import { Button } from '@repo/ui/components/button';
import { Field } from '@repo/ui/components/field';
import { Label } from '@repo/ui/components/label';
import { NumberField } from '@repo/ui/components/number-field';
import { Radio } from '@repo/ui/components/radio';
import { Select } from '@repo/ui/components/select';
import { Slider } from '@repo/ui/components/slider';
import { Switch } from '@repo/ui/components/switch';

import { useCopy } from './use-copy';

export function SwitchAppliesNow() {
  const [on, setOn] = useState(true);
  const t = useCopy({
    en: {
      label: 'Comment emails',
      hint: 'Get an email when someone replies to you.',
      on: 'On. Saved.',
      off: 'Off. Saved.',
    },
    es: {
      label: 'Emails de comentarios',
      hint: 'Te avisamos cuando alguien te responde.',
      on: 'Activado. Guardado.',
      off: 'Desactivado. Guardado.',
    },
  });

  return (
    <div className="border-border bg-card flex w-80 max-w-full flex-col gap-2 rounded-lg border p-4">
      <Field orientation="horizontal" className="items-start justify-between">
        <Field.Content>
          <Field.Label>{t.label}</Field.Label>
          <Field.Description>{t.hint}</Field.Description>
        </Field.Content>
        <Field.Control>
          <Switch checked={on} onCheckedChange={setOn} />
        </Field.Control>
      </Field>
      <p role="status" className="text-muted-foreground text-xs">
        {on ? t.on : t.off}
      </p>
    </div>
  );
}

export function SwitchWaitsForSave() {
  const t = useCopy({
    en: {
      label: 'Comment emails',
      hint: 'Get an email when someone replies to you.',
      save: 'Save changes',
    },
    es: {
      label: 'Emails de comentarios',
      hint: 'Te avisamos cuando alguien te responde.',
      save: 'Guardar cambios',
    },
  });

  return (
    <div className="border-border bg-card flex w-80 max-w-full flex-col gap-4 rounded-lg border p-4">
      <Field orientation="horizontal" className="items-start justify-between">
        <Field.Content>
          <Field.Label>{t.label}</Field.Label>
          <Field.Description>{t.hint}</Field.Description>
        </Field.Content>
        <Field.Control>
          <Switch defaultChecked />
        </Field.Control>
      </Field>
      <Button size="sm" className="self-end">
        {t.save}
      </Button>
    </div>
  );
}

const PLANS = {
  en: [
    { value: 'hobby', title: 'Hobby', detail: 'Free, one project' },
    { value: 'pro', title: 'Pro', detail: '$20 per user, unlimited projects' },
    { value: 'team', title: 'Team', detail: '$48 per user, SSO and audit log' },
  ],
  es: [
    { value: 'hobby', title: 'Hobby', detail: 'Gratis, un proyecto' },
    { value: 'pro', title: 'Pro', detail: 'USD 20 por persona, proyectos ilimitados' },
    { value: 'team', title: 'Team', detail: 'USD 48 por persona, SSO y registro de auditoría' },
  ],
};

export function RadioPlans() {
  const name = useId();
  const t = useCopy({
    en: { legend: 'Plan', plans: PLANS.en },
    es: { legend: 'Plan', plans: PLANS.es },
  });

  return (
    <Field.Set className="w-80 max-w-full">
      <Field.Legend variant="label">{t.legend}</Field.Legend>
      <Field.Group className="gap-2">
        {t.plans.map((plan) => (
          <Field
            key={plan.value}
            orientation="horizontal"
            className="border-border bg-card rounded-lg border p-3"
          >
            <Field.Control>
              <Radio name={name} value={plan.value} defaultChecked={plan.value === 'pro'} />
            </Field.Control>
            <Field.Content>
              <Field.Label>{plan.title}</Field.Label>
              <Field.Description>{plan.detail}</Field.Description>
            </Field.Content>
          </Field>
        ))}
      </Field.Group>
    </Field.Set>
  );
}

export function SelectPlans() {
  const id = useId();
  const t = useCopy({
    en: { label: 'Plan', plans: PLANS.en },
    es: { label: 'Plan', plans: PLANS.es },
  });

  return (
    <div className="flex w-72 max-w-full flex-col gap-1.5">
      <Label htmlFor={id}>{t.label}</Label>
      <Select defaultValue="pro">
        <Select.Trigger id={id} />
        <Select.Content>
          {t.plans.map((plan) => (
            <Select.Item key={plan.value} value={plan.value}>
              {plan.title}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  );
}

export function NumberFieldSeats() {
  const id = useId();
  const t = useCopy({
    en: { label: 'Seats', hint: 'One per person who signs in.' },
    es: { label: 'Licencias', hint: 'Una por cada persona que inicia sesión.' },
  });

  return (
    <div className="flex w-44 flex-col gap-1.5">
      <Label htmlFor={id} description={t.hint}>
        {t.label}
      </Label>
      <NumberField
        id={id}
        aria-describedby={`${id}-label-description`}
        defaultValue={12}
        min={1}
        max={500}
      >
        <NumberField.Group>
          <NumberField.Decrement />
          <NumberField.Input />
          <NumberField.Increment />
        </NumberField.Group>
      </NumberField>
    </div>
  );
}

export function SliderSeats() {
  const labelId = useId();
  const [seats, setSeats] = useState([12]);
  const t = useCopy({
    en: { label: 'Seats' },
    es: { label: 'Licencias' },
  });

  return (
    <div className="flex w-72 max-w-full flex-col gap-3">
      <div className="flex items-center justify-between text-sm">
        <span id={labelId} className="font-medium">
          {t.label}
        </span>
        <span className="text-muted-foreground tabular-nums">{seats[0]}</span>
      </div>
      <Slider value={seats} onValueChange={setSeats} min={1} max={500}>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb aria-labelledby={labelId} />
      </Slider>
    </div>
  );
}
