# TerraCoffe

Sitio web de TerraCoffe, una cafetería de especialidad ficticia con tostadora propia en Palermo, Ciudad Autónoma de Buenos Aires.

Hecho con **Next.js 16** (App Router), **React 19**, **TypeScript** y **Tailwind CSS 4**. Se publica en Vercel.

## Páginas

- **Inicio** (`/`): hero con video de fondo y estado de apertura en hora de Buenos Aires, menú con filtro por categoría (queda en la URL: `?cat=frios`), accesos a Historia y Origen, el local con horarios y cómo llegar.
- **Historia** (`/historia`): el origen del lugar con línea de tiempo.
- **Origen** (`/origen`): mapa interactivo (Leaflet y OpenStreetMap) con las tres fincas, las rutas hasta Palermo y la distancia a cada una.

## Desarrollo

```bash
npm install
npm run dev
```

Abrí http://localhost:3000.

Para generar la versión estática (carpeta `out/`):

```bash
npm run build
```

## Variables de entorno

Ninguna es obligatoria (ver `.env.example`).

- `NEXT_PUBLIC_SITE_URL`: dominio propio, para las vistas previas al compartir. Si no se define, en Vercel se usa el dominio de producción del proyecto (`VERCEL_PROJECT_PRODUCTION_URL`, que Vercel define solo) y en local `http://localhost:3000`.
- `NEXT_PUBLIC_BASE_PATH`: solo si se publica en un subdirectorio. En Vercel no se usa.

## Estructura

```
app/               páginas (layout, inicio, historia, origen) y estilos globales
  globals.css      tokens de diseño (@theme de Tailwind, colores en OKLCH) y estilos del mapa
components/        Header, Hero, MenuSection, OriginMap, etc.
lib/               datos del menú y orígenes, horarios, clases de botones
public/assets/     fotos (generadas con IA y de Pexels) y video del hero (Pexels)
PRODUCT.md         contexto de marca y principios de diseño
```

## Notas

- Tipografías: Young Serif y Hanken Grotesk, servidas con `next/font`.
- Imágenes: hero, interior, tostadora y latte generadas con IA; fachada, granos, dulce y filtrado de Pexels (licencia gratuita). El video del hero es de Pexels.
- El mapa base es el servidor público de OpenStreetMap, con un filtro CSS para oscurecerlo. Para tráfico alto conviene un proveedor de teselas con clave.
- TerraCoffe y las personas mencionadas son ficticias.
