'use client';

import { CopyButton } from '@/components/mdx/copy-button';
import { Link } from '@/i18n/navigation';
import { ArrowRightIcon } from '@repo/ui/icons/arrow-right';
import { useTranslations } from 'next-intl';
import { HeroSpecimens } from './hero-specimens';
import { PreviewWall } from './preview-wall';

const INSTALL_COMMAND = 'pnpm dlx nachui add button';

interface HomePageActions {
  href: string;
  label: string;
  description: string;
  variant?: 'default' | 'secondary';
}

export function LandingHero() {
  const t = useTranslations('sections.home');
  const actions: HomePageActions[] = t.raw('actions');
  const primary = actions[0];

  return (
    <>
      <section className="flex min-h-[calc(100svh-5rem)] w-full flex-col">
        <div className="flex flex-1 flex-col items-center justify-center py-16 text-center md:py-20">
          <p className="border-border text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[11px] md:text-xs">
            <span aria-hidden="true" className="bg-brand size-1.5" />
            {t('badge')}
          </p>

          <h1 className="font-heading text-foreground mt-7 text-[clamp(4rem,22vw,12.25rem)] leading-[0.8] font-black tracking-[-0.075em] uppercase md:mt-8">
            <span className="sr-only">{t('subheading1')}</span>
            <span aria-hidden="true" className="block">
              {t('headline1')}
            </span>
            <span aria-hidden="true" className="block">
              {t('headline2')}
              <span className="bg-brand ml-[0.05em] inline-block size-[0.16em]" />
            </span>
          </h1>

          <p className="text-muted-strong mt-7 max-w-[56ch] text-[15px] leading-relaxed md:mt-9 md:text-[17px]">
            {t('description')}
          </p>

          <div className="mt-8 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:items-center sm:gap-3 md:mt-9">
            <div className="border-border flex h-12 items-center justify-between gap-6 rounded-[10px] border pr-1.5 pl-4 font-mono text-[13px] md:text-sm">
              <code>
                <span className="text-brand">$</span> {INSTALL_COMMAND}
              </code>
              <span className="flex size-10 items-center justify-center">
                <CopyButton value={INSTALL_COMMAND} />
              </span>
            </div>
            <Link
              href={primary?.href ?? '/docs'}
              className="bg-foreground text-background hover:bg-foreground/90 inline-flex h-12 items-center justify-center gap-2.5 rounded-[10px] px-5 font-mono text-sm font-semibold transition-colors"
            >
              {primary?.label ?? 'Get started'}
              <ArrowRightIcon size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <HeroSpecimens />
      </section>

      <div className="mt-14 w-full md:mt-20">
        <PreviewWall />
      </div>
    </>
  );
}
