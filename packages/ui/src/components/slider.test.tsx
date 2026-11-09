import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Slider } from './slider';
import type { SliderProps } from './slider';

function Volume(props: Partial<SliderProps>) {
  return (
    <Slider defaultValue={[40]} {...props}>
      <Slider.Track>
        <Slider.Range />
      </Slider.Track>
      <Slider.Thumb aria-label="Volume" />
    </Slider>
  );
}

function Price(props: Partial<SliderProps>) {
  return (
    <Slider defaultValue={[200, 600]} max={1000} step={10} {...props}>
      <Slider.Track>
        <Slider.Range />
      </Slider.Track>
      <Slider.Thumb aria-label="Minimum price" />
      <Slider.Thumb aria-label="Maximum price" />
    </Slider>
  );
}

describe('Slider', () => {
  it('renders a slider role per thumb with value attributes', () => {
    render(<Price getAriaValueText={(value) => `$${value}`} />);
    const [low, high] = screen.getAllByRole('slider');
    expect(low).toHaveAccessibleName('Minimum price');
    expect(low).toHaveAttribute('aria-valuenow', '200');
    expect(low).toHaveAttribute('aria-valuemin', '0');
    expect(low).toHaveAttribute('aria-valuemax', '1000');
    expect(low).toHaveAttribute('aria-valuetext', '$200');
    expect(low).toHaveAttribute('aria-orientation', 'horizontal');
    expect(high).toHaveAttribute('aria-valuenow', '600');
    expect(high).toHaveAttribute('tabindex', '0');
  });

  it('marks every part with data-slot and orientation', () => {
    const { container } = render(<Volume orientation="vertical" />);
    const root = container.querySelector('[data-slot="slider"]');
    expect(root).toHaveAttribute('data-orientation', 'vertical');
    expect(container.querySelector('[data-slot="slider-track"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="slider-range"]')).toBeInTheDocument();
    expect(screen.getByRole('slider')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('positions the range from the start up to the value', () => {
    const { container } = render(<Volume />);
    const range = container.querySelector<HTMLElement>('[data-slot="slider-range"]');
    expect(range?.style.insetInlineStart).toBe('0%');
    expect(range?.style.insetInlineEnd).toBe('60%');
    expect(screen.getByRole('slider').style.insetInlineStart).toBe('40%');
  });

  it('fills from the other end when inverted', () => {
    const { container } = render(<Volume inverted />);
    const range = container.querySelector<HTMLElement>('[data-slot="slider-range"]');
    expect(range?.style.insetInlineStart).toBe('60%');
    expect(range?.style.insetInlineEnd).toBe('0%');
  });

  it('steps with arrows, Shift, PageUp/PageDown, Home and End when uncontrolled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onValueCommit = vi.fn();
    render(<Volume onValueChange={onValueChange} onValueCommit={onValueCommit} />);
    const thumb = screen.getByRole('slider');
    thumb.focus();

    await user.keyboard('{ArrowRight}');
    expect(thumb).toHaveAttribute('aria-valuenow', '41');
    expect(onValueChange).toHaveBeenLastCalledWith([41]);
    expect(onValueCommit).toHaveBeenLastCalledWith([41]);

    await user.keyboard('{ArrowDown}{ArrowLeft}');
    expect(thumb).toHaveAttribute('aria-valuenow', '39');

    await user.keyboard('{Shift>}{ArrowUp}{/Shift}');
    expect(thumb).toHaveAttribute('aria-valuenow', '49');

    await user.keyboard('{PageDown}');
    expect(thumb).toHaveAttribute('aria-valuenow', '39');

    await user.keyboard('{End}');
    expect(thumb).toHaveAttribute('aria-valuenow', '100');
    await user.keyboard('{ArrowRight}');
    expect(thumb).toHaveAttribute('aria-valuenow', '100');

    await user.keyboard('{Home}');
    expect(thumb).toHaveAttribute('aria-valuenow', '0');
    expect(onValueCommit).toHaveBeenCalledTimes(7);
  });

  it('reverses horizontal arrows in rtl', async () => {
    const user = userEvent.setup();
    render(<Volume dir="rtl" />);
    const thumb = screen.getByRole('slider');
    thumb.focus();
    await user.keyboard('{ArrowLeft}');
    expect(thumb).toHaveAttribute('aria-valuenow', '41');
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(thumb).toHaveAttribute('aria-valuenow', '39');
  });

  it('follows the controlled value and reports changes', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(<Volume value={[10]} onValueChange={onValueChange} />);
    const thumb = screen.getByRole('slider');
    thumb.focus();

    await user.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenCalledWith([11]);
    expect(thumb).toHaveAttribute('aria-valuenow', '10');

    rerender(<Volume value={[75]} onValueChange={onValueChange} />);
    expect(thumb).toHaveAttribute('aria-valuenow', '75');
  });

  it('keeps thumbs from crossing and respects minStepsBetweenThumbs', async () => {
    const user = userEvent.setup();
    render(<Price defaultValue={[500, 520]} minStepsBetweenThumbs={1} />);
    const [low, high] = screen.getAllByRole('slider');

    low?.focus();
    await user.keyboard('{End}');
    expect(low).toHaveAttribute('aria-valuenow', '510');

    high?.focus();
    await user.keyboard('{Home}');
    expect(high).toHaveAttribute('aria-valuenow', '520');
  });

  it('snaps to the step grid and handles decimal steps', async () => {
    const user = userEvent.setup();
    render(<Volume defaultValue={[0.2]} min={0} max={1} step={0.1} />);
    const thumb = screen.getByRole('slider');
    thumb.focus();
    await user.keyboard('{ArrowRight}');
    expect(thumb).toHaveAttribute('aria-valuenow', '0.3');
  });

  it('ignores input and leaves the tab order when disabled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(<Volume disabled onValueChange={onValueChange} />);
    const thumb = screen.getByRole('slider');
    expect(thumb).toHaveAttribute('aria-disabled', 'true');
    expect(thumb).toHaveAttribute('tabindex', '-1');
    expect(container.querySelector('[data-slot="slider"]')).toHaveAttribute('data-disabled');

    thumb.focus();
    await user.keyboard('{ArrowRight}');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('submits one hidden input per thumb and resets with the form', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <Price name="price" />
        <button type="reset">Reset</button>
      </form>,
    );
    const form = container.querySelector('form')!;
    expect(new FormData(form).getAll('price')).toEqual(['200', '600']);

    screen.getAllByRole('slider')[1]?.focus();
    await user.keyboard('{ArrowRight}');
    expect(new FormData(form).getAll('price')).toEqual(['200', '610']);

    fireEvent.reset(form);
    expect(screen.getAllByRole('slider')[1]).toHaveAttribute('aria-valuenow', '600');
  });

  it('accepts an explicit thumb index for wrapped thumbs', () => {
    render(
      <Slider defaultValue={[10, 90]}>
        <Slider.Track />
        <div>
          <Slider.Thumb index={1} aria-label="Upper" />
        </div>
      </Slider>,
    );
    expect(screen.getByRole('slider', { name: 'Upper' })).toHaveAttribute('aria-valuenow', '90');
  });

  it('sets a group role when the root is labelled', () => {
    render(
      <Slider aria-label="Opacity" defaultValue={[50]}>
        <Slider.Track />
        <Slider.Thumb aria-label="Opacity value" />
      </Slider>,
    );
    expect(screen.getByRole('group', { name: 'Opacity' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <Volume />
        <Price getAriaValueText={(value) => `$${value}`} />
        <Volume orientation="vertical" disabled />
      </div>,
    );
    await expectNoAxeViolations(container);
  });

  it('stays deterministic for SSR without random ids', () => {
    const first = render(<Volume />).container.innerHTML;
    const second = render(<Volume />).container.innerHTML;
    expect(first).toBe(second);
  });
});
