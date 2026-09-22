import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Sources, sourceHost } from './sources';

const list = (
  <Sources.Content>
    <Sources.Item href="https://react.dev/reference/react/use" title="use – React" />
    <Sources.Item href="https://www.w3.org/WAI/ARIA/apg/" title="ARIA Authoring Practices" />
  </Sources.Content>
);

describe('Sources', () => {
  it('is closed by default and counts its items', () => {
    render(
      <Sources>
        <Sources.Trigger />
        {list}
      </Sources>,
    );
    const trigger = screen.getByRole('button', { name: 'Used 2 sources' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('opens on click and lists the items', async () => {
    render(
      <Sources>
        <Sources.Trigger />
        {list}
      </Sources>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('link', { name: /use – React/ })).toHaveAttribute(
      'href',
      'https://react.dev/reference/react/use',
    );
  });

  it('prefers an explicit count and a custom label', () => {
    render(
      <Sources count={7}>
        <Sources.Trigger label={(count) => `${count} fuentes`} />
        {list}
      </Sources>,
    );
    expect(screen.getByRole('button', { name: '7 fuentes' })).toBeInTheDocument();
  });

  it('renders the host without www and a default favicon', () => {
    render(
      <Sources defaultOpen>
        <Sources.Trigger />
        {list}
      </Sources>,
    );
    expect(screen.getByText('w3.org')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /ARIA Authoring/ });
    expect(link.querySelector('img')).toHaveAttribute(
      'src',
      'https://www.google.com/s2/favicons?domain=w3.org&sz=32',
    );
  });

  it('accepts a favicon override or none at all', () => {
    render(
      <Sources defaultOpen>
        <Sources.Trigger />
        <Sources.Content>
          <Sources.Item href="https://example.com/a" title="Custom" favicon="/icon.png" />
          <Sources.Item href="https://example.com/b" title="Bare" favicon={null} />
        </Sources.Content>
      </Sources>,
    );
    expect(screen.getByRole('link', { name: /Custom/ }).querySelector('img')).toHaveAttribute(
      'src',
      '/icon.png',
    );
    expect(screen.getByRole('link', { name: /Bare/ }).querySelector('img')).toBeNull();
  });

  it('links the trigger to its region', () => {
    render(
      <Sources defaultOpen>
        <Sources.Trigger />
        {list}
      </Sources>,
    );
    const trigger = screen.getByRole('button');
    expect(screen.getByRole('region')).toHaveAttribute('id', trigger.getAttribute('aria-controls'));
  });

  it('derives a host from a url', () => {
    expect(sourceHost('https://www.example.com/path?q=1')).toBe('example.com');
    expect(sourceHost('not a url')).toBe('not a url');
  });
});
