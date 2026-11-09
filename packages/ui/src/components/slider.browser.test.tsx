import { describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Slider } from './slider';
import type { SliderProps } from './slider';

function Volume({ dir, ...props }: Partial<SliderProps> & { dir?: 'ltr' | 'rtl' }) {
  return (
    <div dir={dir} style={{ width: 400, padding: 24 }}>
      <Slider defaultValue={[40]} {...props}>
        <Slider.Track>
          <Slider.Range />
        </Slider.Track>
        <Slider.Thumb aria-label="Volume" />
      </Slider>
    </div>
  );
}

function rootOf(element: Element) {
  return element.closest('[data-slot="slider"]')!.getBoundingClientRect();
}

function centerX(element: Element) {
  const rect = element.getBoundingClientRect();
  return rect.left + rect.width / 2;
}

describe('Slider in a real browser', () => {
  it('places the thumb at its value from the left in ltr', async () => {
    const screen = await render(<Volume />);
    const thumb = screen.getByRole('slider').element();
    const root = rootOf(thumb);
    expect(Math.abs(centerX(thumb) - (root.left + root.width * 0.4))).toBeLessThan(1);
  });

  it('fills from the right in rtl', async () => {
    const screen = await render(<Volume dir="rtl" />);
    const thumb = screen.getByRole('slider').element();
    const root = rootOf(thumb);
    expect(Math.abs(centerX(thumb) - (root.right - root.width * 0.4))).toBeLessThan(1);

    const range = thumb
      .closest('[data-slot="slider"]')!
      .querySelector('[data-slot="slider-range"]')!
      .getBoundingClientRect();
    expect(Math.abs(range.right - root.right)).toBeLessThan(1);
    expect(Math.abs(range.left - (root.right - root.width * 0.4))).toBeLessThan(1);
  });

  it('jumps to a click on the track, focuses the thumb and commits', async () => {
    const onValueCommit = vi.fn();
    const screen = await render(<Volume onValueCommit={onValueCommit} />);
    const slider = screen.container.querySelector('[data-slot="slider"]')!;
    const { width, height } = slider.getBoundingClientRect();

    await userEvent.click(slider, { position: { x: width * 0.75, y: height / 2 } });
    const thumb = screen.getByRole('slider');
    await expect.element(thumb).toHaveAttribute('aria-valuenow', '75');
    await expect.element(thumb).toHaveFocus();
    expect(onValueCommit).toHaveBeenCalledWith([75]);
  });

  it('maps clicks from the right edge in rtl', async () => {
    const screen = await render(<Volume dir="rtl" />);
    const slider = screen.container.querySelector('[data-slot="slider"]')!;
    const { width, height } = slider.getBoundingClientRect();

    await userEvent.click(slider, { position: { x: width * 0.25, y: height / 2 } });
    await expect.element(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '75');
  });

  it('drags the thumb with the pointer', async () => {
    const onValueChange = vi.fn();
    const onValueCommit = vi.fn();
    const screen = await render(
      <Volume onValueChange={onValueChange} onValueCommit={onValueCommit} />,
    );
    const slider = screen.container.querySelector('[data-slot="slider"]')!;
    const { width, height } = slider.getBoundingClientRect();
    const thumb = screen.getByRole('slider');

    await userEvent.dragAndDrop(thumb, slider, {
      targetPosition: { x: width * 0.9, y: height / 2 },
    });
    await expect.element(thumb).toHaveAttribute('aria-valuenow', '90');
    expect(onValueChange.mock.calls.length).toBeGreaterThan(0);
    expect(onValueCommit).toHaveBeenCalledTimes(1);
    expect(onValueCommit).toHaveBeenCalledWith([90]);
  });

  it('moves the closest thumb of a range', async () => {
    const screen = await render(
      <div style={{ width: 400, padding: 24 }}>
        <Slider defaultValue={[20, 80]}>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb aria-label="Minimum" />
          <Slider.Thumb aria-label="Maximum" />
        </Slider>
      </div>,
    );
    const slider = screen.container.querySelector('[data-slot="slider"]')!;
    const { width, height } = slider.getBoundingClientRect();

    await userEvent.click(slider, { position: { x: width * 0.6, y: height / 2 } });
    await expect
      .element(screen.getByRole('slider', { name: 'Maximum' }))
      .toHaveAttribute('aria-valuenow', '60');
    await expect
      .element(screen.getByRole('slider', { name: 'Minimum' }))
      .toHaveAttribute('aria-valuenow', '20');
    await expect.element(screen.getByRole('slider', { name: 'Maximum' })).toHaveFocus();
  });

  it('reads vertical clicks from the bottom', async () => {
    const screen = await render(
      <div style={{ padding: 24 }}>
        <Slider orientation="vertical" defaultValue={[0]} className="h-[200px]">
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb aria-label="Gain" />
        </Slider>
      </div>,
    );
    const slider = screen.container.querySelector('[data-slot="slider"]')!;
    const { width, height } = slider.getBoundingClientRect();
    expect(height).toBe(200);

    await userEvent.click(slider, { position: { x: width / 2, y: height * 0.3 } });
    await expect.element(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '70');
  });

  it('moves through the thumbs with Tab and steps with real keys in rtl', async () => {
    const screen = await render(
      <div dir="rtl" style={{ width: 400, padding: 24 }}>
        <button type="button">Before</button>
        <Slider defaultValue={[20, 80]}>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb aria-label="Minimum" />
          <Slider.Thumb aria-label="Maximum" />
        </Slider>
      </div>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Before' }));
    await userEvent.keyboard('{Tab}');
    const minimum = screen.getByRole('slider', { name: 'Minimum' });
    await expect.element(minimum).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect.element(minimum).toHaveAttribute('aria-valuenow', '21');
    await userEvent.keyboard('{Tab}');
    await expect.element(screen.getByRole('slider', { name: 'Maximum' })).toHaveFocus();
  });
});
