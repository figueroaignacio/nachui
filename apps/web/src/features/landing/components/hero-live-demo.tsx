'use client';

import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import { Select } from '@repo/ui/components/select';
import { Switch } from '@repo/ui/components/switch';
import { Tabs } from '@repo/ui/components/tabs';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

type SaveStatus = 'idle' | 'saving' | 'saved';

const toggles = [
  { id: 'auto-deploy', label: 'Auto-deploy on push', hint: 'main branch only', on: true },
  { id: 'preview-urls', label: 'Preview URLs', hint: 'one per pull request', on: true },
  { id: 'notify', label: 'Notify on failure', hint: 'email + webhook', on: false },
];

const code = `import { useState } from 'react';

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
        <Switch defaultChecked aria-label="Auto-deploy" />
      </Card.Content>
      <Card.Footer compact>
        <Button loading={saving} fullWidth>
          Save changes
        </Button>
      </Card.Footer>
    </Card>
  );
}`;

const syntax = /(<\/?[A-Z][\w.]*|\b(?:import|from|export|function|return|const)\b|'[^']*')/g;

function highlight(line: string) {
  return line.split(syntax).map((part, index) => {
    if (!part) return null;
    const isTag = /^<\/?[A-Z]/.test(part);

    return (
      <span key={index} className={isTag ? 'text-foreground' : undefined}>
        {part}
      </span>
    );
  });
}

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
    <Card className="shadow-lg">
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

export function HeroLiveDemo() {
  const t = useTranslations('sections.home.liveDemo');

  return (
    <Tabs
      defaultValue="preview"
      variant="ghost"
      className="border-border bg-card/40 overflow-hidden rounded-lg border border-dashed backdrop-blur-sm"
    >
      <div className="border-border flex items-center justify-between gap-4 border-b border-dashed px-3 py-2">
        <span className="text-muted-foreground truncate font-mono text-[11px]">
          deploy-settings.tsx
        </span>
        <Tabs.List variant="ghost" className="w-auto shrink-0" size="sm">
          <Tabs.Trigger value="preview" size="sm" className="px-2.5 py-1">
            {t('preview')}
          </Tabs.Trigger>
          <Tabs.Trigger value="code" size="sm" className="px-2.5 py-1">
            {t('code')}
          </Tabs.Trigger>
        </Tabs.List>
      </div>
      <Tabs.Content value="preview" className="mt-0 p-4 sm:p-5">
        <div className="min-h-[26rem]">
          <DeploySettingsDemo />
        </div>
      </Tabs.Content>
      <Tabs.Content value="code" className="mt-0">
        <div className="min-h-[26rem] overflow-x-auto p-4 sm:p-5">
          <pre className="text-muted-strong font-mono text-[12px] leading-[1.7]">
            <code>
              {code.split('\n').map((line, index) => (
                <span key={index} className="block">
                  {line ? highlight(line) : ' '}
                </span>
              ))}
            </code>
          </pre>
        </div>
      </Tabs.Content>
    </Tabs>
  );
}
