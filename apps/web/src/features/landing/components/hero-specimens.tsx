'use client';

import { useChatStore } from '@/features/chat/store/chat-store';
import { PromptInput, type PromptInputMessage } from '@repo/ui/ai/prompt-input';
import { Button } from '@repo/ui/components/button';
import { Switch } from '@repo/ui/components/switch';
import { useTranslations } from 'next-intl';

function SpecimenLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-muted-foreground font-mono text-[11px]">{children}</span>;
}

export function HeroSpecimens() {
  const t = useTranslations('sections.home.specimens');

  const ask = (message: PromptInputMessage) => {
    const text = message.text.trim();
    if (!text) return;
    const { openChat, sendMessage } = useChatStore.getState();
    openChat();
    void sendMessage(text);
  };

  return (
    <div className="rule-bleed bleed-x grid md:grid-cols-3">
      <div className="hidden flex-col justify-between gap-6 py-6 pr-8 md:flex">
        <SpecimenLabel>ui/button</SpecimenLabel>
        <div className="flex gap-2.5">
          <Button>{t('deploy')}</Button>
          <Button variant="outline">{t('cancel')}</Button>
        </div>
      </div>

      <div className="border-rule hidden flex-col justify-between gap-6 border-l px-8 py-6 md:flex">
        <SpecimenLabel>ui/switch</SpecimenLabel>
        <div className="flex items-center gap-3">
          <Switch id="hero-specimen-switch" defaultChecked />
          <label htmlFor="hero-specimen-switch" className="text-foreground text-sm">
            {t('switch')}
          </label>
        </div>
      </div>

      <div className="md:border-rule flex flex-col justify-between gap-4 py-5 md:gap-6 md:border-l md:py-6 md:pl-8">
        <SpecimenLabel>ai/prompt-input</SpecimenLabel>
        <PromptInput onSubmit={ask} className="flex-row items-center pr-2">
          <PromptInput.Body>
            <PromptInput.Textarea placeholder={t('prompt')} aria-label={t('prompt')} maxRows={3} />
          </PromptInput.Body>
          <PromptInput.Submit className="bg-brand text-brand-foreground hover:bg-brand/90" />
        </PromptInput>
      </div>
    </div>
  );
}
