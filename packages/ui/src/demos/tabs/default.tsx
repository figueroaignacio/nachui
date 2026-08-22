'use client';

import { Badge } from '../../components/badge';
import { Card } from '../../components/card';
import { Tabs } from '../../components/tabs';

const summary = [
  { label: 'Build time', value: '42s' },
  { label: 'Output size', value: '218 kB' },
  { label: 'Region', value: 'iad1' },
  { label: 'Commit', value: '9fk2ax' },
];

const buildLog = [
  '14:02:11  Cloning github.com/acme/storefront-api (branch: main)',
  '14:02:14  Running "pnpm install --frozen-lockfile"',
  '14:02:38  Running "pnpm build"',
  '14:02:52  Uploading build output (218 kB)',
  '14:02:53  Deployment ready',
];

const envVars = [
  { key: 'DATABASE_URL', value: 'postgres://••••', scope: 'Production' },
  { key: 'STRIPE_SECRET_KEY', value: 'sk_live_••••4f2a', scope: 'Production' },
  { key: 'NEXT_PUBLIC_API_URL', value: 'https://api.acme.dev', scope: 'All' },
];

export function Default() {
  return (
    <Tabs defaultValue="overview" variant="default" size="sm" className="w-full max-w-lg">
      <Tabs.List>
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="logs">Build log</Tabs.Trigger>
        <Tabs.Trigger value="env">Environment</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="overview">
        <Card className="border-border shadow-sm">
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              storefront-api
              <Badge variant="success">Ready</Badge>
            </Card.Title>
            <Card.Description>
              Deployment dpl_9fk2ax was promoted to production 12 minutes ago.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {summary.map((item) => (
                <div key={item.label}>
                  <dt className="text-muted-foreground text-xs">{item.label}</dt>
                  <dd className="font-medium">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Card.Content>
        </Card>
      </Tabs.Content>

      <Tabs.Content value="logs">
        <Card className="border-border shadow-sm">
          <Card.Header>
            <Card.Title>Build log</Card.Title>
            <Card.Description>Last 5 lines of the production build.</Card.Description>
          </Card.Header>
          <Card.Content>
            <pre className="bg-muted text-muted-foreground overflow-x-auto rounded-md p-3 font-mono text-xs">
              {buildLog.join('\n')}
            </pre>
          </Card.Content>
        </Card>
      </Tabs.Content>

      <Tabs.Content value="env">
        <Card className="border-border shadow-sm">
          <Card.Header>
            <Card.Title>Environment variables</Card.Title>
            <Card.Description>
              Values are encrypted and hidden after you save them.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <ul className="divide-border divide-y text-sm">
              {envVars.map((variable) => (
                <li key={variable.key} className="flex items-center justify-between gap-3 py-2">
                  <span className="font-mono text-xs font-medium">{variable.key}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-muted-foreground font-mono text-xs">
                      {variable.value}
                    </span>
                    <Badge variant="outline">{variable.scope}</Badge>
                  </span>
                </li>
              ))}
            </ul>
          </Card.Content>
        </Card>
      </Tabs.Content>
    </Tabs>
  );
}
