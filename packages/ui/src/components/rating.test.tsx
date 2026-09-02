import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Rating } from './rating';

describe('Rating', () => {
  it('renders one radio per step', () => {
    render(<Rating aria-label="Score" />);
    expect(screen.getByRole('radiogroup', { name: 'Score' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(5);
  });

  it('marks the current value as checked', () => {
    render(<Rating defaultValue={3} max={4} />);
    expect(screen.getByRole('radio', { name: '3 of 4' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: '4 of 4' })).toHaveAttribute('aria-checked', 'false');
  });

  it('changes the value on click', async () => {
    const onValueChange = vi.fn();
    render(<Rating onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('radio', { name: '4 of 5' }));
    expect(onValueChange).toHaveBeenLastCalledWith(4);
  });

  it('moves with the arrow keys', async () => {
    const onValueChange = vi.fn();
    render(<Rating defaultValue={2} onValueChange={onValueChange} />);
    screen.getByRole('radio', { name: '2 of 5' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenLastCalledWith(3);
    await userEvent.keyboard('{End}');
    expect(onValueChange).toHaveBeenLastCalledWith(5);
  });

  it('clears when allowClear and the same value is picked', async () => {
    const onValueChange = vi.fn();
    render(<Rating defaultValue={3} allowClear onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('radio', { name: '3 of 5' }));
    expect(onValueChange).toHaveBeenLastCalledWith(0);
  });

  it('renders read-only ratings as an image', () => {
    render(<Rating readOnly value={4.5} precision={0.5} />);
    expect(screen.getByRole('img', { name: '4.5 of 5' })).toBeInTheDocument();
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
  });

  it('submits a hidden input when named', () => {
    const { container } = render(<Rating name="score" defaultValue={2} />);
    expect(container.querySelector('input[name="score"]')).toHaveValue('2');
  });
});
