import { useKbdShortcut } from '@/hooks/use-kbd-shortcut';
import { Button } from '@repo/ui/components/button';
import { Tooltip } from '@repo/ui/components/tooltip';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

interface ChatToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.7, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.85, y: 6 },
} as const;

const buttonTransition = {
  type: 'spring' as const,
  stiffness: 500,
  damping: 28,
  mass: 0.6,
};

export function ChatToggleButton({ isOpen, onClick }: ChatToggleButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [autoShow, setAutoShow] = useState(false);
  const t = useTranslations('components.chat');

  useEffect(() => {
    const showTimer = setTimeout(() => setAutoShow(true), 1000);
    const hideTimer = setTimeout(() => setAutoShow(false), 5000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  useKbdShortcut(['cmd', 'j'], onClick);

  const shouldShowTooltip = (isHovered || autoShow) && !isOpen;

  return (
    <motion.div
      variants={buttonVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={buttonTransition}
    >
      <Tooltip open={shouldShowTooltip} onOpenChange={setIsHovered} delayDuration={0}>
        <Tooltip.Trigger asChild className="bg-background">
          <Button onClick={onClick} variant="outline">
            {t('button.label')}
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content side="top" sideOffset={10}>
          {t('messages.tooltip')}
        </Tooltip.Content>
      </Tooltip>
    </motion.div>
  );
}
