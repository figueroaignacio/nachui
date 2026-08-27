import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Empty } from './empty';

describe('Empty', () => {
  it('renders title, description and content', () => {
    render(
      <Empty>
        <Empty.Header>
          <Empty.Title>No projects yet</Empty.Title>
          <Empty.Description>Create your first project to get started.</Empty.Description>
        </Empty.Header>
        <Empty.Content>
          <button type="button">New project</button>
        </Empty.Content>
      </Empty>,
    );
    expect(screen.getByRole('heading', { name: 'No projects yet' })).toBeInTheDocument();
    expect(screen.getByText('Create your first project to get started.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New project' })).toBeInTheDocument();
  });

  it('applies the outline variant', () => {
    render(<Empty variant="outline" data-testid="empty" />);
    expect(screen.getByTestId('empty')).toHaveClass('border-dashed');
  });

  it('applies the icon media variant', () => {
    render(<Empty.Media variant="icon" data-testid="media" />);
    const media = screen.getByTestId('media');
    expect(media).toHaveClass('bg-muted');
    expect(media).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders the title with a custom heading level', () => {
    render(<Empty.Title as="h2">Nothing here</Empty.Title>);
    expect(screen.getByRole('heading', { level: 2, name: 'Nothing here' })).toBeInTheDocument();
  });
});
