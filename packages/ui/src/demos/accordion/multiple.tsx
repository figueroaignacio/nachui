'use client';

import { Accordion } from '../../components/accordion';

const causes = [
  {
    value: 'module-not-found',
    trigger: 'Module not found during the build step',
    content:
      'The package resolves locally but not on the build machine. Move it out of devDependencies, commit the lockfile, and rerun the build with a cleared cache.',
  },
  {
    value: 'out-of-memory',
    trigger: 'Build ran out of memory',
    content:
      'Node stops at the default heap limit on large bundles. Set NODE_OPTIONS to --max-old-space-size=4096 in the project settings, then split the largest entry point if it happens again.',
  },
  {
    value: 'missing-env',
    trigger: 'Environment variable was undefined at build time',
    content:
      'Variables scoped to Preview are not injected into Production builds. Check the scope column in Settings, Environment Variables, and remember that only NEXT_PUBLIC_ values reach the browser bundle.',
  },
];

export function Multiple() {
  return (
    <Accordion type="multiple" className="w-full max-w-md">
      {causes.map((cause) => (
        <Accordion.Item key={cause.value} value={cause.value}>
          <Accordion.Trigger value={cause.value}>{cause.trigger}</Accordion.Trigger>
          <Accordion.Content value={cause.value} className="text-muted-foreground text-sm">
            {cause.content}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
