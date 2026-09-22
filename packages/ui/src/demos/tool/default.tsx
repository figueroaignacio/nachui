'use client';

import { Tool } from '../../ai/tool';

const input = { locale: 'en', limit: 3 };

const output = [
  { slug: 'nachui', title: 'NachUI', stars: 128 },
  { slug: 'portfolio', title: 'ignaciofigueroa.dev', stars: 41 },
  { slug: 'links', title: 'links.ignaciofigueroa.dev', stars: 9 },
];

export function Default() {
  return (
    <div className="w-full max-w-md">
      <Tool status="complete" defaultOpen>
        <Tool.Header name="get_projects" description="Lists the public projects" />
        <Tool.Content>
          <Tool.Input value={input} />
          <Tool.Output value={output} />
        </Tool.Content>
      </Tool>
    </div>
  );
}
