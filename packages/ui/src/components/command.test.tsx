import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Command } from './command';

describe('Command', () => {
  it('renders the command and default prefix', () => {
    render(<Command command="npm install @repo/ui" />);

    expect(screen.getByText('npm install @repo/ui')).toBeInTheDocument();
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it('renders a custom prefix', () => {
    render(<Command command="pnpm dev" prefix=">" />);

    expect(screen.getByText('>')).toBeInTheDocument();
  });

  it('renders the copy button with accessible label', () => {
    render(<Command command="pnpm install" />);

    expect(screen.getByRole('button', { name: 'Copy command' })).toBeInTheDocument();
  });

  it('shows copied state and calls onCopied callback on click', async () => {
    const onCopied = vi.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    render(<Command command="pnpm dev" onCopied={onCopied} resetDelay={500} />);

    fireEvent.click(screen.getByRole('button', { name: 'Copy command' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();
    });

    expect(onCopied).toHaveBeenCalledOnce();
  });

  it('accepts and applies custom className', () => {
    const { container } = render(<Command command="pnpm build" className="my-custom-class" />);

    expect(container.firstChild).toHaveClass('my-custom-class');
  });
});
