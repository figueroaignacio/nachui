import { useTranslations } from 'next-intl';

interface FeatureItem {
  title: string;
  description: string;
}

export function LandingFeatures() {
  const t = useTranslations('sections.home.features');
  const items: FeatureItem[] = t.raw('items');

  return (
    <section className="w-full py-16 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-8">
          <h2 className="text-muted-foreground font-mono text-[11px] tracking-[0.2em] uppercase">
            {t('title')}
          </h2>
          <div className="bg-rule mt-3 h-px" />
        </div>

        {/* Feature rows */}
        <div>
          {items.map((feature, idx) => (
            <div
              key={idx}
              className="border-rule grid grid-cols-[2rem_1fr] gap-4 border-b py-5 last:border-0 sm:grid-cols-[2.5rem_1fr_2fr] sm:gap-8"
            >
              {/* Index */}
              <span className="text-muted-foreground pt-0.5 font-mono text-[11px] tabular-nums select-none">
                {String(idx + 1).padStart(2, '0')}
              </span>

              {/* Title */}
              <div>
                <span className="text-foreground text-[15px] leading-snug font-medium">
                  {feature.title}
                </span>
                {/* Description inline on mobile */}
                <p className="text-muted-foreground mt-1 text-[14px] leading-relaxed sm:hidden">
                  {feature.description}
                </p>
              </div>

              {/* Description — desktop third column */}
              <p className="text-muted-foreground hidden text-[14px] leading-relaxed sm:block">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
