import {
  AiBrain01Icon,
  AiEditingIcon,
  AiInnovation02Icon,
  BookOpen01Icon,
  BrickWallIcon,
  ComponentIcon,
  ComputerTerminal01Icon,
  Download01Icon,
  HelpSquareIcon,
  Layers01Icon,
  Layout01Icon,
  Moon02Icon,
  PaintBoardIcon,
  Rocket01Icon,
  SourceCodeIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export const getIcon = (title: string, href?: string) => {
  const lowerTitle = title.toLowerCase();

  if (['sections', 'secciones'].includes(lowerTitle))
    return <HugeiconsIcon icon={Layers01Icon} size={16} />;
  if (['getting started', 'comenzando'].includes(lowerTitle))
    return <HugeiconsIcon icon={Rocket01Icon} size={16} />;
  if (['components', 'componentes'].includes(lowerTitle))
    return <HugeiconsIcon icon={ComponentIcon} size={16} />;
  if (['bricks'].includes(lowerTitle)) return <HugeiconsIcon icon={BrickWallIcon} size={16} />;
  if (['faq', 'faqs'].includes(lowerTitle))
    return <HugeiconsIcon icon={HelpSquareIcon} size={16} />;
  if ('skills'.includes(lowerTitle)) return <HugeiconsIcon icon={AiInnovation02Icon} size={16} />;
  if (['generator', 'generador'].includes(lowerTitle))
    return <HugeiconsIcon icon={AiEditingIcon} size={16} />;

  if (href) {
    if (href.includes('/installation')) return <HugeiconsIcon icon={Download01Icon} size={16} />;
    if (href.includes('/theming')) return <HugeiconsIcon icon={PaintBoardIcon} size={16} />;
    if (href.includes('/dark-mode')) return <HugeiconsIcon icon={Moon02Icon} size={16} />;
    if (href.includes('/cli')) return <HugeiconsIcon icon={ComputerTerminal01Icon} size={16} />;
    if (href.includes('/docs/components/'))
      return <HugeiconsIcon icon={SourceCodeIcon} size={16} />;
    if (href === '/docs') return <HugeiconsIcon icon={BookOpen01Icon} size={16} />;
    if (href.includes('/skills/')) return <HugeiconsIcon icon={AiBrain01Icon} size={16} />;
  }

  return <HugeiconsIcon icon={Layout01Icon} size={16} />;
};
