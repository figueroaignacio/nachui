'use client';

import * as React from 'react';
import { Button } from '../../components/button';
import { Field } from '../../components/field';
import { Input } from '../../components/input';

function validate(value: string): string[] {
  const errors: string[] = [];
  if (value.length < 3) errors.push('Use at least 3 characters.');
  if (/[^a-z0-9-]/.test(value)) errors.push('Only lowercase letters, numbers and dashes.');
  if (value.startsWith('-') || value.endsWith('-')) errors.push('Cannot start or end with a dash.');
  return errors;
}

export function WithError() {
  const [slug, setSlug] = React.useState('My Team!');
  const errors = validate(slug);

  return (
    <form
      className="border-border bg-card w-full max-w-sm rounded-xl border p-6"
      onSubmit={(event) => event.preventDefault()}
    >
      <Field.Group>
        <Field invalid={errors.length > 0}>
          <Field.Label>Workspace URL</Field.Label>
          <Field.Control>
            <Input value={slug} onChange={(event) => setSlug(event.target.value)} />
          </Field.Control>
          <Field.Description>northwind.app/{slug || 'your-workspace'}</Field.Description>
          <Field.Error errors={errors} />
        </Field>
        <Field orientation="horizontal">
          <Button type="submit" size="sm" disabled={errors.length > 0}>
            Save
          </Button>
        </Field>
      </Field.Group>
    </form>
  );
}
