import { MobileMenu } from './mobile-menu';
import { Navbar } from './navbar';
import { SilkWaves } from '@/components/layout/silk-waves';

export function Header() {
  return (
    <header className="bg-background/60 border-border/40 sticky top-0 isolate z-50 w-full overflow-hidden border-b backdrop-blur-md">
      <SilkWaves className="header-silk" />
      {/* Same frame as the main content, so the nav aligns to the same gutter as
          everything below it. */}
      <div className="page-frame-outer">
        <div className="page-frame">
          <Navbar />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
