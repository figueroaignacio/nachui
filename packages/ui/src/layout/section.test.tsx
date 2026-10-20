import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Section } from './section';

describe('Section', () => {
  it('renders a section wrapped in a container', () => {
    render(
      <Section data-testid="section">
        <p>Content</p>
      </Section>,
    );
    const section = screen.getByTestId('section');
    expect(section.tagName).toBe('SECTION');
    expect(section).toHaveClass('py-12');
    expect(screen.getByText('Content').parentElement).toHaveClass('max-w-screen-xl');
  });

  it('skips the container when contained is false', () => {
    render(
      <Section contained={false} data-testid="section">
        <p>Content</p>
      </Section>,
    );
    expect(screen.getByText('Content').parentElement).toBe(screen.getByTestId('section'));
  });

  it('applies background and size variants', () => {
    render(
      <Section size="lg" background="inverted" bordered data-testid="section">
        Content
      </Section>,
    );
    const section = screen.getByTestId('section');
    expect(section).toHaveClass('py-16', 'bg-foreground', 'border-y');
    expect(section).toHaveAttribute('data-background', 'inverted');
  });

  it('renders the header parts', () => {
    render(
      <Section>
        <Section.Header align="center">
          <Section.Eyebrow>Platform</Section.Eyebrow>
          <Section.Title as="h1">Title</Section.Title>
          <Section.Description>Description</Section.Description>
        </Section.Header>
      </Section>,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Title' })).toBeInTheDocument();
    expect(screen.getByText('Platform')).toBeInTheDocument();
    expect(screen.getByText('Description').parentElement).toHaveClass('text-center');
  });

  it('keeps the eyebrow and description readable on a primary background', () => {
    render(
      <Section background="primary" data-testid="section">
        <Section.Eyebrow>Eyebrow</Section.Eyebrow>
        <Section.Description>Description</Section.Description>
      </Section>,
    );
    expect(screen.getByTestId('section').className).toContain(
      '[--section-accent:var(--primary-foreground)]',
    );
    expect(screen.getByText('Eyebrow').className).toContain('var(--section-accent');
    expect(screen.getByText('Eyebrow')).not.toHaveClass('text-primary');
    expect(screen.getByText('Description')).not.toHaveClass('opacity-70');
  });

  it('aligns the header to the logical start', () => {
    render(
      <Section.Header data-testid="header">
        <Section.Title>Title</Section.Title>
      </Section.Header>,
    );
    expect(screen.getByTestId('header')).toHaveClass('text-start');
  });
});
