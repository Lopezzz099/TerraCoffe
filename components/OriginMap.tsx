'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap, Marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { HOME, origins } from '@/lib/data';
import { btn } from '@/lib/site';

const rad = (d: number) => (d * Math.PI) / 180;

type Pt = { lat: number; lng: number };

/** Distancia por círculo máximo, en km. */
const km = (a: Pt, b: Pt) => {
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};

/** Puntos intermedios de una ruta (círculo máximo) para que la línea siga la curvatura real. */
const arc = (a: Pt, b: Pt, steps = 48): [number, number][] => {
  const [la1, lo1, la2, lo2] = [rad(a.lat), rad(a.lng), rad(b.lat), rad(b.lng)];
  const d = 2 * Math.asin(Math.sqrt(Math.sin((la2 - la1) / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin((lo2 - lo1) / 2) ** 2));
  if (d === 0) return [[a.lat, a.lng]];
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(la1) * Math.cos(lo1) + B * Math.cos(la2) * Math.cos(lo2);
    const y = A * Math.cos(la1) * Math.sin(lo1) + B * Math.cos(la2) * Math.sin(lo2);
    const z = A * Math.sin(la1) + B * Math.sin(la2);
    pts.push([(Math.atan2(z, Math.sqrt(x * x + y * y)) * 180) / Math.PI, (Math.atan2(y, x) * 180) / Math.PI]);
  }
  return pts;
};

const distances = Object.fromEntries(origins.map((o) => [o.id, Math.round(km(o, HOME))]));
const fmtKm = (n: number) => `${n.toLocaleString('es-AR')} km`;

export default function OriginMap() {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});
  const fitAllRef = useRef<() => void>(() => {});
  const reduceMotion = useRef(false);
  const [active, setActive] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let observer: ResizeObserver | undefined;

    (async () => {
      const L = (await import('leaflet')).default;
      const el = elRef.current;
      if (cancelled || !el) return;

      reduceMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const map = L.map(el, { scrollWheelZoom: false, worldCopyJump: true, minZoom: 2, zoomSnap: 0.5 });
      mapRef.current = map;

      // Mapa base de OpenStreetMap; el tono oscuro se aplica con un filtro CSS (.leaflet-tile-pane)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 14,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // El zoom con la rueda solo se activa después de hacer clic, para no atrapar el scroll de la página
      map.on('click focus', () => map.scrollWheelZoom.enable());
      map.on('mouseout blur', () => map.scrollWheelZoom.disable());

      const pin = (cls: string) =>
        L.divIcon({ className: '', html: `<span class="pin ${cls}"></span>`, iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -14] });

      const bounds = L.latLngBounds([[HOME.lat, HOME.lng]]);

      origins.forEach((o) => {
        const popup = document.createElement('div');
        const title = document.createElement('strong');
        title.className = 'pop-title';
        title.textContent = o.name;
        const notes = document.createElement('span');
        notes.className = 'pop-notes';
        notes.textContent = o.notes;
        const dist = document.createElement('span');
        dist.className = 'pop-dist';
        dist.textContent = `A ${fmtKm(distances[o.id])} de Palermo`;
        popup.append(title, notes, dist);

        const marker = L.marker([o.lat, o.lng], { icon: pin('pin--origin'), title: o.name, alt: o.name, keyboard: true })
          .bindPopup(popup, { autoPanPadding: [24, 24] })
          .addTo(map);
        marker.on('click', () => setActive(o.id));
        markersRef.current[o.id] = marker;

        L.polyline(arc(o, HOME), { color: '#e8b923', weight: 2, opacity: 0.7, dashArray: '2 8', lineCap: 'round' }).addTo(map);
        bounds.extend([o.lat, o.lng]);
      });

      const home = document.createElement('div');
      const homeTitle = document.createElement('strong');
      homeTitle.className = 'pop-title';
      homeTitle.textContent = HOME.name;
      const homeSub = document.createElement('span');
      homeSub.className = 'pop-notes';
      homeSub.textContent = 'Palermo, Buenos Aires';
      home.append(homeTitle, homeSub);
      L.marker([HOME.lat, HOME.lng], { icon: pin('pin--home'), title: HOME.name, alt: HOME.name, keyboard: true })
        .bindPopup(home)
        .addTo(map);

      fitAllRef.current = () => map.fitBounds(bounds, { padding: [40, 40], animate: !reduceMotion.current });
      fitAllRef.current();
      setReady(true);

      // Si cambia el tamaño del contenedor (rotar el celular), se recalcula
      observer = new ResizeObserver(() => map.invalidateSize());
      observer.observe(el);
    })();

    return () => {
      cancelled = true;
      observer?.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, []);

  const show = useCallback((id: string) => {
    const map = mapRef.current;
    const marker = markersRef.current[id];
    const o = origins.find((x) => x.id === id);
    if (!map || !marker || !o) return;
    setActive(id);
    if (reduceMotion.current) {
      map.setView([o.lat, o.lng], o.zoom, { animate: false });
      marker.openPopup();
    } else {
      map.flyTo([o.lat, o.lng], o.zoom, { duration: 1.4 });
      map.once('moveend', () => marker.openPopup());
    }
    // En pantallas chicas el mapa queda arriba: lo traemos a la vista
    if (window.matchMedia('(max-width: 60rem)').matches) {
      elRef.current?.scrollIntoView({ block: 'center', behavior: reduceMotion.current ? 'auto' : 'smooth' });
    }
  }, []);

  const reset = () => {
    mapRef.current?.closePopup();
    setActive(null);
    fitAllRef.current();
  };

  return (
    <div className="wrap grid gap-8 split:grid-cols-[1.5fr_1fr] split:items-start split:gap-12">
      <div className="grid justify-items-start gap-4 split:sticky split:top-24">
        <div
          ref={elRef}
          role="region"
          aria-label="Mapa interactivo con las tres fincas y el local de Buenos Aires"
          className="z-0 h-[clamp(22rem,62svh,40rem)] w-full overflow-hidden rounded-lg bg-roast-2 split:h-[clamp(28rem,72svh,44rem)]"
        >
          {!ready && <p className="p-6 text-on-dark-muted">Cargando el mapa. Las ubicaciones están en la lista.</p>}
        </div>
        <button type="button" onClick={reset} className={btn.ghost}>Ver todo el recorrido</button>
      </div>

      <ul className="m-0 grid list-none content-start gap-4 p-0">
        {origins.map((o) => {
          const on = active === o.id;
          return (
            <li
              key={o.id}
              className={`grid justify-items-start gap-2 rounded-lg border p-6 transition-[background-color,border-color] duration-300 ease-out-expo ${
                on ? 'border-amber bg-roast-2' : 'border-line-dark'
              }`}
            >
              <h2 className="text-fluid-xl">{o.name}</h2>
              <p className="font-semibold text-amber">{o.notes}</p>
              <dl className="my-2 grid w-full grid-cols-2 gap-x-6 gap-y-2">
                {[
                  ['Altura', o.altitude],
                  ['Proceso', o.process],
                  ['Tueste', o.roast],
                  ['Hasta Palermo', fmtKm(distances[o.id])],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-fluid-sm text-on-dark-muted">{k}</dt>
                    <dd className="m-0 font-semibold tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="max-w-lg text-on-dark-muted">{o.about}</p>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => show(o.id)}
                className={`${btn.ghost} mt-2 !min-h-11 !px-5 !py-2`}
              >
                Ver en el mapa
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
