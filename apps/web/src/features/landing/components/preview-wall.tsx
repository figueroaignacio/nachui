'use client';

import { Link } from '@/i18n/navigation';
import { Button } from '@repo/ui/components/button';
import { Frame } from '@repo/ui/components/frame';
import { ArrowUpRightIcon } from '@repo/ui/icons/arrow-up-right';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { PreviewAccountAccess } from './preview-cards/preview-account-access';
import { PreviewAgentRun } from './preview-cards/preview-agent-run';
import { PreviewAiComposer } from './preview-cards/preview-ai-composer';
import { PreviewApiKeys } from './preview-cards/preview-api-keys';
import { PreviewClaimableBalance } from './preview-cards/preview-claimable-balance';
import { PreviewContextWindow } from './preview-cards/preview-context-window';
import { PreviewContributionHistory } from './preview-cards/preview-contribution-history';
import { PreviewDeployReview } from './preview-cards/preview-deploy-review';
import { PreviewDistributeTrack } from './preview-cards/preview-distribute-track';
import { PreviewDividendIncome } from './preview-cards/preview-dividend-income';
import { PreviewInviteTeam } from './preview-cards/preview-invite-team';
import {
  PreviewLayoutCenter,
  PreviewLayoutGrid,
  PreviewLayoutSplit,
  PreviewLayoutStack,
} from './preview-cards/preview-layout';
import { PreviewMilestoneForm } from './preview-cards/preview-milestone-form';
import { PreviewModelRouting } from './preview-cards/preview-model-routing';
import { PreviewNewChat } from './preview-cards/preview-new-chat';
import { PreviewNotificationPrefs } from './preview-cards/preview-notification-prefs';
import { PreviewPaymentsNav } from './preview-cards/preview-payments-nav';
import { PreviewPayoutThreshold } from './preview-cards/preview-payout-threshold';
import { PreviewPowerUsage } from './preview-cards/preview-power-usage';
import { PreviewPromptStarters } from './preview-cards/preview-prompt-starters';
import { PreviewSavingsTargets } from './preview-cards/preview-savings-targets';
import { PreviewSources } from './preview-cards/preview-sources';
import { PreviewThinking } from './preview-cards/preview-thinking';

type Category = 'ui' | 'ai' | 'layout';
type Filter = 'all' | Category;

type WallItem = {
  id: string;
  category: Category;
  slug: string;
  card: React.ReactNode;
};

const FILTERS: Filter[] = ['all', 'ui', 'ai', 'layout'];
const CLAMP_AFTER = 12;

function Framed({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Frame>
      <Frame.Header>
        <Frame.Title>{title}</Frame.Title>
        <Frame.Description>{description}</Frame.Description>
      </Frame.Header>
      {children}
    </Frame>
  );
}

const ITEMS: WallItem[] = [
  { id: 'ai-composer', category: 'ai', slug: 'prompt-input', card: <PreviewAiComposer /> },
  { id: 'api-keys', category: 'ui', slug: 'switch', card: <PreviewApiKeys /> },
  { id: 'agent-run', category: 'ai', slug: 'task', card: <PreviewAgentRun /> },
  { id: 'layout-stack', category: 'layout', slug: 'stack', card: <PreviewLayoutStack /> },
  { id: 'invite-team', category: 'ui', slug: 'avatar', card: <PreviewInviteTeam /> },
  { id: 'context-window', category: 'ai', slug: 'context', card: <PreviewContextWindow /> },
  { id: 'power-usage', category: 'ui', slug: 'card', card: <PreviewPowerUsage /> },
  { id: 'layout-grid', category: 'layout', slug: 'grid', card: <PreviewLayoutGrid /> },
  { id: 'thinking', category: 'ai', slug: 'chain-of-thought', card: <PreviewThinking /> },
  { id: 'payout-threshold', category: 'ui', slug: 'progress', card: <PreviewPayoutThreshold /> },
  {
    id: 'notification-prefs',
    category: 'ui',
    slug: 'checkbox',
    card: <PreviewNotificationPrefs />,
  },
  {
    id: 'milestone',
    category: 'ui',
    slug: 'frame',
    card: (
      <Framed title="Goals" description="Savings plan for the acme team.">
        <PreviewMilestoneForm />
      </Framed>
    ),
  },
  { id: 'prompt-starters', category: 'ai', slug: 'suggestion', card: <PreviewPromptStarters /> },
  { id: 'layout-split', category: 'layout', slug: 'split', card: <PreviewLayoutSplit /> },
  { id: 'deploy-review', category: 'ui', slug: 'badge', card: <PreviewDeployReview /> },
  { id: 'model-routing', category: 'ui', slug: 'select', card: <PreviewModelRouting /> },
  { id: 'sources', category: 'ai', slug: 'attachments', card: <PreviewSources /> },
  {
    id: 'claimable-balance',
    category: 'ui',
    slug: 'separator',
    card: <PreviewClaimableBalance />,
  },
  { id: 'layout-center', category: 'layout', slug: 'center', card: <PreviewLayoutCenter /> },
  { id: 'new-chat', category: 'ui', slug: 'kbd', card: <PreviewNewChat /> },
  { id: 'dividend-income', category: 'ui', slug: 'card', card: <PreviewDividendIncome /> },
  { id: 'payments-nav', category: 'ui', slug: 'breadcrumb', card: <PreviewPaymentsNav /> },
  {
    id: 'account-access',
    category: 'ui',
    slug: 'input',
    card: (
      <Framed title="Security" description="Credentials and sessions.">
        <PreviewAccountAccess />
      </Framed>
    ),
  },
  { id: 'savings-targets', category: 'ui', slug: 'progress', card: <PreviewSavingsTargets /> },
  { id: 'distribute-track', category: 'ui', slug: 'empty', card: <PreviewDistributeTrack /> },
  {
    id: 'contribution',
    category: 'ui',
    slug: 'frame',
    card: (
      <Framed title="Activity" description="Contributions, last six months.">
        <PreviewContributionHistory />
      </Framed>
    ),
  },
];

