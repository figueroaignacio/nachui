import { CopyButton } from '@/components/mdx/copy-button';
import { Link } from '@/i18n/navigation';
import { Command } from '@repo/ui/components/command';
import { Frame } from '@repo/ui/components/frame';
import { Sprite, type SpriteState } from '@repo/ui/components/sprite';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { findMember } from '../lib/cast';

const STATES: SpriteState[] = ['idle', 'walk', 'work', 'loop'];

export async function SpriteView({ id }: { id: string }) {
  const member = findMember(id);
  if (!member) notFound();

  const t = await getTranslations('sections.sprites');

  const snippet = [
    '<Sprite',
    `  seed="${member.seed}"`,
    '  parts={{',
    `    skin: '${member.parts.skin}',`,
    `    hair: '${member.parts.hair}',`,
    `    hairColor: '${member.parts.hairColor}',`,
    `    eyes: '${member.parts.eyes}',`,
    `    outfit: '${member.parts.outfit}',`,
    `    outfitMain: '${member.parts.outfitMain}',`,
    `    outfitTrim: '${member.parts.outfitTrim}',`,
    `    accessory: '${member.parts.accessory}',`,
    '  }}',
    '  state="loop"',
    '/>',
  ].join('\n');
  const endpoint = `/api/sprite/${member.id}.svg?state=loop&size=96`;

  const recipe = [
    ['skin', member.parts.skin, null],
    ['hair', `${member.parts.hair} · ${member.parts.hairColor}`, null],
    ['eyes', member.parts.eyes, null],
    ['outfit', member.parts.outfit, member.parts.outfitMain],
    ['accessory', member.parts.accessory, null],
  ] as const;

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/sprites"
          className="text-muted-foreground hover:text-foreground font-mono text-xs transition-colors"
        >
          ← {t('back')}
        </Link>

        <div className="border-border bg-surface-muted mt-6 flex flex-wrap items-end gap-8 rounded-lg border px-7 pt-7 pb-6">
          <Sprite seed={member.seed} parts={member.parts} state="loop" size={132} />
          <div className="flex-1 pb-1">
            <h1 className="font-serif text-[clamp(1.5rem,4vw,2rem)] leading-tight tracking-tight">
              {t(`cast.${member.id}.name`)}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">{t(`cast.${member.id}.note`)}</p>
          </div>
        </div>

        <h2 className="text-muted-foreground mt-12 mb-4 font-mono text-[0.68rem] tracking-widest uppercase">
          {t('statesTitle')}
        </h2>
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {STATES.map((state) => (
            <li key={state} className="border-border bg-card overflow-hidden rounded-lg border">
              <span className="bg-surface-muted border-border flex h-32 items-end justify-center border-b pb-4">
                <Sprite seed={member.seed} parts={member.parts} state={state} size={92} />
              </span>
              <span className="block px-3 py-3">
                <span className="block text-sm font-medium">{t(`states.${state}.title`)}</span>
                <span className="text-muted-foreground block text-xs leading-relaxed">
                  {t(`states.${state}.note`)}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <h2 className="text-muted-foreground mt-12 mb-4 font-mono text-[0.68rem] tracking-widest uppercase">
          {t('recipeTitle')}
        </h2>
        <dl className="border-border divide-border divide-y overflow-hidden rounded-lg border font-mono text-[0.8rem]">
          <div className="flex gap-4 px-4 py-2.5">
            <dt className="text-muted-foreground w-28 shrink-0">seed</dt>
            <dd>{member.seed}</dd>
          </div>
          {recipe.map(([slot, value, swatch]) => (
            <div key={slot} className="flex gap-4 px-4 py-2.5">
              <dt className="text-muted-foreground w-28 shrink-0">{slot}</dt>
              <dd className="flex items-center gap-2">
                {swatch ? (
                  <span
                    aria-hidden="true"
                    className="border-border inline-block size-3 rounded-[3px] border"
                    style={{ background: swatch }}
                  />
                ) : null}
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <h2 className="text-muted-foreground mt-12 mb-4 font-mono text-[0.68rem] tracking-widest uppercase">
          {t('codeTitle')}
        </h2>
        <Frame spacing="sm">
          <Frame.Header className="flex-row items-center justify-between py-1 pr-1 pl-3">
            <Frame.Title className="text-muted-foreground font-mono text-[0.68rem] font-normal">
              {'<Sprite />'}
            </Frame.Title>
            <CopyButton value={snippet} />
          </Frame.Header>
          <Frame.Panel className="overflow-x-auto">
            <pre className="font-mono text-[12px] leading-[1.7]">{snippet}</pre>
          </Frame.Panel>
        </Frame>
        <Command command={endpoint} className="mt-3 text-[12px]" />
      </div>
    </section>
  );
}
