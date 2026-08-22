'use client';

import { useState } from 'react';

import { Badge } from '../../components/badge';
import { Button } from '../../components/button';
import { Table } from '../../components/table';

const apiKeys = [
  { id: 'key_prod', name: 'Production', secret: 'sk_live_••••4f2a', lastUsed: '2m ago' },
  { id: 'key_ci', name: 'CI pipeline', secret: 'sk_live_••••9b71', lastUsed: '3h ago' },
  { id: 'key_dev', name: 'Local dev', secret: 'sk_test_••••1c05', lastUsed: 'Mar 12' },
];

export function WithActions() {
  const [revoked, setRevoked] = useState<string[]>([]);

  return (
    <Table>
      <Table.Caption>API keys for the storefront-api project.</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
          <Table.Head>Key</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head className="text-right">Actions</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {apiKeys.map((apiKey) => {
          const isRevoked = revoked.includes(apiKey.id);

          return (
            <Table.Row key={apiKey.id}>
              <Table.Cell className="font-medium">{apiKey.name}</Table.Cell>
              <Table.Cell className="font-mono">{apiKey.secret}</Table.Cell>
              <Table.Cell>
                {isRevoked ? (
                  <Badge variant="secondary">Revoked</Badge>
                ) : (
                  <span className="flex items-center gap-2">
                    <Badge variant="success">Active</Badge>
                    <span className="text-muted-foreground">Used {apiKey.lastUsed}</span>
                  </span>
                )}
              </Table.Cell>
              <Table.Cell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" className="h-8 px-2 text-xs" disabled={isRevoked}>
                    Copy
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-destructive-text h-8 px-2 text-xs"
                    disabled={isRevoked}
                    onClick={() => setRevoked((keys) => [...keys, apiKey.id])}
                  >
                    Revoke
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
}
