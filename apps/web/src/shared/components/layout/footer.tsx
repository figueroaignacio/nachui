import { GITHUB_REPO_URL } from '@/lib/domains';
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from '../common/locale-switcher';
import { ThemeToggle } from '../common/theme-toggle';

const linkClassName =
  'text-foreground font-medium underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors';

export function Footer() {
  const t = useTranslations('sections.footer');

  return (
    <footer data-site-footer className="border-rule border-t pb-24">
      <div className="page-frame-outer">
        <div className="page-frame">
          <div className="flex w-full flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
            <p className="text-muted-foreground text-[13px] leading-relaxed text-balance">
              {t('builtBy')}{' '}
              <a
                href="https://ignaciofigueroa.dev"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
              >
                ignaciofigueroa
              </a>
              . {t('source')}{' '}
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
              >
                GitHub
              </a>
              .
            </p>
            <div className="flex items-center gap-3">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
