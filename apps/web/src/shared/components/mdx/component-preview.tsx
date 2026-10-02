import { getDemoCode } from '@/features/docs/lib/get-component-code';
import { Callout } from '@repo/ui/components/callout';
import { ComponentPreviewClient } from './component-preview-client';
import { DEMO_COMPONENTS } from './demo-registry';

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

  if (error) {
    return (
      <Callout variant="danger" className="my-4">
        <Callout.Title>Unable to load demo</Callout.Title>
        <Callout.Content>
          {error ?? `Error: Demo "${demo}" not found for component "${component}".`}
        </Callout.Content>
      </Callout>
    );
  }

  const loadDemo = DEMO_COMPONENTS[component]?.[demo];
  const DemoComponent = loadDemo ? await loadDemo() : undefined;

  if (!DemoComponent) {
    return (
      <Callout variant="danger" className="my-4">
        <Callout.Title>Missing demo import</Callout.Title>
        <Callout.Content>
          Error: Demo component not imported for &quot;{component}/{demo}&quot;.
        </Callout.Content>
      </Callout>
    );
  }

  const componentPreview = <DemoComponent />;

  return (
    <ComponentPreviewClient
      componentPreview={componentPreview}
      code={code}
      description={description}
      className={className}
      align={align}
      filePath={filePath || undefined}
    />
  );
}
