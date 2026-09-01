import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Timeline } from './timeline';

function renderTimeline(props: React.ComponentProps<typeof Timeline> = {}) {
  return render(
    <Timeline data-testid="timeline" {...props}>
      {[1, 2, 3].map((step) => (
        <Timeline.Item key={step} step={step} data-testid={`item-${step}`}>
          <Timeline.Header>
            <Timeline.Date dateTime="2026-03-01">Mar {step}</Timeline.Date>
            <Timeline.Title>Step {step}</Timeline.Title>
          </Timeline.Header>
          <Timeline.Indicator data-testid={`indicator-${step}`} />
          <Timeline.Separator data-testid={`separator-${step}`} />
          <Timeline.Content>Body {step}</Timeline.Content>
        </Timeline.Item>
      ))}
    </Timeline>,
  );
}

describe('Timeline', () => {
  it('renders an ordered list of items', () => {
    renderTimeline();
    expect(screen.getByTestId('timeline').tagName).toBe('OL');
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByRole('heading', { name: 'Step 2' })).toBeInTheDocument();
    expect(screen.getByText('Body 3')).toBeInTheDocument();
  });

  it('marks steps up to the value as completed and the value as active', () => {
    renderTimeline({ value: 2 });
    expect(screen.getByTestId('item-1')).toHaveAttribute('data-completed');
    expect(screen.getByTestId('item-2')).toHaveAttribute('data-completed');
    expect(screen.getByTestId('item-2')).toHaveAttribute('data-active');
    expect(screen.getByTestId('item-3')).not.toHaveAttribute('data-completed');
    expect(screen.getByTestId('item-1')).not.toHaveAttribute('data-active');
  });

  it('defaults to the first step being completed', () => {
    renderTimeline();
    expect(screen.getByTestId('item-1')).toHaveAttribute('data-completed');
    expect(screen.getByTestId('item-2')).not.toHaveAttribute('data-completed');
  });

  it('is vertical by default and exposes the orientation', () => {
    renderTimeline();
    expect(screen.getByTestId('timeline')).toHaveAttribute('data-orientation', 'vertical');
    expect(screen.getByTestId('timeline')).toHaveClass('flex-col');
    expect(screen.getByTestId('item-1')).toHaveClass('ps-8');
  });

  it('lays items out in a row when horizontal', () => {
    renderTimeline({ orientation: 'horizontal' });
    expect(screen.getByTestId('timeline')).toHaveAttribute('data-orientation', 'horizontal');
    expect(screen.getByTestId('item-1')).toHaveClass('pt-8');
    expect(screen.getByTestId('separator-1')).toHaveClass('h-px');
  });

  it('renders dates as time elements', () => {
    renderTimeline();
    const date = screen.getByText('Mar 1');
    expect(date.tagName).toBe('TIME');
    expect(date).toHaveAttribute('datetime', '2026-03-01');
  });

  it('renders the title with a custom heading level', () => {
    render(
      <Timeline>
        <Timeline.Item step={1}>
          <Timeline.Title as="h2">Launch</Timeline.Title>
        </Timeline.Item>
      </Timeline>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Launch' })).toBeInTheDocument();
  });

  it('throws when an item is used outside the timeline', () => {
    const error = console.error;
    console.error = () => {};
    expect(() => render(<Timeline.Item step={1}>Orphan</Timeline.Item>)).toThrow(
      'Timeline components must be used within Timeline',
    );
    console.error = error;
  });
});
