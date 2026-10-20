import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type * as React from 'react';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { Table } from './table';

describe('Table', () => {
  it('renders complete structure correctly', () => {
    render(
      <Table>
        <Table.Caption>A list of recent invoices.</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.Head>Invoice</Table.Head>
            <Table.Head>Status</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>INV001</Table.Cell>
            <Table.Cell>Paid</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.Cell>Total</Table.Cell>
            <Table.Cell>$250.00</Table.Cell>
          </Table.Row>
        </Table.Footer>
      </Table>,
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('A list of recent invoices.')).toBeInTheDocument();
    expect(screen.getByText('Invoice')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('INV001')).toBeInTheDocument();
    expect(screen.getByText('Paid')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('$250.00')).toBeInTheDocument();
  });
});

describe('Table accessibility', () => {
  function renderTable(props: React.ComponentProps<typeof Table> = {}) {
    return render(
      <Table {...props}>
        <Table.Header>
          <Table.Row>
            <Table.Head>Invoice</Table.Head>
            <Table.Head scope="colgroup">Status</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Head scope="row">INV001</Table.Head>
            <Table.Cell>Paid</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    );
  }

  it('lets keyboard users reach the scroll container', () => {
    renderTable({ label: 'Invoices' });
    const region = screen.getByRole('region', { name: 'Invoices' });
    expect(region).toHaveAttribute('tabindex', '0');
    expect(region).toContainElement(screen.getByRole('table'));
  });

  it('stays out of the tab order when there is no label', () => {
    renderTable();
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
    expect(screen.getByRole('table').parentElement).not.toHaveAttribute('tabindex');
  });

  it('scopes header cells to their column by default', () => {
    renderTable();
    expect(screen.getByRole('columnheader', { name: 'Invoice' })).toHaveAttribute('scope', 'col');
    expect(screen.getByText('Status')).toHaveAttribute('scope', 'colgroup');
    expect(screen.getByRole('rowheader', { name: 'INV001' })).toHaveAttribute('scope', 'row');
  });

  it('has no axe violations', async () => {
    const { container } = renderTable({ label: 'Invoices' });
    await expectNoAxeViolations(container);
  });
});
