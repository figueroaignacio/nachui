import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function LandingLogoCta() {
  const t = useTranslations('components');

  return (
    <section className="w-full py-16 sm:py-24">
      <div className="mx-auto w-full px-6">
        <div className="bg-rule mb-16 h-px" />
        <div className="max-w-xl">
          <p className="text-muted-foreground mb-4 font-mono text-[11px] tracking-[0.2em] uppercase">
            {t('landingLogoCta.version')}
          </p>
          <p className="text-muted-strong mb-8 text-[17px] leading-relaxed">
            {t('landingLogoCta.line1')} {t('landingLogoCta.line2')}
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/docs"
              className="bg-foreground text-background inline-flex items-center gap-2 rounded-sm px-4 py-2 font-mono text-sm transition-all hover:opacity-80 active:scale-[0.98]"
            >
              {t('landingLogoCta.primaryAction')} →
            </Link>
            <Link
              href="/docs/components"
              className="text-muted-foreground hover:text-foreground font-mono text-sm transition-colors"
            >
              {t('landingLogoCta.secondaryAction')} ↗
            </Link>
          </div>
        </div>
        <div className="bg-rule mt-16 h-px" />
        <p className="text-muted-foreground mt-4 font-mono text-xs">
          {t('landingLogoCta.license')}
        </p>
      </div>
    </section>
  );
}
