import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Checkpoint } from './checkpoint';

describe('Checkpoint', () => {
  it('names the group and restores on click', async () => {
    const onRestore = vi.fn();
    const { container } = render(<Checkpoint label="Before the refactor" onRestore={onRestore} />);
    expect(screen.getByRole('group', { name: 'Before the refactor' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Restore' }));
    expect(onRestore).toHaveBeenCalledTimes(1);
    await expectNoAxeViolations(container);
  });

  it('has no button without onRestore and takes its own restore label', () => {
    const { rerender } = render(<Checkpoint />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    rerender(<Checkpoint restoreLabel="Volver acá" onRestore={() => undefined} />);
    expect(screen.getByRole('button', { name: 'Volver acá' })).toBeInTheDocument();
  });
});
