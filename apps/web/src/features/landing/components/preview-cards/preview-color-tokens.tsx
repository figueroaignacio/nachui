import { Badge } from '@repo/ui/components/badge';

const colors = [
  { name: 'Primary', hex: '#6366f1', label: 'Indigo 500' },
  { name: 'Success', hex: '#22c55e', label: 'Green 500' },
  { name: 'Warning', hex: '#f59e0b', label: 'Amber 500' },
  { name: 'Danger', hex: '#ef4444', label: 'Red 500' },
  { name: 'Info', hex: '#3b82f6', label: 'Blue 500' },
  { name: 'Neutral', hex: '#71717a', label: 'Zinc 500' },
];

export function PreviewColorTokens() {
  return (
    <div
      className="border-border bg-card flex flex-col gap-4 rounded-2xl border p-5"
      role="region"
      aria-label="Design color tokens"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Color Tokens
        </span>
        <Badge
          variant="outline"
          className="h-5 border-zinc-300 px-1.5 text-[9px] font-bold text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
        >
          v2.4
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {colors.map((c) => (
          <div key={c.name} className="flex flex-col gap-1.5">
            <div
              className="h-8 w-full rounded-lg shadow-sm"
              style={{ backgroundColor: c.hex }}
              aria-label={`${c.name} color swatch`}
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-zinc-900 dark:text-zinc-50">
                {c.name}
              </span>
              <span className="font-mono text-[9px] text-zinc-400 dark:text-zinc-500">
                {c.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
