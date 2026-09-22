'use client';

import { Button } from '../../components/button';
import { Sheet, type SheetSide } from '../../components/sheet';

const SIDES: SheetSide[] = ['left', 'right', 'top', 'bottom'];

export function Sides() {
  return (
    <div className="flex flex-wrap gap-2">
      {SIDES.map((side) => (
        <Sheet key={side}>
          <Sheet.Trigger asChild>
            <Button variant="outline" size="sm" className="capitalize">
              {side}
            </Button>
          </Sheet.Trigger>
          <Sheet.Content side={side}>
            <Sheet.Header>
              <Sheet.Title className="capitalize">{side}</Sheet.Title>
              <Sheet.Description>A sheet anchored to the {side} edge.</Sheet.Description>
            </Sheet.Header>
            <Sheet.Body>
              <p className="text-muted-foreground text-sm">
                Press Escape, click the backdrop or use the close button to dismiss it.
              </p>
            </Sheet.Body>
          </Sheet.Content>
        </Sheet>
      ))}
    </div>
  );
}
