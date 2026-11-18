import { IconTile } from '../../components/icon-tile';
import { BarChartIcon } from '../../icons/bar-chart';
import { ShieldIcon } from '../../icons/shield';
import { ZapIcon } from '../../icons/zap';

const FEATURES = [
  {
    icon: ZapIcon,
    tone: 'primary',
    title: 'Instant previews',
    body: 'Every push gets a URL in under a minute.',
  },
  {
    icon: ShieldIcon,
    tone: 'success',
    title: 'Signed builds',
    body: 'Artifacts are verified before they reach production.',
  },
  {
    icon: BarChartIcon,
    tone: 'info',
    title: 'Usage insights',
    body: 'Requests, errors and latency per route.',
  },
] as const;

export function FeatureList() {
  return (
    <ul className="bg-card m-0 flex w-full max-w-sm list-none flex-col divide-y rounded-lg p-0 shadow-sm">
      {FEATURES.map((feature) => (
        <li key={feature.title} className="flex items-start gap-3 p-4">
          <IconTile variant="soft" tone={feature.tone}>
            <feature.icon />
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
