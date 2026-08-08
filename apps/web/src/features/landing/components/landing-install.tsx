'use client';

import { CopyButton } from '@/components/mdx/copy-button';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

const command = 'npx nachui add switch';

const output = [
  '◇  Component switch found.',
  '│',
  '◇  Component installed ──────────────────────╮',
  '│  Location: src/components/ui/switch.tsx    │',
  '├────────────────────────────────────────────╯',
  '│',
  '◇  ✓ All dependencies are already present.',
  '│',
  '└  NachUI · Component ready to use!',
];

export function LandingInstall() {
  const t = useTranslations('components.landingLogoCta');

  return (
    <section className="w-full py-16 sm:py-20">
      <div className="rule-bleed" />
      <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
        <div className="flex flex-col lg:w-[40%] lg:shrink-0">
          <p className="section-label">{t('version')}</p>
          <h2 className="font-heading text-foreground mt-3 text-[1.375rem] leading-tight font-semibold tracking-tight md:text-[1.625rem]">
            {t('line1')}
            <span className="text-muted-foreground block">{t('line2')}</span>
          </h2>
          <p className="text-muted-strong mt-4 text-[15px] leading-relaxed">{t('description')}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/docs/installation"
              className="bg-foreground text-background inline-flex items-center gap-2 rounded-md px-4 py-2 font-mono text-sm transition-all hover:opacity-80 active:scale-[0.98]"
            >
              {t('primaryAction')} →
            </Link>
            <Link
              href="/docs/components"
              className="text-muted-foreground hover:text-foreground font-mono text-sm transition-colors"
            >
              {t('secondaryAction')} ↗
            </Link>
          </div>
        </div>

        <div className="min-w-0 lg:flex-1">
          <div className="border-border bg-card/40 overflow-hidden rounded-lg border border-dashed">
            <div className="border-border flex items-center justify-between gap-4 border-b border-dashed px-3 py-2">
              <span className="text-muted-foreground font-mono text-[11px]">{t('terminal')}</span>
              <CopyButton
                value={command}
                className="text-muted-foreground hover:text-foreground transition-colors"
              />
            </div>
            <div className="overflow-x-auto p-4 sm:p-5">
              <pre className="font-mono text-[12px] leading-[1.8]">
                <code>
                  <span className="block">
                    <span className="text-muted-foreground select-none">$ </span>
                    <span className="text-foreground">{command}</span>
                  </span>
                  <span className="block"> </span>
                  {output.map((line, index) => (
                    <span key={index} className="text-muted-strong block whitespace-pre">
                      {line}
                    </span>
                  ))}
                </code>
              </pre>
            </div>
          </div>
          <p className="text-muted-foreground mt-3 font-mono text-[11px] leading-relaxed">
            {t('outputNote')}
          </p>
        </div>
      </div>
      <div className="rule-bleed mt-16" />
      <p className="text-muted-foreground mt-4 font-mono text-xs">{t('license')}</p>
    </section>
  );
}
