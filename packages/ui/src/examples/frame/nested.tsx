import { Badge } from '../../components/badge';
import { Frame } from '../../components/frame';

export function Nested() {
  return (
    <Frame className="max-w-md">
      <Frame.Header>
        <Frame.Title>Production</Frame.Title>
        <Frame.Description>Everything deployed from the main branch.</Frame.Description>
      </Frame.Header>
      <Frame.Panel>
        <Frame variant="ghost" spacing="sm" stacked dense>
          <Frame.Header className="px-1 py-1.5">
            <Frame.Title as="h4" className="text-xs font-normal tracking-wide uppercase">
              Web
            </Frame.Title>
          </Frame.Header>
          <Frame.Panel>
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="font-mono text-sm">nachui.tech</span>
              <Badge variant="success">Live</Badge>
            </div>
          </Frame.Panel>
          <Frame.Panel>
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="font-mono text-sm">docs preview</span>
              <Badge variant="warning">Building</Badge>
            </div>
          </Frame.Panel>
          <Frame.Header className="px-1 pt-3 pb-1.5">
            <Frame.Title as="h4" className="text-xs font-normal tracking-wide uppercase">
              API
            </Frame.Title>
          </Frame.Header>
          <Frame.Panel>
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="font-mono text-sm">api.nachui.tech</span>
              <Badge variant="success">Live</Badge>
            </div>
          </Frame.Panel>
        </Frame>
      </Frame.Panel>
    </Frame>
  );
}
