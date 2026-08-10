'use client';

import { CodeBlock } from '@/components/mdx/codeblock';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import { Select } from '@repo/ui/components/select';
import { Switch } from '@repo/ui/components/switch';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

type SaveStatus = 'idle' | 'saving' | 'saved';

const toggles = [
  { id: 'auto-deploy', label: 'Auto-deploy on push', hint: 'main branch only', on: true },
  { id: 'preview-urls', label: 'Preview URLs', hint: 'one per pull request', on: true },
  { id: 'notify', label: 'Notify on failure', hint: 'email + webhook', on: false },
];

const code = `'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export function DeploySettings() {
  const [saving, setSaving] = useState(false);

  return (
    <Card>
      <Card.Header compact>
        <Card.Title>Deploy settings</Card.Title>
      </Card.Header>
      <Card.Content compact>
        <Switch defaultChecked aria-label="Auto-deploy on push" />
      </Card.Content>
      <Card.Footer compact>
        <Button loading={saving} onClick={() => setSaving(true)} fullWidth>
          Save changes
        </Button>
      </Card.Footer>
    </Card>
  );
}`;

function DeploySettingsDemo() {
  const t = useTranslations('sections.home.liveDemo');
  const [status, setStatus] = useState<SaveStatus>('idle');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  function handleSave() {
    if (status === 'saving') return;
    setStatus('saving');
    timers.current.push(
      setTimeout(() => setStatus('saved'), 900),
      setTimeout(() => setStatus('idle'), 3200),
    );
  }

  return (
    <Card className="w-full max-w-md">
      <Card.Header compact>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <Card.Title className="text-sm font-semibold">Deploy settings</Card.Title>
            <Card.Description className="text-xs">
              Applies to every environment in this project.
            </Card.Description>
          </div>
          <Badge variant="outline" className="shrink-0 text-[10px]">
            {t('badge')}
          </Badge>
        </div>
      </Card.Header>
      <Card.Content compact className="mt-5 space-y-5">
        <div className="space-y-4">
          {toggles.map((toggle) => (
            <div key={toggle.id} className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-foreground text-xs font-medium">{toggle.label}</div>
                <div className="text-muted-foreground mt-0.5 text-[11px]">{toggle.hint}</div>
              </div>
              <Switch defaultChecked={toggle.on} aria-label={toggle.label} />
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="hero-demo-region" className="text-foreground block text-xs font-medium">
            Build region
          </label>
          <Select id="hero-demo-region" size="sm" defaultValue="sa-east">
            <option value="sa-east">South America — São Paulo</option>
            <option value="us-east">North America — Virginia</option>
            <option value="eu-west">Europe — Dublin</option>
          </Select>
        </div>
      </Card.Content>
      <Card.Footer compact className="mt-5 flex-col items-stretch gap-2">
        <Button size="sm" loading={status === 'saving'} fullWidth onClick={handleSave}>
          {status === 'saved' ? t('saved') : t('save')}
        </Button>
        <p aria-live="polite" className="text-muted-foreground text-center text-[11px]">
          {status === 'saved' ? t('savedHint') : t('idleHint')}
        </p>
      </Card.Footer>
    </Card>
  );
}

/**
 * Same shape as a docs component preview — live component over its source, one
 * frame, one divider — so the hero and the docs read as the same system.
 */
export function HeroLiveDemo() {
  return (
    <div className="border-rule overflow-hidden rounded-md border">
      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16">
        <DeploySettingsDemo />
      </div>
      <div className="border-rule border-t">
        <CodeBlock
          code={code}
          language="tsx"
          showLineNumbers
          collapsible
          className="rounded-none border-0"
        />
      </div>
    </div>
  );
}
