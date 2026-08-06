import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'motion/react';
import type { ToolName } from '../hooks/use-chat';

interface ChatLoadingProps {
  /** When the agent is running a tool, name it instead of the generic label. */
  activeTool?: ToolName | null;
}

export function ChatLoading({ activeTool }: ChatLoadingProps) {
  const t = useTranslations('components.chat.messages');

  // Tool execution (embeddings + DB lookups) is the long silence in a turn —
  // naming it reads as progress instead of a hang.
  const label = activeTool ? t(`tools.${activeTool}`) : t('thinking');

  return (
    <div className="flex flex-col items-start space-y-2">
      <div className="flex animate-pulse items-center gap-1 rounded-xl text-sm backdrop-blur-sm">
        <AnimatePresence mode="wait">
          <motion.span
            key={label}
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.15 }}
            className="text-muted-foreground"
          >
            {label}
          </motion.span>
        </AnimatePresence>
        <span className="flex gap-0.5">
          <span className="bg-muted-foreground h-1 w-1 animate-pulse rounded-full" />
          <span className="bg-muted-foreground h-1 w-1 animate-pulse rounded-full delay-100" />
          <span className="bg-muted-foreground h-1 w-1 animate-pulse rounded-full delay-200" />
        </span>
      </div>
    </div>
  );
}
