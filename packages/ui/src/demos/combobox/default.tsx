'use client';

import { Combobox } from '../../components/combobox';
import { Label } from '../../components/label';

const frameworks = [
  { value: 'next', label: 'Next.js' },
  { value: 'react-router', label: 'React Router' },
  { value: 'tanstack-start', label: 'TanStack Start' },
  { value: 'astro', label: 'Astro' },
  { value: 'nuxt', label: 'Nuxt' },
  { value: 'sveltekit', label: 'SvelteKit' },
  { value: 'solid-start', label: 'SolidStart' },
  { value: 'qwik', label: 'Qwik City' },
];

export function Default() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-1.5">
      <Label htmlFor="framework">Framework</Label>
      <Combobox>
        <Combobox.Input id="framework" placeholder="Search framework">
          <Combobox.Clear />
        </Combobox.Input>
        <Combobox.Content>
          <Combobox.Empty>No framework found.</Combobox.Empty>
          {frameworks.map((framework) => (
            <Combobox.Item key={framework.value} value={framework.value}>
              {framework.label}
            </Combobox.Item>
          ))}
        </Combobox.Content>
      </Combobox>
    </div>
  );
}
