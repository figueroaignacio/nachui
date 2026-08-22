'use client';

import { Sprite } from '../../components/sprite';

export function Parts() {
  return (
    <div className="flex flex-wrap items-end gap-8">
      <Sprite
        seed="nachui"
        size={64}
        parts={{ hair: 'bun', hairColor: 'copper', eyes: 'wide', accessory: 'glasses' }}
      />
      <Sprite
        seed="nachui"
        size={64}
        parts={{ skin: 'umber', outfit: 'overalls', outfitMain: '#4E6E58', accessory: 'none' }}
      />
      <Sprite
        seed="nachui"
        size={64}
        parts={{ eyes: 'visor', eyeFill: '#A8E6D7', hair: 'buzz', hairColor: 'ash' }}
      />
    </div>
  );
}
