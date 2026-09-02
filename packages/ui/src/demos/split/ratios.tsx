import { Split, type SplitRatio } from '../../layout/split';

const ratios: SplitRatio[] = ['1/2', '1/3', '2/3', '1/4', 'auto'];

export function Ratios() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      {ratios.map((ratio) => (
        <Split key={ratio} ratio={ratio} collapse="none" gap="2">
          <div className="bg-primary/10 text-primary rounded-md px-3 py-2 font-mono text-xs">
            {ratio}
          </div>
          <div className="bg-muted text-muted-foreground rounded-md px-3 py-2 font-mono text-xs">
            rest
          </div>
        </Split>
      ))}
    </div>
  );
}
