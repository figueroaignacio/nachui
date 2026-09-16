'use client';

import { Dock } from '../../components/dock';
import { BookIcon } from '../../icons/book';
import { HomeIcon } from '../../icons/home';
import { PackageIcon } from '../../icons/package';
import { StarIcon } from '../../icons/star';

export function Links() {
  return (
    <Dock floating={false} label="Site navigation">
      <Dock.Item asChild label="Home">
        <a href="#home">
          <HomeIcon />
        </a>
      </Dock.Item>
      <Dock.Item asChild label="Docs" active>
        <a href="#docs">
          <BookIcon />
        </a>
      </Dock.Item>
      <Dock.Item asChild label="Bricks">
        <a href="#bricks">
          <PackageIcon />
        </a>
      </Dock.Item>
      <Dock.Item asChild label="Icons">
        <a href="#icons">
          <StarIcon />
        </a>
      </Dock.Item>
    </Dock>
  );
}
