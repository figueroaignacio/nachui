import math
import os

B, P, D, R = 68, 28, 18, 16


def f(v):
    s = f'{v:.2f}'.rstrip('0').rstrip('.')
    return '0' if s in ('-0', '') else s


def symbol_paths(B=B, p=P, d=D, r=R, x0=None, y0=None, size=100):
    T = B + d
    if x0 is None:
        x0 = (size - T) / 2
    if y0 is None:
        y0 = x0 + d
    bx1, by1 = x0 + B, y0 + B
    nx0, ny1 = bx1 - p, y0 + p
    block = (f'M{f(nx0)} {f(y0)}H{f(x0+r)}A{f(r)} {f(r)} 0 0 0 {f(x0)} {f(y0+r)}V{f(by1-r)}'
             f'A{f(r)} {f(r)} 0 0 0 {f(x0+r)} {f(by1)}H{f(bx1-r)}A{f(r)} {f(r)} 0 0 0 {f(bx1)} {f(by1-r)}'
             f'V{f(ny1)}H{f(nx0)}Z')
    px0, py0 = nx0 + d, y0 - d
    px1, py1 = px0 + p, py0 + p
    piece = f'M{f(px0)} {f(py0)}H{f(px1-r)}A{f(r)} {f(r)} 0 0 1 {f(px1)} {f(py0+r)}V{f(py1)}H{f(px0)}Z'
    return block, piece


VS = 19
HS = 16.5
X = 72
TOP = 100 - X
RO = 16
RI = 6


def letter_N(x, W=76):
    d = VS * 1.08
    for _ in range(40):
        d = VS * 1.08 * math.hypot(W - d, 100) / 100
    y1 = 100 * (W - VS - d) / (W - d)
    y2 = 100 * VS / (W - d)
    pts = [(0, 100), (0, 0), (d, 0), (W - VS, y1), (W - VS, 0), (W, 0), (W, 100), (W - d, 100), (VS, y2), (VS, 100)]
    return 'M' + 'L'.join(f'{f(x+a)} {f(b)}' for a, b in pts) + 'Z', W


def letter_a(x, W=62):
    o = (f'M{f(x+W)} {f(TOP)}H{f(x+RO)}A{RO} {RO} 0 0 0 {f(x)} {f(TOP+RO)}V{f(100-RO)}'
         f'A{RO} {RO} 0 0 0 {f(x+RO)} 100H{f(x+W)}Z')
    i = (f'M{f(x+W-VS)} {f(TOP+HS)}H{f(x+VS+RI)}A{RI} {RI} 0 0 0 {f(x+VS)} {f(TOP+HS+RI)}V{f(100-HS-RI)}'
         f'A{RI} {RI} 0 0 0 {f(x+VS+RI)} {f(100-HS)}H{f(x+W-VS)}Z')
    return o + i, W


def letter_c(x, W=56):
    d = (f'M{f(x+W)} {f(TOP)}H{f(x+RO)}A{RO} {RO} 0 0 0 {f(x)} {f(TOP+RO)}V{f(100-RO)}'
         f'A{RO} {RO} 0 0 0 {f(x+RO)} 100H{f(x+W)}V{f(100-HS)}H{f(x+VS+RI)}'
         f'A{RI} {RI} 0 0 1 {f(x+VS)} {f(100-HS-RI)}V{f(TOP+HS+RI)}A{RI} {RI} 0 0 1 {f(x+VS+RI)} {f(TOP+HS)}'
         f'H{f(x+W)}Z')
    return d, W


def letter_h(x, W=62):
    d = (f'M{f(x)} 0H{f(x+VS)}V{f(TOP)}H{f(x+W-RO)}A{RO} {RO} 0 0 1 {f(x+W)} {f(TOP+RO)}V100H{f(x+W-VS)}'
         f'V{f(TOP+HS+RI)}A{RI} {RI} 0 0 0 {f(x+W-VS-RI)} {f(TOP+HS)}H{f(x+VS)}V100H{f(x)}Z')
    return d, W


def letter_U(x, W=68):
    d = (f'M{f(x)} 0H{f(x+VS)}V{f(100-HS-RI)}A{RI} {RI} 0 0 0 {f(x+VS+RI)} {f(100-HS)}H{f(x+W-VS-RI)}'
         f'A{RI} {RI} 0 0 0 {f(x+W-VS)} {f(100-HS-RI)}V0H{f(x+W)}V{f(100-RO)}A{RO} {RO} 0 0 1 {f(x+W-RO)} 100'
         f'H{f(x+RO)}A{RO} {RO} 0 0 1 {f(x)} {f(100-RO)}Z')
    return d, W


def letter_I(x):
    return f'M{f(x)} 0H{f(x+VS)}V100H{f(x)}Z', VS


KERN = {'Na': 9, 'ac': 8, 'ch': 10, 'hU': 13, 'UI': 13}


def wordmark():
    x = 0
    parts = []
    seq = [('N', letter_N), ('a', letter_a), ('c', letter_c), ('h', letter_h), ('U', letter_U), ('I', letter_I)]
    prev = None
    for ch, fn in seq:
        if prev:
            x += KERN[prev + ch]
        d, w = fn(x)
        parts.append(d)
        x += w
        prev = ch
    return parts, x


WORD, WORD_W = wordmark()


def word_svg_body(color='currentColor'):
    return ''.join(f'<path d="{d}" fill="{color}" fill-rule="evenodd"/>' for d in WORD)


def symbol_body(block='currentColor', piece=None):
    b, p = symbol_paths()
    return f'<path d="{b}" fill="{block}"/><path d="{p}" fill="{piece or block}"/>'
