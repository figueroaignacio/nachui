import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Menubar } from './menubar';

function Editor({ dir, className }: { dir?: 'ltr' | 'rtl'; className?: string }) {
  return (
    <div dir={dir} className={className}>
      <Menubar aria-label="Editor">
        <Menubar.Menu>
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item shortcut="⌘N">New file</Menubar.Item>
            <Menubar.Item shortcut="⌘S">Save</Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
        <Menubar.Menu>
          <Menubar.Trigger>Edit</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item>Undo</Menubar.Item>
            <Menubar.Sub>
              <Menubar.SubTrigger>Find</Menubar.SubTrigger>
              <Menubar.SubContent>
                <Menubar.Item>Find in file</Menubar.Item>
                <Menubar.Item>Replace</Menubar.Item>
              </Menubar.SubContent>
            </Menubar.Sub>
          </Menubar.Content>
        </Menubar.Menu>
        <Menubar.Menu>
          <Menubar.Trigger>Help</Menubar.Trigger>
          <Menubar.Content>
            <Menubar.Item>Keyboard shortcuts</Menubar.Item>
            <Menubar.Item>Release notes for this version</Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
      </Menubar>
      <button type="button">After</button>
    </div>
  );
}

async function settle() {
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

describe('Menubar in a real browser', () => {
  it('switches menus on hover while one is open', async () => {
    const screen = await render(<Editor />);
    await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
    await expect.element(screen.getByRole('menuitem', { name: /New file/ })).toBeVisible();

    await userEvent.hover(screen.getByRole('menuitem', { name: 'Edit' }));
    await expect
      .element(screen.getByRole('menuitem', { name: 'Edit' }))
      .toHaveAttribute('aria-expanded', 'true');
    await expect.element(screen.getByRole('menuitem', { name: 'Undo' })).toBeVisible();
    await expect
      .element(screen.getByRole('menuitem', { name: 'File' }))
      .toHaveAttribute('aria-expanded', 'false');
  });

  it('does not open on hover when every menu is closed', async () => {
    const screen = await render(<Editor />);
    await userEvent.hover(screen.getByRole('menuitem', { name: 'Edit' }));
    await settle();
    await expect
      .element(screen.getByRole('menuitem', { name: 'Edit' }))
      .toHaveAttribute('aria-expanded', 'false');
  });

  it('opens a submenu on hover', async () => {
    const screen = await render(<Editor />);
    await userEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));
    await userEvent.hover(screen.getByRole('menuitem', { name: 'Find', exact: true }));
    await expect.element(screen.getByRole('menuitem', { name: 'Find in file' })).toBeVisible();
    await settle();

    const subTrigger = screen.getByRole('menuitem', { name: 'Find', exact: true }).element();
    const submenu = screen.getByRole('menuitem', { name: 'Find in file' }).element();
    await expect
      .poll(() => submenu.getBoundingClientRect().left)
      .toBeGreaterThanOrEqual(subTrigger.getBoundingClientRect().right);
  });

  it('reverses the arrows in rtl', async () => {
    const screen = await render(<Editor dir="rtl" />);
    const file = screen.getByRole('menuitem', { name: 'File' });
    file.element().focus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect.element(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect.element(file).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    await expect.element(screen.getByRole('menuitem', { name: /New file/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect.element(screen.getByRole('menuitem', { name: 'Undo' })).toHaveFocus();
  });

  it('opens rtl submenus towards the left', async () => {
    const screen = await render(<Editor dir="rtl" className="flex justify-center" />);
    screen.getByRole('menuitem', { name: 'Edit' }).element().focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect.element(screen.getByRole('menuitem', { name: 'Undo' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}{ArrowLeft}');
    await expect.element(screen.getByRole('menuitem', { name: 'Find in file' })).toHaveFocus();
    await settle();

    const subTrigger = screen.getByRole('menuitem', { name: 'Find', exact: true }).element();
    const submenu = screen.getByRole('menuitem', { name: 'Find in file' }).element();
    await expect
      .poll(() => submenu.getBoundingClientRect().right)
      .toBeLessThanOrEqual(subTrigger.getBoundingClientRect().left);
  });

  it('keeps the menu inside the viewport near the right edge', async () => {
    await page.viewport(480, 600);
    const screen = await render(<Editor className="fixed end-1 top-2" />);
    await userEvent.click(screen.getByRole('menuitem', { name: 'Help' }));
    await expect
      .element(screen.getByRole('menuitem', { name: 'Keyboard shortcuts' }))
      .toBeVisible();
    await settle();

    const trigger = screen.getByRole('menuitem', { name: 'Help' }).element();
    const menu = screen.getByRole('menu').element();
    await expect
      .poll(() => menu.getBoundingClientRect().top)
      .toBeGreaterThanOrEqual(trigger.getBoundingClientRect().bottom);
    const rect = menu.getBoundingClientRect();
    expect(rect.right).toBeLessThanOrEqual(window.innerWidth);
    expect(rect.left).toBeGreaterThanOrEqual(0);
    await page.viewport(1024, 768);
  });

  it('closes on Tab and moves focus past the bar', async () => {
    const screen = await render(<Editor />);
    screen.getByRole('menuitem', { name: 'Edit' }).element().focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect.element(screen.getByRole('menuitem', { name: 'Undo' })).toHaveFocus();

    await userEvent.keyboard('{Tab}');
    await expect.element(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    await expect
      .element(screen.getByRole('menuitem', { name: 'Edit' }))
      .toHaveAttribute('aria-expanded', 'false');
  });
});
