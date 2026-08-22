'use client';

import { Collapsible } from '../../components/collapsible';

const advanced = [
  { label: 'Build command', value: 'pnpm build' },
  { label: 'Output directory', value: 'dist' },
  { label: 'Install command', value: 'pnpm install --frozen-lockfile' },
  { label: 'Node version', value: '22.x' },
];

export function Default() {
  return (
    <div className="border-border bg-card w-full max-w-md space-y-4 rounded-xl border p-4">
      <div>
        <p className="text-sm font-medium">Build settings</p>
        <p className="text-muted-foreground text-xs">
          Framework preset detected: Vite. These values are used on every deployment.
        </p>
      </div>

      <Collapsible>
        <Collapsible.Trigger>
          <span className="text-sm font-medium">Advanced options</span>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <dl className="divide-border divide-y pt-3">
            {advanced.map((setting) => (
              <div key={setting.label} className="flex items-center justify-between gap-3 py-2">
                <dt className="text-muted-foreground text-xs">{setting.label}</dt>
                <dd className="bg-muted rounded px-2 py-1 font-mono text-xs">{setting.value}</dd>
              </div>
            ))}
          </dl>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
