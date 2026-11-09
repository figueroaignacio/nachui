'use client';

import * as React from 'react';
import { Combobox } from '../../components/combobox';
import { Label } from '../../components/label';

const initialLabels = [
  { value: 'bug', label: 'bug' },
  { value: 'feature', label: 'feature' },
  { value: 'docs', label: 'docs' },
  { value: 'good-first-issue', label: 'good first issue' },
  { value: 'needs-triage', label: 'needs triage' },
];

function toSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function Creatable() {
  const [labels, setLabels] = React.useState(initialLabels);
  const [value, setValue] = React.useState(['bug']);

  const createLabel = (name: string) => {
    const slug = toSlug(name) || name;
    setLabels((current) =>
      current.some((label) => label.value === slug)
        ? current
        : [...current, { value: slug, label: name }],
    );
    return slug;
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-1.5">
      <Label htmlFor="issue-labels">Labels</Label>
      <Combobox multiple value={value} onValueChange={setValue}>
        <Combobox.Input id="issue-labels" placeholder="Find or create a label" />
        <Combobox.Content>
          {labels.map((label) => (
            <Combobox.Item key={label.value} value={label.value}>
              {label.label}
            </Combobox.Item>
          ))}
          <Combobox.Create onCreate={createLabel}>
            {(query) => `Create label "${query}"`}
          </Combobox.Create>
        </Combobox.Content>
      </Combobox>
    </div>
  );
}
