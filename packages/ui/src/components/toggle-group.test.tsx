import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { ToggleGroup, type ToggleGroupSingleProps } from './toggle-group';

function Alignment(props: Omit<ToggleGroupSingleProps, 'type'>) {
  return (
    <ToggleGroup aria-label="Text alignment" {...props} type="single">
      <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
      <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
      <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
    </ToggleGroup>
  );
}

const button = (name: string) => screen.getByRole('button', { name });

describe('ToggleGroup single', () => {
  it('renders a labelled group of toggle buttons', () => {
    render(<Alignment defaultValue="center" />);
    const group = screen.getByRole('group', { name: 'Text alignment' });
    expect(group).toHaveAttribute('data-slot', 'toggle-group');
    expect(button('Center')).toHaveAttribute('aria-pressed', 'true');
    expect(button('Center')).toHaveAttribute('data-state', 'on');
    expect(button('Left')).toHaveAttribute('aria-pressed', 'false');
  });

  it('presses one item at a time and can turn it off', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Alignment defaultValue="left" onValueChange={onValueChange} />);

    await user.click(button('Right'));
    expect(button('Right')).toHaveAttribute('aria-pressed', 'true');
    expect(button('Left')).toHaveAttribute('aria-pressed', 'false');
    expect(onValueChange).toHaveBeenLastCalledWith('right');

    await user.click(button('Right'));
    expect(button('Right')).toHaveAttribute('aria-pressed', 'false');
    expect(onValueChange).toHaveBeenLastCalledWith('');
  });

  it('keeps the active item pressed when required', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Alignment defaultValue="left" required onValueChange={onValueChange} />);

    await user.click(button('Left'));
    expect(button('Left')).toHaveAttribute('aria-pressed', 'true');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('follows the value prop when controlled', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState('left');
      return (
        <>
          <Alignment value={value} onValueChange={setValue} />
          <output>{value || 'none'}</output>
        </>
      );
    }
    render(<Controlled />);
    await user.click(button('Center'));
    expect(screen.getByText('center')).toBeInTheDocument();
    expect(button('Center')).toHaveAttribute('aria-pressed', 'true');
  });

  it('ignores clicks that the parent does not accept', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Alignment value="left" onValueChange={onValueChange} />);
    await user.click(button('Right'));
    expect(onValueChange).toHaveBeenCalledWith('right');
    expect(button('Left')).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('ToggleGroup multiple', () => {
  function Formatting(props: { onValueChange?: (value: string[]) => void }) {
    return (
      <ToggleGroup
        type="multiple"
        aria-label="Formatting"
        defaultValue={['bold']}
        onValueChange={props.onValueChange}
      >
        <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
        <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
        <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
      </ToggleGroup>
    );
  }

  it('presses several items at once', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Formatting onValueChange={onValueChange} />);

    await user.click(button('Italic'));
    expect(onValueChange).toHaveBeenLastCalledWith(['bold', 'italic']);
    expect(button('Bold')).toHaveAttribute('aria-pressed', 'true');
    expect(button('Italic')).toHaveAttribute('aria-pressed', 'true');

    await user.click(button('Bold'));
    expect(onValueChange).toHaveBeenLastCalledWith(['italic']);
    expect(button('Bold')).toHaveAttribute('aria-pressed', 'false');
  });

  it('toggles the focused item with Space and Enter', async () => {
    const user = userEvent.setup();
    render(<Formatting />);
    await user.tab();
    expect(button('Bold')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(button('Italic')).toHaveFocus();
    await user.keyboard(' ');
    expect(button('Italic')).toHaveAttribute('aria-pressed', 'true');
    await user.keyboard('{Enter}');
    expect(button('Italic')).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('ToggleGroup keyboard', () => {
  it('has a single tab stop on the pressed item', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">Before</button>
        <Alignment defaultValue="center" />
        <button type="button">After</button>
      </>,
    );
    expect(button('Left')).toHaveAttribute('tabindex', '-1');
    expect(button('Center')).toHaveAttribute('tabindex', '0');

    await user.click(button('Before'));
    await user.tab();
    expect(button('Center')).toHaveFocus();
    await user.tab();
    expect(button('After')).toHaveFocus();
  });

  it('falls back to the first enabled item when nothing is pressed', () => {
    render(
      <ToggleGroup type="single" aria-label="View">
        <ToggleGroup.Item value="day" disabled>
          Day
        </ToggleGroup.Item>
        <ToggleGroup.Item value="week">Week</ToggleGroup.Item>
        <ToggleGroup.Item value="month">Month</ToggleGroup.Item>
      </ToggleGroup>,
    );
    expect(button('Week')).toHaveAttribute('tabindex', '0');
    expect(button('Month')).toHaveAttribute('tabindex', '-1');
  });

  it('moves with the arrows, wraps, skips disabled items and jumps with Home and End', async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup type="single" aria-label="View" defaultValue="day">
        <ToggleGroup.Item value="day">Day</ToggleGroup.Item>
        <ToggleGroup.Item value="week" disabled>
          Week
        </ToggleGroup.Item>
        <ToggleGroup.Item value="month">Month</ToggleGroup.Item>
        <ToggleGroup.Item value="year">Year</ToggleGroup.Item>
      </ToggleGroup>,
    );
    await user.tab();
    expect(button('Day')).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(button('Month')).toHaveFocus();
    expect(button('Month')).toHaveAttribute('tabindex', '0');
    expect(button('Day')).toHaveAttribute('tabindex', '-1');
    expect(button('Day')).toHaveAttribute('aria-pressed', 'true');

    await user.keyboard('{End}');
    expect(button('Year')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(button('Day')).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(button('Year')).toHaveFocus();
    await user.keyboard('{Home}');
    expect(button('Day')).toHaveFocus();
  });

  it('stops at the ends when loop is off', async () => {
    const user = userEvent.setup();
    render(<Alignment defaultValue="right" loop={false} />);
    await user.tab();
    expect(button('Right')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(button('Right')).toHaveFocus();
  });

  it('uses up and down when vertical', async () => {
    const user = userEvent.setup();
    render(<Alignment defaultValue="left" orientation="vertical" />);
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(button('Left')).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(button('Center')).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(button('Left')).toHaveFocus();
  });

  it('reverses horizontal arrows with dir="rtl"', async () => {
    const user = userEvent.setup();
    render(<Alignment defaultValue="left" dir="rtl" />);
    expect(screen.getByRole('group')).toHaveAttribute('dir', 'rtl');
    await user.tab();
    await user.keyboard('{ArrowLeft}');
    expect(button('Center')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(button('Left')).toHaveFocus();
  });

  it('returns to the pressed item after focus leaves the group', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Alignment defaultValue="left" />
        <button type="button">After</button>
      </>,
    );
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(button('Center')).toHaveFocus();
    await user.tab();
    expect(button('After')).toHaveFocus();
    expect(button('Left')).toHaveAttribute('tabindex', '0');
    await user.tab({ shift: true });
    expect(button('Left')).toHaveFocus();
  });

  it('disables every item from the root', () => {
    render(<Alignment disabled />);
    for (const name of ['Left', 'Center', 'Right']) expect(button(name)).toBeDisabled();
    expect(screen.getByRole('group')).toHaveAttribute('data-disabled');
  });
});

describe('ToggleGroup styling and a11y', () => {
  it('joins outline items into a segmented control', () => {
    render(<Alignment variant="outline" defaultValue="left" />);
    expect(screen.getByRole('group')).toHaveClass('border-input');
    expect(button('Center')).toHaveClass('border-s', 'first:rounded-s-md', 'last:rounded-e-md');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <div>
        <Alignment defaultValue="center" />
        <ToggleGroup type="multiple" aria-label="Formatting" variant="outline">
          <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
          <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
        </ToggleGroup>
      </div>,
    );
    await expectNoAxeViolations(container);
  });

  it('throws when an item is rendered outside a group', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ToggleGroup.Item value="x">X</ToggleGroup.Item>)).toThrow();
    spy.mockRestore();
  });
});
