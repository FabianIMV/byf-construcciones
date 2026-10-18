# Plan de mejora — ByF Construcciones

Mejora incremental: **una fase = un PR pequeño y desplegable**. Cada fase se cierra (merge) antes de empezar la siguiente.

Roles:
- **Opus (orquestador):** define el alcance de cada fase, clasifica material, revisa y fusiona.
- **Sonnet:** tareas medianas (secciones de HTML/CSS/JS, lógica).
- **Haiku:** tareas chicas y mecánicas (textos, README, metadatos, limpieza).

## Fotos reales clasificadas (`assets/images/obras/`)

| Carpeta | Contenido |
|---|---|
| `cocinas/` | Cocina con muebles oscuros terminada (8) + cocina antes (1) |
| `revestimientos/` | Cerámica de muros: en obra y terminada (5) |
| `interiores/` | Revestimiento de madera (1) |
| `pisos/` | Porcelanato y cerámico (2) |
| `techumbres/` | Estructura, tejas, hojalatería, canal (5) |
| `cercos-portones/` | Cercos y portones de madera con estructura metálica (8) |
| `electricidad/` | Tablero eléctrico (1) |
| `fachadas/` | Fachada con andamio, bajada de aguas, pilar (3) |
| `comercial/` | Baños comerciales (1) |

Se seleccionaron 35 de 69 fotos (se descartaron duplicados, desenfocadas y detalles poco vistosos). Optimizadas a máx. 1600 px, JPEG progresivo q78.

## Fases

### Fase 1 — Fotos reales en lugar de imágenes IA ✅ (mergeada)
- Hero, "Nosotros", servicios, antes/después y galería con fotos reales.
- Galería ampliada con categorías nuevas (techumbres, cercos/portones).
- Testimonios: se quitan los rostros IA (avatar con iniciales).
- Se eliminan las imágenes IA que quedan sin uso.

### Fase 2 — Contenido y confianza (Haiku) ✅ (en main)
- Canonical, `og:url` y `twitter:url` apuntan al dominio `https://byfconstrucciones.cl/`.
- Schema `GeneralContractor` con dirección, horario y área de servicio.
- Se quitó `aggregateRating` (reseñas no verificables).
- README limpio (se eliminó la plantilla de GitLab).
- `robots.txt` y `sitemap.xml` agregados.
- Pendiente del dueño: confirmar "+15 años" y entregar testimonios reales (nombre y comuna).

### Fase 3 — Galería y lightbox (Sonnet) ✅ (en main)
- Filtros acordes a las obras reales: Cocinas, Techumbres, Cercos y portones, Revestimientos y pisos, Otros.
- Galería ampliada a 26 fotos reales, con categorías reasignadas según la foto.
- Lightbox accesible propio (`role="dialog"`, foco gestionado, Escape, flechas, swipe táctil, contador y navegación solo entre las fotos visibles según el filtro).
- `aria-label` en los botones de WhatsApp y de foto ampliada.
- Antes/Después corregido: "Antes" a la izquierda y "Después" a la derecha.

### Fase 4 — Rendimiento (Sonnet) ✅
- Todas las fotos en `<picture>` con WebP (`-800.webp` 800w y `.webp` 1600w) y JPG como respaldo; `sizes` ajustado a cada sección.
- `width`/`height` intrínsecos en cada `<img>`; el CSS sigue controlando el tamaño (`picture { display: contents }`).
- Hero con `fetchpriority="high"` y `<link rel="preload">` de la imagen WebP.
- Logo optimizado (`icon-256.webp`/`.png`, 167x256) en lugar de `icon.png` (219 KB); se elimina el archivo original.
- Font Awesome 6.0.0-beta3 actualizado a 6.5.2 estable (con `crossorigin` y `referrerpolicy`).
- Se quita el `preconnect` a Google Fonts, que no se usaba (el sitio usa fuentes del sistema).
- `aos.js` y `script.js` con `defer`.

### Fase 5 — SEO local y conversión (Sonnet + Haiku)
- Schema `LocalBusiness` completo (comuna/área de servicio, horario).
- Formulario de contacto funcional (Formspree o WhatsApp) y botón flotante de WhatsApp.

### Fase 6 — Accesibilidad y QA (Haiku)
- `alt` descriptivos, contraste, foco visible, navegación con teclado.
- Revisión en móvil y Lighthouse ≥ 90.
