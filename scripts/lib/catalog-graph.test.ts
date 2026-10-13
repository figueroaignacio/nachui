import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  buildCatalogGraph,
  findStaleSlugs,
  npmPackageName,
  parseImportSpecifiers,
  resolveRelativeImport,
  slugForFile,
} from './catalog-graph';

const dirFamilies = new Map([
  ['components', 'ui'],
  ['layout', 'layout'],
  ['ai', 'ai'],
  ['hybrids', 'hybrids'],
  ['lib', 'lib'],
  ['hooks', 'hooks'],
]);

describe('parseImportSpecifiers', () => {
  it('finds static, type-only, multi-line, re-export, side-effect and dynamic imports', () => {
    const code = [
      "'use client';",
      "import { useState } from 'react';",
      "import type { Variants } from 'motion/react';",
      'import {',
      '  Button,',
      '  type ButtonProps,',
      "} from '../components/button';",
      "export { cn } from '../lib/cn';",
      "export * from './label';",
      "import './styles.css';",
      "const Lazy = lazy(() => import('../ai/tool'));",
    ].join('\n');

    assert.deepEqual(parseImportSpecifiers(code), [
      'react',
      'motion/react',
      '../components/button',
      '../lib/cn',
      './label',
      './styles.css',
      '../ai/tool',
    ]);
  });

  it('ignores the word from inside strings and identifiers', () => {
    const code = [
      "const label = 'Pick from the list';",
      'export const fromValue = 1;',
      "export function Copy() { return 'import from x'; }",
    ].join('\n');

    assert.deepEqual(parseImportSpecifiers(code), []);
  });

  it('dedupes repeated specifiers', () => {
    const code = "import { a } from '../lib/cn';\nimport type { B } from '../lib/cn';";
    assert.deepEqual(parseImportSpecifiers(code), ['../lib/cn']);
  });
});

describe('npmPackageName', () => {
  it('reduces subpaths to the package', () => {
    assert.equal(npmPackageName('motion/react'), 'motion');
    assert.equal(npmPackageName('@scope/pkg/sub/path'), '@scope/pkg');
    assert.equal(npmPackageName('react'), 'react');
  });

  it('skips relative paths and node builtins', () => {
    assert.equal(npmPackageName('../lib/cn'), null);
    assert.equal(npmPackageName('./label'), null);
    assert.equal(npmPackageName('node:fs'), null);
  });
});

describe('resolveRelativeImport', () => {
  const files = new Set(['lib/cn.ts', 'components/button.tsx', 'hooks/index.ts']);
  const exists = (file: string) => files.has(file);

  it('tries .ts then .tsx', () => {
    assert.equal(resolveRelativeImport('components/x.tsx', '../lib/cn', exists), 'lib/cn.ts');
    assert.equal(
      resolveRelativeImport('hybrids/chat.tsx', '../components/button', exists),
      'components/button.tsx',
    );
    assert.equal(
      resolveRelativeImport('components/x.tsx', './button', exists),
      'components/button.tsx',
    );
  });

  it('falls back to index files', () => {
    assert.equal(resolveRelativeImport('components/x.tsx', '../hooks', exists), 'hooks/index.ts');
  });

  it('refuses paths outside src and missing files', () => {
    assert.equal(resolveRelativeImport('components/x.tsx', '../../package', exists), null);
    assert.equal(resolveRelativeImport('components/x.tsx', './missing', exists), null);
  });
});

describe('slugForFile', () => {
  it('maps a directory to its family', () => {
    assert.equal(slugForFile('components/button.tsx', dirFamilies), 'ui/button');
    assert.equal(
      slugForFile('lib/use-controllable-state.ts', dirFamilies),
      'lib/use-controllable-state',
    );
  });

  it('rejects nested files and unknown directories', () => {
    assert.equal(slugForFile('components/nested/button.tsx', dirFamilies), null);
    assert.equal(slugForFile('demos/button.tsx', dirFamilies), null);
  });
});

describe('buildCatalogGraph', () => {
  function graphFor(sources: Record<string, string>, seeds: string[]) {
    return buildCatalogGraph({
      seeds,
      dirFamilies,
      readFile: (file) => {
        const code = sources[file];
        if (code === undefined) throw new Error(`unexpected read of ${file}`);
        return code;
      },
      exists: (file) => file in sources,
    });
  }

  it('pulls in lib files reached by components and records registryDependencies', () => {
    const graph = graphFor(
      {
        'components/button.tsx':
          "import { cn } from '../lib/cn';\nimport { motion } from 'motion/react';",
        'components/dialog.tsx':
          "import { cn } from '../lib/cn';\nimport { Button } from './button';",
        'lib/cn.ts': "import { clsx } from 'clsx';\nimport { twMerge } from 'tailwind-merge';",
        'lib/unused.ts': '',
      },
      ['components/button.tsx', 'components/dialog.tsx'],
    );

    assert.deepEqual(graph.errors, []);
    assert.deepEqual(
      graph.items.map((i) => [i.slug, i.registryDependencies, i.dependencies]),
      [
        ['lib/cn', [], ['clsx', 'tailwind-merge']],
        ['ui/button', ['lib/cn'], ['motion']],
        ['ui/dialog', ['lib/cn', 'ui/button'], []],
      ],
    );
  });

  it('handles new lib files generically, including lib to lib imports', () => {
    const graph = graphFor(
      {
        'components/popover.tsx': "import { useOverlay } from '../lib/overlay';",
        'lib/overlay.ts': "import { useControllableState } from './use-controllable-state';",
        'lib/use-controllable-state.ts': "import { useState } from 'react';",
      },
      ['components/popover.tsx'],
    );

    assert.deepEqual(graph.errors, []);
    assert.deepEqual(
      graph.items.map((i) => i.slug),
      ['lib/overlay', 'lib/use-controllable-state', 'ui/popover'],
    );
    assert.deepEqual(graph.items[0]?.registryDependencies, ['lib/use-controllable-state']);
  });

  it('terminates on import cycles', () => {
    const graph = graphFor(
      {
        'components/a.tsx': "import { B } from './b';",
        'components/b.tsx': "import { A } from './a';",
      },
      ['components/a.tsx'],
    );

    assert.deepEqual(graph.errors, []);
    assert.deepEqual(
      graph.items.map((i) => [i.slug, i.registryDependencies]),
      [
        ['ui/a', ['ui/b']],
        ['ui/b', ['ui/a']],
      ],
    );
  });

  it('reports unresolvable imports, workspace packages and wrong extensions', () => {
    const graph = graphFor(
      {
        'components/a.tsx': "import { x } from './missing';\nimport { y } from '@repo/ui';",
        'components/b.tsx': "import { z } from '../lib/jsx-helper';",
        'lib/jsx-helper.tsx': '',
      },
      ['components/a.tsx', 'components/b.tsx'],
    );

    assert.equal(graph.errors.length, 3);
    assert.match(graph.errors.join('\n'), /cannot resolve '\.\/missing'/);
    assert.match(graph.errors.join('\n'), /workspace package @repo\/ui/);
    assert.match(graph.errors.join('\n'), /lib family must use \.ts/);
  });
});

describe('findStaleSlugs', () => {
  it('returns rows with no synced item', () => {
    assert.deepEqual(findStaleSlugs(['ui/old', 'ui/button', 'button'], ['ui/button']), [
      'button',
      'ui/old',
    ]);
  });
});
