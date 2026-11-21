import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lift import B, D, P, R, WORD_W, f, symbol_paths, word_svg_body

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

INK = '#141414'
NIGHT = '#070707'
PAPER = '#ffffff'
ACCENT = '#f26829'
ACCENT_DARK = '#f8894b'
ACCENT_DEEP = '#451a0b'

K = 100 / B
GAP = 30

SCHEMES = {
    'ink': (INK, INK),
    'paper': (PAPER, PAPER),
    'two-tone': (INK, ACCENT),
    'two-tone-reversed': (PAPER, ACCENT_DARK),
    'current': ('currentColor', 'currentColor'),
}


def write(rel, text):
    p = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w') as fh:
        fh.write(text)


def svg(w, h, inner, label='NachUI', extra=''):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {f(w)} {f(h)}" role="img" aria-label="{label}"{extra}>'
            f'<title>{label}</title>{inner}</svg>\n')


def centroid():
    import math
    b, p = symbol_paths()
    T = B + D
    x0 = (100 - T) / 2
    y0 = x0 + D
    sx = sy = n = 0
    for i in range(400):
        for j in range(400):
            x = (i + .5) / 4
            y = (j + .5) / 4
            inb = x0 <= x <= x0 + B and y0 <= y <= y0 + B and not (x >= x0 + B - P and y <= y0 + P)
            inp = x0 + B - P + D <= x <= x0 + B + D and y0 - D <= y <= y0 - D + P
            if inb or inp:
                sx += x; sy += y; n += 1
    return sx / n, sy / n


CX, CY = centroid()
OPT_DX = (50 - CX) * 0.45
OPT_DY = (50 - CY) * 0.45


def sym_inner(block, piece, cls=False):
    b, p = symbol_paths()
    bc = ' class="block"' if cls else ''
    pc = ' class="piece"' if cls else ''
    return f'<path{bc} d="{b}" fill="{block}"/><path{pc} d="{p}" fill="{piece}"/>'


def horiz_inner(block, piece, word, cls=False):
    b, p = symbol_paths(x0=0, y0=D)
    sx = (B + D) * K
    bc = ' class="block"' if cls else ''
    pc = ' class="piece"' if cls else ''
    wc = ' class="word"' if cls else ''
    inner = (f'<g transform="scale({f(K)})"><path{bc} d="{b}" fill="{block}"/><path{pc} d="{p}" fill="{piece}"/></g>'
             f'<g{wc} transform="translate({f(sx + GAP)} {f(D * K)})">{word_svg_body(word)}</g>')
    return inner, sx + GAP + WORD_W, 100 + D * K


def stacked_inner(block, piece, word):
    s = 136
    kk = s / (B + D)
    b, p = symbol_paths(x0=0, y0=D)
    gap = 44
    ox = (WORD_W - s) / 2 + OPT_DX * 1.6 * s / 100
    inner = (f'<g transform="translate({f(ox)} 0) scale({f(kk)})"><path d="{b}" fill="{block}"/><path d="{p}" fill="{piece}"/></g>'
             f'<g transform="translate(0 {f(s + gap)})">{word_svg_body(word)}</g>')
    return inner, WORD_W, s + gap + 100


def hinted(grid):
    if grid == 16:
        return symbol_paths(B=11, p=5, d=3, r=3, x0=1, y0=4, size=16)
    return symbol_paths(B=22, p=9, d=6, r=5, x0=2, y0=8, size=32)


def build_logos():
    for name, (bl, pc) in SCHEMES.items():
        word = bl
        write(f'logo/symbol/nachui-symbol-{name}.svg', svg(100, 100, sym_inner(bl, pc)))
        inner, w, h = horiz_inner(bl, pc, word)
        write(f'logo/horizontal/nachui-logo-{name}.svg', svg(w, h, inner))
        inner, w, h = stacked_inner(bl, pc, word)
        write(f'logo/stacked/nachui-logo-stacked-{name}.svg', svg(w, h, inner))
    inner, w, h = horiz_inner(PAPER, ACCENT_DARK, PAPER)
    pad = 64
    write('logo/horizontal/nachui-logo-on-ink.svg',
          svg(w + pad * 2, h + pad * 2, f'<rect width="{f(w + pad * 2)}" height="{f(h + pad * 2)}" fill="{INK}"/>'
              f'<g transform="translate({pad} {pad})">{inner}</g>'))
    for name, col in (('ink', INK), ('paper', PAPER), ('current', 'currentColor')):
        write(f'logo/wordmark/nachui-wordmark-{name}.svg', svg(WORD_W, 100, word_svg_body(col)))


