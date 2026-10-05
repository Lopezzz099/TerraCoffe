(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');

  // Header: transparente sobre el hero, sólido al scrollear
  const syncHeader = () => header.classList.toggle('is-solid', window.scrollY > 40);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  // Navegación móvil
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });

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

  // Link activo en la navegación según la sección visible
  const links = [...nav.querySelectorAll('a[href^="#"]:not(.btn)')];
  const sections = links.map((l) => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => {
          if (l.getAttribute('href') === `#${entry.target.id}`) l.setAttribute('aria-current', 'true');
          else l.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => io.observe(s));
  }
})();
