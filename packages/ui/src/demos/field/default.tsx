'use client';

import { Button } from '../../components/button';
import { Field } from '../../components/field';
import { Input } from '../../components/input';
import { Textarea } from '../../components/textarea';

export function Default() {
  return (
    <form className="bg-card w-full max-w-sm rounded-lg p-6 shadow-sm">
      <Field.Group>
        <Field>
          <Field.Label>Project name</Field.Label>
          <Field.Control>
            <Input placeholder="Checkout redesign" />
          </Field.Control>
          <Field.Description>Shown in the sidebar and in deploy notifications.</Field.Description>
        </Field>
        <Field>
          <Field.Label>Description</Field.Label>
          <Field.Control>
            <Textarea placeholder="What is this project for?" rows={3} />
          </Field.Control>
          <Field.Description>Optional. Markdown is supported.</Field.Description>
        </Field>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" size="sm">
            Cancel
          </Button>
          <Button type="button" size="sm">
            Create project
          </Button>
        </Field>
      </Field.Group>
    </form>
  );
}
