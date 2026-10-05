'use client';

import { schedule, useOpenStatus } from '@/lib/hours';
import { asset } from '@/lib/site';

const perks = ['Wi-Fi', 'Enchufes en las mesas', 'Pet friendly', 'Bicicletero', 'Granos para llevar'];

const rows = [
  { label: 'Lunes a viernes', hours: '7:30 a 20:00', days: schedule.weekday.days },
  { label: 'Sábados y domingos', hours: '8:30 a 21:00', days: schedule.weekend.days },
];

export default function Place() {
  const status = useOpenStatus();

  return (
    <section id="local" aria-labelledby="place-title" className="bg-roast pb-section text-on-dark">
      <img
        src={asset('/assets/img/interior.jpg')}
        width={1800}
        height={1005}
        loading="lazy"
        alt="Interior del local: paredes terracota, mesas de roble con sillas de madera curvada, plantas colgantes y una lámpara de bronce junto a la ventana."
        className="aspect-[21/9] min-h-72 w-full object-cover"
      />
      <div className="wrap grid gap-12 pt-section nav:grid-cols-[1.2fr_0.8fr] nav:gap-[var(--spacing-section)]">
        <div className="grid max-w-xl content-start gap-6">
          <h2 id="place-title" className="text-fluid-2xl">Mesas con sol de mañana.</h2>
          <p className="text-fluid-lg leading-normal text-on-dark-muted">
            Ocho mesas, una barra y una ventana grande sobre Honduras. Se puede venir a trabajar con la notebook o a quedarse con un libro. Hay enchufes en todas las mesas y la red se llama TerraCoffe.
          </p>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {perks.map((p) => (
              <li key={p} className="rounded-full border border-line-dark px-4 py-1.5 text-fluid-sm">{p}</li>
            ))}
          </ul>
        </div>

        <div className="grid content-start gap-2">
          <h3 className="mb-2 text-fluid-xl">Horarios</h3>
          <dl className="m-0 grid">
            {rows.map((r) => {
              const today = status ? (r.days as readonly number[]).includes(status.dayIndex) : false;
              return (
                <div key={r.label} className="flex justify-between gap-4 border-b border-line-dark py-3.5">
                  <dt className={today ? 'text-amber' : 'text-on-dark-muted'}>{r.label}</dt>
                  <dd className={`m-0 font-semibold tabular-nums ${today ? 'text-amber' : ''}`}>{r.hours}</dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
