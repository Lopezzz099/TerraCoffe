# TerraCoffe

Sitio web de TerraCoffe, una cafetería de especialidad ficticia con tostadora propia en Palermo, Ciudad Autónoma de Buenos Aires.

Es un proyecto estático (HTML, CSS y JS), sin build ni dependencias.

## Qué incluye

- Hero con fotografía, horarios y estado de apertura en hora de Buenos Aires
- Historia del lugar con línea de tiempo
- Orígenes de los granos
- Menú con filtro por categoría (la categoría queda en la URL: `?cat=frios`)
- El local y horarios
- Cómo llegar

## Correrlo en local

```bash
npx serve .
```

## Estructura

```
index.html
css/styles.css     tokens (OKLCH), tipografía, layout
js/main.js         navegación móvil, filtro del menú, horarios
assets/img/        fotografías generadas con IA
PRODUCT.md         contexto de marca y principios de diseño
```

## Notas

- Tipografías: Young Serif y Hanken Grotesk (Google Fonts).
- Las imágenes fueron generadas con IA. TerraCoffe y las personas mencionadas son ficticias.
