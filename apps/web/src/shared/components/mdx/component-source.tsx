// Components
import { Callout } from '@repo/ui/components/callout';
import { ComponentSourceClient } from './component-source-client';

// Utils
import { getComponentSourceCode } from '@/features/docs/lib/get-component-code';

interface ComponentSourceProps {
  component: string;
  className?: string;
}

export async function ComponentSource({ component, className }: ComponentSourceProps) {
  const { code, filePath, error } = await getComponentSourceCode(component);

  if (error) {
    return (
      <Callout variant="danger" className="my-4">
        <Callout.Title>Unable to load source</Callout.Title>
        <Callout.Content>{error ?? `Error: Component "${component}" not found.`}</Callout.Content>
      </Callout>
    );
  }

  return (
    <ComponentSourceClient code={code} className={className} filePath={filePath || undefined} />
  );
}
