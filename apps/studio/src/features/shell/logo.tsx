import Image from 'next/image';
import Link from 'next/link';

export function Logo({ label = 'Studio' }: { label?: string }) {
  return (
    <Link
      href="/"
      className="focus-visible:ring-ring flex items-center gap-2.5 rounded-sm focus-visible:ring-2 focus-visible:outline-none"
    >
      <Image src="/icon-192.png" alt="" width={26} height={26} className="rounded-[9px]" priority />
      <span className="text-sm font-semibold">{label}</span>
    </Link>
  );
}
