'use client';

// Components
import { CodeBlockWrapper } from './code-block-wrapper';
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
        <CodeBlockWrapper>
          <CodeBlock code={code} language="tsx" />
        </CodeBlockWrapper>
      ) : (
        <div className="rounded border border-red-300 p-4 text-red-500">
          Error al leer el archivo: {filePath || 'No especificado'}
        </div>
      )}
    </div>
  );
}
