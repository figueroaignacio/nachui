import axe from 'axe-core';
import { expect } from 'vitest';

const RULES_OFF_IN_JSDOM = {
  'color-contrast': { enabled: false },
  region: { enabled: false },
};

export async function expectNoAxeViolations(container: Element) {
  const results = await axe.run(container, { rules: RULES_OFF_IN_JSDOM });
  const summary = results.violations.map(
    (violation) =>
      `${violation.id}: ${violation.help} (${violation.nodes.map((node) => node.target.join(' ')).join(', ')})`,
  );
  expect(summary, summary.join('\n')).toEqual([]);
}
