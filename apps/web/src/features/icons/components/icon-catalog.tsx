import { Suspense } from 'react';

import { getIconCatalog } from '../lib/get-icon-catalog';
import { IconsBrowser } from './icons-browser';

/** The icon browser for the Icons docs page, with the catalog read at build time. */
export async function IconCatalog() {
  const icons = await getIconCatalog();

  return (
    <Suspense fallback={null}>
      <IconsBrowser icons={icons} />
    </Suspense>
  );
}
