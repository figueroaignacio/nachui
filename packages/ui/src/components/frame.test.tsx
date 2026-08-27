import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Frame } from './frame';

describe('Frame', () => {
  it('renders header, panels and footer', () => {
    render(
      <Frame>
        <Frame.Header>
          <Frame.Title>Workspace</Frame.Title>
          <Frame.Description>Plan and usage.</Frame.Description>
        </Frame.Header>
        <Frame.Panel>Panel content</Frame.Panel>
        <Frame.Footer>Footer content</Frame.Footer>
      </Frame>,
    );
    expect(screen.getByRole('heading', { name: 'Workspace' })).toBeInTheDocument();
    expect(screen.getByText('Plan and usage.')).toBeInTheDocument();
    expect(screen.getByText('Panel content')).toBeInTheDocument();
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('applies the default variant classes', () => {
    render(<Frame data-testid="frame" />);
    expect(screen.getByTestId('frame')).toHaveClass('bg-muted/40');
  });

  it('applies the ghost variant classes', () => {
    render(<Frame variant="ghost" data-testid="frame" />);
    expect(screen.getByTestId('frame')).toHaveClass('border-transparent');
  });

  it('connects panels when stacked', () => {
    render(
      <Frame stacked data-testid="frame">
        <Frame.Panel>First</Frame.Panel>
        <Frame.Panel>Second</Frame.Panel>
      </Frame>,
    );
    expect(screen.getByTestId('frame')).toHaveClass('gap-0');
  });

  it('marks panels with a slot attribute for stacked styling', () => {
    render(<Frame.Panel data-testid="panel">Content</Frame.Panel>);
    expect(screen.getByTestId('panel')).toHaveAttribute('data-slot', 'frame-panel');
  });

  it('renders the title with a custom heading level', () => {
    render(<Frame.Title as="h2">Logs</Frame.Title>);
    expect(screen.getByRole('heading', { level: 2, name: 'Logs' })).toBeInTheDocument();
  });
});
