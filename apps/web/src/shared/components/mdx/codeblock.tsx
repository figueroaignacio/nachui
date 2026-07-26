'use client';

import { fontCode } from '@/lib/font';
import { cn } from '@repo/ui/lib/cn';
import { Highlight, themes } from 'prism-react-renderer';
import { useRef } from 'react';
import { CopyButton } from './copy-button';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
  filename?: string;
}

export function CodeBlock({
  code,
  language = 'tsx',
  className,
  showLineNumbers = true,
  filename: _filename,
}: CodeBlockProps) {
  const codeString = code.trim();
  const filename = _filename?.trim() || undefined;
  const preRef = useRef<HTMLPreElement>(null);

  return (
    <div
      className={cn(
        'group relative mt-6 w-full overflow-hidden rounded-sm bg-[#0a0908]',
        className,
      )}
    >
      <div className="max-h-inherit flex h-full flex-col">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-[#201f1e]/50 px-4 py-2 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
            </div>
            {filename ? (
              <span
                className={cn(
                  'rounded-sm bg-white/5 px-2 py-0.5 font-mono text-[11px] leading-none text-white/60',
                  fontCode.className,
                )}
              >
                {filename}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <CopyButton value={codeString} />
          </div>
        </div>
        <Highlight code={codeString} language={language} theme={themes.vsDark}>
          {({ className: _className, style, tokens, getLineProps, getTokenProps }) => (
            <>
              <pre
                ref={preRef}
                className={cn(
                  'overflow-x-auto p-5 text-[13px] leading-relaxed',
                  fontCode.className,
                )}
                style={{ ...style, backgroundColor: 'transparent' }}
              >
                {tokens.map((line, i) => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const { key: _key, ...lineProps } = getLineProps({ line, key: i });
                  return (
                    <div key={i} {...lineProps} className={cn('table-row', lineProps.className)}>
                      {showLineNumbers && (
                        <span className="table-cell w-8 pr-4 text-right text-white/20 select-none">
                          {i + 1}
                        </span>
                      )}
                      <span className="table-cell">
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </span>
                    </div>
                  );
                })}
              </pre>
            </>
          )}
        </Highlight>
      </div>
    </div>
  );
}
