import { DEMO_REGISTRY } from '@repo/ui/registry';
import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { fromRepoRoot } from '@/lib/repo-root';
import { rewriteDemoImports } from './get-component-code';

describe('rewriteDemoImports', () => {
  it('points every component family at the components alias', () => {
    const code = [
      "import { Button } from '../../components/button';",
      'import { Flex } from "../../layout/flex";',
      "import { Message } from '../../ai/message';",
      "import { AgentRun } from '../../hybrids/agent-run';",
      "import { CheckIcon } from '../../icons/check';",
    ].join('\n');

    expect(rewriteDemoImports(code)).toBe(
      [
        "import { Button } from '@/components/ui/button';",
        'import { Flex } from "@/components/ui/flex";',
        "import { Message } from '@/components/ui/message';",
        "import { AgentRun } from '@/components/ui/agent-run';",
        "import { CheckIcon } from '@/components/ui/check';",
      ].join('\n'),
    );
  });

  it('keeps lib imports on their own alias', () => {
    expect(rewriteDemoImports("import { cn } from '../../lib/cn';")).toBe(
      "import { cn } from '@/lib/cn';",
    );
  });

  it('leaves package and sibling imports alone', () => {
    const code = "import * as React from 'react';\nimport { data } from './data';";
    expect(rewriteDemoImports(code)).toBe(code);
  });

  it('leaves no demo importing outside the rewritten families', () => {
    const escaped: string[] = [];
    for (const demos of Object.values(DEMO_REGISTRY)) {
      for (const relativePath of Object.values(demos as Record<string, string>)) {
        const code = rewriteDemoImports(fs.readFileSync(fromRepoRoot(relativePath), 'utf8'));
        if (/from ['"]\.\.\/\.\.\//.test(code)) escaped.push(relativePath);
      }
    }
    expect(escaped).toEqual([]);
  });
});
