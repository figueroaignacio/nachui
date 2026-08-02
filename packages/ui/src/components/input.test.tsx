import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Input } from './input';

describe('Input', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Input label="Email Address" id="email" />);
    const label = screen.getByText('Email Address');
    const input = screen.getByRole('textbox', { name: 'Email Address' });
    expect(label).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it('renders error message and sets aria-invalid', () => {
    render(<Input error="Invalid email" />);
    const input = screen.getByRole('textbox');
    const errorMessage = screen.getByText('Invalid email');

    expect(errorMessage).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
  });

  it('handles user input', async () => {
    render(<Input />);
    const input = screen.getByRole('textbox');

    await userEvent.type(input, 'Hello World');
    expect(input).toHaveValue('Hello World');
  });

  it('is disabled when disabled prop is passed', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('renders with description text', () => {
    render(<Input description="We'll never share your email" />);
    const description = screen.getByText("We'll never share your email");
    expect(description).toBeInTheDocument();
  });

  it('renders description and error with proper aria-describedby', () => {
    render(<Input id="test" description="Helper text" error="Error text" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', 'test-description test-error');
    expect(screen.getByText('Helper text')).toBeInTheDocument();
    expect(screen.getByText('Error text')).toBeInTheDocument();
  });

  it('renders with left icon', () => {
    render(<Input leftIcon={<span data-testid="left-icon">🔍</span>} placeholder="Search..." />);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('renders with right icon', () => {
    render(<Input rightIcon={<span data-testid="right-icon">👁</span>} placeholder="Password" />);
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('applies size variant classes', () => {
    const { rerender } = render(<Input size="sm" placeholder="sm" />);
    let input = screen.getByPlaceholderText('sm');
    expect(input.className).toContain('h-8');

    rerender(<Input size="default" placeholder="default" />);
    input = screen.getByPlaceholderText('default');
    expect(input.className).toContain('h-9');

    rerender(<Input size="lg" placeholder="lg" />);
    input = screen.getByPlaceholderText('lg');
    expect(input.className).toContain('h-10');
  });
});
