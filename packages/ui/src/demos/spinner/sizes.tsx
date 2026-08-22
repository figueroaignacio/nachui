import { Spinner } from '../../components/spinner';

const sizes = [
  { size: 'sm' as const, usage: 'Table cell' },
  { size: 'md' as const, usage: 'Card body' },
  { size: 'lg' as const, usage: 'Side panel' },
  { size: 'xl' as const, usage: 'Full page' },
];

export function Sizes() {
  return (
    <div className="grid w-full max-w-md grid-cols-4 gap-3">
      {sizes.map((entry) => (
        <div
          key={entry.size}
          className="border-border bg-card flex h-28 flex-col items-center justify-center gap-3 rounded-lg border p-3"
        >
          <Spinner size={entry.size} />
          <p className="text-muted-foreground text-center text-xs">{entry.usage}</p>
        </div>
      ))}
    </div>
  );
}
