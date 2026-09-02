import { AspectRatio } from '../../layout/aspect-ratio';

const ratios = [
  { label: '1 / 1', value: 1 },
  { label: '4 / 3', value: 4 / 3 },
  { label: '3 / 4', value: 3 / 4 },
  { label: '21 / 9', value: 21 / 9 },
];

export function Ratios() {
  return (
    <div className="grid w-full max-w-md grid-cols-2 gap-4">
      {ratios.map((ratio) => (
        <div key={ratio.label} className="flex flex-col gap-1.5">
          <AspectRatio
            ratio={ratio.value}
            className="bg-muted text-muted-foreground flex items-center justify-center rounded-lg border border-dashed"
          >
            <span className="font-mono text-xs">{ratio.label}</span>
          </AspectRatio>
        </div>
      ))}
    </div>
  );
}
