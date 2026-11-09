import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Combobox } from './combobox';

const frameworks = [
  { value: 'next', label: 'Next.js' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
  { value: 'nuxt', label: 'Nuxt' },
  { value: 'sveltekit', label: 'SvelteKit' },
];

function Frameworks({
  anchored = 'top',
  dir = 'ltr',
  multiple = false,
}: {
  anchored?: 'top' | 'bottom';
  dir?: 'ltr' | 'rtl';
  multiple?: boolean;
}) {
  const items = frameworks.map((framework) => (
    <Combobox.Item key={framework.value} value={framework.value}>
      {framework.label}
    </Combobox.Item>
  ));
  return (
    <>
      <button type="button" className="fixed end-2 bottom-2">
        Elsewhere
      </button>
      <div
        dir={dir}
        className={anchored === 'bottom' ? 'fixed inset-x-4 bottom-2' : 'fixed inset-x-4 top-2'}
      >
        {multiple ? (
          <Combobox multiple>
            <Combobox.Input aria-label="Framework" placeholder="Search framework" />
            <Combobox.Content>{items}</Combobox.Content>
          </Combobox>
        ) : (
          <Combobox>
            <Combobox.Input aria-label="Framework" placeholder="Search framework" />
            <Combobox.Content>
              <Combobox.Empty>No framework found</Combobox.Empty>
              {items}
            </Combobox.Content>
          </Combobox>
        )}
      </div>
    </>
  );
}

async function settle() {
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

function fieldRect() {
  const field = document.querySelector('[data-slot="combobox-field"]');
  if (!field) throw new Error('missing field');
  return field.getBoundingClientRect();
}

describe('Combobox in a real browser', () => {
  it('keeps focus in the input while the arrows move the active option', async () => {
    const screen = await render(<Frameworks />);
    const input = screen.getByRole('combobox');
    await userEvent.click(input);
    await expect.element(screen.getByRole('listbox')).toBeVisible();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await expect.element(input).toHaveFocus();
    const active = input.element().getAttribute('aria-activedescendant') ?? '';
    expect(document.getElementById(active)).toHaveTextContent('Remix');
    await userEvent.keyboard('{Enter}');
    await expect.element(input).toHaveValue('Remix');
    await expect.element(input).toHaveFocus();
  });

  it('filters while typing and shows Empty when nothing matches', async () => {
    const screen = await render(<Frameworks />);
    const input = screen.getByRole('combobox');
    await userEvent.type(input, 'nu');
    await expect.element(screen.getByRole('option', { name: 'Nuxt' })).toBeVisible();
    expect(screen.getByRole('option').elements()).toHaveLength(1);
    await userEvent.type(input, 'zz');
    await expect.element(screen.getByText('No framework found')).toBeVisible();
  });

  it('keeps focus in the input when an option is clicked', async () => {
    const screen = await render(<Frameworks multiple />);
    const input = screen.getByRole('combobox');
    await userEvent.click(input);
    await userEvent.click(screen.getByRole('option', { name: 'Astro' }));
    await expect.element(input).toHaveFocus();
    await expect.element(screen.getByRole('listbox')).toBeVisible();
    await expect.element(screen.getByRole('button', { name: 'Remove Astro' })).toBeVisible();
    await userEvent.click(screen.getByRole('option', { name: 'Nuxt' }));
    await expect.element(input).toHaveFocus();
    await userEvent.keyboard('{Backspace}');
    await expect
      .element(screen.getByRole('button', { name: 'Remove Nuxt' }))
      .not.toBeInTheDocument();
  });

  it('opens below the field and matches its width', async () => {
    const screen = await render(<Frameworks />);
    await userEvent.click(screen.getByRole('combobox'));
    await expect.element(screen.getByRole('listbox')).toBeVisible();
    await settle();
    const field = fieldRect();
    const content = document.querySelector('[data-slot="combobox-content"]');
    if (!(content instanceof HTMLElement)) throw new Error('missing content');
    const style = getComputedStyle(content);
    expect(Number.parseFloat(style.top)).toBeGreaterThanOrEqual(field.bottom);
    expect(content.offsetWidth).toBe(Math.round(field.width));
    expect(Number.parseFloat(style.left)).toBe(Math.round(field.left));
  });

  it('flips above the field near the bottom edge', async () => {
    await page.viewport(800, 300);
    const screen = await render(<Frameworks anchored="bottom" />);
    await userEvent.click(screen.getByRole('combobox'));
    await expect.element(screen.getByRole('listbox')).toBeVisible();
    await settle();
    const field = fieldRect();
    const content = document.querySelector('[data-slot="combobox-content"]');
    const list = content?.getBoundingClientRect();
    expect(content).toHaveAttribute('data-side', 'top');
    expect(list?.bottom).toBeLessThanOrEqual(field.top);
    expect(list?.top).toBeGreaterThanOrEqual(0);
    await page.viewport(1024, 768);
  });

  it('puts the chevron at the start side in rtl', async () => {
    const screen = await render(<Frameworks dir="rtl" />);
    const chevron = document.querySelector('[data-slot="combobox-chevron"]');
    const input = screen.getByRole('combobox').element().getBoundingClientRect();
    expect(chevron?.getBoundingClientRect().right).toBeLessThanOrEqual(input.left);
  });

  it('closes when the pointer goes down outside', async () => {
    const screen = await render(<Frameworks />);
    const input = screen.getByRole('combobox');
    await userEvent.click(input);
    await expect.element(input).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'Elsewhere' }));
    await expect.element(input).toHaveAttribute('aria-expanded', 'false');
  });

  it('has no axe violations while open', async () => {
    const screen = await render(<Frameworks multiple />);
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.click(screen.getByRole('option', { name: 'Remix' }));
    await userEvent.keyboard('{ArrowDown}');
    await expect.element(screen.getByRole('listbox')).toBeVisible();
    await settle();
    await expectNoAxeViolations(document.body);
  });
});
