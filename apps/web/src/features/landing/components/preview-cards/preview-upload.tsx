import { Card } from '@repo/ui/components/card';
import { Progress } from '@repo/ui/components/progress';
import Image from 'next/image';

const photos = ['sea', 'road', 'forest'];

export function PreviewUpload() {
  return (
    <Card className="gap-3 p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-foreground text-sm font-semibold">Uploading 3 photos</p>
        <p className="text-brand-text font-mono text-xs">68%</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo, index) => (
          <div key={photo} className="relative overflow-hidden rounded-md">
            <Image
              src={`/images/landing/${photo}.jpg`}
              alt=""
              width={640}
              height={480}
              sizes="96px"
              className="h-20 w-full object-cover"
            />
            {index === photos.length - 1 && (
              <span className="bg-overlay text-inverse-foreground absolute inset-0 flex items-center justify-center font-mono text-xs">
                68%
              </span>
            )}
          </div>
        ))}
      </div>
      <Progress value={68} label="Upload progress" />
    </Card>
  );
}
