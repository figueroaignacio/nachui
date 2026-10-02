import { fontCode } from '@/lib/font';
import { Frame } from '@repo/ui/components/frame';
import { cn } from '@repo/ui/lib/cn';
import { useTranslations } from 'next-intl';
import { normalizeTokens, Prism } from 'prism-react-renderer';
import { CodeBlockCollapse } from './code-block-collapse';
import { CopyButton } from './copy-button';

const TOKEN_COLORS: [types: string[], style: React.CSSProperties][] = [
  [
    ['comment', 'prolog', 'doctype', 'cdata'],
    { color: 'var(--code-comment)', fontStyle: 'italic' },
  ],
  [['punctuation', 'operator'], { color: 'var(--code-punctuation)' }],
  [['keyword', 'builtin', 'important', 'atrule'], { color: 'var(--code-keyword)' }],
  [['string', 'char', 'attr-value', 'inserted', 'regex'], { color: 'var(--code-string)' }],
  [['function', 'class-name', 'maybe-class-name'], { color: 'var(--code-function)' }],
  [
    ['number', 'boolean', 'constant', 'symbol', 'attr-name', 'property'],
    { color: 'var(--code-number)' },
  ],
  [['tag', 'selector', 'deleted'], { color: 'var(--code-tag)' }],
];

const TOKEN_STYLES = new Map(
  TOKEN_COLORS.flatMap(([types, style]) => types.map((type) => [type, style] as const)),
);

const PLAIN_STYLE: React.CSSProperties = {
  color: 'var(--code-plain)',
  backgroundColor: 'transparent',
};

interface Segment {
  content: string;
  style?: React.CSSProperties;
}

/**
 * Tokenizes with the same Prism build prism-react-renderer ships, then folds
 * neighbouring tokens of the same color into one span and leaves plain text
 * bare. On the server the markup also travels in the RSC payload, so fewer
 * elements keeps both the HTML and the payload small.
 */
function highlightLines(code: string, language: string): Segment[][] {
  const lang = language.toLowerCase();
  const grammar = Prism.languages[lang];
  let lines = normalizeTokens([code]);

  if (grammar) {
    // The JSX grammar folds tag text into plain-text in an after-tokenize hook.
    const env = { code, grammar, language: lang, tokens: [] as (string | Prism.Token)[] };
    Prism.hooks.run('before-tokenize', env);
    env.tokens = Prism.tokenize(code, grammar);
    Prism.hooks.run('after-tokenize', env);
    lines = normalizeTokens(env.tokens);
  }

  return lines.map((line) => {
    const segments: Segment[] = [];
    for (const token of line) {
      let style: React.CSSProperties | undefined;
      for (const type of token.types) {
        const typeStyle = TOKEN_STYLES.get(type);
        if (typeStyle) style = { ...style, ...typeStyle };
      }

      const previous = segments.at(-1);
      if (
        previous &&
        previous.style?.color === style?.color &&
        previous.style?.fontStyle === style?.fontStyle
      ) {
        previous.content += token.content;
      } else if (token.content) {
        segments.push({ content: token.content, style });
      }
    }
    return segments;
  });
}

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
  collapsible?: boolean;
  framed?: boolean;
  title?: string;
}

/**
 * Highlights with Prism wherever it renders. From a server component (MDX,
 * component previews and sources) the tokens are resolved on the server and
 * only the copy and expand islands hydrate. Client callers like the chat or
 * the icon drawer still highlight in the browser.
 */
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

  const codeString = code.trim();

  const highlighted = (
    <div
      tabIndex={0}
      role="region"
      aria-label={t('region')}
      className="hide-scrollbar focus-visible:ring-ring overflow-x-auto rounded-md focus-visible:ring-2 focus-visible:outline-none"
    >
      <pre
        className={cn('w-fit min-w-full p-4 text-[13px] leading-[1.7]', fontCode.className)}
        style={PLAIN_STYLE}
      >
        {highlightLines(codeString, language).map((line, i) => (
          <div key={i} className="table-row">
            {showLineNumbers && (
              <span className="bg-code text-muted-foreground/60 sticky left-0 table-cell w-10 pr-4 text-right tabular-nums select-none">
                {i + 1}
              </span>
            )}
            <span className="table-cell pr-10">
              {line.length === 1 && line[0]?.content === '\n' ? (
                <span className="inline-block">{'\n'}</span>
              ) : (
                line.map((segment, key) =>
                  segment.style ? (
                    <span key={key} style={segment.style}>
                      {segment.content}
                    </span>
                  ) : (
                    segment.content
                  ),
                )
              )}
            </span>
          </div>
        ))}
      </pre>
    </div>
  );

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
      {collapsible ? (
        <CodeBlockCollapse expandLabel={t('expand')} collapseLabel={t('collapse')}>
          {highlighted}
        </CodeBlockCollapse>
      ) : (
        <div className="max-h-128 overflow-y-auto transition-[max-height] duration-400 ease-out motion-reduce:transition-none">
          {highlighted}
        </div>
      )}
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
