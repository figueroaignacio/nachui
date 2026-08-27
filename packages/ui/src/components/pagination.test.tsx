import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './pagination';

describe('Pagination', () => {
  it('renders a labeled navigation landmark', () => {
    render(
      <Pagination>
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Link href="#">1</Pagination.Link>
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>,
    );
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
  });

  it('marks the active page with aria-current', () => {
    render(
      <Pagination>
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Link href="#1">1</Pagination.Link>
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Link href="#2" isActive>
              2
            </Pagination.Link>
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>,
    );
    expect(screen.getByRole('link', { name: '2' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: '1' })).not.toHaveAttribute('aria-current');
  });

  it('renders a button when no href is given', async () => {
    const handleClick = vi.fn();
    render(<Pagination.Link onClick={handleClick}>3</Pagination.Link>);
    const button = screen.getByRole('button', { name: '3' });
    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables previous and next', () => {
    render(
      <Pagination>
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Previous href="#" disabled />
          </Pagination.Item>
          <Pagination.Item>
            <Pagination.Next href="#" />
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>,
    );
    const previous = screen.getByRole('link', { name: /previous/i });
    expect(previous).toHaveAttribute('aria-disabled', 'true');
    expect(previous).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('link', { name: /next/i })).not.toHaveAttribute('aria-disabled');
  });

  it('hides the previous and next labels in icon-only mode', () => {
    render(
      <>
        <Pagination.Previous href="#" iconOnly />
        <Pagination.Next href="#" iconOnly />
      </>,
    );
    expect(screen.getByText('Previous')).toHaveClass('sr-only');
    expect(screen.getByText('Next')).toHaveClass('sr-only');
  });

  it('hides the ellipsis from assistive tech', () => {
    render(<Pagination.Ellipsis data-testid="ellipsis" />);
    expect(screen.getByTestId('ellipsis')).toHaveAttribute('aria-hidden', 'true');
  });
});
