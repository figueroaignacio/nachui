import { Analytics01Icon, Shield01Icon, ZapIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { IconTile } from '../../components/icon-tile';

const FEATURES = [
  {
    icon: ZapIcon,
    tone: 'primary',
    title: 'Instant previews',
    body: 'Every push gets a URL in under a minute.',
  },
  {
    icon: Shield01Icon,
    tone: 'success',
    title: 'Signed builds',
    body: 'Artifacts are verified before they reach production.',
  },
  {
    icon: Analytics01Icon,
    tone: 'info',
    title: 'Usage insights',
    body: 'Requests, errors and latency per route.',
  },
] as const;

export function FeatureList() {
  return (
    <ul className="border-border bg-card m-0 flex w-full max-w-sm list-none flex-col divide-y rounded-xl border p-0">
      {FEATURES.map((feature) => (
        <li key={feature.title} className="border-border flex items-start gap-3 p-4">
          <IconTile variant="soft" tone={feature.tone}>
            <HugeiconsIcon icon={feature.icon} />
          </IconTile>
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-sm font-medium">{feature.title}</span>
            <span className="text-muted-foreground text-xs">{feature.body}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
