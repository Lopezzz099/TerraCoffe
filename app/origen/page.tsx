import type { Metadata } from 'next';
import NextBand from '@/components/NextBand';
import OriginMap from '@/components/OriginMap';
import { asset } from '@/lib/site';

export const metadata: Metadata = {
  title: 'De dónde viene el café',
  description:
    'Mapa interactivo de las tres fincas de las que sale el café de TerraCoffe: Huila en Colombia, Guji en Etiopía y Mogiana en Brasil.',
  openGraph: { title: 'De dónde viene el café | TerraCoffe', description: 'Recorré en el mapa las tres fincas que tenemos hoy en barra.' },
};

export default function Origen() {
  return (
    <>
      <section aria-labelledby="origin-title" className="relative isolate flex min-h-[52svh] items-end overflow-clip bg-roast text-on-dark">
        <img
          src={asset('/assets/img/granos.jpg')}
          width={1600}
          height={1067}
          alt="Granos de café recién tostados derramándose de una bolsa de arpillera."
          fetchPriority="high"
          className="absolute inset-0 -z-20 size-full object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,oklch(0.14_0.014_50/0.88)_0%,oklch(0.14_0.014_50/0.45)_55%,oklch(0.14_0.014_50/0.3)_100%)]" />
        <div className="wrap-wide grid justify-items-start gap-4 pt-[calc(4.5rem+3rem)] pb-12">
          <h1 id="origin-title" className="max-w-[18ch] text-fluid-3xl">Tres fincas, tres tazas distintas.</h1>
          <p className="max-w-[38rem] text-fluid-lg leading-normal">
            Cambiamos de lote según la cosecha. Estas son las tres que hoy están en la barra. Tocá una para ver dónde queda.
          </p>
        </div>
      </section>

      <section aria-label="Mapa de orígenes" className="bg-roast pt-12 pb-section text-on-dark">
        <OriginMap />
      </section>

      <NextBand
        title="Probalos en la barra."
        primary={{ label: 'Ver el menú', href: '/#menu' }}
        secondary={{ label: 'Leer nuestra historia', href: '/historia/' }}
      />
    </>
  );
}
