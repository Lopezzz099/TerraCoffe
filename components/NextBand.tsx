import Link from 'next/link';
import { btn } from '@/lib/site';

type Props = {
  title: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
};

/** Cierre de las páginas interiores. */
export default function NextBand({ title, primary, secondary }: Props) {
  return (
    <section aria-labelledby="next-title" className="bg-terra py-12 text-[oklch(0.98_0.006_60)]">
      <div className="wrap flex flex-wrap items-center justify-between gap-x-8 gap-y-6">
        <h2 id="next-title" className="text-fluid-2xl">{title}</h2>
        <div className="flex flex-wrap gap-4">
          <Link href={primary.href} className={btn.amber}>{primary.label}</Link>
          <Link href={secondary.href} className={`${btn.ghost} border-[oklch(0.98_0.006_60/0.7)] text-[oklch(0.98_0.006_60)]`}>
            {secondary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
