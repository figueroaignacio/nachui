'use client';

import { fontCode } from '@/lib/font';
import { Frame } from '@repo/ui/components/frame';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';
import { Highlight, type PrismTheme } from 'prism-react-renderer';
import { useState } from 'react';
import { CopyButton } from './copy-button';

const codeTheme: PrismTheme = {
  plain: { color: 'var(--code-plain)', backgroundColor: 'transparent' },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: { color: 'var(--code-comment)', fontStyle: 'italic' },
    },
    { types: ['punctuation', 'operator'], style: { color: 'var(--code-punctuation)' } },
    {
      types: ['keyword', 'builtin', 'important', 'atrule'],
      style: { color: 'var(--code-keyword)' },
    },
    {
      types: ['string', 'char', 'attr-value', 'inserted', 'regex'],
      style: { color: 'var(--code-string)' },
    },
    {
      types: ['function', 'class-name', 'maybe-class-name'],
      style: { color: 'var(--code-function)' },
    },
    {
      types: ['number', 'boolean', 'constant', 'symbol', 'attr-name', 'property'],
      style: { color: 'var(--code-number)' },
    },
    { types: ['tag', 'selector', 'deleted'], style: { color: 'var(--code-tag)' } },
  ],
};

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
  collapsible?: boolean;
  framed?: boolean;
  title?: string;
}

export function CodeBlock({
  code,
  language = 'tsx',
  className,
  showLineNumbers = true,
  collapsible = false,
  framed = false,
  title,
}: CodeBlockProps) {
  const t = useTranslations('components.codeblockWrapper');
  const [isExpanded, setIsExpanded] = useState(false);

  const codeString = code.trim();
  const isCollapsed = collapsible && !isExpanded;

  const block = (
    <div
      className={cn(
        'bg-code relative overflow-hidden',
        framed ? 'rounded-lg' : cn('border-rule rounded-md border', className),
      )}
    >
      {!framed && (
        <CopyButton
          value={codeString}
          className="bg-code/80 absolute top-2.5 right-2.5 z-20 rounded-sm p-1.5 backdrop-blur-sm"
        />
      )}
      <div
        className={cn(
          'transition-[max-height] duration-400 ease-out motion-reduce:transition-none',
          isCollapsed ? 'max-h-52 overflow-y-hidden' : 'max-h-128 overflow-y-auto',
        )}
      >
        <div
          tabIndex={0}
          role="region"
          aria-label={t('region')}
          className="hide-scrollbar focus-visible:ring-ring overflow-x-auto rounded-md focus-visible:ring-2 focus-visible:outline-none"
        >
          <Highlight code={codeString} language={language} theme={codeTheme}>
            {({ style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className={cn('w-fit min-w-full p-4 text-[13px] leading-[1.7]', fontCode.className)}
                style={{ ...style, backgroundColor: 'transparent' }}
              >
                {tokens.map((line, i) => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const { key: _key, ...lineProps } = getLineProps({ line, key: i });
                  return (
                    <div key={i} {...lineProps} className={cn('table-row', lineProps.className)}>
                      {showLineNumbers && (
                        <span className="bg-code text-muted-foreground/60 sticky left-0 table-cell w-10 pr-4 text-right tabular-nums select-none">
                          {i + 1}
                        </span>
                      )}
                      <span className="table-cell pr-10">
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </span>
                    </div>
                  );
                })}
              </pre>
            )}
          </Highlight>
        </div>
      </div>

      {collapsible &&
        (isCollapsed ? (
          <div className="from-code via-code absolute inset-x-0 bottom-0 flex justify-center bg-linear-to-t to-transparent pt-16 pb-3">
            <ExpandButton onClick={() => setIsExpanded(true)}>{t('expand')}</ExpandButton>
          </div>
        ) : (
          <div className="border-rule flex justify-center border-t py-2">
            <ExpandButton onClick={() => setIsExpanded(false)}>{t('collapse')}</ExpandButton>
          </div>
        ))}
    </div>
  );

  if (!framed) return block;

  return (
    <Frame spacing="sm" className={className}>
      <Frame.Header className="min-h-0 flex-row items-center justify-between gap-3 py-1 pr-1 pl-3">
        <span className="text-muted-foreground min-w-0 truncate font-mono text-[11px]">
          {title}
        </span>
        <CopyButton value={codeString} className="rounded-sm p-1.5" />
      </Frame.Header>
      <Frame.Panel className="bg-code border-border p-0">{block}</Frame.Panel>
    </Frame>
  );
}

function ExpandButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-sm px-3 py-1 font-mono text-xs transition-colors"
    >
      {children}
    </button>
  );
}
