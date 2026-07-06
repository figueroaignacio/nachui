import { Badge } from '@repo/ui/components/badge';

const bars = [40, 65, 50, 80, 60, 90, 75, 55, 85, 70, 95, 62];

export function PreviewAnalytics() {
  return (
    <div
      className="flex flex-col gap-4 rounded-2xl border border-zinc-200/80 bg-white/60 p-5 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/60"
      role="region"
      aria-label="Analytics overview widget"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Page Views
          </span>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400">Last 12 months</span>
        </div>
        <Badge variant="secondary" className="h-5 px-1.5 text-[9px] font-bold">
          +24.5%
        </Badge>
      </div>

      <div
        className="flex h-16 items-end gap-1"
        role="img"
        aria-label="Monthly page views bar chart"
      >
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-zinc-200 transition-all duration-300 dark:bg-zinc-700"
            style={{ height: `${h}%` }}
            aria-hidden="true"
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-dashed border-zinc-100 pt-4 dark:border-zinc-800">
        {[
          { label: 'Visitors', value: '84.2k' },
          { label: 'Bounce', value: '24%' },
          { label: 'Avg. Time', value: '3m 42s' },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50">{stat.value}</span>
            <span className="text-[9px] font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
