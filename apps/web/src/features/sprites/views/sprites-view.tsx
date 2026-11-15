import { Link } from '@/i18n/navigation';
import { Sprite } from '@repo/ui/components/sprite';
import { Separator } from '@repo/ui/components/separator';
import { getTranslations } from 'next-intl/server';
import { CAST } from '../lib/cast';

export async function SpritesView() {
  const t = await getTranslations('sections.sprites');

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-muted-foreground mb-1 font-mono text-xs">{t('eyebrow')}</p>
        <h1 className="font-heading text-foreground text-3xl leading-[1.1] font-light tracking-[-0.03em] lg:text-4xl">
          {t('title')}
        </h1>
        <p className="text-muted-strong mt-3 max-w-xl text-lg leading-relaxed md:text-xl">
          {t('subtitle')}
        </p>

        <Separator className="my-10" />

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CAST.map((member) => (
            <li key={member.id}>
              <Link
                href={`/sprites/${member.id}`}
                className="border-border bg-card hover:border-border-interactive focus-visible:ring-ring block overflow-hidden rounded-lg border transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <span className="bg-surface-muted border-border flex h-28 items-end justify-center border-b pb-4">
                  <Sprite seed={member.seed} parts={member.parts} size={72} />
                </span>
                <span className="block px-3 py-3">
                  <span className="block text-sm font-medium">{t(`cast.${member.id}.name`)}</span>
                  <span className="text-muted-foreground block font-mono text-xs">
                    {member.seed}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="text-muted-foreground mt-10 max-w-xl text-sm leading-relaxed">
          {t('explainer')}
        </p>
      </div>
    </section>
  );
}
