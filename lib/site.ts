// Ruta base para publicar en GitHub Pages (en local queda vacía)
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Prefija con la ruta base los archivos de /public (imágenes, video). */
export const asset = (path: string) => `${BASE_PATH}${path}`;

export const SITE_URL = 'https://lopezzz099.github.io/TerraCoffe';

export const ADDRESS = {
  street: 'Honduras 4850',
  area: 'Palermo, CABA',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Honduras+4850+Palermo+Buenos+Aires',
};

// Clases de botones compartidas
// Cada variante define su propio fondo y borde: así no hay clases base que se pisen entre sí.
const base =
  'inline-flex min-h-12 items-center justify-center rounded-full border-2 px-6 py-3 font-semibold leading-tight no-underline cursor-pointer touch-manipulation transition-[background-color,color,border-color,transform] duration-200 ease-out-expo active:scale-[0.98]';

export const btn = {
  amber: `${base} border-amber bg-amber text-roast hover:border-[oklch(0.88_0.14_90)] hover:bg-[oklch(0.88_0.14_90)]`,
  ghost: `${base} border-on-dark/55 text-on-dark hover:border-on-dark hover:bg-on-dark/10`,
  dark: `${base} border-roast bg-roast text-on-dark hover:border-terra-deep hover:bg-terra-deep`,
  ghostDark: `${base} border-roast text-roast hover:bg-roast/10`,
};
