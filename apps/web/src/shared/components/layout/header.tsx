import { MobileMenu } from './mobile-menu';
import { Navbar } from './navbar';

export function Header() {
  return (
    <header
      style={{ viewTransitionName: 'site-header' }}
      className="bg-background/95 sticky top-0 z-50 w-full border-b backdrop-blur-sm"
    >
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
