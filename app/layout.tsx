import type { Metadata, Viewport } from 'next';
import { Hanken_Grotesk, Young_Serif } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SITE_URL } from '@/lib/site';

const display = Young_Serif({ weight: '400', subsets: ['latin'], variable: '--font-young-serif', display: 'swap' });
const sans = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-hanken', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: {
    default: 'TerraCoffe | Café de especialidad en Palermo, Buenos Aires',
    template: '%s | TerraCoffe',
  },
  description:
    'Café de especialidad con tostadora propia en Palermo, CABA. Granos de Colombia, Etiopía y Brasil tostados cada semana. Mirá el menú y vení a probarlos.',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'TerraCoffe',
    images: [{ url: `${SITE_URL}/assets/img/hero.jpg`, width: 1800, height: 1005 }],
  },
};

export const viewport: Viewport = { themeColor: '#2a1c15', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${display.variable} ${sans.variable}`}>
      <body>
        <a
          href="#contenido"
          className="absolute left-4 -top-16 z-[100] rounded-lg bg-amber px-4 py-3 font-semibold text-roast focus:top-4"
        >
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
