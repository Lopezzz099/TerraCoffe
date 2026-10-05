import Link from 'next/link';
import { asset } from '@/lib/site';

const cards = [
  {
    href: '/historia/',
    src: '/assets/img/tostadora.jpg',
    width: 1800,
    height: 2234,
    title: 'Nuestra historia',
    sub: 'De un garaje en Villa Crespo a la barra de Honduras.',
  },
  {
    href: '/origen/',
    src: '/assets/img/granos.jpg',
    width: 1600,
    height: 1067,
    title: 'De dónde viene el café',
    sub: 'Recorré en el mapa las tres fincas que tenemos hoy en barra.',
  },
];

export default function Discover() {
  return (
    <section aria-label="Conocé más de TerraCoffe" className="grid bg-roast nav:grid-cols-2">
      {cards.map((c) => (
        <Link
          key={c.href}
          href={c.href}
          className="group relative isolate flex min-h-[clamp(18rem,40vw,26rem)] items-end overflow-clip px-[var(--gutter)] py-8 text-on-dark no-underline"
        >
          <img
            src={asset(c.src)}
            width={c.width}
            height={c.height}
            loading="lazy"
            alt=""
            className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.04]"
          />
          <span aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,oklch(0.14_0.014_50/0.85)_0%,oklch(0.14_0.014_50/0.2)_70%)]" />
          <span className="grid max-w-[26rem] gap-1">
            <span className="font-display text-fluid-xl leading-[1.1]">
              {c.title} <span aria-hidden="true" className="text-amber">&rarr;</span>
            </span>
            <span className="text-fluid-sm">{c.sub}</span>
          </span>
        </Link>
      ))}
    </section>
  );
}
