import { findMember } from '@/features/sprites/lib/cast';
import { spriteToSvg, type SpriteState } from '@repo/ui/components/sprite';

const STATES: SpriteState[] = ['bust', 'idle', 'walk', 'work', 'loop'];

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export async function GET(request: Request, ctx: { params: Promise<{ seed: string }> }) {
  const { seed: raw } = await ctx.params;
  const seed = decodeURIComponent(raw).replace(/\.svg$/i, '');

  if (!seed || seed.length > 128) {
    return new Response('Seed must be 1 to 128 characters.', { status: 400 });
  }

  const url = new URL(request.url);
  const stateParam = url.searchParams.get('state') ?? 'idle';

  if (!STATES.includes(stateParam as SpriteState)) {
    return new Response(`Unknown state. One of: ${STATES.join(', ')}.`, { status: 400 });
  }

  const member = findMember(seed);
  const svg = spriteToSvg({
    seed: member?.seed ?? seed,
    parts: member?.parts,
    state: stateParam as SpriteState,
    size: clamp(Number(url.searchParams.get('size')) || 96, 16, 512),
    label: member ? seed : `sprite ${seed}`,
  });

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
