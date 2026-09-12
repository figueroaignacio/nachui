import { MobileMenu } from './mobile-menu';
import { Navbar } from './navbar';

export function Header() {
  return (
    <header className="site-header border-border/40 sticky top-0 z-50 w-full border-b">
      <div className="page-frame-outer">
        <div className="page-frame">
          <Navbar />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
