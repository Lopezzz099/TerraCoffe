// Mapa interactivo de orígenes (Leaflet + mapa base oscuro de CARTO / OpenStreetMap)
(() => {
  const el = document.getElementById('map');
  if (!el || typeof L === 'undefined') return; // sin Leaflet queda el texto de respaldo y la lista

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HOME = { name: 'TerraCoffe, Honduras 4850', lat: -34.5875, lng: -58.4297 };

  el.innerHTML = '';
  const map = L.map(el, { scrollWheelZoom: false, worldCopyJump: true, minZoom: 2, zoomSnap: 0.5 });

  // Mapa base de OpenStreetMap; el tono oscuro se aplica con un filtro CSS (.leaflet-tile-pane)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 14,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // El zoom con la rueda solo se activa después de hacer clic, para no atrapar el scroll de la página
  map.on('click focus', () => map.scrollWheelZoom.enable());
  map.on('mouseout blur', () => map.scrollWheelZoom.disable());

  const pin = (cls) => L.divIcon({ className: '', html: `<span class="pin ${cls}"></span>`, iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -14] });

  // Distancia por círculo máximo, en km
  const rad = (d) => (d * Math.PI) / 180;
  const km = (a, b) => {
    const dLat = rad(b.lat - a.lat);
    const dLng = rad(b.lng - a.lng);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * 6371 * Math.asin(Math.sqrt(h));
  };
  // Puntos intermedios de una ruta (círculo máximo) para que la línea siga la curvatura real
  const arc = (a, b, steps = 48) => {
    const [la1, lo1, la2, lo2] = [rad(a.lat), rad(a.lng), rad(b.lat), rad(b.lng)];
    const d = 2 * Math.asin(Math.sqrt(Math.sin((la2 - la1) / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin((lo2 - lo1) / 2) ** 2));
    if (d === 0) return [[a.lat, a.lng]];
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const f = i / steps;
      const A = Math.sin((1 - f) * d) / Math.sin(d);
      const B = Math.sin(f * d) / Math.sin(d);
      const x = A * Math.cos(la1) * Math.cos(lo1) + B * Math.cos(la2) * Math.cos(lo2);
      const y = A * Math.cos(la1) * Math.sin(lo1) + B * Math.cos(la2) * Math.sin(lo2);
      const z = A * Math.sin(la1) + B * Math.sin(la2);
      pts.push([Math.atan2(z, Math.sqrt(x * x + y * y)) * 180 / Math.PI, Math.atan2(y, x) * 180 / Math.PI]);
    }
    return pts;
  };

  const items = [...document.querySelectorAll('.origin-item')];
  const markers = {};
  const bounds = L.latLngBounds([[HOME.lat, HOME.lng]]);

  items.forEach((item) => {
    const o = { id: item.dataset.id, lat: Number(item.dataset.lat), lng: Number(item.dataset.lng), zoom: Number(item.dataset.zoom) };
    const title = item.querySelector('h2').textContent;
    const notes = item.querySelector('.notes').textContent;
    const dist = Math.round(km(o, HOME));
    const distText = `${dist.toLocaleString('es-AR')} km`;

    const target = document.querySelector(`.distance[data-for="${o.id}"]`);
    if (target) target.textContent = distText;

    const popup = document.createElement('div');
    popup.innerHTML = `<strong class="pop-title"></strong><span class="pop-notes"></span><span class="pop-dist"></span>`;
    popup.querySelector('.pop-title').textContent = title;
    popup.querySelector('.pop-notes').textContent = notes;
    popup.querySelector('.pop-dist').textContent = `A ${distText} de Palermo`;

    markers[o.id] = L.marker([o.lat, o.lng], { icon: pin('pin--origin'), title, alt: title, keyboard: true })
      .bindPopup(popup, { closeButton: true, autoPanPadding: [24, 24] })
      .addTo(map);
    markers[o.id].on('click', () => setActive(o.id, false));

    L.polyline(arc(o, HOME), { color: '#e8b923', weight: 2, opacity: 0.7, dashArray: '2 8', lineCap: 'round' }).addTo(map);
    bounds.extend([o.lat, o.lng]);
    item._origin = o;
  });

  L.marker([HOME.lat, HOME.lng], { icon: pin('pin--home'), title: HOME.name, alt: HOME.name, keyboard: true })
    .bindPopup(`<strong class="pop-title">${HOME.name}</strong><span class="pop-notes">Palermo, Buenos Aires</span>`)
    .addTo(map);

  const fitAll = () => map.fitBounds(bounds, { padding: [40, 40], animate: !reduceMotion });
  fitAll();

  const go = (latlng, zoom) => {
    if (reduceMotion) map.setView(latlng, zoom, { animate: false });
    else map.flyTo(latlng, zoom, { duration: 1.4 });
  };

  function setActive(id, move = true) {
    items.forEach((i) => {
      const on = i.dataset.id === id;
      i.classList.toggle('is-active', on);
      i.querySelector('.origin-go').setAttribute('aria-pressed', String(on));
    });
    if (!id) return;
    const o = items.find((i) => i.dataset.id === id)._origin;
    if (move) {
      go([o.lat, o.lng], o.zoom);
      map.once('moveend', () => markers[id].openPopup());
      if (reduceMotion) markers[id].openPopup();
      // En pantallas chicas el mapa queda arriba: lo traemos a la vista
      if (window.matchMedia('(max-width: 60rem)').matches) {
        el.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    }
  }

  items.forEach((item) => {
    item.querySelector('.origin-go').addEventListener('click', () => setActive(item.dataset.id));
  });

  document.getElementById('map-reset').addEventListener('click', () => {
    map.closePopup();
    setActive(null);
    fitAll();
  });

  // Si cambia el tamaño del contenedor (rotar el celular), se recalcula
  new ResizeObserver(() => map.invalidateSize()).observe(el);
})();
