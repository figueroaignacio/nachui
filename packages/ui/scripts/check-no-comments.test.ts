import { describe, expect, it } from 'vitest';
import { findComments } from './check-no-comments.mjs';

const lines = (source: string) => findComments(source).map((comment) => comment.line);

describe('findComments', () => {
  it('ignores // and /* inside strings, templates, regexes and JSX text', () => {
    const source = [
      "const url = 'https://example.com/a//b';",
      'const glob = "src/**/*.tsx";',
      'const template = `http://${host}/path /* not a comment */`;',
      'const pattern = /\\/\\/ not a comment/;',
      'const node = <p>Visit https://nachui.dev // today /* or tomorrow */</p>;',
      '<a href="//cdn.example.com/x.js" title="/* nope */" />;',
    ].join('\n');

    expect(findComments(source)).toEqual([]);
  });

  it('finds line, block, JSDoc, trailing and JSX comments', () => {
    const source = [
      '// leading line comment',
      'const a = 1; // trailing',
      '/** JSDoc */',
      'function f(/* inline */ b: number) {',
      '  return (',
      '    <div>',
      '      {/* JSX comment */}',
      '      <span>{b}</span>',
      '    </div>',
      '  );',
      '}',
      '/* at the end of the file */',
    ].join('\n');

    expect(lines(source)).toEqual([1, 2, 3, 4, 7, 12]);
  });

  it('reports eslint-disable directives, which are comments too', () => {
    const source = ['useEffect(() => {', '  // eslint-disable-next-line', '  setX(1);', '});'].join(
      '\n',
    );

    expect(findComments(source)).toEqual([{ line: 2, text: '// eslint-disable-next-line' }]);
  });
});