function WallCard({ item, openLabel }: { item: WallItem; openLabel: string }) {
  const path = `${item.category}/${item.slug}`;

  return (
    <div className="group relative mb-4 break-inside-avoid">
      <div
        aria-hidden="true"
        inert
        className="pointer-events-none transition-transform duration-300 ease-out select-none group-hover:-translate-y-1 max-md:[zoom:0.72]"
      >
        {item.card}
      </div>
      <div className="text-muted-foreground group-hover:text-brand mt-2 flex items-center justify-between font-mono text-[10px] transition-colors md:text-[11px]">
        <span>{path}</span>
        <ArrowUpRightIcon
          size={12}
          aria-hidden="true"
          className="opacity-0 transition-opacity group-hover:opacity-100"
        />
      </div>
      <Link
        href={`/docs/elements/${path}`}
        aria-label={`${openLabel} ${path}`}
        className="focus-visible:ring-ring absolute inset-0 rounded-xl focus-visible:ring-2 focus-visible:outline-none"
      />
    </div>
  );
}

export function PreviewWall() {
  const t = useTranslations('sections.home.wall');
  const [filter, setFilter] = useState<Filter>('all');
  const items = filter === 'all' ? ITEMS : ITEMS.filter((item) => item.category === filter);
  const clamped = items.length > CLAMP_AFTER;

  return (
    <section className="w-full pb-10 md:pb-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
        <div>
          <p className="text-muted-foreground font-mono text-xs">
            <span className="text-muted-foreground/60">./</span>
            {t('label')}
          </p>
          <h2 className="font-heading text-foreground mt-3 text-[clamp(2.5rem,11vw,4.5rem)] leading-[0.84] font-black tracking-[-0.07em] uppercase md:mt-4">
            <span className="block">{t('title1')}</span>
            <span className="text-muted-foreground/60 block">{t('title2')}</span>
          </h2>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          <Button.Group attached aria-label={t('filterLabel')} className="w-full md:w-auto">
            {FILTERS.map((id) => (
              <Button
                key={id}
                size="sm"
                variant={filter === id ? 'default' : 'outline'}
                aria-pressed={filter === id}
                onClick={() => setFilter(id)}
                className="h-9 flex-1 font-mono md:flex-none md:px-4"
              >
                {t(`filters.${id}`)}
              </Button>
            ))}
          </Button.Group>
          <Link
            href="/docs/elements/ui"
            className="text-muted-foreground hover:text-foreground hidden items-center gap-1.5 font-mono text-xs transition-colors md:flex"
          >
            {t('browse')}
            <ArrowUpRightIcon size={13} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div
        className={cn(
          'mt-8 md:mt-10',
          clamped && 'preview-fade max-h-[46rem] overflow-hidden md:max-h-[56rem]',
        )}
      >
        <div className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4 xl:columns-5">
          {items.map((item) => (
            <WallCard key={item.id} item={item} openLabel={t('open')} />
          ))}
        </div>
      </div>

      <Link
        href="/docs/elements/ui"
        className="border-border text-foreground mt-6 flex h-12 items-center justify-center gap-2 rounded-[10px] border font-mono text-[13px] md:hidden"
      >
        {t('browse')}
        <ArrowUpRightIcon size={13} aria-hidden="true" />
      </Link>
    </section>
  );
}
