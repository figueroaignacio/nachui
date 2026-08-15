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
  <PreviewMilestoneForm key="milestone-form" />,
  <PreviewClaimableBalance key="claimable-balance" />,
  <PreviewNotificationPrefs key="notification-prefs" />,
  <PreviewContributionHistory key="contribution-history" />,
  <PreviewDistributeTrack key="distribute-track" />,
  <PreviewPayoutThreshold key="payout-threshold" />,
  <PreviewNewChat key="new-chat" />,
  <PreviewSavingsTargets key="savings-targets" />,
  <PreviewDividendIncome key="dividend-income" />,
  <PreviewAccountAccess key="account-access" />,
  <PreviewPaymentsNav key="payments-nav" />,
  <PreviewPowerUsage key="power-usage" />,
];

/**
 * Masonry of real component previews, clipped behind a bottom fade so the hero
 * stays a fixed height regardless of how the columns balance.
 */
export function PreviewMasonry() {
  return (
    <div aria-hidden="true" className="relative max-h-[34rem] overflow-hidden lg:max-h-[40rem]">
      <div className="scroll-parallax [zoom:0.72] columns-2 gap-3 [column-fill:balance] sm:[zoom:1] lg:columns-3 lg:gap-5 xl:columns-4">
        {cards.map((card) => (
          <div key={card.key} className="mb-3 break-inside-avoid lg:mb-5">
            {card}
          </div>
        ))}
      </div>
      <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 z-10 h-48 bg-linear-to-t to-transparent" />
    </div>
  );
}
