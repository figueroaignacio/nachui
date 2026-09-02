import { ScrollArea } from '../../components/scroll-area';

const versions = Array.from({ length: 24 }, (_, index) => {
  const minor = 24 - index;
  return { tag: `v2.${minor}.0`, note: minor % 3 === 0 ? 'Security fixes' : 'Improvements' };
});

export function Default() {
  return (
    <ScrollArea className="border-border bg-card h-72 w-56 rounded-lg border">
      <div className="p-3">
        <p className="text-muted-foreground mb-3 px-1 text-xs font-medium tracking-wide uppercase">
          Releases
        </p>
        <ul className="flex flex-col">
          {versions.map((version) => (
            <li
              key={version.tag}
              className="border-border flex items-center justify-between border-b px-1 py-2 text-sm last:border-0"
            >
              <span className="font-medium">{version.tag}</span>
              <span className="text-muted-foreground text-xs">{version.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </ScrollArea>
  );
}
