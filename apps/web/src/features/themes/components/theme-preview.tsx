import { useId, useState } from 'react';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { Callout } from '@repo/ui/components/callout';
import { Card } from '@repo/ui/components/card';
import { Checkbox } from '@repo/ui/components/checkbox';
import { Input } from '@repo/ui/components/input';
import { Kbd } from '@repo/ui/components/kbd';
import { Progress } from '@repo/ui/components/progress';
import { Radio } from '@repo/ui/components/radio';
import { Slider } from '@repo/ui/components/slider';
import { Switch } from '@repo/ui/components/switch';
import { Tabs } from '@repo/ui/components/tabs';
import { ToggleGroup } from '@repo/ui/components/toggle-group';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';

import type { ThemeMode } from '../lib/customize';
import { modeVariables, type ThemeTokens } from '../lib/tokens';

const MODES: ThemeMode[] = ['light', 'dark'];

function ProfileCard({ mode }: { mode: ThemeMode }) {
  const t = useTranslations('sections.themes.preview.sample.profile');
  const lightFieldFix = mode === 'light' ? 'dark:bg-transparent' : undefined;

  return (
    <Card>
      <Card.Header>
        <Card.Title>{t('title')}</Card.Title>
        <Card.Description>{t('description')}</Card.Description>
      </Card.Header>
      <Card.Content className="flex flex-col gap-4">
        <Input label={t('name')} defaultValue={t('nameValue')} className={lightFieldFix} />
        <Input
          label={t('email')}
          type="email"
          defaultValue={t('emailValue')}
          error={t('emailError')}
          aria-invalid
          className={lightFieldFix}
        />
      </Card.Content>
      <Card.Footer align="end" className="gap-2">
        <Button variant="ghost" size="sm">
          {t('cancel')}
        </Button>
        <Button size="sm">{t('save')}</Button>
      </Card.Footer>
    </Card>
  );
}

function NotificationsCard() {
  const t = useTranslations('sections.themes.preview.sample.notifications');
  const id = useId();

  return (
    <Card>
      <Card.Header>
        <Card.Title>{t('title')}</Card.Title>
      </Card.Header>
      <Card.Content className="flex flex-col gap-4 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span id={`${id}-updates`}>{t('updates')}</span>
          <Switch aria-labelledby={`${id}-updates`} defaultChecked />
        </div>
        <div className="flex items-center justify-between gap-4">
          <span id={`${id}-digest`}>{t('digest')}</span>
          <Switch aria-labelledby={`${id}-digest`} />
        </div>
        <label className="flex items-center gap-2.5">
          <Checkbox defaultChecked />
          {t('mentions')}
        </label>
        <fieldset className="flex flex-col gap-2.5">
          <legend className="text-muted-foreground mb-2.5 text-xs">{t('frequency')}</legend>
          <label className="flex items-center gap-2.5">
            <Radio name={`${id}-frequency`} value="instant" defaultChecked />
            {t('instant')}
          </label>
          <label className="flex items-center gap-2.5">
            <Radio name={`${id}-frequency`} value="daily" />
            {t('daily')}
          </label>
        </fieldset>
      </Card.Content>
    </Card>
  );
}

function UsageCard() {
  const t = useTranslations('sections.themes.preview.sample.usage');
  const limitId = useId();
  const [limit, setLimit] = useState([40]);

  return (
    <Card>
      <Card.Header>
        <Card.Title>{t('title')}</Card.Title>
      </Card.Header>
      <Card.Content className="flex flex-col gap-5 text-sm">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <span>{t('storage')}</span>
            <span className="text-muted-foreground text-xs tabular-nums">{t('storageValue')}</span>
          </div>
          <Progress value={64} label={t('storage')} />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <span id={limitId}>{t('limit')}</span>
            <span className="text-muted-foreground text-xs tabular-nums">{limit[0]} h</span>
          </div>
          <Slider value={limit} onValueChange={setLimit} max={100}>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb aria-labelledby={limitId} />
          </Slider>
        </div>
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          required
          defaultValue="week"
          aria-label={t('range')}
        >
          <ToggleGroup.Item value="day" className="flex-1">
            {t('day')}
          </ToggleGroup.Item>
          <ToggleGroup.Item value="week" className="flex-1">
            {t('week')}
          </ToggleGroup.Item>
          <ToggleGroup.Item value="month" className="flex-1">
            {t('month')}
          </ToggleGroup.Item>
        </ToggleGroup>
      </Card.Content>
    </Card>
  );
}

