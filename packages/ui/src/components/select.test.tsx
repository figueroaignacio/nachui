import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Select } from './select';

function renderSelect(props: Omit<React.ComponentProps<typeof Select>, 'children'> = {}) {
  return render(
    <Select {...props}>
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
    renderSelect({ defaultValue: 'two' });
    expect(screen.getByRole('combobox')).toHaveTextContent('Two');
  });

  it('opens on click and selects an option', () => {
    const onValueChange = vi.fn();
    renderSelect({ onValueChange });
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(screen.getByText('One'));
    expect(onValueChange).toHaveBeenCalledWith('one');
    expect(trigger).toHaveTextContent('One');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('marks the selected option', () => {
    renderSelect({ defaultValue: 'one' });
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
    renderSelect({ disabled: true });
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('renders a hidden input when given a name', () => {
    const { container } = renderSelect({ name: 'plan', defaultValue: 'two' });
    expect(container.querySelector('input[name="plan"]')).toHaveValue('two');
  });
});

describe('Select focus, forms and naming', () => {
  it('closes on Escape while focus is still on the trigger after a click', () => {
    renderSelect();
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const event = fireEvent.keyDown(trigger, { key: 'Escape' });

    expect(event).toBe(false);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes when Tab leaves the trigger while open', () => {
    renderSelect();
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);

    fireEvent.keyDown(trigger, { key: 'Tab' });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('blocks form submission when required and empty', () => {
    const { container } = render(
      <form>
        <Select name="plan" required>
          <Select.Trigger aria-label="Plan" placeholder="Pick one" />
          <Select.Content>
            <Select.Item value="one">One</Select.Item>
          </Select.Content>
        </Select>
      </form>,
    );
    const form = container.querySelector('form') as HTMLFormElement;
    const input = container.querySelector('input[name="plan"]') as HTMLInputElement;

    expect(input).not.toHaveAttribute('type', 'hidden');
    expect(input).toHaveAttribute('tabindex', '-1');
    expect(form.checkValidity()).toBe(false);

    act(() => input.focus());
    expect(screen.getByRole('combobox')).toHaveFocus();

    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('One'));
    expect(form.checkValidity()).toBe(true);
  });

  it('names each group after its label', () => {
    render(
      <Select defaultOpen>
        <Select.Trigger aria-label="Assignee" />
        <Select.Content>
          <Select.Group>
            <Select.Label>Engineering</Select.Label>
            <Select.Item value="lucia">Lucia</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select>,
    );

    expect(screen.getByRole('group', { name: 'Engineering' })).toBeInTheDocument();
  });

  it('names the listbox after the trigger label instead of the selected value', () => {
    render(
      <>
        <label htmlFor="assignee">Assign to</label>
        <Select defaultValue="lucia" defaultOpen>
          <Select.Trigger id="assignee" />
          <Select.Content>
            <Select.Item value="lucia">Lucia</Select.Item>
          </Select.Content>
        </Select>
      </>,
    );

    expect(screen.getByRole('combobox', { name: 'Assign to' })).toBeInTheDocument();
    expect(screen.getByRole('listbox', { name: 'Assign to' })).toBeInTheDocument();
  });

  it('uses the trigger aria-label for the listbox', () => {
    render(
      <Select defaultValue="one" defaultOpen>
        <Select.Trigger aria-label="Currency" />
        <Select.Content>
          <Select.Item value="one">One</Select.Item>
        </Select.Content>
      </Select>,
    );

    expect(screen.getByRole('listbox', { name: 'Currency' })).toBeInTheDocument();
  });

  it('matches several typed characters as one search', async () => {
    render(
      <Select>
        <Select.Trigger aria-label="Country" />
        <Select.Content>
          <Select.Item value="ar">Argentina</Select.Item>
          <Select.Item value="am">Armenia</Select.Item>
          <Select.Item value="au">Australia</Select.Item>
        </Select.Content>
      </Select>,
    );
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
    const listbox = screen.getByRole('listbox', { hidden: true });
    await waitFor(() =>
      expect(screen.getByRole('option', { name: 'Argentina', hidden: true })).toHaveFocus(),
    );

    fireEvent.keyDown(listbox, { key: 'a' });
    fireEvent.keyDown(listbox, { key: 'u' });

    expect(screen.getByRole('option', { name: 'Australia', hidden: true })).toHaveFocus();
  });

  it('portals the listbox to the body with a viewport bound height', () => {
    const { container } = renderSelect();
    fireEvent.click(screen.getByRole('combobox'));

    const listbox = screen.getByRole('listbox', { hidden: true });
    expect(container).not.toContainElement(listbox);
    expect(listbox.style.position).toBe('fixed');
    expect(listbox.className).toContain('--available-height');
  });

  it('has no axe violations while open', async () => {
    render(
      <Select defaultOpen name="plan" required>
        <Select.Trigger aria-label="Plan" />
        <Select.Content>
          <Select.Group>
            <Select.Label>Plans</Select.Label>
            <Select.Item value="one">One</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select>,
    );
    await expectNoAxeViolations(document.body);
  });
});
