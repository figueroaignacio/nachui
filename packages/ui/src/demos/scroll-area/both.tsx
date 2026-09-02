import { ScrollArea } from '../../components/scroll-area';

const columns = ['Route', 'Method', 'p50', 'p95', 'p99', 'Errors', 'Requests', 'Region'];

const rows = [
  ['/api/orders', 'GET', '32 ms', '120 ms', '340 ms', '0.1%', '1.2M', 'us-east-1'],
  ['/api/orders', 'POST', '58 ms', '210 ms', '610 ms', '0.4%', '240K', 'us-east-1'],
  ['/api/customers', 'GET', '21 ms', '88 ms', '190 ms', '0.0%', '980K', 'eu-central-1'],
  ['/api/invoices', 'GET', '44 ms', '160 ms', '420 ms', '0.2%', '410K', 'eu-central-1'],
  ['/api/invoices/:id/pdf', 'GET', '310 ms', '900 ms', '1.8 s', '1.1%', '32K', 'us-west-2'],
  ['/api/webhooks', 'POST', '12 ms', '40 ms', '95 ms', '0.0%', '3.4M', 'ap-southeast-1'],
  ['/api/search', 'GET', '80 ms', '260 ms', '700 ms', '0.3%', '620K', 'us-east-1'],
  ['/api/exports', 'POST', '1.2 s', '3.4 s', '6.1 s', '2.0%', '8K', 'sa-east-1'],
  ['/api/auth/session', 'GET', '9 ms', '30 ms', '70 ms', '0.0%', '5.1M', 'us-east-1'],
  ['/api/auth/login', 'POST', '140 ms', '400 ms', '900 ms', '0.8%', '150K', 'us-east-1'],
];

export function Both() {
  return (
    <ScrollArea
      orientation="both"
      type="always"
      className="border-border bg-card h-56 w-full max-w-md rounded-lg border"
    >
      <table className="w-max min-w-full text-left text-sm">
        <thead className="bg-muted/60 text-muted-foreground sticky top-0 text-xs">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-3 py-2 font-medium whitespace-nowrap">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row[0]}-${row[1]}`} className="border-border border-t">
              {row.map((cell, index) => (
                <td
                  key={columns[index]}
                  className={
                    index === 0
                      ? 'px-3 py-2 font-mono whitespace-nowrap'
                      : 'px-3 py-2 whitespace-nowrap'
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
}
