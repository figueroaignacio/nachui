'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { GitHubIcon } from '@/components/common/github-icon';
import { useChatStore } from '@/features/chat/store/chat-store';
import { Searcher } from '@/features/docs/components/searcher';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { locales } from '@/i18n/routing';
import { GITHUB_REPO_URL } from '@/lib/domains';
import { isHiddenProductLink } from '@/lib/hidden-product-links';
import { Badge } from '@repo/ui/components/badge';
import { Dock, useDockAutoHide } from '@repo/ui/components/dock';
import { BookIcon } from '@repo/ui/icons/book';
import { HomeIcon } from '@repo/ui/icons/home';
import { LanguagesIcon } from '@repo/ui/icons/languages';
import { LayersIcon } from '@repo/ui/icons/layers';
import { LayoutIcon } from '@repo/ui/icons/layout';
import { LayoutGridIcon } from '@repo/ui/icons/layout-grid';
import { MoonIcon } from '@repo/ui/icons/moon';
import { Logo } from '../common/logo';
import { PackageIcon } from '@repo/ui/icons/package';
import { PuzzleIcon } from '@repo/ui/icons/puzzle';
import { SparklesIcon } from '@repo/ui/icons/sparkles';
import { StarIcon } from '@repo/ui/icons/star';
import { SunIcon } from '@repo/ui/icons/sun';
import { WandIcon } from '@repo/ui/icons/wand';
import { cn } from '@repo/ui/lib/cn';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useTheme } from 'nach-themes';
import type { Locale } from 'next-intl';
import { useLocale, useTranslations } from 'next-intl';

type MenuItem = { title: string; description: string; href: string };
type ElementsMenu = {
  label: string;
  items: MenuItem[];
  comingSoon?: { title: string; description: string; badge: string };
};

const PRODUCT_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  '/docs/elements/ui': LayoutGridIcon,
  '/docs/elements/layout': LayoutIcon,
  '/docs/elements/ai': WandIcon,
  '/docs/elements/hybrids': LayersIcon,
  '/components': PuzzleIcon,
  '/bricks/login': PackageIcon,
  '/icons': StarIcon,
};

const PANEL_TRANSITION = { type: 'spring' as const, stiffness: 420, damping: 32, mass: 0.7 };

function ProductPanel({
  open,
  onClose,
  menu,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  menu: ElementsMenu;
  pathname: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (ref.current?.contains(target)) return;
      if ((target as Element).closest?.('[data-dock-product]')) return;
      onClose();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointer);
    window.addEventListener('scroll', onClose, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('scroll', onClose);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          role="menu"
          aria-label={menu.label}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
          transition={reduceMotion ? { duration: 0.1 } : PANEL_TRANSITION}
          className="border-border/60 bg-background/90 fixed bottom-[calc(1.25rem+4.25rem)] left-1/2 z-50 w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border p-1.5 shadow-xl backdrop-blur-md"
        >
          {menu.items.map((item) => {
            const Icon = PRODUCT_ICONS[item.href] ?? LayoutGridIcon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                onClick={onClose}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group/navlink hover:bg-muted focus-visible:ring-ring flex items-start gap-3 rounded-md px-2.5 py-2.5 transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset',
                  active && 'bg-muted/60',
                )}
              >
                <span className="border-border bg-background text-muted-foreground group-hover/navlink:text-foreground flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors">
                  <Icon size={16} />
                </span>
                <span className="min-w-0">
                  <span className="text-foreground block text-sm font-medium">{item.title}</span>
                  <span className="text-muted-foreground mt-0.5 block truncate text-xs">
                    {item.description}
                  </span>
                </span>
              </Link>
            );
          })}
          {menu.comingSoon && (
            <div className="flex cursor-default items-start gap-3 rounded-md px-2.5 py-2.5 opacity-60">
              <span className="border-border bg-background text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-md border">
                <SparklesIcon size={16} />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-2">
                  <span className="text-foreground text-sm font-medium">
                    {menu.comingSoon.title}
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    {menu.comingSoon.badge}
                  </Badge>
                </span>
                <span className="text-muted-foreground mt-0.5 block truncate text-xs">
                  {menu.comingSoon.description}
                </span>
              </span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const LOCALE_NAMES: Record<string, string> = {
  en: 'English',
  es: 'Español',
};

export function SiteDock() {
  const t = useTranslations('ui.dock');
  const tUi = useTranslations('ui');
  const rawMenu = tUi.raw('elementsMenu') as ElementsMenu;
  const elementsMenu: ElementsMenu = {
    ...rawMenu,
    items: rawMenu.items.filter((item) => !isHiddenProductLink(item.href)),
  };
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [, startTransition] = useTransition();
  const { resolvedTheme, setTheme } = useTheme();
  const autoHidden = useDockAutoHide();
  const chatOpen = useChatStore((state) => state.isOpen);
  const openChat = useChatStore((state) => state.openChat);
  const [productOpen, setProductOpen] = useState(false);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const productActive = elementsMenu.items.some(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  const nextLocale = locales.find((code) => code !== locale) ?? locale;
  const switchLocale = () => {
    startTransition(() => {
      router.replace({ pathname }, { locale: nextLocale as Locale });
    });
  };

  return (
    <>
      <Dock
        hidden={autoHidden || chatOpen}
        label={t('label')}
        className="site-dock relative isolate"
      >
        <span className="site-dock-silk" aria-hidden="true" />
        <Dock.Item
          asChild
          label={t('home')}
          active={isActive('/')}
          containerClassName="hidden lg:flex"
          className="hover:bg-transparent"
        >
          <Link href="/">
            <Logo size={22} className="pointer-events-none" imageClassName="rounded-[5px]" />
          </Link>
        </Dock.Item>
        <Dock.Separator className="hidden lg:block" />
        <Dock.Item asChild label={t('home')} active={isActive('/')} containerClassName="lg:hidden">
          <Link href="/">
            <HomeIcon />
          </Link>
        </Dock.Item>
        <Dock.Item
          label={elementsMenu.label}
          active={productActive}
          data-dock-product
          aria-haspopup="menu"
          aria-expanded={productOpen}
          onClick={() => setProductOpen((previous) => !previous)}
        >
          <LayoutGridIcon />
        </Dock.Item>
        <Dock.Item asChild label={t('docs')} active={isActive('/docs')}>
          <Link href="/docs">
            <BookIcon />
          </Link>
        </Dock.Item>
        <Dock.Separator />
        <Searcher variant="dock" />
        <Dock.Item label={t('ask')} onClick={openChat}>
          <SparklesIcon />
        </Dock.Item>
        <Dock.Item asChild label={t('github')} containerClassName="hidden sm:flex">
          <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer">
            <GitHubIcon />
          </a>
        </Dock.Item>
        <Dock.Item
          label={t('theme')}
          onClick={(event) => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark', event)}
        >
          <span className="contents dark:hidden">
            <SunIcon />
          </span>
          <span className="hidden dark:contents">
            <MoonIcon />
          </span>
        </Dock.Item>
        <Dock.Item
          label={`${t('language')}: ${LOCALE_NAMES[nextLocale] ?? nextLocale}`}
          containerClassName="hidden sm:flex"
          onClick={switchLocale}
        >
          <LanguagesIcon />
        </Dock.Item>
      </Dock>
      <ProductPanel
        open={productOpen}
        onClose={() => setProductOpen(false)}
        menu={elementsMenu}
        pathname={pathname}
      />
    </>
  );
}
