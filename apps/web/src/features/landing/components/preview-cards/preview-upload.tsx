import { Card } from '@repo/ui/components/card';
import { Progress } from '@repo/ui/components/progress';
import { UploadIcon } from '@repo/ui/icons/upload';

export function PreviewUpload() {
  return (
    <Card>
      <Card.Header compact>
        <Card.Title className="text-sm font-semibold">Upload files</Card.Title>
      </Card.Header>
      <Card.Content compact>
        <div className="border-input text-muted-foreground flex flex-col items-center gap-2 rounded-md border border-dashed px-3 py-6 text-xs">
          <UploadIcon size={18} aria-hidden="true" />
          Drop files or browse
        </div>
        <div className="mt-3.5 flex justify-between text-xs">
          <span className="text-foreground">brand-kit.zip</span>
          <span className="text-muted-foreground font-mono text-[11px]">72%</span>
        </div>
        <Progress value={72} label="brand-kit.zip" className="mt-2" />
      </Card.Content>
    </Card>
  );
}
