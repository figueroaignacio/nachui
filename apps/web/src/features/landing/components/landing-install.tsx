'use client';

import { CopyButton } from '@/components/mdx/copy-button';
import { Link } from '@/i18n/navigation';
import { ArrowRightIcon } from '@repo/ui/icons/arrow-right';
import { useTranslations } from 'next-intl';

type Tool = { name: string; description: string };

/**
 * The literal block a user pastes into their MCP client. Kept as one string so
 * the copy button hands over valid JSON instead of the rendered lines.
 */
const config = `{
  "mcpServers": {
    "nachui": {
      "command": "npx",
      "args": ["-y", "nachui-mcp"]
    }
  }
}`;

/** Minimal JSON tinting: quoted spans read as content, punctuation recedes. */
function ConfigLine({ line }: { line: string }) {
  const parts = line.split(/("(?:[^"\\]|\\.)*")/g);

  return (
    <span className="block whitespace-pre">
      {parts.map((part, index) =>
        part.startsWith('"') ? (
          <span key={index} className="text-foreground">
            {part}
          </span>
        ) : (
          <span key={index} className="text-muted-foreground">
            {part}
          </span>
        ),
      )}
    </span>
  );
}

/**
 * The MCP pitch as one floating panel: the copy and the config side by side,
 * and the four tools the server exposes underneath.
 */
export function LandingInstall() {
  const t = useTranslations('components.landingLogoCta');
  const tools: Tool[] = t.raw('tools');

  return (
    <section className="bg-island mx-auto mt-16 w-full max-w-[70rem] rounded-lg p-1.5 sm:rounded-xl md:mt-20">
      <div className="flex flex-col gap-1.5 lg:flex-row">
        <div className="flex flex-col items-start p-5 sm:p-7 lg:w-[44%] lg:shrink-0">
          <h2 className="font-heading text-foreground text-2xl leading-tight font-normal tracking-[-0.025em] md:text-3xl">
            {t('line1')}
            <span className="text-muted-foreground block">{t('line2')}</span>
          </h2>
          <p className="text-muted-strong mt-4 max-w-[52ch] leading-relaxed">{t('description')}</p>
          <Link
            href="/docs/concepts/mcp"
            className="bg-popover border-border text-foreground hover:border-border-interactive focus-visible:ring-ring focus-visible:ring-offset-card mt-7 inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {t('primaryAction')}
            <ArrowRightIcon size={15} aria-hidden="true" className="rtl:-scale-x-100" />
          </Link>
        </div>

        <div className="bg-code min-w-0 flex-1 rounded-md sm:rounded-lg">
          <div className="border-border flex items-center justify-between gap-4 border-b py-1.5 ps-4 pe-1.5">
            <span className="text-muted-foreground font-mono text-xs">{t('configFile')}</span>
            <CopyButton
              value={config}
              className="text-muted-foreground hover:text-foreground transition-colors"
            />
          </div>
          <pre dir="ltr" className="overflow-x-auto p-4 font-mono text-[13px] leading-[1.7] sm:p-5">
            <code>
              {config.split('\n').map((line, index) => (
                <ConfigLine key={index} line={line} />
              ))}
            </code>
          </pre>
        </div>
      </div>

      <dl className="grid gap-x-6 gap-y-5 px-5 pt-6 sm:grid-cols-2 sm:px-7 lg:grid-cols-4">
        {tools.map((tool) => (
          <div key={tool.name}>
            <dt className="text-foreground font-mono text-[13px]">{tool.name}</dt>
            <dd className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
              {tool.description}
            </dd>
          </div>
        ))}
      </dl>
      <p className="text-muted-foreground px-5 pt-5 pb-5 text-[13px] leading-relaxed sm:px-7 sm:pb-6">
        {t('outputNote')}
      </p>
    </section>
  );
}
