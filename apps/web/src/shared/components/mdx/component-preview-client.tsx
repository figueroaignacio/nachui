'use client';

import { Callout } from '@repo/ui/components/callout';
import { Frame } from '@repo/ui/components/frame';
import { Typography } from '@repo/ui/components/typography';
import { cn } from '@repo/ui/lib/cn';
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
    <div data-no-select className={className}>
      <Frame className="mt-5">
        <Frame.Panel
          className={cn(
            'bg-code flex min-h-72 items-center p-6 *:min-w-0 sm:p-8',
            alignmentClasses[align],
          )}
        >
          {componentPreview}
        </Frame.Panel>
        {description && (
          <Frame.Header className="py-2">
            <Frame.Description className="text-sm">{description}</Frame.Description>
          </Frame.Header>
        )}
        {code ? (
          <Frame.Panel className="bg-code p-0">
            <CodeBlock
              code={code}
              language="tsx"
              showLineNumbers
              collapsible
              className="rounded-none border-0"
            />
          </Frame.Panel>
        ) : (
          <Frame.Panel className="p-0">
            <Callout variant="danger" className="rounded-none border-0">
              <Callout.Title>Unable to read the file</Callout.Title>
              <Callout.Content>{filePath || 'No path provided'}</Callout.Content>
            </Callout>
          </Frame.Panel>
        )}
      </Frame>
    </div>
  );
}
