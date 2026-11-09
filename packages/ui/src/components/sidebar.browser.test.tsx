import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Sidebar } from './sidebar';

type ShellProps = {
  dir?: 'ltr' | 'rtl';
  collapsible?: 'offcanvas' | 'icon' | 'none';
  variant?: 'sidebar' | 'floating' | 'inset';
  defaultOpen?: boolean;
};

function Glyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

function Shell({ dir = 'ltr', collapsible, variant, defaultOpen }: ShellProps) {
  return (
    <div dir={dir} data-testid="frame" style={{ width: 800, height: 400 }}>
      <Sidebar.Provider defaultOpen={defaultOpen} className="h-full min-h-0">
        <Sidebar collapsible={collapsible} variant={variant}>
          <Sidebar.Content>
            <Sidebar.Group label="Platform">
              <Sidebar.Menu>
                <Sidebar.Item href="#home" icon={<Glyph />}>
                  Home
                </Sidebar.Item>
                <Sidebar.Item href="#projects" icon={<Glyph />} active>
                  Projects
                </Sidebar.Item>
              </Sidebar.Menu>
            </Sidebar.Group>
          </Sidebar.Content>
        </Sidebar>
        <Sidebar.Inset data-testid="inset">
          <Sidebar.Trigger />
        </Sidebar.Inset>
      </Sidebar.Provider>
    </div>
  );
}

async function settle(ms = 600) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

const rect = (selector: string) =>
  (document.querySelector(selector) as HTMLElement).getBoundingClientRect();

describe('Sidebar in a real browser', () => {
  it('slides offcanvas and lets the inset take the freed space', async () => {
    const screen = await render(<Shell />);
    const frame = rect('[data-testid="frame"]');
    expect(rect('[data-slot="sidebar-container"]').width).toBe(256);
    expect(rect('[data-slot="sidebar-inset"]').width).toBe(frame.width - 256);
    expect(rect('[data-slot="sidebar-inset"]').left).toBe(frame.left + 256);

    await userEvent.click(screen.getByRole('button', { name: 'Toggle sidebar' }));
    await settle();

    expect(rect('[data-slot="sidebar-inset"]').width).toBe(frame.width);
    expect(rect('[data-slot="sidebar-inset"]').left).toBe(frame.left);
    expect(rect('[data-slot="sidebar-container"]').right).toBeLessThanOrEqual(frame.left + 1);
    expect(rect('[data-slot="sidebar-container"]').height).toBe(400);
  });

  it('slides toward the right edge in rtl', async () => {
    const screen = await render(<Shell dir="rtl" />);
    const frame = rect('[data-testid="frame"]');
    expect(rect('[data-slot="sidebar-container"]').right).toBe(frame.right);
    expect(rect('[data-slot="sidebar-inset"]').right).toBe(frame.right - 256);

    await userEvent.click(screen.getByRole('button', { name: 'Toggle sidebar' }));
    await settle();

    expect(rect('[data-slot="sidebar-container"]').left).toBeGreaterThanOrEqual(frame.right - 1);
    expect(rect('[data-slot="sidebar-inset"]').width).toBe(frame.width);
  });

  it('shrinks to the icon rail and shows labels in a tooltip on hover', async () => {
    const screen = await render(<Shell collapsible="icon" />);
    const frame = rect('[data-testid="frame"]');
    await userEvent.click(screen.getByRole('button', { name: 'Toggle sidebar' }));
    await settle(100);

    expect(rect('[data-slot="sidebar"]').width).toBe(56);
    expect(rect('[data-slot="sidebar-inset"]').width).toBe(frame.width - 56);
    const projects = screen.getByRole('link', { name: 'Projects' });
    const item = projects.element().getBoundingClientRect();
    expect(item.width).toBe(32);

    await userEvent.hover(projects);
    const tooltip = screen.getByRole('tooltip');
    await expect.element(tooltip).toHaveTextContent('Projects');
    await settle(300);
    expect(tooltip.element().getBoundingClientRect().left).toBeGreaterThanOrEqual(item.right);
  });

  it('frames the inset as a card in the inset variant', async () => {
    await render(<Shell variant="inset" />);
    const inset = document.querySelector('[data-slot="sidebar-inset"]') as HTMLElement;
    const style = getComputedStyle(inset);
    expect(style.marginTop).toBe('8px');
    expect(style.borderTopWidth).toBe('1px');
    const wrapper = document.querySelector('[data-slot="sidebar-wrapper"]') as HTMLElement;
    expect(getComputedStyle(wrapper).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(
      rect('[data-slot="sidebar-inset"]').left - rect('[data-slot="sidebar-inner"]').right,
    ).toBe(8);
  });

  it('switches to a sheet below the breakpoint', async () => {
    await page.viewport(600, 700);
    const screen = await render(<Shell />);
    await expect.element(screen.getByRole('link', { name: 'Projects' })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Toggle sidebar' }));
    const dialog = screen.getByRole('dialog', { name: 'Sidebar' });
    await expect.element(dialog).toBeVisible();
    await settle();
    expect(dialog.element().getBoundingClientRect().left).toBe(0);
    await userEvent.keyboard('{Escape}');
    await expect.element(dialog).not.toBeInTheDocument();
    await page.viewport(1024, 768);
  });
});
