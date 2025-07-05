import Link from 'next/link';

import { cn } from '@kit/ui/utils';

function LogoImage({
  className,
  width = 105,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <span
      className={cn(
        'font-bold text-primary dark:text-white text-lg lg:text-xl',
        className,
      )}
    >
      MarketReady.ai
    </span>
  );
}

export function AppLogo({
  href,
  label,
  className,
}: {
  href?: string | null;
  className?: string;
  label?: string;
}) {
  if (href === null) {
    return <LogoImage className={className} />;
  }

  return (
    <Link aria-label={label ?? 'Home Page'} href={href ?? '/'} prefetch={true}>
      <LogoImage className={className} />
    </Link>
  );
}