def build_favicon():
    b, p = hinted(32)
    style = ('<style>.b{fill:%s}.p{fill:%s}@media (prefers-color-scheme:dark){.b{fill:%s}.p{fill:%s}}</style>'
             % (INK, ACCENT, PAPER, ACCENT_DARK))
    write('icons/favicon.svg', svg(32, 32, style + f'<path class="b" d="{b}"/><path class="p" d="{p}"/>'))


def tile(size, bg, block, piece, scale=0.58, radius=0.0, transparent=False):
    s = size * scale
    ox = (size - s) / 2 + OPT_DX * s / 100
    oy = (size - s) / 2 + OPT_DY * s / 100
    rr = size * radius
    bgsvg = '' if transparent else f'<rect width="{size}" height="{size}" rx="{f(rr)}" fill="{bg}"/>'
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 {size} {size}">{bgsvg}'
            f'<g transform="translate({f(ox)} {f(oy)}) scale({f(s/100)})">{sym_inner(block, piece)}</g></svg>')


def hinted_png_svg(grid, block, piece, px):
    b, p = hinted(grid)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{px}" height="{px}" viewBox="0 0 {grid} {grid}">'
            f'<path d="{b}" fill="{block}"/><path d="{p}" fill="{piece}"/></svg>')


def page(body, w, h, bg='transparent', fonts=False):
    link = ('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500&display=swap">'
            if fonts else '')
    return (f'<!doctype html><html><head><meta charset="utf-8">{link}<style>html,body{{margin:0;width:{w}px;height:{h}px;'
            f'background:{bg};overflow:hidden}}svg{{display:block}}</style></head><body>{body}</body></html>')


