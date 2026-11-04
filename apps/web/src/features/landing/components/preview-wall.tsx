'use client';

import { cn } from '@repo/ui/lib/cn';

import { PreviewChecklist } from './preview-cards/preview-checklist';
import { PreviewCommand } from './preview-cards/preview-command';
import { PreviewEmpty } from './preview-cards/preview-empty';
import { PreviewFeatureFlags } from './preview-cards/preview-feature-flags';
import { PreviewInvoices } from './preview-cards/preview-invoices';
import { PreviewPlan } from './preview-cards/preview-plan';
import { PreviewRating } from './preview-cards/preview-rating';
import { PreviewRelease } from './preview-cards/preview-release';
import { PreviewStorage } from './preview-cards/preview-storage';
import { PreviewTeam } from './preview-cards/preview-team';
import { PreviewUpload } from './preview-cards/preview-upload';
import { PreviewUptime } from './preview-cards/preview-uptime';

/** In reading order: every three cards start the next desktop column. */
const CARDS = [
  PreviewPlan,
  PreviewTeam,
  PreviewFeatureFlags,
  PreviewCommand,
  PreviewStorage,
  PreviewRating,
  PreviewRelease,
  PreviewUpload,
  PreviewEmpty,
  PreviewInvoices,
  PreviewChecklist,
  PreviewUptime,
];

const CARDS_PER_DESKTOP_COLUMN = 3;
const DESKTOP_COLUMNS = 4;
const COLUMNS = 6;
const ROWS = 6;

function WallCard({ column, row }: { column: number; row: number }) {
  const index = (column * CARDS_PER_DESKTOP_COLUMN + row) % CARDS.length;
  const Preview = CARDS[index] ?? PreviewPlan;
  return <Preview />;
}

export function PreviewWall() {
  return (
    <div className="bleed-x relative mt-6 overflow-hidden md:mt-8">
      <div
        aria-hidden="true"
        inert
        className="preview-stage pointer-events-none relative h-[34rem] overflow-hidden select-none max-lg:mx-[calc(-1*var(--frame-bleed))] md:h-[48rem] lg:h-[44rem]"
      >
        <div className="preview-plane absolute top-12 left-1/2 flex -translate-x-1/2 items-start gap-3 md:top-16 lg:static lg:grid lg:translate-x-0 lg:grid-cols-4">
          {Array.from({ length: COLUMNS }, (_, column) => (
            <div
              key={column}
              className={cn(
                'flex w-60 shrink-0 flex-col gap-3 lg:w-auto lg:min-w-0',
                column >= DESKTOP_COLUMNS && 'lg:hidden',
              )}
            >
              {Array.from({ length: ROWS }, (_, row) => (
                <WallCard key={row} column={column} row={row} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
