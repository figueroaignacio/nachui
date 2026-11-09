import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { AlertDialog } from './alert-dialog';

function DeleteProject({ onAction }: { onAction?: () => Promise<void> }) {
  return (
    <div style={{ height: 3000 }}>
      <AlertDialog>
        <AlertDialog.Trigger>Delete project</AlertDialog.Trigger>
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>Delete project?</AlertDialog.Title>
            <AlertDialog.Description>
              This removes Northwind and its 14 deployments for good.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action variant="destructive" onClick={onAction}>
              Delete
            </AlertDialog.Action>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </div>
  );
}

describe('AlertDialog in a real browser', () => {
  it('focuses Cancel, keeps Tab inside and returns focus on Escape', async () => {
    const screen = await render(<DeleteProject />);
    const trigger = screen.getByRole('button', { name: 'Delete project' });
    await userEvent.click(trigger);

    const cancel = screen.getByRole('button', { name: 'Cancel' });
    const action = screen.getByRole('button', { name: 'Delete', exact: true });
    await expect.element(cancel).toHaveFocus();
    await userEvent.tab();
    await expect.element(action).toHaveFocus();
    await userEvent.tab();
    await expect.element(cancel).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect.element(action).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await expect.element(screen.getByRole('alertdialog')).not.toBeInTheDocument();
    await expect.element(trigger).toHaveFocus();
  });

  it('ignores clicks on the overlay', async () => {
    const screen = await render(<DeleteProject />);
    await userEvent.click(screen.getByRole('button', { name: 'Delete project' }));
    await expect.element(screen.getByRole('alertdialog')).toBeVisible();

    const overlay = document.querySelector<HTMLElement>('[data-slot="alert-dialog-overlay"]');
    expect(overlay).not.toBeNull();
    await userEvent.click(overlay as HTMLElement, { position: { x: 8, y: 8 } });

    await expect.element(screen.getByRole('alertdialog')).toBeVisible();
  });

  it('locks page scroll while open and restores it after', async () => {
    const screen = await render(<DeleteProject />);
    await userEvent.click(screen.getByRole('button', { name: 'Delete project' }));
    await expect.element(screen.getByRole('alertdialog')).toBeVisible();

    expect(getComputedStyle(document.body).overflow).toBe('hidden');
    expect(document.documentElement.dataset.scrollLocked).toBe('1');

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await expect.element(screen.getByRole('alertdialog')).not.toBeInTheDocument();
    expect(getComputedStyle(document.body).overflow).not.toBe('hidden');
    expect(document.documentElement.dataset.scrollLocked).toBeUndefined();
  });

  it('keeps focus on the busy action and closes when it resolves', async () => {
    let resolve: () => void = () => {};
    const screen = await render(
      <DeleteProject
        onAction={() =>
          new Promise<void>((done) => {
            resolve = done;
          })
        }
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Delete project' }));
    const action = screen.getByRole('button', { name: 'Delete', exact: true });
    await userEvent.click(action);

    await expect.element(action).toHaveAttribute('aria-busy', 'true');
    await expect.element(action).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await expect.element(screen.getByRole('alertdialog')).toBeVisible();

    resolve();
    await expect.element(screen.getByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('stays centered on a phone sized viewport', async () => {
    await page.viewport(360, 640);
    const screen = await render(<DeleteProject />);
    await userEvent.click(screen.getByRole('button', { name: 'Delete project' }));
    await expect.element(screen.getByRole('alertdialog')).toBeVisible();
    await new Promise((resolve) => setTimeout(resolve, 400));

    const rect = screen.getByRole('alertdialog').element().getBoundingClientRect();
    expect(rect.left).toBeGreaterThanOrEqual(0);
    expect(rect.right).toBeLessThanOrEqual(360);
    expect(Math.abs(rect.left - (360 - rect.right))).toBeLessThan(2);
    await page.viewport(1024, 768);
  });
});
