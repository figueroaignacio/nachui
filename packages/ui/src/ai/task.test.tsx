import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Task } from './task';

describe('Task', () => {
  it('renders the title and its content open by default', () => {
    render(
      <Task>
        <Task.Trigger title="Scanned the registry" />
        <Task.Content>
          <Task.Item>Read 58 components</Task.Item>
        </Task.Content>
      </Task>,
    );
    expect(screen.getByRole('button', { name: /Scanned the registry/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByText('Read 58 components')).toBeInTheDocument();
  });

  it('stays closed when defaultOpen is false', () => {
    render(
      <Task defaultOpen={false}>
        <Task.Trigger title="Run the tests" />
        <Task.Content>
          <Task.Item>Hidden</Task.Item>
        </Task.Content>
      </Task>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('opens on click', async () => {
    render(
      <Task defaultOpen={false}>
        <Task.Trigger title="Run the tests" />
        <Task.Content>
          <Task.Item>Now visible</Task.Item>
        </Task.Content>
      </Task>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Now visible')).toBeInTheDocument();
  });

  it('links the trigger to its region', () => {
    render(
      <Task>
        <Task.Trigger title="Step" />
        <Task.Content>Body</Task.Content>
      </Task>,
    );
    const trigger = screen.getByRole('button');
    expect(screen.getByRole('region')).toHaveAttribute('id', trigger.getAttribute('aria-controls'));
  });

  it('renders a file chip', () => {
    render(
      <Task>
        <Task.Trigger title="Step" />
        <Task.Content>
          <Task.Item>
            Wrote <Task.File>task.tsx</Task.File>
          </Task.Item>
        </Task.Content>
      </Task>,
    );
    expect(screen.getByText('task.tsx')).toHaveClass('font-mono');
  });

  it('names the status in the trigger, not only with color', async () => {
    const { container, rerender } = render(
      <Task>
        <Task.Trigger title="Run the tests" status="active" />
        <Task.Content>
          <Task.Item>Running</Task.Item>
        </Task.Content>
      </Task>,
    );
    expect(screen.getByRole('button', { name: 'Run the tests, In progress' })).toBeInTheDocument();
    await expectNoAxeViolations(container);
    rerender(
      <Task>
        <Task.Trigger title="Run the tests" status="error" statusLabels={{ error: 'Broke' }} />
      </Task>,
    );
    expect(screen.getByRole('button', { name: 'Run the tests, Broke' })).toBeInTheDocument();
  });

  it('only points aria-controls at the content while it is open', async () => {
    render(
      <Task>
        <Task.Trigger title="Run the tests" />
        <Task.Content>
          <Task.Item>Body</Task.Item>
        </Task.Content>
      </Task>,
    );
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-controls', screen.getByRole('region').id);
    await userEvent.click(trigger);
    expect(trigger).not.toHaveAttribute('aria-controls');
  });
});
