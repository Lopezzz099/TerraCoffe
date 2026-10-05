'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ADDRESS, asset, btn } from '@/lib/site';
import { useOpenStatus } from '@/lib/hours';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const status = useOpenStatus();

  // Video de fondo en todos los tamaños, salvo ahorro de datos o reducción de movimiento.
  // Si el navegador bloquea el autoplay queda la foto fija.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const allowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches && !conn?.saveData;
    if (!allowed) {
      video.pause();
      return;
    }
    // iOS exige muted como propiedad (React no la refleja como atributo en el HTML del servidor)
    video.muted = true;
    const start = () => video.play().catch(() => {});
    const onPlaying = () => setPlaying(true);
    video.addEventListener('playing', onPlaying);
    if (!video.paused) setPlaying(true);
    start();
    const onTouch = () => video.paused && start();
    const onVisible = () => !document.hidden && video.paused && start();
    document.addEventListener('touchstart', onTouch, { once: true, passive: true });
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      video.removeEventListener('playing', onPlaying);
      document.removeEventListener('touchstart', onTouch);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-svh flex-col justify-end overflow-clip bg-roast text-on-dark"
    >
      <div className="absolute inset-0 -z-20">
        <img
          src={asset('/assets/img/hero.jpg')}
          width={1800}
          height={1005}
          alt="Las manos de un barista sirven un espresso desde el portafiltro en una taza de cerámica, sobre una barra de nogal junto a la ventana."
          fetchPriority="high"
          className="size-full animate-settle object-cover object-[62%_center]"
        />
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={asset('/assets/img/hero.jpg')}
          aria-hidden="true"
          tabIndex={-1}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-[900ms] ease-out-expo ${playing ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src={asset('/assets/video/hero.mp4')} type="video/mp4" />
        </video>
      </div>
      {/* Capas oscuras para que el texto se lea sobre el video */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,oklch(0.14_0.014_50/0.9)_0%,oklch(0.14_0.014_50/0.7)_50%,oklch(0.14_0.014_50/0)_85%),linear-gradient(0deg,oklch(0.14_0.014_50/0.7)_0%,oklch(0.14_0.014_50/0)_40%)]"
      />

      <div className="wrap-wide grid justify-items-start gap-6 pt-32 pb-12 [&>*]:animate-rise [&>:nth-child(2)]:[animation-delay:120ms] [&>:nth-child(3)]:[animation-delay:240ms]">
        <h1 id="hero-title" className="max-w-[18ch] text-fluid-3xl">
          Café de tostadora propia, <em className="not-italic text-amber">servido en Palermo.</em>
        </h1>
        <p className="max-w-xl text-fluid-lg leading-normal">
          Tostamos cada semana en Villa Crespo. El grano que llega a tu taza tiene menos de diez días.
        </p>
        <div className="mt-2 flex flex-wrap gap-4">
          <Link href="/#menu" className={btn.amber}>Ver el menú</Link>
          <Link href="/#visitanos" className={btn.ghost}>Cómo llegar</Link>
        </div>
      </div>

      <div className="border-t border-on-dark/25 bg-[oklch(0.14_0.014_50/0.55)] backdrop-blur-sm">
        <div className="wrap-wide flex flex-wrap justify-between gap-x-8 gap-y-2 py-4 text-fluid-sm">
          <span className="inline-flex items-center gap-2 font-semibold">
            <span
              aria-hidden="true"
              className={`size-2.5 rounded-full ${
                status === null ? 'bg-on-dark-muted' : status.isOpen ? 'bg-[oklch(0.8_0.17_145)]' : 'bg-[oklch(0.7_0.16_30)]'
              }`}
            />
            {status ? status.text : 'Lun a vie 7:30 a 20:00'}
          </span>
          <span>{ADDRESS.street}, {ADDRESS.area}</span>
        </div>
      </div>
    </section>
  );
}
