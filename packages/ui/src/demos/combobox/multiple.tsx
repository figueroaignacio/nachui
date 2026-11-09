'use client';

import * as React from 'react';
import { Combobox } from '../../components/combobox';
import { Label } from '../../components/label';

const topics = [
  {
    label: 'Languages',
    items: [
      { value: 'typescript', label: 'TypeScript' },
      { value: 'rust', label: 'Rust' },
      { value: 'go', label: 'Go' },
      { value: 'python', label: 'Python' },
    ],
  },
  {
    label: 'Frontend',
    items: [
      { value: 'react', label: 'React' },
      { value: 'tailwindcss', label: 'Tailwind CSS' },
      { value: 'accessibility', label: 'Accessibility' },
    ],
  },
  {
    label: 'Infrastructure',
    items: [
      { value: 'postgres', label: 'Postgres' },
      { value: 'docker', label: 'Docker' },
      { value: 'edge', label: 'Edge functions' },
    ],
  },
];

export function Multiple() {
  const [value, setValue] = React.useState(['typescript', 'react']);

  return (
    <div className="flex w-full max-w-sm flex-col gap-1.5">
      <Label htmlFor="repo-topics" description="Topics help people find your repository in search.">
        Topics
      </Label>
      <Combobox multiple value={value} onValueChange={setValue}>
        <Combobox.Input
          id="repo-topics"
          placeholder="Add topics"
          aria-describedby="repo-topics-label-description"
        />
        <Combobox.Content>
          <Combobox.Empty>No topics match.</Combobox.Empty>
          {topics.map((group, index) => (
            <React.Fragment key={group.label}>
              {index > 0 && <Combobox.Separator />}
              <Combobox.Group>
                <Combobox.Label>{group.label}</Combobox.Label>
                {group.items.map((topic) => (
                  <Combobox.Item key={topic.value} value={topic.value}>
                    {topic.label}
                  </Combobox.Item>
                ))}
              </Combobox.Group>
            </React.Fragment>
          ))}
        </Combobox.Content>
      </Combobox>
    </div>
  );
}
