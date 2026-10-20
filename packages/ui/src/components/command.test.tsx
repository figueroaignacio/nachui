import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { expectNoAxeViolations } from '../../test-utils/axe';
import { Command } from './command';

afterEach(() => {
  vi.restoreAllMocks();
  Object.assign(navigator, { clipboard: undefined });
});

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
      expect(screen.getByRole('status')).toHaveTextContent('Copied!');
    });

    expect(screen.getByRole('button', { name: 'Copy command' })).toBeInTheDocument();
    expect(onCopied).toHaveBeenCalledOnce();
  });

  it('accepts and applies custom className', () => {
    const { container } = render(<Command command="pnpm build" className="my-custom-class" />);

    expect(container.firstChild).toHaveClass('my-custom-class');
  });

  it('accepts translated labels', () => {
    render(<Command command="pnpm dev" labels={{ copy: 'Copiar comando' }} />);
    expect(screen.getByRole('button', { name: 'Copiar comando' })).toBeInTheDocument();
  });

  it('keeps an empty live region mounted before copying', () => {
    render(<Command command="pnpm dev" />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toBeEmptyDOMElement();
  });

  it('falls back to execCommand, restores focus and checks the result', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    });
    const execCommand = vi.fn().mockReturnValue(false);
    Object.assign(document, { execCommand });
    const onCopied = vi.fn();

    render(<Command command="pnpm dev" onCopied={onCopied} />);
    const button = screen.getByRole('button', { name: 'Copy command' });
    button.focus();
    fireEvent.click(button);

    await waitFor(() => expect(execCommand).toHaveBeenCalledWith('copy'));
    expect(button).toHaveFocus();
    expect(onCopied).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    expect(document.querySelector('textarea')).toBeNull();

    execCommand.mockReturnValue(true);
    fireEvent.click(button);
    await waitFor(() => expect(onCopied).toHaveBeenCalledOnce());
    expect(button).toHaveFocus();
    expect(screen.getByRole('status')).toHaveTextContent('Copied!');
  });

  it('scrolls long commands instead of truncating them', () => {
    render(<Command command="pnpm dlx nachui add button" />);
    const code = screen.getByText('pnpm dlx nachui add button');
    expect(code).toHaveClass('overflow-x-auto', 'whitespace-nowrap');
    expect(code).not.toHaveClass('truncate');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Command command="pnpm dev" />);
    await expectNoAxeViolations(container);
  });
});
