import { Card } from '@repo/ui/components/card';
import { Files } from '@repo/ui/components/files';

export function PreviewFiles() {
  return (
    <Card variant="outline" className="bg-card h-full">
      <Card.Content compact className="pt-4 pb-4">
        <div className="text-foreground mb-3 text-sm font-bold tracking-tight">
          Project Explorer
        </div>
        <Files defaultValue="src/components">
          <Files.Folder name="src">
            <Files.Folder name="components" status="modified">
              <Files.File name="button.tsx" status="modified" />
              <Files.File name="card.tsx" />
              <Files.File name="avatar.tsx" status="added" />
            </Files.Folder>
            <Files.Folder name="lib">
              <Files.File name="utils.ts" />
            </Files.Folder>
            <Files.File name="main.ts" status="renamed" />
          </Files.Folder>
          <Files.File name="package.json" />
          <Files.File name="README.md" status="ignored" />
        </Files>
      </Card.Content>
    </Card>
  );
}
