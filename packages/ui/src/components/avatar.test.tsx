import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar } from './avatar';

describe('Avatar', () => {
  it('renders fallback when no src is provided', () => {
    render(
      <Avatar>
        <Avatar.Image src="" alt="Test" />
        <Avatar.Fallback>AB</Avatar.Fallback>
      </Avatar>,
    );
    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('renders fallback when image fails to load', () => {
    render(
      <Avatar>
        <Avatar.Image src="invalid.jpg" alt="Test" />
        <Avatar.Fallback data-testid="fallback">CD</Avatar.Fallback>
      </Avatar>,
    );

    const img = screen.getByRole('img', { hidden: true });
    fireEvent.error(img);

    expect(screen.getByTestId('fallback')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders image when loaded', () => {
    render(
      <Avatar>
        <Avatar.Image src="valid.jpg" alt="Test" />
        <Avatar.Fallback>EF</Avatar.Fallback>
      </Avatar>,
    );

    const img = screen.getByRole('img', { hidden: true });
    fireEvent.load(img);

    expect(screen.queryByText('EF')).not.toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('renders avatar group correctly', () => {
    render(
      <Avatar.Group data-testid="group">
        <Avatar>
          <Avatar.Fallback>1</Avatar.Fallback>
        </Avatar>
        <Avatar>
          <Avatar.Fallback>2</Avatar.Fallback>
        </Avatar>
      </Avatar.Group>,
    );
    const group = screen.getByTestId('group');
    expect(group).toHaveClass('flex', '-space-x-2');
  });

  it('layers the loading image over the fallback so initials stay centered', () => {
    render(
      <Avatar>
        <Avatar.Image src="/slow.jpg" alt="" />
        <Avatar.Fallback data-testid="fallback">EF</Avatar.Fallback>
      </Avatar>,
    );
    const img = screen.getByRole('presentation', { hidden: true });
    expect(img).toHaveAttribute('data-status', 'loading');
    expect(img).toHaveClass('absolute', 'inset-0');
    expect(screen.getByTestId('fallback')).toHaveClass('h-full', 'w-full');

    fireEvent.load(img);
    expect(img).toHaveAttribute('data-status', 'loaded');
    expect(screen.queryByTestId('fallback')).not.toBeInTheDocument();
  });
});
