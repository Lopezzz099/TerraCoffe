import Link from 'next/link';
import { ADDRESS, asset, btn } from '@/lib/site';

export default function Visit() {
  return (
    <section id="visitanos" aria-labelledby="visit-title" className="bg-amber py-section text-roast">
      <div className="wrap grid items-center gap-8 nav:grid-cols-[1.1fr_0.9fr] nav:gap-[var(--spacing-section)]">
        <figure className="reveal m-0">
          <img
            src={asset('/assets/img/fachada.jpg')}
            width={1600}
            height={1200}
            loading="lazy"
            alt="Puerta doble de madera sobre una pared terracota, con mesas y sillas naranjas en la vereda."
            className="aspect-[4/3] w-full rounded-lg object-cover"
          />
        </figure>
        <div className="grid justify-items-start gap-6">
          <h2 id="visit-title" className="text-fluid-3xl">Pasá por Honduras.</h2>
          <address className="text-fluid-lg leading-normal not-italic">
            {ADDRESS.street}, Palermo<br />
            Ciudad Autónoma de Buenos Aires<br />
            A dos cuadras de la plaza Armenia y de la estación Plaza Italia del subte D.
          </address>
          <div className="flex flex-wrap gap-4">
            <a href={ADDRESS.mapsUrl} target="_blank" rel="noopener noreferrer" className={btn.dark}>
              Abrir en Google Maps
            </a>
            <Link href="/#menu" className={btn.ghostDark}>Ver el menú</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
