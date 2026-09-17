import { Frame } from '@repo/ui/components/frame';

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
};

type Column = {
  id: string;
  duration: string;
  direction?: 'reverse';
  cards: (keyof typeof CARDS)[];
};

/**
 * Eight fixed-width columns so the plane is wider than any viewport and the
 * tilt never shows its edge. Four cards each, because one copy of a column has
 * to be taller than the stage or the loop shows a hole (see WallColumn). That
 * is 32 slots for 22 cards, so ten repeat, each in a column far from its twin.
 */
const COLUMNS: Column[] = [
  {
    id: 'one',
    duration: '96s',
    cards: ['ai-composer', 'claimable-balance', 'savings-targets', 'model-routing'],
  },
  {
    id: 'two',
    duration: '122s',
    direction: 'reverse',
    cards: ['agent-run', 'milestone', 'power-usage', 'invite-team'],
  },
  {
    id: 'three',
    duration: '108s',
    cards: ['thinking', 'notification-prefs', 'payments-nav', 'context-window'],
  },
  {
    id: 'four',
    duration: '134s',
    direction: 'reverse',
    cards: ['sources', 'payout-threshold', 'dividend-income', 'prompt-starters'],
  },
  {
    id: 'five',
    duration: '100s',
    cards: ['deploy-review', 'invite-team', 'account-access', 'ai-composer'],
  },
  {
    id: 'six',
    duration: '126s',
    direction: 'reverse',
    cards: ['context-window', 'new-chat', 'distribute-track', 'agent-run'],
  },
  {
    id: 'seven',
    duration: '112s',
    cards: ['prompt-starters', 'contribution', 'api-keys', 'thinking'],
  },
  {
    id: 'eight',
    duration: '140s',
    direction: 'reverse',
    cards: ['sources', 'claimable-balance', 'notification-prefs', 'model-routing'],
  },
];

/**
 * Every card is rendered twice per column and the column travels exactly half
 * its own height, so the second copy lands where the first started and the loop
 * has no seam. Two things follow from that:
 *
 * The spacing lives on each card as a bottom margin rather than a flex gap,
 * because a gap would not apply between the two copies and the seam would jump
 * by one gap on every cycle.
 *
 * The visible band has to sit inside the first copy at every point of the
 * cycle, which means one copy must be taller than the stage. Fewer or shorter
 * cards than that and the column runs out of content mid cycle and shows a
 * hole. That is also why the plane is anchored to the top of the stage and not
 * centred on it.
 */
function WallColumn({ column }: { column: Column }) {
  return (
    <div
      className="preview-column w-60 shrink-0"
      data-direction={column.direction}
      style={{ '--preview-duration': column.duration } as React.CSSProperties}
    >
      {[0, 1].map((copy) =>
        column.cards.map((id, index) => (
          <div key={`${column.id}-${copy}-${index}`} className="mb-3">
            {CARDS[id]}
          </div>
        )),
      )}
    </div>
  );
}

/**
 * The hero wall: a masonry of real component previews, every column drifting on
 * its own. The plane is wider than the stage, and the stage masks its own edges
 * so cards fade in and out instead of getting sliced.
 *
 * It is decoration, so it is inert: no pointer, no focus, nothing for a screen
 * reader.
 */
export function PreviewWall() {
  return (
    <div
      aria-hidden="true"
      inert
      className="preview-stage pointer-events-none relative h-[28rem] overflow-hidden select-none md:h-[38rem] lg:h-[46rem]"
    >
      <div className="preview-plane absolute top-[-2rem] left-1/2 flex -translate-x-1/2 items-start gap-3">
        {COLUMNS.map((column) => (
          <WallColumn key={column.id} column={column} />
        ))}
      </div>
    </div>
  );
}
