import { PreviewAccountAccess } from './preview-cards/preview-account-access';
import { PreviewClaimableBalance } from './preview-cards/preview-claimable-balance';
import { PreviewContributionHistory } from './preview-cards/preview-contribution-history';
import { PreviewDistributeTrack } from './preview-cards/preview-distribute-track';
import { PreviewDividendIncome } from './preview-cards/preview-dividend-income';
import { PreviewMilestoneForm } from './preview-cards/preview-milestone-form';
import { PreviewNewChat } from './preview-cards/preview-new-chat';
import { PreviewNotificationPrefs } from './preview-cards/preview-notification-prefs';
import { PreviewPaymentsNav } from './preview-cards/preview-payments-nav';
import { PreviewPayoutThreshold } from './preview-cards/preview-payout-threshold';
import { PreviewPowerUsage } from './preview-cards/preview-power-usage';
import { PreviewSavingsTargets } from './preview-cards/preview-savings-targets';

const cards = [
  <PreviewContributionHistory key="contribution-history" />,
  <PreviewMilestoneForm key="milestone-form" />,
  <PreviewDistributeTrack key="distribute-track" />,
  <PreviewNotificationPrefs key="notification-prefs" />,
  <PreviewClaimableBalance key="claimable-balance" />,
  <PreviewPayoutThreshold key="payout-threshold" />,
  <PreviewNewChat key="new-chat" />,
  <PreviewSavingsTargets key="savings-targets" />,
  <PreviewDividendIncome key="dividend-income" />,
  <PreviewAccountAccess key="account-access" />,
  <PreviewPaymentsNav key="payments-nav" />,
  <PreviewPowerUsage key="power-usage" />,
];

export function HeroComponentPreview() {
  return (
    <div className="relative w-full overflow-hidden" aria-label="Component showcase">
      <div className="columns-2 gap-3 [column-fill:balance] sm:columns-2 lg:columns-3 lg:gap-5 xl:columns-4">
        {cards.map((card) => (
          <div key={card.key} className="mb-4 break-inside-avoid">
            {card}
          </div>
        ))}
      </div>
    </div>
  );
}
