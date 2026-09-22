import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tool } from './tool';

describe('Tool', () => {
  it('starts closed and names the tool', () => {
    render(
      <Tool>
        <Tool.Header name="get_projects" description="Lists the public projects" />
        <Tool.Content>
          <Tool.Output value="ok" />
        </Tool.Content>
      </Tool>,
    );
    const trigger = screen.getByRole('button', { name: /get_projects/ });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('Lists the public projects')).toBeInTheDocument();
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('opens on click and links the trigger to its region', async () => {
    render(
      <Tool>
        <Tool.Header name="send_email" />
        <Tool.Content>
          <Tool.Output value="sent" />
        </Tool.Content>
      </Tool>,
    );
    const trigger = screen.getByRole('button');
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region')).toHaveAttribute('id', trigger.getAttribute('aria-controls'));
    expect(screen.getByText('sent')).toBeInTheDocument();
  });

  it('exposes a label for every status', () => {
    const { rerender } = render(
      <Tool status="pending">
        <Tool.Header name="fetch" />
      </Tool>,
    );
    expect(screen.getByText('Pending')).toBeInTheDocument();

    rerender(
      <Tool status="running">
        <Tool.Header name="fetch" />
      </Tool>,
    );
    expect(screen.getByText('Running')).toBeInTheDocument();

    rerender(
      <Tool status="complete">
        <Tool.Header name="fetch" />
      </Tool>,
    );
    expect(screen.getByText('Completed')).toBeInTheDocument();

    rerender(
      <Tool status="error">
        <Tool.Header name="fetch" statusLabels={{ error: 'Broke' }} />
      </Tool>,
    );
    expect(screen.getByText('Broke')).toBeInTheDocument();
  });

  it('reflects the status on the root', () => {
    const { container } = render(
      <Tool status="running">
        <Tool.Header name="fetch" />
      </Tool>,
    );
    expect(container.firstChild).toHaveAttribute('data-status', 'running');
  });

  it('pretty-prints an object input', () => {
    render(
      <Tool defaultOpen>
        <Tool.Header name="get_projects" />
        <Tool.Content>
          <Tool.Input value={{ locale: 'en', limit: 3 }} />
        </Tool.Content>
      </Tool>,
    );
    expect(screen.getByText('Input')).toBeInTheDocument();
    expect(screen.getByText(/"locale": "en"/)).toBeInTheDocument();
    expect(screen.getByText(/"limit": 3/)).toBeInTheDocument();
  });

  it('marks a failed output', () => {
    render(
      <Tool defaultOpen status="error">
        <Tool.Header name="get_projects" />
        <Tool.Content>
          <Tool.Output error value="Request timed out" />
        </Tool.Content>
      </Tool>,
    );
    expect(screen.getByText('Request timed out').closest('[data-error]')).not.toBeNull();
  });

  it('prefers children over value in an output', () => {
    render(
      <Tool defaultOpen>
        <Tool.Header name="get_projects" />
        <Tool.Content>
          <Tool.Output value="ignored">
            <strong>3 projects</strong>
          </Tool.Output>
        </Tool.Content>
      </Tool>,
    );
    expect(screen.getByText('3 projects')).toBeInTheDocument();
    expect(screen.queryByText('ignored')).not.toBeInTheDocument();
  });
});
