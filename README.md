# Portafolio Personal — Dilan Solórzano

> Un portafolio web que rompe con lo convencional: una estantería interactiva de libros, escenas sincronizadas con fondo y música, estética neon por tema y un modal futurista con chibis.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React%20Router-7-CA4245?logo=reactrouter&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-Variables-1572B6?logo=css3&logoColor=white)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)
![Versión](https://img.shields.io/badge/versión-1.0.0-brightgreen)

---

## ✦ Sitio en vivo

Despliegue en Vercel (rewrites configurados en `vercel.json` para React Router).

## ✦ Stack

| Tecnología | Detalle |
|---|---|
| React 19 | UI principal |
| Vite 8 | Bundler y dev server |
| React Router 7 | Rutas (`/`, `/experiencia`, 404) |
| CSS Custom Properties | Sistema de temas dinámico (sin frameworks CSS) |
| Font Awesome (CDN) | Iconos del reproductor (atrás / pausa / adelante) |
| ffmpeg | Fondos 4K optimizados a 1080p H.264 para baja gama |

## ✦ Características

- **Intro cinematográfica** en `/experiencia`: video de fondo con su propia música incorporada.
- **Escenas sincronizadas:** cada escena une un fondo (video/imagen) y una música. Al terminar la música, cambian fondo y audio al mismo tiempo.
- **Fondos en bucle:** el video de fondo se repite si la canción dura más (excepto el primero, `fondo.mp4`).
- **Estética adaptativa por escena:** toda la paleta (panel, libros, modal, sombras, acentos) cambia según el tema de la escena, definido en `src/data/temas.js`. Sin "modo claro/oscuro" — los colores derivan del fondo activo.
- **Estantería futurista con libros neon:** caja con scroll interno elegante, libros con lomo vertical y brillo del color de acento de la escena. El libro brilla en hover/foco.
- **Modal "pegarmina" renovado:** cambio automático a la estética del tema activo, contenido centrado y chibi posicionado en la esquina inferior derecha (`position: absolute`).
- **Chibis sin fondo (PNG)** de `public/imagenes/chibi/`, rotación determinística por proyecto.
- **Reproductor de música** discreto integrado: sólo botones atrás / pausa / adelante, oculto hasta que aparece la estantería (aparece con el mismo fundido y retraso).
- **Cambio de escena con cooldown de 5 segundos** tras cada cambio manual, para evitar lags en equipos de baja gama.
- **Aviso de móvil:** en celulares se pide usar una computadora para la experiencia completa.
- **Precarga inteligente:** la página de inicio sólo precarga lo esencial; el resto carga bajo demanda (`preload="none"`), acelerado por GPU (`translateZ(0)`).

---

## ✦ Rutas

| Ruta | Descripción |
|---|---|
| `/` | Portafolio: precarga de recursos y carga progresiva |
| `/experiencia` | Escena interactiva: video de fondo, estantería de proyectos, reproductor |
| `*` | Página 404: `<NoEncontrado />` |

---

## ✦ Cómo agregar contenido

### Agregar un nuevo proyecto
Edita `src/data/proyectos.js`:

```js
{
    id: 9,
    titulo: "Mi proyecto",
    descripcion: "Detalle completo del proyecto...",
    tecnologias: ["REACT", "JS"],
    imagen: "/imagenes/proyectos/mi-proyecto.png",
    url: "https://mi-proyecto.vercel.app/"
}
```

### Agregar una escena (fondo + música)
1. Copia los archivos: audio en `public/audios/`, fondo en `public/fondos/` (`fondo1.mp4`, `fondo2.mp4`, ...).
2. Registra la escena en `src/data/escenas.js` con su `temaId`.
3. Define la paleta en `src/data/temas.js` (o pásalo a otra IA para que la ajuste al fondo).

---

## ✦ Scripts

```bash
# Desarrollo con hot reload
npm run dev

# Lint (ESLint)
npm run lint

# Build de producción
npm run build

# Previsualizar el build
npm run preview
```

## ✦ Estructura de `src/`

```
src/
├── components/
│   ├── AvisoMovil/      # Aviso de uso desde computadora en móvil
│   ├── DivEstetica/     # Caja futurista con libros y scroll
│   ├── Modal/           # Modal del proyecto (chibis + estética del tema)
│   └── ReproductorMusica/  # Reproductor atrás / pausa / adelante
├── data/                # escenas, temas, proyectos, chibis, mensajes
├── hooks/               # usePrecarga, useEstetica
├── pages/               # Inicio, Experiencia, NoEncontrado
└── assets/              # Imágenes (ch.estica inicial, proyectos)
```

## ✦ Notas de rendimiento

- Fondos codificados a **1080p H.264** (`ffmpeg -crf 20 -preset slow`) — decodificables por hardware.
- Los elementos de fondo usan `translateZ(0)` + `will-change` para composición por GPU.
- Recursos pesados cargan bajo demanda; la página de inicio sólo precarga lo esencial para evitar cargas masivas.

---

## ✦ Créditos

- Proyecto de portafolio personal de **Dilan Solórzano**.
- Desarrollado con React + Vite y herramientas de código abierto.

## ✦ Licencia

Uso libre para fines educativos y de inspiración. Atribución apreciada.
