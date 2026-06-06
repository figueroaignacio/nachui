import { Link } from '@/i18n/navigation';
import { Typography } from '@repo/ui/components/typography';
import { Container } from '@repo/ui/layout/container';
import { Flex } from '@repo/ui/layout/flex';
import { Grid } from '@repo/ui/layout/grid';
import { Stack } from '@repo/ui/layout/stack';
import { useTranslations } from 'next-intl';
import { LocaleSwitcher } from '../common/locale-switcher';
import { Logo } from '../common/logo';
import { GitHubIcon } from '../common/tech-icons';
import { ThemeToggle } from '../common/theme-toggle';

function FooterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Stack gap="4">
      <Typography
        variant="h3"
        className="text-foreground text-xs font-semibold tracking-widest uppercase"
      >
        {title}
      </Typography>
      <Stack as="ul" gap="3">
        {children}
      </Stack>
    </Stack>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-muted-foreground hover:text-foreground transition-colors duration-200"
    >
      <Icon className="h-5 w-5" />
    </a>
  );
}

export function Footer() {
  const t = useTranslations('sections');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 px-4 pb-6 md:px-6 lg:pb-8">
      <div className="bg-card border-border relative overflow-hidden rounded-2xl border shadow-lg shadow-black/5 dark:shadow-black/30">
        <Container className="px-6 md:px-8 lg:px-10" size="fluid">
          <Grid columns="2" gap="8" className="py-10 md:grid-cols-4 lg:grid-cols-6 lg:gap-12">
            <div className="col-span-2 lg:col-span-2">
              <div className="mb-4">
                <Logo size="mobile" />
              </div>
              <Typography
                variant="p"
                className="text-muted-foreground mb-6 max-w-xs text-sm leading-relaxed"
              >
                {t('home.description')}
              </Typography>
              <Flex align="center" gap="4">
                <SocialLink
                  href="https://github.com/figueroaignacio/ui"
                  icon={GitHubIcon}
                  label="GitHub"
                />
              </Flex>
            </div>
            <FooterSection title={t('footer.product.title')}>
              <FooterLink href="/docs">{t('footer.product.docs')}</FooterLink>
              <FooterLink href="/docs/components">{t('footer.product.components')}</FooterLink>
              <FooterLink href="/docs/installation">{t('footer.product.installation')}</FooterLink>
              <FooterLink href="/blog">{t('footer.product.blog')}</FooterLink>
              <FooterLink href="/about">{t('footer.product.about')}</FooterLink>
            </FooterSection>

            <FooterSection title={t('footer.resources.title')}>
              <FooterLink href="/docs/concepts/theming">{t('footer.resources.theming')}</FooterLink>
              <FooterLink href="/docs/concepts/dark-mode">
                {t('footer.resources.darkMode')}
              </FooterLink>
              <FooterLink href="/docs/concepts/cli">{t('footer.resources.cli')}</FooterLink>
              <FooterLink href="/examples">{t('footer.resources.examples')}</FooterLink>
            </FooterSection>

            <FooterSection title={t('footer.community.title')}>
              <FooterLink href="https://github.com/figueroaignacio/ui">
                {t('footer.community.github')}
              </FooterLink>
            </FooterSection>
          </Grid>
          <div className="border-border border-t" />
          <div className="py-5">
            <Flex
              direction="column"
              align="center"
              justify="between"
              gap="4"
              className="md:flex-row"
            >
              <Stack gap="1" className="text-center md:text-left">
                <Typography variant="p" className="text-muted-foreground text-sm">
                  © {currentYear} NachUI. {t('footer.copyright')}
                </Typography>
                <Typography variant="p" className="text-muted-foreground text-sm">
                  {t('footer.developedBy')}
                  <a
                    href="https://ignaciofigueroa.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground ml-1 font-medium underline underline-offset-2 transition-colors duration-200"
                  >
                    ignaciofigueroa.dev
                  </a>
                </Typography>
              </Stack>
              <Flex align="center" gap="6">
                <Link
                  href="/sitemap.xml"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
                >
                  {t('footer.sitemap')}
                </Link>
                <Link
                  href="/rss.xml"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
                >
                  RSS
                </Link>
                <Flex align="center" gap="3">
                  <LocaleSwitcher />
                  <div className="hidden lg:block">
                    <ThemeToggle />
                  </div>
                </Flex>
              </Flex>
            </Flex>
          </div>
          <Typography
            variant="p"
            className="text-muted-foreground/50 pb-5 text-center text-xs lg:text-left"
          >
            I was told to keep it simple. So I did. - Nacho
          </Typography>
        </Container>
      </div>
    </footer>
  );
}
