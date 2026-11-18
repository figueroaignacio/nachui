import { CodeBlock } from '@/components/mdx/codeblock';
import { DEMO_COMPONENTS } from '@/components/mdx/demo-registry';
import { Callout } from '@repo/ui/components/callout';
import { getTranslations } from 'next-intl/server';
import { StagePreview } from '../components/demo-stage';
import { getDemoCode } from '../lib/get-component-code';
import { ComponentPreviewClient } from './component-preview-client';

interface ComponentPreviewProps {
  component: string;
  demo?: string;
  description?: string;
  className?: string;
  align?: 'center' | 'start' | 'end';
}

export async function ComponentPreview({
  component,
  demo = 'default',
  description,
  className = '',
  align = 'center',
}: ComponentPreviewProps) {
  const { code, filePath, error } = await getDemoCode(component, demo);
  const t = await getTranslations('docs.preview');

  if (error) {
    return (
      <Callout variant="danger" className="my-4">
        <Callout.Title>{t('loadError')}</Callout.Title>
        <Callout.Content>{error}</Callout.Content>
      </Callout>
    );
  }

  const loadDemo = DEMO_COMPONENTS[component]?.[demo];
  const DemoComponent = loadDemo ? await loadDemo() : undefined;

  if (!DemoComponent) {
    return (
      <Callout variant="danger" className="my-4">
        <Callout.Title>{t('missingTitle')}</Callout.Title>
        <Callout.Content>{t('missingDescription', { component, demo })}</Callout.Content>
      </Callout>
    );
  }

  const componentPreview = <DemoComponent />;

  return (
    <StagePreview
      demoKey={`${component}/${demo}`}
      demo={componentPreview}
      code={
        code ? (
          <CodeBlock code={code} language="tsx" collapsible className="rounded-none border-0" />
        ) : null
      }
      fullCode={
        code ? <CodeBlock code={code} language="tsx" className="rounded-none border-0" /> : null
      }
      fallback={
        <ComponentPreviewClient
          componentPreview={componentPreview}
          code={code}
          description={description}
          className={className}
          align={align}
          filePath={filePath || undefined}
        />
      }
    />
  );
}
