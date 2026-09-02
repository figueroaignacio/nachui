'use client';

import { Field } from '../../components/field';
import { Switch } from '../../components/switch';

const settings = [
  {
    id: 'notify-deploys',
    title: 'Deploy notifications',
    description: 'Post to the team channel when a production deploy finishes.',
    defaultChecked: true,
  },
  {
    id: 'notify-incidents',
    title: 'Incident pages',
    description: 'Page the on-call engineer when an alert fires.',
    defaultChecked: true,
  },
  {
    id: 'notify-digest',
    title: 'Weekly digest',
    description: 'A summary of usage and spend every Monday.',
    defaultChecked: false,
  },
];

export function Horizontal() {
  return (
    <Field.Group className="w-full max-w-sm gap-5">
      {settings.map((setting) => (
        <Field key={setting.id} orientation="horizontal" id={setting.id}>
          <Field.Content>
            <Field.Label>{setting.title}</Field.Label>
            <Field.Description>{setting.description}</Field.Description>
          </Field.Content>
          <Field.Control>
            <Switch defaultChecked={setting.defaultChecked} />
          </Field.Control>
        </Field>
      ))}
    </Field.Group>
  );
}
