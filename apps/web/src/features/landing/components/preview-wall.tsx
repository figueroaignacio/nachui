import { useTranslations } from 'next-intl';

import { HeroActions } from './hero-actions';
import { PreviewAiComposer } from './preview-cards/preview-ai-composer';
import { PreviewCheckpoints } from './preview-cards/preview-checkpoints';
import { PreviewContributionHistory } from './preview-cards/preview-contribution-history';
import { PreviewDateRange } from './preview-cards/preview-date-range';
import { PreviewInviteTeam } from './preview-cards/preview-invite-team';
import { PreviewKitchenSink } from './preview-cards/preview-kitchen-sink';
import { PreviewModelPicker } from './preview-cards/preview-model-picker';
import { PreviewNotificationPrefs } from './preview-cards/preview-notification-prefs';
import { PreviewPaymentsNav } from './preview-cards/preview-payments-nav';
import { PreviewPayoutThreshold } from './preview-cards/preview-payout-threshold';
import { PreviewThinking } from './preview-cards/preview-thinking';
import { PreviewToolApproval } from './preview-cards/preview-tool-approval';
import { PreviewVerifyEmail } from './preview-cards/preview-verify-email';

const COLUMNS = [
  [
    <PreviewKitchenSink key="kitchen-sink" />,
    <PreviewPaymentsNav key="payments-nav" />,
    <PreviewInviteTeam key="invite-team" />,
  ],
  [
    <PreviewContributionHistory key="contribution" />,
    <PreviewToolApproval key="tool-approval" />,
    <PreviewDateRange key="date-range" />,
  ],
  [
    <PreviewPayoutThreshold key="payout-threshold" />,
    <PreviewModelPicker key="model-picker" />,
    <PreviewCheckpoints key="checkpoints" />,
  ],
  [
    <PreviewAiComposer key="ai-composer" />,
    <PreviewNotificationPrefs key="notification-prefs" />,
    <PreviewVerifyEmail key="verify-email" />,
    <PreviewThinking key="thinking" />,
  ],
];

/**
 * A flat wall of real components under the hero. Desktop shows it at full size;
 * smaller screens keep the desktop layout and scale it down, so the columns run
 * off the right edge. It is a showcase, so the whole thing is inert.
 */
export function PreviewWall() {
  const t = useTranslations('sections.home');

  return (
    <div className="bleed-x relative mt-12 overflow-hidden md:mt-16">
      <div
        aria-hidden="true"
        inert
        className="preview-stage pointer-events-none relative h-[30rem] select-none sm:h-[40rem] lg:h-[58rem]"
      >
        <div className="preview-grid grid grid-cols-4 items-start gap-4">
          {COLUMNS.map((cards, column) => (
            <div key={column} className="flex min-w-0 flex-col gap-4">
              {cards}
            </div>
          ))}
        </div>
      </div>
      <div className="relative -mt-14 pb-2">
        <HeroActions
          actions={[{ href: '/docs/elements/ui', label: t('wallCta'), variant: 'outline' }]}
        />
      </div>
    </div>
  );
}
