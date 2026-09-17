import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
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
});
