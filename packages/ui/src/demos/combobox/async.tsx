'use client';

import * as React from 'react';
import { Combobox } from '../../components/combobox';
import { Label } from '../../components/label';

const airports = [
  { code: 'EZE', city: 'Buenos Aires', country: 'Argentina' },
  { code: 'GRU', city: 'Sao Paulo', country: 'Brazil' },
  { code: 'SCL', city: 'Santiago', country: 'Chile' },
  { code: 'BOG', city: 'Bogota', country: 'Colombia' },
  { code: 'MEX', city: 'Mexico City', country: 'Mexico' },
  { code: 'JFK', city: 'New York', country: 'United States' },
  { code: 'SFO', city: 'San Francisco', country: 'United States' },
  { code: 'YYZ', city: 'Toronto', country: 'Canada' },
  { code: 'LHR', city: 'London', country: 'United Kingdom' },
  { code: 'MAD', city: 'Madrid', country: 'Spain' },
  { code: 'CDG', city: 'Paris', country: 'France' },
  { code: 'NRT', city: 'Tokyo', country: 'Japan' },
];

type Airport = (typeof airports)[number];

function searchAirports(query: string): Airport[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  return airports.filter((airport) =>
    `${airport.city} (${airport.code}) ${airport.country}`.toLowerCase().includes(needle),
  );
}

export function Async() {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<Airport[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setResults(searchAirports(query));
      setLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [query]);

  const handleInputChange = (next: string) => {
    setQuery(next);
    setLoading(true);
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-1.5">
      <Label htmlFor="destination">Destination</Label>
      <Combobox
        filter={false}
        loading={loading}
        inputValue={query}
        onInputValueChange={handleInputChange}
      >
        <Combobox.Input id="destination" placeholder="City or airport code">
          <Combobox.Clear />
        </Combobox.Input>
        <Combobox.Content>
          <Combobox.Empty>
            {query.trim() ? 'No airports found.' : 'Start typing to search airports.'}
          </Combobox.Empty>
          {results.map((airport) => (
            <Combobox.Item
              key={airport.code}
              value={airport.code}
              textValue={`${airport.city} (${airport.code})`}
            >
              <span className="flex w-full items-center justify-between gap-2">
                <span className="truncate">
                  {airport.city}, {airport.country}
                </span>
                <span className="text-muted-foreground font-mono text-xs">{airport.code}</span>
              </span>
            </Combobox.Item>
          ))}
        </Combobox.Content>
      </Combobox>
    </div>
  );
}
