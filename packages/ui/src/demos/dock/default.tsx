'use client';

import { useState } from 'react';
import { Dock } from '../../components/dock';
import { BookIcon } from '../../icons/book';
import { HomeIcon } from '../../icons/home';
import { LayoutGridIcon } from '../../icons/layout-grid';
import { MoonIcon } from '../../icons/moon';
import { SearchIcon } from '../../icons/search';
import { SparklesIcon } from '../../icons/sparkles';

const ITEMS = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'docs', label: 'Docs', icon: BookIcon },
  { id: 'components', label: 'Components', icon: LayoutGridIcon },
];

export function Default() {
  const [active, setActive] = useState('home');

  return (
    <Dock floating={false} label="Demo dock">
      {ITEMS.map(({ id, label, icon: Icon }) => (
        <Dock.Item key={id} label={label} active={active === id} onClick={() => setActive(id)}>
          <Icon />
        </Dock.Item>
      ))}
      <Dock.Separator />
      <Dock.Item label="Search">
        <SearchIcon />
      </Dock.Item>
      <Dock.Item label="Ask AI">
        <SparklesIcon />
      </Dock.Item>
      <Dock.Item label="Toggle theme">
        <MoonIcon />
      </Dock.Item>
    </Dock>
  );
}
