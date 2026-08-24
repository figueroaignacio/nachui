'use client';

import { SparklesIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cn } from '@repo/ui/lib/cn';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import type { TextSelection } from '../hooks/use-text-selection';

interface SelectionPromptProps {
  selection: TextSelection;
  onAdd: () => void;
}

const GAP = 10;
const HEADER_SAFE_AREA = 96;
const EDGE_PADDING = 90;

export function SelectionPrompt({ selection, onAdd }: SelectionPromptProps) {
  const t = useTranslations('components.chat.selection');
  const { rect } = selection;

  const flipBelow = rect.top < HEADER_SAFE_AREA;
  const top = flipBelow ? rect.bottom + GAP : rect.top - GAP;
  const left = Math.min(
    Math.max(rect.left + rect.width / 2, EDGE_PADDING),
    window.innerWidth - EDGE_PADDING,
  );

  return (
    <div
      style={{ top, left }}
      className={cn('fixed z-600 -translate-x-1/2', !flipBelow && '-translate-y-full')}
    >
      <motion.div
        initial={{ opacity: 0, y: flipBelow ? -4 : 4, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.14, ease: [0.4, 0, 0.2, 1] }}
      >
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onAdd}
          className="bg-background/95 border-rule text-foreground hover:border-foreground/25 flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium whitespace-nowrap shadow-sm backdrop-blur-md transition-colors"
        >
          <HugeiconsIcon icon={SparklesIcon} size={13} aria-hidden="true" />
          {t('add')}
        </button>
      </motion.div>
    </div>
  );
}
