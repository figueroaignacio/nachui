import { render } from '@testing-library/react';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ICON_REGISTRY } from '../lib/registry';

const ICONS_DIR = join(__dirname);

const iconFiles = readdirSync(ICONS_DIR)
  .filter((file) => file.endsWith('.tsx') && !file.endsWith('.test.tsx'))
  .map((file) => file.replace(/\.tsx$/, ''))
  .sort((a, b) => a.localeCompare(b));

function pascal(value: string) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

type IconModule = Record<string, React.ComponentType<Record<string, unknown>> | undefined>;

async function componentFor(name: string) {
  const mod = (await import(`./${name}.tsx`)) as IconModule;
  const Component = mod[`${pascal(name)}Icon`];
  if (!Component) throw new Error(`${name}.tsx must export ${pascal(name)}Icon`);
  return Component;
}

describe('icon set', () => {
  it('matches the generated registry', () => {
    expect(Object.keys(ICON_REGISTRY).sort((a, b) => a.localeCompare(b))).toEqual(iconFiles);
  });

  it.each(iconFiles)('%s follows the set rules', async (name) => {
    const Icon = await componentFor(name);
    const { container } = render(<Icon data-testid="icon" />);
    const svg = container.querySelector('svg');

    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
    expect(svg).toHaveAttribute('stroke-width', '1.5');
    expect(svg).toHaveAttribute('stroke-linecap', 'round');
    expect(svg).toHaveAttribute('stroke-linejoin', 'round');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('data-testid', 'icon');

    const children = Array.from(svg?.children ?? []);
    expect(children.length).toBeGreaterThan(0);
    for (const child of children) {
      expect(['path', 'circle', 'rect', 'line', 'polyline']).toContain(child.tagName);
      expect(child.getAttribute('fill')).toBeNull();
      expect(child.getAttribute('stroke')).toBeNull();
      expect(child.getAttribute('transform')).toBeNull();
      expect(child.getAttribute('id')).toBeNull();
    }
  });

  it('forwards size and strokeWidth', async () => {
    const Icon = await componentFor('search');
    const { container } = render(<Icon size={16} strokeWidth={2} />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('width', '16');
    expect(svg).toHaveAttribute('height', '16');
    expect(svg).toHaveAttribute('stroke-width', '2');
  });
});
