import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Toast, useToast } from './toast';

function TestComponent({
  variant,
}: {
  variant?: 'default' | 'success' | 'error' | 'info' | 'warning';
}) {
  const { toast } = useToast();
  return (
    <button
      onClick={() =>
        toast({
          title: 'Test toast',
          description: 'Test description',
          variant,
        })
      }
    >
      Show Toast
    </button>
  );
}

describe('Toast', () => {
  it('renders provider and shows toast on trigger', async () => {
    render(
      <Toast.Provider>
        <TestComponent />
      </Toast.Provider>,
    );

    await userEvent.click(screen.getByText('Show Toast'));
    expect(screen.getByText('Test toast')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders toast with success variant', async () => {
    render(
      <Toast.Provider>
        <TestComponent variant="success" />
      </Toast.Provider>,
    );

    await userEvent.click(screen.getByText('Show Toast'));
    expect(screen.getByText('Test toast')).toBeInTheDocument();
  });

  it('throws when useToast is used outside provider', () => {
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useToast must be used within a Toast.Provider');
  });

  it('uses the labels passed to the provider and forwards its ref', async () => {
    let region: HTMLDivElement | null = null;
    render(
      <Toast.Provider
        ref={(node) => {
          region = node;
        }}
        labels={{ region: 'Notificaciones', dismiss: 'Descartar' }}
      >
        <TestComponent />
      </Toast.Provider>,
    );

    await userEvent.click(screen.getByText('Show Toast'));

    expect(screen.getByRole('region', { name: 'Notificaciones' })).toBe(region);
    expect(screen.getByRole('button', { name: 'Descartar' })).toBeInTheDocument();
  });
});
