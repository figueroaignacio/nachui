// Components
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
      <div className="rounded border border-red-300 p-4 text-red-500">
        {error ?? `Error: Component "${component}" not found.`}
      </div>
    );
  }

  return (
    <ComponentSourceClient code={code} className={className} filePath={filePath || undefined} />
  );
}
