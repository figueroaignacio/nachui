import { useTranslations } from 'next-intl';

import { Annotation } from './annotation';

/**
 * The hero masonry's margin notes. Purely decorative.
 */
export function HeroAnnotations() {
  const t = useTranslations('sections.home');
  const labels: string[] = t.raw('annotations');

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
      <Annotation
        label={labels[0] ?? ''}
        arrow="down-right"
        className="-top-10 left-[4%] -rotate-6"
      />
      <Annotation
        label={labels[1] ?? ''}
        arrow="down-left"
        className="-top-10 right-[5%] rotate-3"
      />
      <Annotation
        label={labels[2] ?? ''}
        arrow="up-right"
        className="bottom-8 left-[3%] -rotate-3"
      />
    </div>
  );
}
