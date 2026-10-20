import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '../../test-utils/axe';
import { partsFromSeed, Sprite, SPRITE_CSS, spriteToSvg, type SpriteParts } from './sprite';

const svgOf = (ui: React.ReactElement) => render(ui).container.innerHTML;

describe('partsFromSeed', () => {
  it('is deterministic', () => {
    expect(partsFromSeed('nacho')).toEqual(partsFromSeed('nacho'));
  });

  it('spreads different seeds across different parts', () => {
    const seeds = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const combos = new Set(seeds.map((s) => JSON.stringify(partsFromSeed(s))));
    expect(combos.size).toBeGreaterThan(1);
  });

  it('only ever picks parts that exist', () => {
    for (const seed of ['', 'x', 'a very long seed string', '123', 'ñ']) {
      const parts = partsFromSeed(seed);
      expect(Object.values(parts).every((v) => v !== undefined)).toBe(true);
    }
  });
});

describe('Sprite', () => {
  it('draws the same markup for the same seed', () => {
    expect(svgOf(<Sprite seed="nacho" />)).toBe(svgOf(<Sprite seed="nacho" />));
  });

  it('draws different markup for different seeds', () => {
    expect(svgOf(<Sprite seed="nacho" />)).not.toBe(svgOf(<Sprite seed="mate" />));
  });

  it('changes its grid with the state', () => {
    expect(svgOf(<Sprite seed="nacho" state="bust" />)).toContain('viewBox="0 0 24 24"');
    expect(svgOf(<Sprite seed="nacho" state="work" />)).toContain('viewBox="0 0 32 30"');
  });

  it('lets an explicit part beat the seed', () => {
    const forced = svgOf(<Sprite seed="nacho" parts={{ skin: 'umber' }} />);
    expect(forced).toContain('#8A5A3C');
  });

  it('only lights the screen in the working states', () => {
    expect(svgOf(<Sprite seed="nacho" state="idle" />)).not.toContain('sprite-glow');
    expect(svgOf(<Sprite seed="nacho" state="work" />)).toContain('sprite-glow');
  });

  it('carries its state on the class so the stylesheet can find it', () => {
    expect(svgOf(<Sprite seed="nacho" state="walk" />)).toContain('sprite-walk');
  });
});

describe('part combinations that would clash', () => {
  it('lights a visor instead of leaving it blindfold-dark', () => {
    expect(svgOf(<Sprite seed="x" parts={{ eyes: 'visor' }} />)).toContain('#A8E6D7');
  });

  it('never puts glasses on a visor', () => {
    const svg = svgOf(<Sprite seed="x" parts={{ eyes: 'visor', accessory: 'glasses' }} />);
    expect(svg).not.toContain('M11 9h2v1h-2Z');
  });
});

describe('spriteToSvg', () => {
  it('is a standalone svg that carries its own animations', () => {
    const svg = spriteToSvg({ seed: 'nacho', state: 'loop' });
    expect(svg.startsWith('<svg xmlns=')).toBe(true);
    expect(svg).toContain('<style>');
    expect(svg).toContain('sprite-cycle-sit');
  });

  it('is deterministic', () => {
    expect(spriteToSvg({ seed: 'nacho' })).toBe(spriteToSvg({ seed: 'nacho' }));
  });

  it('respects the state grid', () => {
    expect(spriteToSvg({ seed: 'nacho', state: 'work' })).toContain('viewBox="0 0 32 30"');
  });

  it('can skip the stylesheet when the page already has one', () => {
    expect(spriteToSvg({ seed: 'nacho', withStyles: false })).not.toContain('<style>');
  });
});

describe('untrusted input', () => {
  const hostile = '"/><script>alert(1)</script><rect fill="';

  it('drops colors that are not colors', () => {
    const svg = spriteToSvg({
      seed: 'nacho',
      parts: { outfitMain: hostile, outfitTrim: hostile, eyeFill: hostile },
    });
    expect(svg).not.toContain('<script>');
    expect(svg).toContain(partsFromSeed('nacho').outfitMain);
    expect(svgOf(<Sprite seed="nacho" parts={{ outfitMain: hostile }} />)).not.toContain(
      '<script>',
    );
  });

  it('keeps real colors in any CSS notation', () => {
    const svg = spriteToSvg({
      seed: 'nacho',
      parts: { outfit: 'tee', outfitMain: '#123abc', outfitTrim: 'oklch(0.7 0.1 200 / 50%)' },
    });
    expect(svg).toContain('fill="#123abc"');
    expect(svg).toContain('fill="oklch(0.7 0.1 200 / 50%)"');
  });

  it('escapes the label', () => {
    const svg = spriteToSvg({ seed: 'nacho', label: '<b>Nacho & "co"</b>' });
    expect(svg).toContain('<title>&#60;b&#62;Nacho &#38; &#34;co&#34;&#60;/b&#62;</title>');
  });

  it('falls back to the seed for unknown parts and states', () => {
    const bogus = {
      skin: 'chrome',
      hair: 'mohawk',
      accessory: 'constructor',
    } as unknown as Partial<SpriteParts>;
    expect(() => svgOf(<Sprite seed="nacho" parts={bogus} />)).not.toThrow();
    const svg = spriteToSvg({ seed: 'nacho', parts: bogus, state: '"><x' as never });
    expect(svg).toContain('class="sprite sprite-idle"');
  });
});

describe('reduced motion', () => {
  it('stops every sprite animation, not only the loop', () => {
    const reduced = SPRITE_CSS.slice(SPRITE_CSS.indexOf('@media (prefers-reduced-motion: reduce)'));
    expect(reduced).toContain('.sprite *');
    expect(reduced).toContain('animation: none');
    expect(reduced).toContain('.sprite-work .sprite-hands');
  });

  it('ships the rule inside standalone svgs', () => {
    expect(spriteToSvg({ seed: 'nacho' })).toContain('prefers-reduced-motion: reduce');
  });
});

describe('accessibility', () => {
  it('is hidden from assistive tech by default', async () => {
    const { container } = render(<Sprite seed="nacho" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    await expectNoAxeViolations(container);
  });

  it('becomes a named image with a label', async () => {
    const { container } = render(<Sprite seed="nacho" label="Nacho" />);
    const image = screen.getByRole('img', { name: 'Nacho' });
    expect(image).not.toHaveAttribute('aria-hidden');
    expect(image.querySelector('title')).toHaveTextContent('Nacho');
    await expectNoAxeViolations(container);
  });

  it('marks a standalone svg as decorative when it has no label', () => {
    expect(spriteToSvg({ seed: 'nacho' })).toContain('aria-hidden="true"');
    expect(spriteToSvg({ seed: 'nacho', label: 'Nacho' })).toContain('role="img"');
  });
});

describe('withStyles', () => {
  it('injects the stylesheet once no matter how many sprites render', () => {
    const { container } = render(
      <>
        <Sprite seed="a" withStyles />
        <Sprite seed="b" withStyles />
        <Sprite seed="c" withStyles />
      </>,
    );
    expect(container.querySelectorAll('style')).toHaveLength(0);
    expect(document.querySelectorAll('style[data-href="nachui-sprite"]')).toHaveLength(1);
  });
});
