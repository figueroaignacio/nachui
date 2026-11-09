import { CodeBlock } from '@/shared/components/mdx/codeblock';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Button } from '@repo/ui/components/button';
import { CheckIcon } from '@repo/ui/icons/check';
import { CopyIcon } from '@repo/ui/icons/copy';
import { DownloadIcon } from '@repo/ui/icons/download';
import { useTranslations } from 'next-intl';

import type { ThemeMode } from '../lib/customize';
import { initCommand, type ThemePreset } from '../lib/presets';
import { serializeTokens, type ThemeTokens } from '../lib/tokens';

function downloadFile(filename: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

interface ExportPanelProps {
  preset: ThemePreset;
  theme: ThemeTokens;
  css: string;
  dirty: boolean;
}

export function ExportPanel({ preset, theme, css, dirty }: ExportPanelProps) {
  const t = useTranslations('sections.themes.export');
  const { isCopied, copyToClipboard } = useCopyToClipboard(2000);
  const slug = dirty ? `${preset.name}-custom` : preset.name;

  const download = (mode: ThemeMode) =>
    downloadFile(`${slug}-${mode}.tokens.json`, serializeTokens(theme[mode]));

  return (
    <section aria-labelledby="themes-export" className="flex flex-col gap-4">
      <h2 id="themes-export" className="section-label">
        {t('heading')}
      </h2>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="border-border bg-card flex flex-col gap-3 rounded-lg border p-4">
          <h3 className="text-foreground text-sm font-medium">{t('cli')}</h3>
          {dirty ? (
            <p className="text-muted-foreground text-sm leading-relaxed">{t('cliDirty')}</p>
          ) : (
            <>
              <p className="text-muted-foreground text-sm leading-relaxed">{t('cliHint')}</p>
              <CodeBlock language="bash" showLineNumbers={false} code={initCommand(preset.name)} />
            </>
          )}
        </div>

        <div className="border-border bg-card flex flex-col gap-3 rounded-lg border p-4">
          <h3 className="text-foreground text-sm font-medium">{t('tokens')}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{t('tokensHint')}</p>
          <div className="mt-auto flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<DownloadIcon size={14} aria-hidden="true" />}
              onClick={() => download('light')}
            >
              {t('downloadLight')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<DownloadIcon size={14} aria-hidden="true" />}
              onClick={() => download('dark')}
            >
              {t('downloadDark')}
            </Button>
          </div>
        </div>
      </div>

      <div className="border-border bg-card flex flex-col gap-3 rounded-lg border p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="text-foreground text-sm font-medium">{t('css')}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{t('cssHint')}</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => copyToClipboard(css)}
            leftIcon={
              isCopied ? (
                <CheckIcon size={14} aria-hidden="true" />
              ) : (
                <CopyIcon size={14} aria-hidden="true" />
              )
            }
          >
            {isCopied ? t('copied') : t('copyCss')}
          </Button>
        </div>
        <CodeBlock language="css" code={css} collapsible />
      </div>
    </section>
  );
}
