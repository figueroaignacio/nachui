'use client';

import { Frame } from '@repo/ui/components/frame';

import type { WallDensity } from './preview-wall';
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

/**
 * Every preview once, by id, so a column can name a card and the two columns
 * that repeat one stay far apart on the wall.
 */
const CARDS: Record<string, React.ReactNode> = {
  'ai-composer': <PreviewAiComposer />,
  'agent-run': <PreviewAgentRun />,
  thinking: <PreviewThinking />,
  'context-window': <PreviewContextWindow />,
  'prompt-starters': <PreviewPromptStarters />,
  sources: <PreviewSources />,
  'deploy-review': <PreviewDeployReview />,
  'invite-team': <PreviewInviteTeam />,
  'api-keys': <PreviewApiKeys />,
  'model-routing': <PreviewModelRouting />,
  'claimable-balance': <PreviewClaimableBalance />,
  'savings-targets': <PreviewSavingsTargets />,
  'power-usage': <PreviewPowerUsage />,
  'notification-prefs': <PreviewNotificationPrefs />,
  'payments-nav': <PreviewPaymentsNav />,
  'payout-threshold': <PreviewPayoutThreshold />,
  'dividend-income': <PreviewDividendIncome />,
  'new-chat': <PreviewNewChat />,
  'distribute-track': <PreviewDistributeTrack />,
  milestone: (
    <Framed title="Goals" description="Savings plan for the acme team.">
      <PreviewMilestoneForm />
    </Framed>
  ),
  'account-access': (
    <Framed title="Security" description="Credentials and sessions.">
      <PreviewAccountAccess />
    </Framed>
  ),
  contribution: (
    <Framed title="Activity" description="Contributions, last six months.">
      <PreviewContributionHistory />
    </Framed>
  ),
  'layout-stack': <PreviewLayoutStack />,
  'layout-grid': <PreviewLayoutGrid />,
  'layout-split': <PreviewLayoutSplit />,
  'layout-center': <PreviewLayoutCenter />,
};

type CardId = keyof typeof CARDS;

const CARD_IDS = Object.keys(CARDS) as CardId[];

function cardsOf(column: number, cards: number) {
  return Array.from(
    { length: cards },
    (_, row) => CARD_IDS[(column * 5 + row * 7) % CARD_IDS.length] as CardId,
  );
}

export function PreviewPlane({ density }: { density: WallDensity }) {
  return Array.from({ length: density.columns }, (_, column) => (
    <div key={column} className="flex w-60 shrink-0 flex-col gap-3">
      {cardsOf(column, density.cards).map((id, row) => (
        <div key={row}>{CARDS[id]}</div>
      ))}
    </div>
  ));
}
