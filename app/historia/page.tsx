import type { Metadata } from 'next';
import NextBand from '@/components/NextBand';
import { timeline } from '@/lib/data';
import { asset } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Nuestra historia',
  description:
    'TerraCoffe empezó en 2016 con una tostadora usada en un garaje de Villa Crespo. Conocé cómo llegamos a la barra de Honduras, en Palermo.',
  openGraph: { title: 'Nuestra historia | TerraCoffe', description: 'De un garaje en Villa Crespo a la barra de Honduras, en Palermo.' },
};

export default function Historia() {
  return (
    <>
      <section aria-labelledby="story-title" className="overflow-clip bg-terra pt-[calc(var(--spacing-section)+4.5rem)] pb-section text-[oklch(0.98_0.006_60)]">
        <div className="wrap grid items-start gap-12 split:grid-cols-[1.1fr_0.9fr] split:gap-[var(--spacing-section)]">
          <div>
            <div className="grid max-w-[38rem] gap-6">
              <h1 id="story-title" className="text-fluid-2xl">Empezó con una tostadora usada y un garaje.</h1>
              <p className="leading-[1.7] text-[oklch(0.97_0.01_60)]">
                En 2016, Lucía Ferrer y Martín Aguirre compraron una tostadora de seis kilos en un remate y la instalaron en un garaje de Villa Crespo. Ella venía de trabajar en una cafetería de Medellín. Él había pasado diez años en logística de exportación. Tostaban de madrugada y repartían las bolsas en bicicleta a seis bares del barrio.
              </p>
              <p className="leading-[1.7] text-[oklch(0.97_0.01_60)]">
                Los clientes empezaron a preguntar dónde podían tomar ese café ya preparado. En 2019 abrimos el local de Honduras, con la barra mirando a la ventana para que el que pasa vea cómo se hace.
              </p>
              <p className="leading-[1.7] text-[oklch(0.97_0.01_60)]">
                Hoy somos doce personas. Seguimos tostando en el garaje, en lotes chicos, y probamos cada lote a ciegas antes de ponerlo a la venta.
              </p>
            </div>

            <ol className="mt-12 grid list-none border-t border-[oklch(0.96_0.01_60/0.4)] p-0">
              {timeline.map((t) => (
                <li key={t.year} className="reveal grid grid-cols-[5.5rem_1fr] gap-4 border-b border-[oklch(0.96_0.01_60/0.4)] py-6">
                  <span className="font-display text-fluid-xl leading-none text-amber">{t.year}</span>
                  <div>
                    <h2 className="mb-1 text-fluid-lg">{t.title}</h2>
                    <p className="max-w-[34rem] text-[oklch(0.97_0.01_60)]">{t.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <figure className="reveal relative m-0 split:sticky split:top-24">
            <img
              src={asset('/assets/img/tostadora.jpg')}
              width={1800}
              height={2234}
              alt="Una tostadora de tambor de acero y una bandeja de enfriado con granos recién tostados, bajo luz cálida."
              className="aspect-[4/5] w-full rounded-lg object-cover"
            />
            <figcaption className="mt-2 text-fluid-sm text-[oklch(0.95_0.015_60)]">La tostadora de seis kilos, la misma de 2016.</figcaption>
          </figure>
        </div>
      </section>

      <NextBand
        title="Ahora seguí con el café."
        primary={{ label: 'Ver de dónde viene', href: '/origen/' }}
        secondary={{ label: 'Ver el menú', href: '/#menu' }}
      />
    </>
  );
}
