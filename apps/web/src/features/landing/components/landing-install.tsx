'use client';

import { CopyButton } from '@/components/mdx/copy-button';
import { AiWalker } from '@/features/chat/ui/ai-walker';
import { Link } from '@/i18n/navigation';
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

export function LandingInstall() {
  const t = useTranslations('components.landingLogoCta');
  const tools: Tool[] = t.raw('tools');

  return (
    <section className="w-full py-10 sm:py-14">
      <div className="rule-bleed rule-draw" />
      <div className="scroll-reveal mt-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
        <div className="flex flex-col lg:w-[40%] lg:shrink-0">
          <p className="section-label">{t('label')}</p>
          <h2 className="font-heading text-foreground mt-3 text-xl leading-tight font-semibold tracking-tight md:text-[1.375rem]">
            {t('line1')}
            <span className="text-muted-foreground block">{t('line2')}</span>
          </h2>
          <p className="text-muted-strong mt-3 text-sm leading-relaxed">{t('description')}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/docs/installation"
              className="bg-foreground text-background inline-flex items-center gap-2 rounded-md px-4 py-2 font-mono text-sm transition-all hover:opacity-80 active:scale-[0.98]"
            >
              {t('primaryAction')} →
            </Link>
            <Link
              href="/docs/elements/ui"
              className="text-muted-foreground hover:text-foreground font-mono text-sm transition-colors"
            >
              {t('secondaryAction')} ↗
            </Link>
          </div>
        </div>

        <div className="min-w-0 lg:flex-1">
          <div className="border-border bg-card/40 overflow-hidden rounded-lg border">
            <div className="border-border flex items-center justify-between gap-4 border-b px-3 py-2">
              <span className="text-muted-foreground font-mono text-[11px]">{t('configFile')}</span>
              <CopyButton
                value={config}
                className="text-muted-foreground hover:text-foreground transition-colors"
              />
            </div>
            <div className="overflow-x-auto p-4 sm:p-5">
              <pre className="font-mono text-[12px] leading-[1.8]">
                <code>
                  {config.split('\n').map((line, index) => (
                    <ConfigLine key={index} line={line} />
                  ))}
                </code>
              </pre>
            </div>
          </div>
          <ul className="mt-5 space-y-2.5">
            {tools.map((tool) => (
              <li
                key={tool.name}
                className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3"
              >
                <code className="text-foreground shrink-0 font-mono text-[12px]">{tool.name}</code>
                <span className="text-muted-foreground text-[13px] leading-relaxed">
                  {tool.description}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground mt-5 font-mono text-[11px] leading-relaxed">
            {t('outputNote')}
          </p>
        </div>
      </div>
      <div className="relative mt-16">
        <div className="rule-bleed" />
        <div className="ai-walk-track" aria-hidden="true">
          <AiWalker />
        </div>
      </div>
      <p className="text-muted-foreground mt-4 font-mono text-xs">{t('license')}</p>
    </section>
  );
}
