import { describe, expect, it } from 'vitest';
import { installCommand } from './install-command';

describe('installCommand', () => {
  it('lists the NachUI items the screen imports', () => {
    expect(
      installCommand({
        'screens/billing.tsx': `import { Card } from '../components/card';\nimport { cn } from '../lib/cn';\nimport { Tool } from '../ai/tool';\nimport { useState } from 'react';`,
        'screens/billing/plan.tsx': `import { Badge } from '../../components/badge';\nimport type { CardProps } from '../../components/card';`,
      }),
    ).toBe('npx nachui add ai/tool lib/cn ui/badge ui/card');
  });

  it('is empty without NachUI imports', () => {
    expect(installCommand({ 'screens/a.tsx': `import { useState } from 'react';` })).toBeNull();
  });
});
