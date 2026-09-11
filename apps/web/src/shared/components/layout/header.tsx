import { MobileMenu } from './mobile-menu';
import { Navbar } from './navbar';
import { Silk } from '@/components/layout/silk';

export function Header() {
  return (
    <header className="bg-background border-border/40 sticky top-0 isolate z-50 w-full overflow-hidden border-b">
      <Silk className="header-silk" />
      <div className="page-frame-outer">
        <div className="page-frame">
          <Navbar />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
