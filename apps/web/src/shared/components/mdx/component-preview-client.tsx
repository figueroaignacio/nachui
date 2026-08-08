'use client';

import { Typography } from '@repo/ui/components/typography';
import { CodeBlock } from './codeblock';

interface ComponentPreviewClientProps {
  componentPreview: React.ReactNode;
  code: string | null;
  description?: string;
  className?: string;
  align?: 'center' | 'start' | 'end';
  filePath?: string;
}

export function ComponentPreviewClient({
  componentPreview,
  code,
  description,
  className = '',
  align = 'center',
  filePath,
}: ComponentPreviewClientProps) {
  const alignmentClasses = {
    center: 'justify-center',
    start: 'justify-start',
    end: 'justify-end',
  };

  return (
    <div className={className}>
      <div className="border-rule mt-5 overflow-hidden rounded-md border">
        <div className={`flex min-h-100 items-center ${alignmentClasses[align]} p-8 sm:p-12`}>
          {componentPreview}
        </div>
        {description && (
          <div className="border-rule bg-muted/30 border-t px-6 py-4">
            <Typography variant="p" className="text-muted-foreground text-sm">
              {description}
            </Typography>
          </div>
        )}
        <div className="border-rule border-t">
          {code ? (
            <CodeBlock
              code={code}
              language="tsx"
              showLineNumbers
              collapsible
              className="rounded-none border-0"
            />
          ) : (
            <div className="border-border bg-destructive/10 p-6">
              <Typography variant="p" className="text-destructive text-sm font-medium">
                ⚠️ Error al leer el archivo: {filePath || 'No especificado'}
              </Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
