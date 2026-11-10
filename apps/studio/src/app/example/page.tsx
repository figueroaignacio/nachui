import type { Metadata } from 'next';
import { ExampleWorkspace } from '@/features/workspace/example-workspace';

export const metadata: Metadata = { title: 'Example: billing page' };

export default function ExamplePage() {
  return <ExampleWorkspace />;
}
