'use client';

import { PromptInput } from '@repo/ui/ai/prompt-input';
import { reveal, springs } from '@repo/ui/lib/motion';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { useChatStore } from '../store/chat-store';

const entrance = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: springs.smooth },
  exit: { opacity: 0, y: 8, transition: { duration: 0.12 } },
};

/** The quick way into the assistant: type, send, and the panel opens with the answer. */
export function ChatLauncher() {
  const t = useTranslations('components.chat.launcher');
  const isOpen = useChatStore((s) => s.isOpen);
  const openChat = useChatStore((s) => s.openChat);
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          data-chat-launcher
          variants={shouldReduceMotion ? reveal : entrance}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <PromptInput
            onSubmit={(message) => {
              openChat();
              void useChatStore.getState().sendMessage(message.text);
            }}
            className="bg-popover focus-within:border-border-interactive pointer-events-auto w-full max-w-xl rounded-xl shadow-md"
          >
            <PromptInput.Body>
              <PromptInput.Textarea
                submitOnEnter
                maxRows={5}
                placeholder={t('placeholder')}
                aria-label={t('placeholder')}
                className="text-base md:text-sm"
              />
            </PromptInput.Body>
            <PromptInput.Footer className="justify-end">
              <PromptInput.Submit label={t('send')} className="size-7" />
            </PromptInput.Footer>
          </PromptInput>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
