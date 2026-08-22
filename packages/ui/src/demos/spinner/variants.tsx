import { Spinner } from '../../components/spinner';

const jobs = [
  { variant: 'default' as const, label: 'Building web-app', detail: 'step 3 of 5' },
  { variant: 'muted' as const, label: 'Queued: docs site', detail: 'waiting for a runner' },
  { variant: 'success' as const, label: 'Promoting to production', detail: 'almost done' },
  { variant: 'info' as const, label: 'Syncing environment variables', detail: '18 of 24' },
  { variant: 'warning' as const, label: 'Retrying image upload', detail: 'attempt 2 of 3' },
  { variant: 'destructive' as const, label: 'Rolling back api-gateway', detail: 'triggered by CI' },
];

export function Variants() {
  return (
    <div className="border-border bg-card divide-border w-full max-w-md divide-y rounded-xl border">
      {jobs.map((job) => (
        <div key={job.variant} className="flex items-center gap-3 px-4 py-3">
          <Spinner size="sm" variant={job.variant} />
          <p className="min-w-0 flex-1 truncate text-sm">{job.label}</p>
          <p className="text-muted-foreground shrink-0 text-xs">{job.detail}</p>
        </div>
      ))}
    </div>
  );
}
