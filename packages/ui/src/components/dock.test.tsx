import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
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
});
