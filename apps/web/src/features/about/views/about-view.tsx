import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

const actions = [
  { label: 'ignaciofigueroa.dev', href: 'https://ignaciofigueroa.dev', meta: 'Portfolio' },
  {
    label: 'github.com/figueroaignacio',
    href: 'https://github.com/figueroaignacio',
    meta: 'Source Code',
  },
  {
    label: 'in/figueroa-ignacio',
    href: 'https://www.linkedin.com/in/figueroa-ignacio/',
    meta: 'Professional',
  },
];

const stats = [
  { value: '40+', label: 'Components' },
  { value: '2', label: 'Locales' },
  { value: '100%', label: 'Open source' },
  { value: '0', label: 'npm deps' },
];

export async function AboutView() {
  const t = await getTranslations('sections.about');

  const profileSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: 'Ignacio Figueroa',
      description: t('subtitle'),
      image: 'https://github.com/figueroaignacio.png',
      sameAs: [
        'https://ignaciofigueroa.dev',
        'https://github.com/figueroaignacio',
        'https://www.linkedin.com/in/figueroa-ignacio/',
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
      />

      <section className="min-h-svh px-6 py-28">
        <div className="mx-auto max-w-2xl">
          <div className="mb-12 space-y-5">
            <div className="border-border size-16 shrink-0 overflow-hidden rounded-lg border">
              <Image
                src="https://github.com/figueroaignacio.png"
                alt="Ignacio Figueroa"
                width={64}
                height={64}
                priority
                className="size-full object-cover"
              />
            </div>
            <div className="pt-1">
              <p className="text-muted-foreground mb-1 font-mono text-[0.68rem] tracking-widest uppercase">
                About the author
              </p>
              <h1 className="font-serif text-[clamp(1.6rem,4vw,2.2rem)] leading-tight tracking-tight">
                Ignacio Figueroa
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Software Developer, Buenos Aires, Argentina.
              </p>
            </div>
          </div>
          <hr className="border-border mb-10 border-dashed" />

          {/* ── Prose ── */}
          <div className="text-foreground/80 mb-14 flex flex-col gap-5 text-base leading-relaxed">
            <p>{t('content1')}</p>
            <p>{t('content2')}</p>
            <p>{t('content3')}</p>
            <p>{t('content4')}</p>
          </div>

          {/* ── Stats ── */}
          <div
            className="border-border bg-card mb-14 grid grid-cols-4 divide-x divide-dashed overflow-hidden rounded-lg border max-sm:grid-cols-2 max-sm:divide-y"
            role="list"
            aria-label="Project statistics"
          >
            {stats.map((s) => (
              <div key={s.label} className="px-4 py-5 text-center" role="listitem">
                <div className="text-foreground mb-1 font-serif text-2xl tracking-tight">
                  {s.value}
                </div>
                <div className="text-muted-foreground font-mono text-[0.63rem] tracking-widest uppercase">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* ── Links ── */}
          <nav className="border-border border-t border-dashed pt-7" aria-label="External profiles">
            {actions.map((action) => (
              <a
                key={action.href}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border group flex items-center justify-between border-b border-dashed py-3 last:border-b-0"
              >
                <span className="flex items-center gap-3">
                  <span className="border-border bg-muted text-muted-foreground rounded px-2 py-0.5 font-mono text-[0.63rem] tracking-widest uppercase">
                    {action.meta}
                  </span>
                  <span className="text-muted-foreground group-hover:text-foreground text-sm transition-colors">
                    {action.label}
                  </span>
                </span>
                <span className="text-muted-foreground/40 text-xs" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </nav>
        </div>
      </section>
    </>
  );
}
