import { MobileMenu } from './mobile-menu';
import { Navbar } from './navbar';

export function Header() {
  return (
    <header className="sticky top-3 z-50 w-full">
      {/* Same frame as the main content so the floating card tracks the rails. */}
      <div className="page-frame-outer">
        <div className="page-frame">
          <div className="border-rule bg-background/90 rounded-lg border px-4 shadow-sm backdrop-blur-md">
            <Navbar />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
