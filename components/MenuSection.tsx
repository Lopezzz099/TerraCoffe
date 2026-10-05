'use client';

import { useEffect, useState } from 'react';
import { menu, menuFilters } from '@/lib/data';
import { asset } from '@/lib/site';

type FilterId = (typeof menuFilters)[number]['id'];

export default function MenuSection() {
  const [filter, setFilter] = useState<FilterId>('all');

  // La categoría queda en la URL (?cat=frios) para poder compartir el menú filtrado
  useEffect(() => {
    const cat = new URLSearchParams(window.location.search).get('cat');
    if (cat && menuFilters.some((f) => f.id === cat)) setFilter(cat as FilterId);
  }, []);

  const choose = (id: FilterId) => {
    setFilter(id);
    const url = new URL(window.location.href);
    if (id === 'all') url.searchParams.delete('cat');
    else url.searchParams.set('cat', id);
    history.replaceState(null, '', url);
  };

  return (
    <section id="menu" aria-labelledby="menu-title" className="bg-paper py-section text-ink">
      <div className="wrap grid gap-12 split:grid-cols-[0.8fr_1.2fr] split:gap-[var(--spacing-section)]">
        <div className="reveal grid content-start split:sticky split:top-24 split:self-start">
          <img
            src={asset('/assets/img/latte.jpg')}
            width={1800}
            height={2234}
            loading="lazy"
            alt="Un flat white con rosetta de leche en una taza de cerámica terracota, sobre una mesa de mármol gris."
            className="aspect-[4/5] w-full rounded-lg object-cover"
          />
        </div>

        <div>
          <div className="mb-6 grid max-w-xl gap-4">
            <h2 id="menu-title" className="text-fluid-2xl">El menú</h2>
            <p className="text-fluid-lg leading-normal text-ink-muted">
              Café de la casa, pastelería hecha en el local y algo salado para el mediodía.
            </p>
          </div>

          <div role="group" aria-label="Filtrar el menú por categoría" className="mb-8 flex flex-wrap gap-2">
            {menuFilters.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => choose(f.id)}
                className="min-h-11 cursor-pointer touch-manipulation rounded-full border-[1.5px] border-ink bg-transparent px-[1.125rem] py-2 font-semibold text-ink transition-colors duration-200 hover:bg-paper-2 aria-pressed:border-roast aria-pressed:bg-roast aria-pressed:text-on-dark"
              >
                {f.label}
              </button>
            ))}
          </div>

          {menu.map((group) => (
            <div key={group.id} hidden={filter !== 'all' && filter !== group.id} className="mb-12">
              <h3 className="mb-2 border-b-2 border-ink pb-2 text-fluid-xl">{group.title}</h3>
              {group.photo && (
                <img
                  src={asset(group.photo.src)}
                  width={group.photo.width}
                  height={group.photo.height}
                  loading="lazy"
                  alt={group.photo.alt}
                  className="mb-2 aspect-[16/8] w-full rounded-lg object-cover"
                />
              )}
              <ul className="m-0 list-none p-0">
                {group.items.map((item) => (
                  <li key={item.name} className="border-b border-line-light py-4 last:border-0">
                    <div className="flex items-baseline gap-3">
                      <span className="text-fluid-lg leading-tight font-bold">
                        {item.name}
                        {item.tag && (
                          <span className="ml-2 inline-block rounded-full bg-terra px-2 py-0.5 align-[0.2em] text-xs font-bold tracking-wide text-white">
                            {item.tag}
                          </span>
                        )}
                      </span>
                      <span aria-hidden="true" className="min-w-4 flex-1 -translate-y-[0.3em] border-b-[1.5px] border-dotted border-ink/45" />
                      <span className="font-bold whitespace-nowrap tabular-nums">{item.price}</span>
                    </div>
                    <p className="mt-1 max-w-xl text-fluid-sm leading-snug text-ink-muted">{item.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <p className="mt-6 text-fluid-sm text-ink-muted">
            Precios en pesos argentinos. Leche de avena o almendras, $800 extra. Preguntá por el origen de la semana en barra.
          </p>
        </div>
      </div>
    </section>
  );
}
