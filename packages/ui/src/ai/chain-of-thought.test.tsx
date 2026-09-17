import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
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
    expect(screen.getByText('docs/theming')).toBeInTheDocument();
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
});
