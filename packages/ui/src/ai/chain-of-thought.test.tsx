import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { ChainOfThought } from './chain-of-thought';

describe('ChainOfThought', () => {
  it('is closed by default', () => {
    render(
      <ChainOfThought>
        <ChainOfThought.Header />
        <ChainOfThought.Content>
          <ChainOfThought.Step label="Reading the docs" />
        </ChainOfThought.Content>
      </ChainOfThought>,
    );
    expect(screen.getByRole('button', { name: /Chain of Thought/ })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.queryByText('Reading the docs')).not.toBeInTheDocument();
  });

  it('opens on click', async () => {
    render(
      <ChainOfThought>
        <ChainOfThought.Header>My reasoning</ChainOfThought.Header>
        <ChainOfThought.Content>
          <ChainOfThought.Step label="Reading the docs" />
        </ChainOfThought.Content>
      </ChainOfThought>,
    );
    await userEvent.click(screen.getByRole('button', { name: /My reasoning/ }));
    expect(screen.getByText('Reading the docs')).toBeInTheDocument();
  });

  it('renders a step with its description and status', () => {
    render(
      <ChainOfThought defaultOpen>
        <ChainOfThought.Header />
        <ChainOfThought.Content>
          <ChainOfThought.Step
            label="Searching"
            description="Looking through the registry"
            status="active"
            data-testid="step"
          />
        </ChainOfThought.Content>
      </ChainOfThought>,
    );
    expect(screen.getByText('Looking through the registry')).toBeInTheDocument();
    expect(screen.getByTestId('step')).toHaveAttribute('data-status', 'active');
  });

  it('renders search results', () => {
    render(
      <ChainOfThought defaultOpen>
        <ChainOfThought.Header />
        <ChainOfThought.Content>
          <ChainOfThought.Step label="Searching">
            <ChainOfThought.SearchResults>
              <ChainOfThought.SearchResult>docs/theming</ChainOfThought.SearchResult>
            </ChainOfThought.SearchResults>
          </ChainOfThought.Step>
        </ChainOfThought.Content>
      </ChainOfThought>,
    );
    expect(screen.getByText('docs/theming')).toHaveClass('truncate');
  });

  it('renders an image caption', () => {
    render(
      <ChainOfThought defaultOpen>
        <ChainOfThought.Header />
        <ChainOfThought.Content>
          <ChainOfThought.Image caption="The rendered page">
            <span>preview</span>
          </ChainOfThought.Image>
        </ChainOfThought.Content>
      </ChainOfThought>,
    );
    expect(screen.getByText('The rendered page')).toBeInTheDocument();
  });

  it('exposes the steps as a list with their status in words', async () => {
    const { container } = render(
      <ChainOfThought defaultOpen>
        <ChainOfThought.Header />
        <ChainOfThought.Content>
          <ChainOfThought.Step label="Read the request" status="complete" />
          <ChainOfThought.Step label="Search the docs" status="active" />
          <ChainOfThought.Step
            label="Write the answer"
            status="pending"
            statusLabels={{ pending: 'Up next' }}
          />
        </ChainOfThought.Content>
      </ChainOfThought>,
    );
    const items = screen.getAllByRole('listitem');
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('Read the request, Completed');
    expect(items[1]).toHaveAttribute('aria-current', 'step');
    expect(items[1]).toHaveTextContent('Search the docs, In progress');
    expect(items[2]).not.toHaveAttribute('aria-current');
    expect(items[2]).toHaveTextContent('Write the answer, Up next');
    await expectNoAxeViolations(container);
  });

  it('only points aria-controls at the content while it is open', async () => {
    render(
      <ChainOfThought>
        <ChainOfThought.Header />
        <ChainOfThought.Content>
          <ChainOfThought.Step label="Step" />
        </ChainOfThought.Content>
      </ChainOfThought>,
    );
    const trigger = screen.getByRole('button');
    expect(trigger).not.toHaveAttribute('aria-controls');
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-controls', screen.getByRole('region').id);
  });
});
