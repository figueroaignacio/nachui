import { AspectRatio } from '../../layout/aspect-ratio';
import { Split } from '../../layout/split';

export function Reverse() {
  return (
    <Split ratio="1/2" collapse="sm" align="center" reverse className="w-full max-w-lg">
      <div className="flex flex-col gap-2">
        <p className="text-lg font-semibold">Preview every branch</p>
        <p className="text-muted-foreground text-sm">
          Each pull request gets its own URL, seeded with a copy of staging data. On small screens
          the image moves above this text.
        </p>
      </div>
      <AspectRatio ratio={4 / 3} className="rounded-lg">
        <img src="https://picsum.photos/seed/split/640/480" alt="Preview deployment" />
      </AspectRatio>
    </Split>
  );
}
