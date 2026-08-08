import { MobileMenu } from './mobile-menu';
import { Navbar } from './navbar';

export function Header() {
  return (
    <header className="bg-background/95 sticky top-0 z-50 w-full border-b backdrop-blur-sm">
      {/* Same frame as the main content, so the rails run unbroken from the top
          of the page down through the footer instead of starting below the nav. */}
      <div className="page-frame-outer">
        <div className="page-frame">
          <Navbar />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
