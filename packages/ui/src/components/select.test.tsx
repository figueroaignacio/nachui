import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './select';

function renderSelect(props: React.ComponentProps<typeof Select> = { children: null }) {
  const { children: _children, ...rest } = props;
  return render(
    <Select {...rest}>
      <Select.Trigger placeholder="Pick one" />
      <Select.Content>
        <Select.Item value="one">One</Select.Item>
        <Select.Item value="two">Two</Select.Item>
        <Select.Item value="three" disabled>
          Three
        </Select.Item>
      </Select.Content>
    </Select>,
  );
}

describe('Select', () => {
  it('shows the placeholder when nothing is selected', () => {
    renderSelect();
    expect(screen.getByRole('combobox')).toHaveTextContent('Pick one');
  });

  it('shows the label of the default value', () => {
    renderSelect({ defaultValue: 'two', children: null });
    expect(screen.getByRole('combobox')).toHaveTextContent('Two');
  });

  it('opens on click and selects an option', () => {
    const onValueChange = vi.fn();
    renderSelect({ onValueChange, children: null });
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(screen.getByText('One'));
    expect(onValueChange).toHaveBeenCalledWith('one');
    expect(trigger).toHaveTextContent('One');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('marks the selected option', () => {
    renderSelect({ defaultValue: 'one', children: null });
    fireEvent.click(screen.getByRole('combobox'));
    const options = screen.getAllByRole('option', { hidden: true });
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    expect(options[1]).toHaveAttribute('aria-selected', 'false');
  });

  it('closes on Escape and restores focus to the trigger', () => {
    renderSelect();
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    fireEvent.keyDown(screen.getByRole('listbox', { hidden: true }), { key: 'Escape' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
  });

  it('respects the disabled state', () => {
    renderSelect({ disabled: true, children: null });
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('renders a hidden input when given a name', () => {
    const { container } = renderSelect({ name: 'plan', defaultValue: 'two', children: null });
    expect(container.querySelector('input[name="plan"]')).toHaveValue('two');
  });
});
