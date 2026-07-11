import { MobileMenu } from './mobile-menu';
import { Navbar } from './navbar';

export function Header() {
  return (
    <header className="bg-background/95 sticky top-0 z-50 w-full backdrop-blur-sm">
      <Navbar />
      <MobileMenu />
    </header>
  );
}