function MenuSurface() {
  const t = useTranslations('sections.themes.preview.sample.menu');
  const items = [
    { label: t('rename'), keys: 'R' },
    { label: t('duplicate'), keys: 'D' },
  ];

  return (
    <div aria-hidden="true" className="flex flex-col gap-2">
      <span className="text-muted-foreground text-xs">{t('label')}</span>
      <div className="bg-popover text-popover-foreground border-border w-full rounded-md border p-1 text-sm shadow-md">
        {items.map((item, index) => (
          <div
            key={item.label}
            className={cn(
              'flex items-center justify-between gap-2 rounded-sm px-2 py-1.5',
              index === 0 && 'bg-muted',
            )}
          >
            {item.label}
            <Kbd size="sm">{item.keys}</Kbd>
          </div>
        ))}
        <div className="bg-border -mx-1 my-1 h-px" />
        <div className="text-destructive-text flex items-center rounded-sm px-2 py-1.5">
          {t('delete')}
        </div>
      </div>
    </div>
  );
}

interface ThemePreviewProps {
  theme: ThemeTokens;
  label: string;
  mode: ThemeMode;
  onModeChange: (mode: ThemeMode) => void;
}

export function ThemePreview({ theme, label, mode, onModeChange }: ThemePreviewProps) {
  const t = useTranslations('sections.themes.preview');
  const tSample = useTranslations('sections.themes.preview.sample');

  return (
    <section aria-labelledby="themes-preview" className="flex min-w-0 flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 id="themes-preview" className="section-label">
          {t('heading')}
        </h2>
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          required
          value={mode}
          onValueChange={(value) => onModeChange(value === 'dark' ? 'dark' : 'light')}
          aria-label={t('mode')}
        >
          {MODES.map((option) => (
            <ToggleGroup.Item key={option} value={option} className="px-3">
              {t(option)}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup>
      </div>

      <div
        role="region"
        aria-label={t('regionLabel', { name: label })}
        data-theme-preview={mode}
        className={cn(
          mode === 'dark' && 'dark',
          'bg-background text-foreground border-border overflow-hidden rounded-lg border p-4 sm:p-6',
        )}
        style={{ ...modeVariables(theme, mode), colorScheme: mode }}
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <p className="font-heading text-lg font-semibold tracking-tight">{tSample('title')}</p>
            <p className="text-muted-foreground text-sm">{tSample('description')}</p>
          </div>

          <Tabs defaultValue="general" variant="underline" size="sm">
            <Tabs.List>
              <Tabs.Trigger value="general">{tSample('tabs.general')}</Tabs.Trigger>
              <Tabs.Trigger value="members">{tSample('tabs.members')}</Tabs.Trigger>
              <Tabs.Trigger value="billing">{tSample('tabs.billing')}</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="general" className="text-muted-strong pt-3 text-sm">
              {tSample('tabs.generalBody')}
            </Tabs.Content>
            <Tabs.Content value="members" className="text-muted-strong pt-3 text-sm">
              {tSample('tabs.membersBody')}
            </Tabs.Content>
            <Tabs.Content value="billing" className="text-muted-strong pt-3 text-sm">
              {tSample('tabs.billingBody')}
            </Tabs.Content>
          </Tabs>

          <div className="flex flex-wrap gap-2">
            <Button>{tSample('buttons.primary')}</Button>
            <Button variant="secondary">{tSample('buttons.secondary')}</Button>
            <Button variant="outline">{tSample('buttons.outline')}</Button>
            <Button variant="ghost">{tSample('buttons.ghost')}</Button>
            <Button variant="destructive">{tSample('buttons.destructive')}</Button>
            <Button variant="link">{tSample('buttons.link')}</Button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <Badge>{tSample('badges.live')}</Badge>
            <Badge variant="secondary">{tSample('badges.draft')}</Badge>
            <Badge variant="outline">{tSample('badges.archived')}</Badge>
            <Badge variant="success">{tSample('badges.passing')}</Badge>
            <Badge variant="warning">{tSample('badges.pending')}</Badge>
            <Badge variant="destructive">{tSample('badges.failed')}</Badge>
            <Badge variant="info">{tSample('badges.beta')}</Badge>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <ProfileCard mode={mode} />
            <NotificationsCard />
            <UsageCard />
            <div className="flex flex-col gap-4">
              <Callout variant="info">
                <Callout.Title>{tSample('callouts.infoTitle')}</Callout.Title>
                <Callout.Content>{tSample('callouts.info')}</Callout.Content>
              </Callout>
              <Callout variant="success">
                <Callout.Title>{tSample('callouts.successTitle')}</Callout.Title>
                <Callout.Content>{tSample('callouts.success')}</Callout.Content>
              </Callout>
              <Callout variant="warning">
                <Callout.Title>{tSample('callouts.warningTitle')}</Callout.Title>
                <Callout.Content>{tSample('callouts.warning')}</Callout.Content>
              </Callout>
              <Callout variant="danger">
                <Callout.Title>{tSample('callouts.dangerTitle')}</Callout.Title>
                <Callout.Content>{tSample('callouts.danger')}</Callout.Content>
              </Callout>
              <MenuSurface />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
