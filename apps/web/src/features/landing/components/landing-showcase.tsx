import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

import { PreviewContributionHistory } from './preview-cards/preview-contribution-history';

export function LandingShowcase() {
  const t = useTranslations('sections.home.showcase');
  const featuredMeta: string[] = t.raw('featured.meta');

  return (
    <section className="w-full pb-10" aria-labelledby="showcase-title">
      <div className="rule-bleed rule-draw" />
      <div className="scroll-reveal flex flex-col gap-3 pt-6 pb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
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
          href="/docs/elements/ui"
          className="text-muted-foreground hover:text-foreground shrink-0 font-mono text-sm transition-colors"
        >
          {t('cta')} ↗
        </Link>
      </div>

      <div className="scroll-reveal border-rule bg-surface-muted/50 flex flex-col gap-8 rounded-lg border p-5 sm:p-8 lg:flex-row lg:items-center lg:gap-14">
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
                className="border-rule text-muted-foreground rounded-sm border px-2 py-0.5 font-mono text-[11px]"
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
    </section>
  );
}
