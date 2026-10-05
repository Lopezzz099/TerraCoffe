# TerraCoffe

Sitio web de TerraCoffe, una cafetería de especialidad ficticia con tostadora propia en Palermo, Ciudad Autónoma de Buenos Aires.

Es un proyecto estático (HTML, CSS y JS), sin build ni dependencias.

## Páginas

- **Inicio** (`index.html`): hero con video de fondo y estado de apertura en hora de Buenos Aires, menú con filtro por categoría (queda en la URL: `?cat=frios`), accesos a Historia y Origen, el local con horarios y cómo llegar.
- **Historia** (`historia.html`): el origen del lugar con línea de tiempo.
- **Origen** (`origen.html`): mapa interactivo (Leaflet y OpenStreetMap) con las tres fincas, las rutas hasta Palermo y la distancia a cada una.

## Correrlo en local

```bash
npx serve .
```

## Estructura

```
index.html, historia.html, origen.html
css/styles.css     tokens (OKLCH), tipografía, layout
js/main.js         navegación móvil, video del hero, filtro del menú, horarios
js/map.js          mapa de orígenes
assets/img/        fotos (generadas con IA y de Pexels)
assets/video/      video del hero (Pexels)
PRODUCT.md         contexto de marca y principios de diseño
```

## Notas

- Tipografías: Young Serif y Hanken Grotesk (Google Fonts).
- Imágenes: hero, interior, tostadora y latte generadas con IA; fachada, granos, dulce y filtrado de Pexels (licencia gratuita). El video del hero es de Pexels.
- TerraCoffe y las personas mencionadas son ficticias.