def jobs():
    J = []

    def add(rel, html, w, h, transparent=True):
        J.append({'html': html, 'out': os.path.join(OUT, rel), 'w': w, 'h': h, 'transparent': transparent})

    add('icons/favicon-16.png', page(hinted_png_svg(16, INK, ACCENT, 16), 16, 16), 16, 16)
    add('icons/favicon-32.png', page(hinted_png_svg(32, INK, ACCENT, 32), 32, 32), 32, 32)
    add('icons/favicon-48.png', page(hinted_png_svg(32, INK, ACCENT, 48), 48, 48), 48, 48)
    add('icons/apple-touch-icon.png', page(tile(180, INK, PAPER, ACCENT_DARK, 0.6), 180, 180), 180, 180, False)
    add('icons/icon-192.png', page(tile(192, INK, PAPER, ACCENT_DARK, 0.6, 0.225), 192, 192), 192, 192)
    add('icons/icon-512.png', page(tile(512, INK, PAPER, ACCENT_DARK, 0.6, 0.225), 512, 512), 512, 512)
    add('icons/icon-maskable-512.png', page(tile(512, INK, PAPER, ACCENT_DARK, 0.46), 512, 512), 512, 512, False)
    add('icons/avatar-400.png', page(tile(400, INK, PAPER, ACCENT_DARK, 0.56), 400, 400), 400, 400, False)

    for name in ('ink', 'paper', 'two-tone', 'two-tone-reversed'):
        bl, pc = SCHEMES[name]
        add(f'logo/png/nachui-symbol-{name}-1024.png', page(tile(1024, None, bl, pc, 1.0, 0, True), 1024, 1024), 1024, 1024)
        inner, w, h = horiz_inner(bl, pc, bl)
        H = 240
        W = round(w * H / h)
        add(f'logo/png/nachui-logo-{name}-{W}x{H}.png',
            page(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {f(w)} {f(h)}">{inner}</svg>', W, H), W, H)

    inner, w, h = horiz_inner(PAPER, ACCENT_DARK, PAPER)
    LH = 112
    LW = w * LH / h
    for rel, line in (('icons/og-image.png', 'A design system you own.'), ('icons/og-about.png', 'About'),
                      ('icons/og-bricks.png', 'Bricks')):
        og = (f'<div style="width:1200px;height:630px;background:{INK};position:relative;font-family:\'Hanken Grotesk\',sans-serif">'
              f'<svg style="position:absolute;left:{f((1200-LW)/2)}px;top:{f(250-LH/2)}px" width="{f(LW)}" height="{LH}" viewBox="0 0 {f(w)} {f(h)}">{inner}</svg>'
              f'<div style="position:absolute;left:0;right:0;top:372px;text-align:center;color:#bdbdbd;font-size:34px;letter-spacing:-0.01em">{line}</div>'
              f'<div style="position:absolute;left:0;right:0;bottom:48px;text-align:center;color:{ACCENT_DARK};font-size:22px">nachui.tech</div></div>')
        add(rel, page(og, 1200, 630, INK, True), 1200, 630, False)
    return J


def build_motion():
    d = D
    ease_out = 'cubic-bezier(.3,1.45,.55,1)'
    rm = '@media (prefers-reduced-motion:reduce){*{animation:none!important}}'
    intro_css = (f'.piece{{animation:lift .9s {ease_out} .45s both}}'
                 f'.block{{animation:in .5s cubic-bezier(.2,0,0,1) both;transform-box:fill-box;transform-origin:50% 50%}}'
                 f'@keyframes lift{{from{{transform:translate(-{d}px,{d}px)}}to{{transform:none}}}}'
                 f'@keyframes in{{from{{opacity:0;transform:scale(.92)}}to{{opacity:1;transform:none}}}}' + rm)
    body = sym_inner(INK, ACCENT, cls=True)
    write('motion/nachui-symbol-intro.svg', svg(100, 100, f'<style>{intro_css}</style>{body}', extra=' overflow="visible"'))

    loader_css = (f'.piece{{animation:hop 1.6s infinite}}'
                  f'@keyframes hop{{0%,12%{{transform:translate(-{d}px,{d}px);animation-timing-function:{ease_out}}}'
                  f'45%,62%{{transform:none;animation-timing-function:cubic-bezier(.6,0,.3,1)}}100%{{transform:translate(-{d}px,{d}px)}}}}' + rm)
    write('motion/nachui-loader.svg', svg(100, 100, f'<style>{loader_css}</style>{sym_inner(INK, ACCENT, cls=True)}',
                                          label='Loading', extra=' overflow="visible"'))
    write('motion/nachui-loader-reversed.svg', svg(100, 100, f'<style>{loader_css}</style>{sym_inner(PAPER, ACCENT_DARK, cls=True)}',
                                                   label='Loading', extra=' overflow="visible"'))

    inner, w, h = horiz_inner(INK, ACCENT, INK, cls=True)
    logo_css = (f'.block{{animation:in .5s cubic-bezier(.2,0,0,1) both;transform-box:fill-box;transform-origin:50% 50%}}'
                f'.piece{{animation:lift .9s {ease_out} .4s both}}'
                f'.word{{animation:wipe .8s cubic-bezier(.65,0,.35,1) .75s both}}'
                f'@keyframes in{{from{{opacity:0;transform:scale(.92)}}to{{opacity:1;transform:none}}}}'
                f'@keyframes lift{{from{{transform:translate(-{d}px,{d}px)}}to{{transform:none}}}}'
                f'@keyframes wipe{{from{{clip-path:inset(0 100% 0 0)}}to{{clip-path:inset(0 0 0 0)}}}}' + rm)
    write('motion/nachui-logo-intro.svg', svg(w, h, f'<style>{logo_css}</style>{inner}', extra=' overflow="visible"'))


if __name__ == '__main__':
    build_logos()
    build_favicon()
    build_motion()
    with open(os.path.join(OUT, 'jobs.json'), 'w') as fh:
        json.dump(jobs(), fh)
    print('centroid', round(CX, 2), round(CY, 2), 'opt', round(OPT_DX, 2), round(OPT_DY, 2), 'word', round(WORD_W, 2))
