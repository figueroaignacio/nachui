import { AspectRatio } from '../../layout/aspect-ratio';

export function Default() {
  return (
    <div className="w-full max-w-md">
      <AspectRatio ratio={16 / 9} className="rounded-xl">
        <img src="https://picsum.photos/seed/aspect/960/540" alt="Office at golden hour" />
      </AspectRatio>
    </div>
  );
}
