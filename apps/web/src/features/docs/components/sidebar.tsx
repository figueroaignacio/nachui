'use client';

import { NavBadge } from '@/components/common/nav-badge';
import { Link, usePathname } from '@/i18n/navigation';
import type { DocItem, DocSection } from '@/lib/definitions';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations('docs');
  const docsNavigation = t.raw('navigation') as DocSection[];

  return (
    <aside className="lg:pr-8">
      <nav className="hide-scrollbar sticky top-24 hidden h-[calc(100vh-5rem)] shrink-0 overflow-y-scroll mask-[linear-gradient(180deg,black_90%,transparent)] pb-20 lg:block">
        {docsNavigation.map((section: DocSection) => (
          <div key={section.title} className="mb-6 last:mb-0">
            <p className="text-muted-foreground px-2.5 text-xs">{section.title}</p>
            <ul className="mt-2">
              {section.items.map((item: DocItem) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      target={item.target}
                      rel={item.target ? 'noopener noreferrer' : undefined}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'flex items-center gap-2 rounded-md px-2.5 py-1 text-[13px] transition-colors',
                        isActive
                          ? 'bg-card text-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                    >
                      {item.title}
                      <NavBadge badge={item.badge} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
