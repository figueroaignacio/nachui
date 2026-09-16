import { Link } from '@/i18n/navigation';
import { Logo } from '../common/logo';
import { MobileMenu } from './mobile-menu';

export function SiteBrand() {
  return (
    <div className="page-frame-outer lg:hidden">
      <div className="page-frame flex h-14 items-center justify-between">
        <MobileMenu />
        <Link
          href="/"
          className="group/brand focus-visible:ring-ring rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          aria-label="NachUI home"
        >
          <Logo
            withText
            priority
            imageClassName="transition-transform duration-300 ease-out group-hover/brand:scale-110 group-hover/brand:-rotate-12 group-hover/brand:shadow-md motion-reduce:transform-none"
          />
        </Link>
      </div>
    </div>
  );
}
