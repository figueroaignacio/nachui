import { COMPONENT_REGISTRY, DEMO_REGISTRY } from '@repo/ui/registry';
import fs from 'fs';
import path from 'path';

type ComponentCodeResult = {
  code: string | null;
  filePath: string | null;
  error?: string;
};

/**
 * Rewrites the imports of a demo so the snippet compiles once pasted.
 *
 * Demos import their siblings by relative path inside packages/ui, from more
 * than one family directory: `../../components/` for UI primitives and
 * `../../layout/` for Flex, Stack, Grid and Container. The CLI writes every
 * component to `aliases.components` regardless of family, so both collapse to
 * the same target here.
 *
 * Exported so a test can assert that no demo escapes the rewrite. When a new
 * family directory appears in packages/ui, it has to be added to this list.
 */
export function rewriteDemoImports(code: string): string {
  return code.replaceAll(/from ['"]\.\.\/\.\.\/(components|layout)\//g, "from '@/components/ui/");
}

/**
 * Get source code for a component
 */
export async function getComponentSourceCode(componentName: string): Promise<ComponentCodeResult> {
  const componentPath = COMPONENT_REGISTRY[componentName as keyof typeof COMPONENT_REGISTRY];

  if (!componentPath) {
    return {
      code: null,
      filePath: null,
      error: `Component "${componentName}" not found in registry.`,
    };
  }

  const filePath = path.join(process.cwd(), '../../', componentPath);

  try {
    const code = await fs.promises.readFile(filePath, 'utf-8');
    return { code, filePath: componentPath };
  } catch (error) {
    console.error('❌ Error reading component file:', error);
    return {
      code: null,
      filePath: componentPath,
      error: 'Error reading the component file.',
    };
  }
}

/**
 * Get source code for a demo
 */
export async function getDemoCode(
  componentName: string,
  demoName: string,
): Promise<ComponentCodeResult> {
  const componentDemos = DEMO_REGISTRY[componentName as keyof typeof DEMO_REGISTRY];

  if (!componentDemos) {
    return {
      code: null,
      filePath: null,
      error: `No demos found for component "${componentName}".`,
    };
  }

  const demoPath = componentDemos[demoName as keyof typeof componentDemos];

  if (!demoPath) {
    return {
      code: null,
      filePath: null,
      error: `Demo "${demoName}" not found for component "${componentName}".`,
    };
  }

  const filePath = path.join(process.cwd(), '../../', demoPath);

  try {
    const code = rewriteDemoImports(await fs.promises.readFile(filePath, 'utf-8'));
    return { code, filePath: demoPath };
  } catch (error) {
    console.error('❌ Error reading demo file:', error);
    return {
      code: null,
      filePath: demoPath,
      error: 'Error reading the demo file.',
    };
  }
}
