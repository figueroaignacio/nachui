import type { SpriteParts } from '@repo/ui/components/sprite';

export type CastMember = {
  id: string;
  seed: string;
  parts: SpriteParts;
};

export const CAST: CastMember[] = [
  {
    id: 'nacho',
    seed: 'a1c04f',
    parts: {
      skin: 'terracotta',
      hair: 'crop',
      hairColor: 'ink',
      eyes: 'square',
      outfit: 'tee',
      outfitMain: '#F5F0E8',
      outfitTrim: '#D4704A',
      accessory: 'none',
    },
  },
  {
    id: 'mate',
    seed: 'b7d213',
    parts: {
      skin: 'terracotta',
      hair: 'crop',
      hairColor: 'ink',
      eyes: 'slit',
      outfit: 'slab',
      outfitMain: '#1A1A1A',
      outfitTrim: '#2A2A2A',
      accessory: 'headset',
    },
  },
  {
    id: 'vera',
    seed: 'c2e930',
    parts: {
      skin: 'sand',
      hair: 'long',
      hairColor: 'copper',
      eyes: 'wide',
      outfit: 'hoodie',
      outfitMain: '#5B6B8C',
      outfitTrim: '#46536E',
      accessory: 'glasses',
    },
  },
  {
    id: 'bit',
    seed: 'd4f118',
    parts: {
      skin: 'clay',
      hair: 'buzz',
      hairColor: 'ash',
      eyes: 'visor',
      outfit: 'slab',
      outfitMain: '#3A3A3A',
      outfitTrim: '#4A4A4A',
      accessory: 'none',
    },
  },
  {
    id: 'chispa',
    seed: 'e8a271',
    parts: {
      skin: 'terracotta',
      hair: 'spikes',
      hairColor: 'copper',
      eyes: 'dot',
      outfit: 'tee',
      outfitMain: '#E5C24A',
      outfitTrim: '#C9A227',
      accessory: 'cap',
    },
  },
  {
    id: 'lupe',
    seed: 'f3b805',
    parts: {
      skin: 'umber',
      hair: 'bun',
      hairColor: 'ink',
      eyes: 'square',
      outfit: 'overalls',
      outfitMain: '#4E6E58',
      outfitTrim: '#3C5645',
      accessory: 'none',
    },
  },
  {
    id: 'tero',
    seed: '17c4e2',
    parts: {
      skin: 'umber',
      hair: 'bowl',
      hairColor: 'ink',
      eyes: 'slit',
      outfit: 'tee',
      outfitMain: '#F5F0E8',
      outfitTrim: '#D4704A',
      accessory: 'headset',
    },
  },
  {
    id: 'nieve',
    seed: '29d6ba',
    parts: {
      skin: 'sand',
      hair: 'crop',
      hairColor: 'ash',
      eyes: 'wide',
      outfit: 'hoodie',
      outfitMain: '#8E7BA8',
      outfitTrim: '#74628C',
      accessory: 'band',
    },
  },
];

export const findMember = (id: string) => CAST.find((member) => member.id === id);
