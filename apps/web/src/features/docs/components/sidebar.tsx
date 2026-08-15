'use client';

import { Link, usePathname } from '@/i18n/navigation';
import type { DocItem, DocSection } from '@/lib/definitions';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations('docs');
  const docsNavigation = t.raw('navigation') as DocSection[];

  return (
    <aside className="hidden lg:block">
      <div className="border-rule bg-card sticky top-20 rounded-lg border p-3 shadow-sm">
        <nav className="hide-scrollbar max-h-[calc(100vh-9rem)] overflow-y-auto mask-[linear-gradient(180deg,black_90%,transparent)] pb-10">
          {docsNavigation.map((section: DocSection) => (
            <div key={section.title} className="mb-8 last:mb-0">
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
                          'block rounded-md px-2.5 py-1.5 text-sm transition-colors',
                          isActive
                            ? 'bg-muted text-foreground font-medium'
                            : 'text-muted-foreground hover:text-foreground',
                        )}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
