'use client';

import { CopyButton } from '@/components/mdx/copy-button';
import { AiWalker } from '@/features/chat/ui/ai-walker';
import { Link } from '@/i18n/navigation';
import { ArrowRight02Icon, ArrowUpRight01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { buttonVariants } from '@repo/ui/components/button';
import { cn } from '@repo/ui/lib/cn';
import { Frame } from '@repo/ui/components/frame';
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
          <h2 className="font-heading text-foreground mt-3 text-lg leading-tight font-semibold tracking-tight md:text-xl">
            {t('line1')}
            <span className="text-muted-foreground block">{t('line2')}</span>
          </h2>
          <p className="text-muted-strong mt-3 text-sm leading-relaxed">{t('description')}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/docs/installation"
              className={cn(buttonVariants({ variant: 'default', size: 'sm' }), 'font-mono')}
            >
              {t('primaryAction')}
              <HugeiconsIcon icon={ArrowRight02Icon} size={14} aria-hidden="true" />
            </Link>
            <Link
              href="/docs/elements/ui"
              className={cn(
                buttonVariants({ variant: 'link', size: 'sm' }),
                'text-muted-foreground hover:text-foreground font-mono',
              )}
            >
              {t('secondaryAction')}
              <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="min-w-0 lg:flex-1">
          <Frame spacing="sm">
            <Frame.Header className="flex-row items-center justify-between gap-4 py-1 pr-1 pl-3">
              <Frame.Title className="text-muted-foreground font-mono text-[11px] font-normal">
                {t('configFile')}
              </Frame.Title>
              <CopyButton
                value={config}
                className="text-muted-foreground hover:text-foreground transition-colors"
              />
            </Frame.Header>
            <Frame.Panel className="overflow-x-auto sm:p-5">
              <pre className="font-mono text-[12px] leading-[1.8]">
                <code>
                  {config.split('\n').map((line, index) => (
                    <ConfigLine key={index} line={line} />
                  ))}
                </code>
              </pre>
            </Frame.Panel>
          </Frame>
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
