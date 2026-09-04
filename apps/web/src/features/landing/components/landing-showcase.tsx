import { Link } from '@/i18n/navigation';
import { Badge } from '@repo/ui/components/badge';
import { useTranslations } from 'next-intl';

import { PreviewContributionHistory } from './preview-cards/preview-contribution-history';

export function LandingShowcase() {
  const t = useTranslations('sections.home.showcase');
  const featuredMeta: string[] = t.raw('featured.meta');

  return (
    <section className="w-full" aria-labelledby="showcase-title">
      <div className="scroll-reveal flex flex-col gap-3 pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <div className="max-w-xl">
          <p className="section-label">{t('label')}</p>
          <h2
            id="showcase-title"
            className="font-heading text-foreground mt-3 text-lg font-semibold tracking-tight md:text-xl"
          >
            {t('title')}
          </h2>
          <p className="text-muted-strong mt-2 text-sm leading-relaxed">{t('description')}</p>
        </div>
        <Link
          href="/docs/elements/ui"
          className="text-muted-foreground hover:text-foreground shrink-0 font-mono text-sm transition-colors"
        >
          {t('cta')} ↗
        </Link>
      </div>

      <div className="scroll-reveal bg-surface-muted flex flex-col gap-6 rounded-xl p-4 sm:p-6 lg:flex-row lg:items-center lg:gap-10">
        <div className="flex flex-col lg:w-[42%] lg:shrink-0">
          <p className="section-label">{t('featured.badge')}</p>
          <h3 className="font-heading text-foreground mt-3 text-xl font-semibold tracking-tight">
            {t('featured.title')}
          </h3>
          <p className="text-muted-strong mt-2 text-sm leading-relaxed">
            {t('featured.description')}
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-2">
            {featuredMeta.map((item) => (
              <li key={item}>
                <Badge
                  variant="outline"
                  className="border-rule text-muted-foreground font-mono font-normal tracking-normal"
                >
                  {item}
                </Badge>
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
