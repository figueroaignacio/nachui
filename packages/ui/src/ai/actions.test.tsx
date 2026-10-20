import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Actions } from './actions';

describe('Actions', () => {
  it('renders labelled icon buttons', () => {
    render(
      <Actions>
        <Actions.Button label="Retry">
          <Actions.Icons.retry />
        </Actions.Button>
        <Actions.Button label="Good response" active>
          <Actions.Icons.thumbsUp />
        </Actions.Button>
      </Actions>,
    );
    expect(screen.getByRole('button', { name: 'Retry' })).not.toHaveAttribute('data-active');
    expect(screen.getByRole('button', { name: 'Good response' })).toHaveAttribute(
      'data-active',
      'true',
    );
  });

  it('exposes active as a pressed state only when it is passed', async () => {
    const { container } = render(
      <Actions>
        <Actions.Button label="Retry">
          <Actions.Icons.retry />
        </Actions.Button>
        <Actions.Button label="Good response" active={false}>
          <Actions.Icons.thumbsUp />
        </Actions.Button>
        <Actions.Button label="Bad response" active>
          <Actions.Icons.thumbsDown />
        </Actions.Button>
      </Actions>,
    );
    expect(screen.getByRole('button', { name: 'Retry' })).not.toHaveAttribute('aria-pressed');
    expect(screen.getByRole('button', { name: 'Good response' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: 'Bad response' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expectNoAxeViolations(container);
  });

  it('aligns to the end', () => {
    const { container } = render(<Actions align="end" />);
    expect(container.firstChild).toHaveAttribute('data-align', 'end');
  });

  describe('Copy', () => {
    const writeText = vi.fn(() => Promise.resolve());

    beforeEach(() => {
      Object.assign(navigator, { clipboard: { writeText } });
    });

    afterEach(() => {
      writeText.mockClear();
      vi.useRealTimers();
    });

    it('copies the text and swaps its label for a while', async () => {
      render(<Actions.Copy text="hello" />);
      await userEvent.click(screen.getByRole('button', { name: 'Copy' }));
      expect(writeText).toHaveBeenCalledWith('hello');
      expect(await screen.findByRole('button', { name: 'Copied' })).toHaveAttribute('data-active');
      expect(screen.getByRole('status')).toHaveTextContent('Copied');
      expect(screen.getByRole('button', { name: 'Copied' })).not.toHaveAttribute('aria-pressed');
    });

    it('announces a failed copy', async () => {
      writeText.mockImplementationOnce(() => Promise.reject(new Error('denied')));
      render(<Actions.Copy text="hello" failedLabel="Could not copy" />);
      expect(screen.getByRole('status')).toBeEmptyDOMElement();
      await userEvent.click(screen.getByRole('button', { name: 'Copy' }));
      expect(await screen.findByText('Could not copy')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
    });

    it('returns to the copy label after the timeout', async () => {
      render(<Actions.Copy text="hello" timeout={10} />);
      await userEvent.click(screen.getByRole('button', { name: 'Copy' }));
      await screen.findByRole('button', { name: 'Copied' });
      await act(() => new Promise((resolve) => setTimeout(resolve, 30)));
      expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
    });
  });
});
