import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Dock } from './dock';

describe('Dock', () => {
  it('renders a labelled nav with items', () => {
    render(
      <Dock floating={false} label="Site">
        <Dock.Item label="Home">
          <svg />
        </Dock.Item>
        <Dock.Separator />
        <Dock.Item label="Docs" active>
          <svg />
        </Dock.Item>
      </Dock>,
    );

    expect(screen.getByRole('navigation', { name: 'Site' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Home' })).not.toHaveAttribute('data-active');
    expect(screen.getByRole('button', { name: 'Docs' })).toHaveAttribute('data-active', 'true');
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('shows the label as a tooltip on hover', async () => {
    const user = userEvent.setup();
    render(
      <Dock floating={false}>
        <Dock.Item label="Search">
          <svg />
        </Dock.Item>
      </Dock>,
    );

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    await user.hover(screen.getByRole('button', { name: 'Search' }));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Search');
  });

  it('merges into the child when asChild is set', () => {
    render(
      <Dock floating={false}>
        <Dock.Item asChild label="Home" active className="extra">
          <a href="/home">
            <svg />
          </a>
        </Dock.Item>
      </Dock>,
    );

    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toHaveAttribute('href', '/home');
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveClass('extra', 'rounded-full');
  });

  it('marks the bar as hidden', () => {
    render(
      <Dock floating={false} hidden label="Hidden dock">
        <Dock.Item label="Home">
          <svg />
        </Dock.Item>
      </Dock>,
    );

    expect(screen.getByRole('navigation', { name: 'Hidden dock' })).toHaveAttribute(
      'data-hidden',
      'true',
    );
  });

  it('marks the active item with aria-current on buttons too', () => {
    render(
      <Dock floating={false}>
        <Dock.Item label="Home" active>
          <svg />
        </Dock.Item>
        <Dock.Item label="Docs">
          <svg />
        </Dock.Item>
      </Dock>,
    );

    const home = screen.getByRole('button', { name: 'Home' });
    expect(home).toHaveAttribute('aria-current', 'page');
    expect(home).not.toHaveAttribute('aria-pressed');
    expect(screen.getByRole('button', { name: 'Docs' })).not.toHaveAttribute('aria-current');
  });

  it('measures each item once per hover instead of on every pointer move', async () => {
    const rect = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue(DOMRect.fromRect({ x: 0, y: 0, width: 40, height: 40 }));

    render(
      <Dock floating={false} label="Measured">
        <Dock.Item label="Home">
          <svg />
        </Dock.Item>
        <Dock.Item label="Docs">
          <svg />
        </Dock.Item>
      </Dock>,
    );

    const nav = screen.getByRole('navigation', { name: 'Measured' });
    const move = (clientX: number) =>
      fireEvent.pointerMove(nav, { pointerType: 'mouse', clientX, clientY: 10 });

    move(5);
    await waitFor(() => expect(rect).toHaveBeenCalled());
    const first = rect.mock.calls.length;
    for (const x of [10, 15, 20, 25, 30]) move(x);
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(rect.mock.calls.length).toBe(first);

    fireEvent.pointerLeave(nav, { pointerType: 'mouse' });
    move(12);
    await waitFor(() => expect(rect.mock.calls.length).toBeGreaterThan(first));

    rect.mockRestore();
  });

  it('keeps the floating bar clear of the home indicator and the screen edges', () => {
    render(
      <Dock label="Floating">
        <Dock.Item label="Home">
          <svg />
        </Dock.Item>
      </Dock>,
    );

    const wrapper = screen.getByRole('navigation', { name: 'Floating' }).parentElement;
    expect(wrapper).toHaveClass(
      'bottom-[max(1.25rem,calc(env(safe-area-inset-bottom)+0.5rem))]',
      'max-w-[calc(100vw-2rem)]',
    );
  });
});
