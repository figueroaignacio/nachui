'use client';

import { Button } from '../../components/button';
import { Sheet, type SheetSize } from '../../components/sheet';

const SIZES: SheetSize[] = ['sm', 'md', 'lg', 'xl', 'full'];

export function Sizes() {
  return (
    <div className="flex flex-wrap gap-2">
      {SIZES.map((size) => (
        <Sheet key={size}>
          <Sheet.Trigger asChild>
            <Button variant="outline" size="sm">
              {size}
            </Button>
          </Sheet.Trigger>
          <Sheet.Content size={size}>
            <Sheet.Header>
              <Sheet.Title>Size {size}</Sheet.Title>
              <Sheet.Description>Width on the sides, height on top and bottom.</Sheet.Description>
            </Sheet.Header>
          </Sheet.Content>
        </Sheet>
      ))}
    </div>
  );
}
