import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
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

  it('moves focus along with the value', async () => {
    render(<Rating defaultValue={2} />);
    screen.getByRole('radio', { name: '2 of 5' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: '3 of 5' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('radio', { name: '5 of 5' })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('radio', { name: '1 of 5' })).toHaveFocus();
  });

  it('names the group by default and accepts a label', () => {
    const { rerender } = render(<Rating />);
    expect(screen.getByRole('radiogroup', { name: 'Rating' })).toBeInTheDocument();
    rerender(<Rating label="Puntaje" />);
    expect(screen.getByRole('radiogroup', { name: 'Puntaje' })).toBeInTheDocument();
  });

  it('exposes half steps as a slider with the exact value', async () => {
    const onValueChange = vi.fn();
    render(<Rating defaultValue={2.5} precision={0.5} onValueChange={onValueChange} />);
    const slider = screen.getByRole('slider', { name: 'Rating' });
    expect(slider).toHaveAttribute('aria-valuenow', '2.5');
    expect(slider).toHaveAttribute('aria-valuetext', '2.5 of 5');
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
    slider.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenLastCalledWith(3);
    expect(slider).toHaveAttribute('aria-valuetext', '3 of 5');
  });

  it('does not mark read-only ratings as aria-readonly', () => {
    render(<Rating readOnly value={3} />);
    expect(screen.getByRole('img')).not.toHaveAttribute('aria-readonly');
  });

  it('grows the hit area on coarse pointers', () => {
    render(<Rating />);
    expect(screen.getAllByRole('radio')[0]?.className).toContain('pointer-coarse:p-3');
  });

  it('has no axe violations in every mode', async () => {
    const { container } = render(
      <>
        <Rating defaultValue={3} />
        <Rating defaultValue={2.5} precision={0.5} label="Half" />
        <Rating readOnly value={4} />
      </>,
    );
    await expectNoAxeViolations(container);
  });
});
