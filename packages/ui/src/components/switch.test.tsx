import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Switch } from './switch';

describe('Switch', () => {
  it('renders correctly', () => {
    render(<Switch data-testid="switch" />);
    // Testing the inner input since it gets the test id usually if passed directly
    expect(screen.getByTestId('switch')).toBeInTheDocument();
  });

  it('can be checked and unchecked', () => {
    render(<Switch data-testid="switch" />);
    const switchEl = screen.getByTestId('switch') as HTMLInputElement;

    expect(switchEl.checked).toBe(false);
    fireEvent.click(switchEl);
    expect(switchEl.checked).toBe(true);
  });

  it('calls onCheckedChange when clicked', () => {
    const onCheckedChange = vi.fn();
    render(<Switch data-testid="switch" onCheckedChange={onCheckedChange} />);
    const switchEl = screen.getByTestId('switch');

    fireEvent.click(switchEl);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('respects disabled state', () => {
    render(<Switch data-testid="switch" disabled />);
    const switchEl = screen.getByTestId('switch');
    expect(switchEl).toBeDisabled();
  });
});

describe('Switch hit area and motion', () => {
  it('extends the clickable area past the track, more on touch screens', () => {
    render(<Switch data-testid="switch" />);
    const label = screen.getByTestId('switch').closest('label');
    expect(label).toHaveClass(
      'before:absolute',
      'before:-inset-y-1',
      'pointer-coarse:before:-inset-y-3',
    );
  });

  it('toggles when the label area around the track is clicked', () => {
    const onCheckedChange = vi.fn();
    render(<Switch data-testid="switch" onCheckedChange={onCheckedChange} />);
    fireEvent.click(screen.getByTestId('switch').closest('label')!);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('stops the thumb transition when reduced motion is requested', () => {
    const { container } = render(<Switch />);
    const thumb = container.querySelector('span[aria-hidden="true"]');
    expect(thumb).toHaveClass('transition-transform', 'motion-reduce:transition-none');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Switch aria-label="Notifications" />);
    await expectNoAxeViolations(container);
  });
});
