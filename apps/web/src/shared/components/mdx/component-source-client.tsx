// Components
import { Callout } from '@repo/ui/components/callout';
import { CodeBlock } from './codeblock';

interface ComponentSourceClientProps {
  code: string | null;
  className?: string;
  filePath?: string;
}

export function ComponentSourceClient({
  code,
  className = '',
  filePath,
}: ComponentSourceClientProps) {
  return (
    <div className={className}>
      {code ? (
        <CodeBlock code={code} language="tsx" collapsible />
      ) : (
        <Callout variant="danger">
          <Callout.Title>Unable to read the file</Callout.Title>
          <Callout.Content>{filePath || 'No path provided'}</Callout.Content>
        </Callout>
      )}
    </div>
  );
}
