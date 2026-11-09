import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Toggle } from './toggle';

vi.mock('motion/react');

describe('Toggle', () => {
  it('renders a button that starts off', () => {
    render(<Toggle aria-label="Bold">B</Toggle>);
    const toggle = screen.getByRole('button', { name: 'Bold' });
    expect(toggle).toHaveAttribute('type', 'button');
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(toggle).toHaveAttribute('data-state', 'off');
    expect(toggle).toHaveAttribute('data-slot', 'toggle');
  });

  it('flips its own state when uncontrolled', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <Toggle aria-label="Bold" defaultPressed onPressedChange={onPressedChange}>
        B
      </Toggle>,
    );
    const toggle = screen.getByRole('button', { name: 'Bold' });
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(toggle).toHaveAttribute('data-state', 'on');

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(onPressedChange).toHaveBeenLastCalledWith(false);
  });

  it('follows the pressed prop when controlled', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    const { rerender } = render(
      <Toggle aria-label="Italic" pressed={false} onPressedChange={onPressedChange}>
        I
      </Toggle>,
    );
    const toggle = screen.getByRole('button', { name: 'Italic' });

    await user.click(toggle);
    expect(onPressedChange).toHaveBeenCalledWith(true);
    expect(toggle).toHaveAttribute('aria-pressed', 'false');

    rerender(
      <Toggle aria-label="Italic" pressed onPressedChange={onPressedChange}>
        I
      </Toggle>,
    );
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
  });

  it('works with a state hook', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [pressed, setPressed] = useState(false);
      return (
        <>
          <Toggle aria-label="Mute" pressed={pressed} onPressedChange={setPressed}>
            M
          </Toggle>
          <output>{pressed ? 'muted' : 'live'}</output>
        </>
      );
    }
    render(<Controlled />);
    await user.click(screen.getByRole('button', { name: 'Mute' }));
    expect(screen.getByText('muted')).toBeInTheDocument();
  });

  it('toggles with Space and Enter', async () => {
    const user = userEvent.setup();
    render(<Toggle aria-label="Bold">B</Toggle>);
    const toggle = screen.getByRole('button', { name: 'Bold' });

    await user.tab();
    expect(toggle).toHaveFocus();
    await user.keyboard(' ');
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await user.keyboard('{Enter}');
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  it('does nothing when disabled', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <Toggle aria-label="Bold" disabled onPressedChange={onPressedChange}>
        B
      </Toggle>,
    );
    const toggle = screen.getByRole('button', { name: 'Bold' });
    expect(toggle).toBeDisabled();
    expect(toggle).toHaveAttribute('data-disabled');
    await user.click(toggle);
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  it('respects preventDefault in onClick', async () => {
    const user = userEvent.setup();
    render(
      <Toggle aria-label="Bold" onClick={(event) => event.preventDefault()}>
        B
      </Toggle>,
    );
    const toggle = screen.getByRole('button', { name: 'Bold' });
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  it('applies the outline variant and size classes', () => {
    render(
      <Toggle aria-label="Bold" variant="outline" size="lg" className="custom">
        B
      </Toggle>,
    );
    const toggle = screen.getByRole('button', { name: 'Bold' });
    expect(toggle).toHaveClass('border', 'border-input', 'h-10', 'custom');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <Toggle aria-label="Bold" defaultPressed>
          B
        </Toggle>
        <Toggle variant="outline">Bookmark</Toggle>
      </div>,
    );
    await expectNoAxeViolations(container);
  });
});
