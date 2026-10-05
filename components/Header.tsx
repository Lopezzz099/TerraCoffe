'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { btn } from '@/lib/site';

type NavLink = { label: string; href: string; section?: string };

const links: NavLink[] = [
  { label: 'Menú', href: '/#menu', section: 'menu' },
  { label: 'El local', href: '/#local', section: 'local' },
  { label: 'Historia', href: '/historia/' },
  { label: 'Origen', href: '/origen/' },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [section, setSection] = useState<string | null>(null);

  const close = useCallback(() => setOpen(false), []);

  // Transparente sobre el hero del inicio; sólido al scrollear y siempre sólido en las páginas interiores
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Inicio: marca la sección que se está viendo. "Cómo llegar" es un botón, pero cuenta para apagar el resaltado.
  useEffect(() => {
    if (!isHome) {
      setSection(null);
      return;
    }
    const ids = ['menu', 'local', 'visitanos'];
    const update = () => {
      const line = window.innerHeight * 0.4;
      let current: string | null = null;
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      });
      setSection(current);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [isHome, pathname]);

  // Panel móvil: bloquea el scroll, cierra con Escape y al agrandar la ventana o cambiar de página
  useEffect(() => {
    document.documentElement.classList.toggle('nav-locked', open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 52.01rem)');
    const onChange = (e: MediaQueryListEvent) => e.matches && close();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [close]);

  useEffect(close, [pathname, close]);

  const solid = !isHome || scrolled || open;

  const isCurrent = (l: NavLink) => (l.section ? isHome && section === l.section : pathname.startsWith(l.href));

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 text-on-dark transition-[background-color,box-shadow] duration-300 ease-out-expo ${
          solid ? 'bg-roast shadow-[0_1px_0_var(--color-line-dark)]' : ''
        }`}
      >
        <div className="wrap-wide flex min-h-[4.5rem] items-center justify-between gap-6">
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 font-display text-2xl tracking-tight" aria-label="TerraCoffe, inicio">
            <svg viewBox="0 0 32 32" aria-hidden="true" className="size-6 text-amber" fill="currentColor">
              <ellipse cx="16" cy="16" rx="8" ry="10.5" transform="rotate(35 16 16)" />
              <path d="M11 24c3-4 7-9 10-16" stroke="#2a1c15" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            </svg>
            TerraCoffe
          </Link>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="nav"
            aria-label={open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            onClick={() => setOpen((v) => !v)}
            className="ml-auto inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center p-2 nav:hidden"
          >
            <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>

          {/* En celular el <nav> sale del flujo: la lista es un panel fijo que entra desde la derecha */}
          <nav aria-label="Principal" className="absolute nav:static">
            <ul
              id="nav"
              className={`fixed top-[4.5rem] right-0 bottom-0 z-50 m-0 flex w-[min(20rem,86vw)] list-none flex-col overflow-y-auto overscroll-contain border-l border-line-dark bg-roast px-6 pt-4 pb-8 transition-[transform,visibility] duration-300 ease-out-expo nav:static nav:w-auto nav:translate-x-0 nav:flex-row nav:items-center nav:gap-6 nav:overflow-visible nav:border-0 nav:bg-transparent nav:p-0 nav:visible ${
                open ? 'visible translate-x-0' : 'invisible translate-x-full'
              }`}
            >
              {links.map((l) => (
                <li key={l.href} className="border-b border-line-dark nav:border-0">
                  <Link
                    href={l.href}
                    aria-current={isCurrent(l) ? 'page' : undefined}
                    className={`group relative block py-4 text-fluid-lg font-medium no-underline nav:px-1 nav:py-3 nav:text-fluid-base ${
                      isCurrent(l) ? 'text-amber nav:text-on-dark' : ''
                    }`}
                  >
                    {l.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-1 bottom-[0.45rem] hidden h-0.5 origin-left bg-amber transition-transform duration-300 ease-out-expo nav:block ${
                        isCurrent(l) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </Link>
                </li>
              ))}
              <li className="pt-6 nav:p-0">
                <Link href="/#visitanos" className={`${btn.amber} nav:min-h-11 nav:px-5 nav:py-2`}>
                  Cómo llegar
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Fondo oscuro detrás del panel; cierra el menú al tocarlo */}
      <div
        aria-hidden="true"
        onClick={close}
        className={`fixed inset-0 z-[35] bg-roast/60 transition-[opacity,visibility] duration-300 ease-out-expo nav:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      />
    </>
  );
}
