import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@repo/ui/lib/cn';
import { PreviewAiChat } from './preview-cards/preview-ai-chat';
import { PreviewAiComposer } from './preview-cards/preview-ai-composer';
import { PreviewAiPlan } from './preview-cards/preview-ai-plan';
import { PreviewAiSuggestions } from './preview-cards/preview-ai-suggestions';
import { PreviewAiSummary } from './preview-cards/preview-ai-summary';
import { PreviewAiVariations } from './preview-cards/preview-ai-variations';
import { PreviewDateRange } from './preview-cards/preview-date-range';
import { PreviewFilter } from './preview-cards/preview-filter';
import { PreviewGuests } from './preview-cards/preview-guests';
import { PreviewModelPicker } from './preview-cards/preview-model-picker';
import { PreviewProfile } from './preview-cards/preview-profile';
import { PreviewReview } from './preview-cards/preview-review';
import { PreviewStay } from './preview-cards/preview-stay';
import { PreviewThinking } from './preview-cards/preview-thinking';
import { PreviewTripTotal } from './preview-cards/preview-trip-total';
import { PreviewUpload } from './preview-cards/preview-upload';

const CARDS: { id: string; card: ReactNode }[] = [
  { id: 'stay', card: <PreviewStay /> },
  { id: 'chat', card: <PreviewAiChat /> },
  { id: 'summary', card: <PreviewAiSummary /> },
  { id: 'date', card: <PreviewDateRange /> },
  { id: 'guests', card: <PreviewGuests /> },
  { id: 'total', card: <PreviewTripTotal /> },
  { id: 'filter', card: <PreviewFilter /> },
  { id: 'suggestions', card: <PreviewAiSuggestions /> },
  { id: 'variations', card: <PreviewAiVariations /> },
  { id: 'profile', card: <PreviewProfile /> },
  { id: 'review', card: <PreviewReview /> },
  { id: 'upload', card: <PreviewUpload /> },
  { id: 'composer', card: <PreviewAiComposer /> },
  { id: 'thinking', card: <PreviewThinking /> },
  { id: 'aiplan', card: <PreviewAiPlan /> },
  { id: 'model', card: <PreviewModelPicker /> },
];

/**
 * Real component previews floating around the hero copy. Each card is placed
 * from the stage centre by the `--x`, `--y`, `--r` and `--s` variables set per
 * breakpoint in globals.css, so the copy keeps a clear area at every width.
 * `--e` staggers the entrance and `--fd` gives each card its own float pace.
 * It is a showcase, so the whole layer is inert.
 */
export function HeroOrbit() {
  return (
    <div aria-hidden="true" inert className="hero-orbit">
      {CARDS.map(({ id, card }, index) => (
        <div
          key={id}
          className={cn('hero-orbit-card', `orbit-${id}`)}
          style={
            {
              '--e': `${200 + index * 55}ms`,
              '--fd': `${6 + (index % 4)}s`,
            } as CSSProperties
          }
        >
          {card}
        </div>
      ))}
    </div>
  );
}
