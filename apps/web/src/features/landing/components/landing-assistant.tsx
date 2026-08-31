'use client';

import { useChatStore } from '@/features/chat/store/chat-store';
import { AiAvatar } from '@/features/chat/ui/ai-avatar';
import { useTranslations } from 'next-intl';

type Role = { title: string; description: string };

function ArrowDoodle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 5c11 3 22 12 27 27"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M23.5 27.5l8.5 5 1.5-10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LandingAssistant() {
  const t = useTranslations('sections.home.assistant');
  const roles: Role[] = t.raw('roles');
  const openChat = useChatStore((state) => state.openChat);

  return (
    <section className="w-full" aria-labelledby="assistant-title">
      {/* The rule bleeds past the rails, so it has to sit outside the clipped
          frame below — otherwise the overflow that makes it bleed is cut. */}
      <div className="rule-bleed rule-draw" />

      <div className="assistant-frame relative overflow-hidden pt-8 pb-10">
        <div className="scroll-reveal max-w-2xl">
          <p className="section-label">{t('label')}</p>
          <h2
            id="assistant-title"
            className="font-heading text-foreground mt-3 text-xl font-semibold tracking-tight md:text-[1.375rem]"
          >
            {t('title')}
          </h2>
          <p className="text-muted-strong mt-2 text-sm leading-relaxed">{t('description')}</p>

          <dl className="mt-8 space-y-5">
            {roles.map((role) => (
              <div key={role.title} className="border-rule border-l pl-4">
                <dt className="text-foreground text-sm font-medium">{role.title}</dt>
                <dd className="text-muted-foreground mt-1 text-[13px] leading-relaxed">
                  {role.description}
                </dd>
              </div>
            ))}
          </dl>

          <button
            type="button"
            onClick={openChat}
            className="bg-foreground text-background mt-6 inline-flex items-center gap-2 rounded-md px-4 py-2 font-mono text-sm transition-all hover:opacity-80 active:scale-[0.98]"
          >
            {t('cta')}
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="assistant-peek absolute right-6 bottom-0 hidden md:block">
          <div className="text-muted-foreground absolute right-full bottom-8 flex items-end gap-1 pr-1 whitespace-nowrap">
            <span className="font-mono text-xs italic">{t('tooltip')}</span>
            <ArrowDoodle className="h-6 w-6 shrink-0" />
          </div>
          <button
            type="button"
            onClick={openChat}
            aria-label={t('tooltip')}
            className="focus-visible:ring-ring block cursor-pointer rounded-2xl transition-transform duration-300 ease-out hover:-translate-y-2 focus-visible:ring-2 focus-visible:outline-none motion-reduce:transform-none"
          >
            <span className="block -rotate-8">
              <AiAvatar size="xl" follow />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
