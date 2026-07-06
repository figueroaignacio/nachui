import { Avatar } from '@repo/ui/components/avatar';
import { Badge } from '@repo/ui/components/badge';

const activities = [
  {
    user: 'IF',
    src: 'https://github.com/figueroaignacio.png',
    action: 'merged pull request',
    target: '#1043 · Fix token refresh',
    time: '2m ago',
    variant: 'default' as const,
  },
  {
    user: 'NV',
    src: 'https://github.com/nicvazquezdev.png',
    action: 'opened issue',
    target: '#1044 · Tooltip z-index',
    time: '18m ago',
    variant: 'secondary' as const,
  },
  {
    user: 'MZ',
    src: 'https://github.com/ManuZarraga.png',
    action: 'deployed to',
    target: 'production · v2.4.1',
    time: '1h ago',
    variant: 'outline' as const,
  },
];

export function PreviewActivity() {
  return (
    <div
      className="flex flex-col gap-4 rounded-2xl border border-zinc-200/80 bg-white/60 p-5 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/60"
      role="region"
      aria-label="Recent team activity"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Activity
        </span>
        <Badge variant="secondary" className="h-5 px-1.5 text-[9px] font-bold">
          LIVE
        </Badge>
      </div>

      <div className="flex flex-col gap-3" role="list">
        {activities.map((a, i) => (
          <div key={i} className="flex items-start gap-3" role="listitem">
            <Avatar
              size="sm"
              className="mt-0.5 shrink-0 border border-zinc-200 dark:border-zinc-800"
            >
              <Avatar.Image src={a.src} alt={a.user} />
              <Avatar.Fallback>{a.user}</Avatar.Fallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                <span className="font-bold text-zinc-900 dark:text-zinc-50">{a.user}</span>{' '}
                {a.action}{' '}
                <span className="font-mono text-[10px] text-zinc-700 dark:text-zinc-200">
                  {a.target}
                </span>
              </p>
              <span className="text-[9px] text-zinc-400 dark:text-zinc-500">{a.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
