import {
  AiBrain01Icon,
  BookOpen01Icon,
  FlashIcon,
  Layers01Icon,
  PlayIcon,
  SourceCodeIcon,
  UniversalAccessIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Container } from '@repo/ui/layout/container';
import { useTranslations } from 'next-intl';

interface FeatureItem {
  title: string;
  description: string;
}

const icons = [
  AiBrain01Icon,
  UniversalAccessIcon,
  BookOpen01Icon,
  SourceCodeIcon,
  FlashIcon,
  PlayIcon,
  Layers01Icon,
  UniversalAccessIcon,
];

export function LandingFeatures() {
  const t = useTranslations('sections.home.features');
  const items: FeatureItem[] = t.raw('items');

  return (
    <section className="relative z-10 w-full py-16 sm:py-24">
      <Container size="xl">
        {/* Section header */}
        <div className="mb-10 px-4 sm:mb-14 sm:px-0">
          <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            {t('title')} <span className="text-muted-foreground">{t('subtitle')}</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* Feature rows */}
        <div className="divide-border/50 divide-y px-4 sm:px-0">
          {items.map((feature, idx) => {
            const Icon = icons[idx];
            return (
              <div
                key={idx}
                className="grid grid-cols-[2rem_1fr] gap-4 py-4 sm:grid-cols-[2.5rem_1fr_2fr] sm:gap-8 sm:py-5"
              >
                {/* Number */}
                <span className="text-muted-foreground pt-0.5 font-mono text-xs tabular-nums select-none">
                  {String(idx + 1).padStart(2, '0')}
                </span>

                {/* Title + icon */}
                <div className="flex items-start gap-2">
                  {Icon && (
                    <HugeiconsIcon
                      icon={Icon}
                      size={14}
                      className="text-muted-foreground mt-0.5 shrink-0"
                    />
                  )}
                  <div>
                    <span className="text-foreground text-sm font-semibold">{feature.title}</span>
                    {/* Description inline on mobile */}
                    <p className="text-muted-foreground mt-0.5 text-sm leading-relaxed sm:hidden">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Description in third column — desktop only */}
                <p className="text-muted-foreground hidden text-sm leading-relaxed sm:block">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
