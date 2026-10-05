(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');

  // Header: transparente sobre el hero, sólido al scrollear
  const syncHeader = () => header.classList.toggle('is-solid', window.scrollY > 40);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  // Navegación móvil
  const scrim = document.createElement('div');
  scrim.className = 'nav-scrim';
  header.after(scrim);
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    nav.classList.toggle('is-open', open);
    scrim.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    document.documentElement.classList.toggle('nav-locked', open);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  scrim.addEventListener('click', () => setMenu(false));
  // Si se agranda la ventana con el panel abierto, se cierra
  window.matchMedia('(min-width: 52.01rem)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });

  // Video del hero: en todos los tamaños, salvo ahorro de datos o reducción de movimiento.
  // En cualquier otro caso (o si el navegador bloquea el autoplay) queda la foto fija.
  const video = document.querySelector('.hero-video');
  if (video) {
    const conn = navigator.connection;
    const allowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      && !(conn && conn.saveData);
    if (allowed) {
      // iOS exige muted como propiedad (no solo como atributo) para permitir autoplay
      video.muted = true;
      const show = () => video.classList.add('is-playing');
      if (!video.paused) show();
      else video.addEventListener('playing', show, { once: true });
      const start = () => video.play().catch(() => {});
      start();
      // Si el sistema pausó el video (ahorro de batería), reintenta con el primer toque
      document.addEventListener('touchstart', () => { if (video.paused) start(); }, { once: true, passive: true });
      // Los navegadores pausan el video con la pestaña oculta; se retoma al volver
      document.addEventListener('visibilitychange', () => { if (!document.hidden && video.paused) start(); });
    } else {
      video.removeAttribute('autoplay');
      video.pause();
    }
  }

  // Filtro del menú
  const chips = document.querySelectorAll('.chip');
  const groups = document.querySelectorAll('.menu-group');
  const applyFilter = (filter) => {
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.filter === filter)));
    groups.forEach((g) => { g.hidden = filter !== 'all' && g.dataset.group !== filter; });
  };
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter;
      applyFilter(filter);
      // La categoría queda en la URL para poder compartir el menú filtrado
      const url = new URL(window.location.href);
      if (filter === 'all') url.searchParams.delete('cat');
      else url.searchParams.set('cat', filter);
      history.replaceState(null, '', url);
    });
  });
  const initial = new URLSearchParams(window.location.search).get('cat');
  if (initial && [...chips].some((c) => c.dataset.filter === initial)) applyFilter(initial);

  // Horarios en hora de Buenos Aires
  const schedule = {
    weekday: { open: [7, 30], close: [20, 0], label: '7:30' },
    weekend: { open: [8, 30], close: [21, 0], label: '8:30' },
  };
  const status = document.getElementById('status');
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Argentina/Buenos_Aires',
    weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (type) => parts.find((p) => p.type === type).value;
  const dayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  const minutes = Number(get('hour')) * 60 + Number(get('minute'));
  const isWeekend = dayIndex === 0 || dayIndex === 6;
  const today = isWeekend ? schedule.weekend : schedule.weekday;
  const openAt = today.open[0] * 60 + today.open[1];
  const closeAt = today.close[0] * 60 + today.close[1];
  const isOpen = minutes >= openAt && minutes < closeAt;

  document.querySelectorAll('#hours .row').forEach((row) => {
    if (row.dataset.days.split(',').map(Number).includes(dayIndex)) row.classList.add('is-today');
  });

  if (status) {
    status.dataset.open = String(isOpen);
    if (isOpen) {
      status.textContent = `Abierto ahora, hasta las ${today.close[0]}:00`;
    } else {
      const nextIsWeekend = minutes >= closeAt ? (dayIndex === 5 || dayIndex === 6) : isWeekend;
      const next = nextIsWeekend ? schedule.weekend : schedule.weekday;
      status.textContent = `Cerrado ahora, abrimos ${minutes >= closeAt ? 'mañana' : 'hoy'} a las ${next.label}`;
    }
  }

  // Inicio: marca en el menú la sección que se está viendo.
  // Se incluyen también las secciones sin enlace propio ("Cómo llegar" es un botón) para apagar el resaltado.
  const anchors = [...nav.querySelectorAll('a[href^="#"]')];
  const spy = anchors
    .map((a) => ({ link: a.classList.contains('btn') ? null : a, section: document.querySelector(a.getAttribute('href')) }))
    .filter((s) => s.section);
  if (spy.length) {
    const update = () => {
      // Sección activa: la última cuyo borde superior ya pasó el 40% de la altura de la ventana
      const line = window.innerHeight * 0.4;
      let current = null;
      spy.forEach((s) => { if (s.section.getBoundingClientRect().top <= line) current = s; });
      spy.forEach((s) => {
        if (!s.link) return;
        if (s === current) s.link.setAttribute('aria-current', 'true');
        else s.link.removeAttribute('aria-current');
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }
})();
