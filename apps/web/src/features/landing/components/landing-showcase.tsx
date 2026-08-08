import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

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

const supportCards = [
  <PreviewMilestoneForm key="milestone-form" />,
  <PreviewClaimableBalance key="claimable-balance" />,
  <PreviewNotificationPrefs key="notification-prefs" />,
  <PreviewDistributeTrack key="distribute-track" />,
  <PreviewPayoutThreshold key="payout-threshold" />,
  <PreviewNewChat key="new-chat" />,
  <PreviewSavingsTargets key="savings-targets" />,
  <PreviewDividendIncome key="dividend-income" />,
  <PreviewAccountAccess key="account-access" />,
  <PreviewPaymentsNav key="payments-nav" />,
  <PreviewPowerUsage key="power-usage" />,
];

export function LandingShowcase() {
  const t = useTranslations('sections.home.showcase');
  const featuredMeta: string[] = t.raw('featured.meta');

  return (
    <section className="w-full" aria-labelledby="showcase-title">
      <div className="rule-bleed" />
      <div className="flex flex-col gap-3 pt-6 pb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <div className="max-w-xl">
          <p className="section-label">{t('label')}</p>
          <h2
            id="showcase-title"
            className="font-heading text-foreground mt-3 text-[1.375rem] font-semibold tracking-tight md:text-[1.625rem]"
          >
            {t('title')}
          </h2>
          <p className="text-muted-strong mt-2 text-[15px] leading-relaxed">{t('description')}</p>
        </div>
        <Link
          href="/docs/components"
          className="text-muted-foreground hover:text-foreground shrink-0 font-mono text-sm transition-colors"
        >
          {t('cta')} ↗
        </Link>
      </div>

      <div className="border-rule bg-surface-muted/50 flex flex-col gap-8 rounded-lg border border-dashed p-5 sm:p-8 lg:flex-row lg:items-center lg:gap-14">
        <div className="flex flex-col lg:w-[42%] lg:shrink-0">
          <p className="section-label">{t('featured.badge')}</p>
          <h3 className="font-heading text-foreground mt-3 text-xl font-semibold tracking-tight">
            {t('featured.title')}
          </h3>
          <p className="text-muted-strong mt-3 text-[15px] leading-relaxed">
            {t('featured.description')}
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-2">
            {featuredMeta.map((item) => (
              <li
                key={item}
                className="border-rule text-muted-foreground rounded-sm border border-dashed px-2 py-0.5 font-mono text-[11px]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full lg:flex-1">
          <div className="mx-auto max-w-md lg:max-w-none">
            <PreviewContributionHistory />
          </div>
        </div>
      </div>

      <div className="relative mt-8">
        <div className="[zoom:0.72] columns-2 gap-3 [column-fill:balance] sm:[zoom:1] lg:columns-3 lg:gap-5 xl:columns-4">
          {supportCards.map((card) => (
            <div key={card.key} className="mb-3 break-inside-avoid lg:mb-5">
              {card}
            </div>
          ))}
        </div>
        <div
          aria-hidden="true"
          className="from-background pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-linear-to-t to-transparent sm:hidden"
        />
      </div>
    </section>
  );
}
