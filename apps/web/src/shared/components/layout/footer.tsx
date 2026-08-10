import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from '../common/locale-switcher';
import { ThemeToggle } from '../common/theme-toggle';

export function Footer() {
  const t = useTranslations('sections');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-rule border-t">
      <div className="page-frame-outer">
        <div className="page-frame">
          <div className="flex w-full flex-col gap-8 pt-12 pb-10 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xs space-y-3">
              <span className="text-foreground font-mono text-sm font-medium">nachui</span>
              <p className="text-muted-foreground text-[13px] leading-relaxed">
                {t('home.description')}
              </p>
              <a
                href="https://github.com/figueroaignacio/ui"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground inline-block font-mono text-xs transition-colors"
                aria-label="GitHub repository"
              >
                github
              </a>
            </div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-6 sm:grid-cols-3">
              <div className="space-y-3">
                <p className="text-muted-foreground font-mono text-[11px] tracking-[0.2em] uppercase">
                  {t('footer.product.title')}
                </p>
                <ul className="space-y-2">
                  {(
                    [
                      ['/docs', t('footer.product.docs')],
                      ['/docs/elements/ui', t('footer.product.components')],
                      ['/docs/installation', t('footer.product.installation')],
                      ['/about', t('footer.product.about')],
                    ] as [string, string][]
                  ).map(([href, label]) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-muted-foreground hover:text-foreground text-[13px] transition-colors"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <p className="text-muted-foreground font-mono text-[11px] tracking-[0.2em] uppercase">
                  {t('footer.resources.title')}
                </p>
                <ul className="space-y-2">
                  {(
                    [
                      ['/docs/concepts/theming', t('footer.resources.theming')],
                      ['/docs/concepts/dark-mode', t('footer.resources.darkMode')],
                      ['/docs/concepts/cli', t('footer.resources.cli')],
                    ] as [string, string][]
                  ).map(([href, label]) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-muted-foreground hover:text-foreground text-[13px] transition-colors"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <p className="text-muted-foreground font-mono text-[11px] tracking-[0.2em] uppercase">
                  {t('footer.community.title')}
                </p>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://github.com/figueroaignacio/ui"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground text-[13px] transition-colors"
                    >
                      {t('footer.community.github')}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Crosses the rails to the viewport edge, like every other section
            rule, instead of stopping inside them. */}
          <div className="rule-bleed" />

          <div className="flex w-full flex-col gap-6 py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-6">
              <p className="text-muted-foreground font-mono text-xs">
                © {currentYear} NachUI. {t('footer.copyright')}
              </p>
              <p className="text-muted-foreground font-mono text-xs">
                {t('footer.developedBy')}{' '}
                <a
                  href="https://ignaciofigueroa.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  ignaciofigueroa.dev
                </a>
              </p>
            </div>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
              <div className="flex items-center gap-6">
                <Link
                  href="/sitemap.xml"
                  className="text-muted-foreground hover:text-foreground font-mono text-xs transition-colors"
                >
                  {t('footer.sitemap')}
                </Link>
                <Link
                  href="/rss.xml"
                  className="text-muted-foreground hover:text-foreground font-mono text-xs transition-colors"
                >
                  rss
                </Link>
              </div>
              <div className="border-rule hidden h-4 border-l sm:block" aria-hidden="true" />
              <div className="flex items-center gap-3">
                <LocaleSwitcher />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
