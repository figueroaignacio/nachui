'use client';

import { Context } from '../../ai/context';

export function Default() {
  return (
    <div className="flex w-full justify-center py-8">
      <Context maxTokens={200000} usedTokens={84320}>
        <Context.Trigger />
        <Context.Content align="center">
          <Context.Header />
          <Context.Body>
            <Context.Usage label="Input" tokens={61200} />
            <Context.Usage label="Output" tokens={14100} tone="info" />
            <Context.Usage label="Reasoning" tokens={6800} tone="warning" />
            <Context.Usage label="Cached" tokens={2220} tone="success" />
          </Context.Body>
          <Context.Footer>Costs are estimated from the model pricing you configure.</Context.Footer>
        </Context.Content>
      </Context>
    </div>
  );
}
