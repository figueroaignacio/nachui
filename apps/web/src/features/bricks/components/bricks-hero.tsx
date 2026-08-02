import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { BRICK_CATEGORIES } from '../lib/bricks-registry';

interface BricksHeroProps {
  activeSlug?: string;
}

export function BricksHero({ activeSlug }: BricksHeroProps) {
  const t = useTranslations('sections.bricks');

  return (
    <section className="bg-background relative pt-16 pb-0 sm:pt-24">
      <div className="max-w-2xl pb-10">
        <h1 className="font-heading text-foreground text-[2rem] leading-[1.1] font-semibold tracking-tight md:text-[2.75rem]">
          {t('title')}
        </h1>
        <p className="text-muted-strong mt-4 text-[15px] leading-relaxed">{t('description')}</p>
      </div>

      <nav aria-label="Brick categories" className="border-border border-b">
        <div className="flex items-center justify-between">
          <div className="hide-scrollbar flex items-center gap-0 overflow-x-auto">
            {BRICK_CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/bricks/${category.slug}`}
                aria-current={activeSlug === category.slug ? 'page' : undefined}
                className={
                  activeSlug === category.slug
                    ? 'border-foreground text-foreground -mb-px border-b-2 px-4 pb-3 font-mono text-[13px] font-medium whitespace-nowrap'
                    : 'text-muted-foreground hover:text-foreground px-4 pb-3 font-mono text-[13px] whitespace-nowrap transition-colors'
                }
              >
                {category.name}
              </Link>
            ))}
          </div>

          <Link
            href="/bricks/login"
            className="text-muted-foreground hover:text-foreground hidden pb-3 font-mono text-[13px] whitespace-nowrap transition-colors sm:block"
          >
            Browse all →
          </Link>
        </div>
      </nav>
    </section>
  );
}
