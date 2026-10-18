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
- Confirmado: más de 30 años de oficio. Testimonios eliminados hasta tener reseñas reales en Google.

### Fase 3 — Galería y lightbox (Sonnet) ✅ (en main)
- Filtros acordes a las obras reales: Cocinas, Techumbres, Cercos y portones, Revestimientos y pisos, Otros.
- Galería ampliada a 26 fotos reales, con categorías reasignadas según la foto.
- Lightbox accesible propio (`role="dialog"`, foco gestionado, Escape, flechas, swipe táctil, contador y navegación solo entre las fotos visibles según el filtro).
- `aria-label` en los botones de WhatsApp y de foto ampliada.
- Antes/Después corregido: "Antes" a la izquierda y "Después" a la derecha.

### Fase 4 — Rendimiento (Sonnet) ✅ (en main)
- Todas las fotos en `<picture>` con WebP (`-800.webp` 800w y `.webp` 1600w) y JPG como respaldo; `sizes` ajustado a cada sección.
- `width`/`height` intrínsecos en cada `<img>`; el CSS sigue controlando el tamaño (`picture { display: contents }`).
- Hero con `fetchpriority="high"` y `<link rel="preload">` de la imagen WebP.
- Logo optimizado (`icon-256.webp`/`.png`, 167x256) en lugar de `icon.png` (219 KB); se elimina el archivo original.
- Font Awesome 6.0.0-beta3 actualizado a 6.5.2 estable (con `crossorigin` y `referrerpolicy`).
- Se quita el `preconnect` a Google Fonts, que no se usaba (el sitio usa fuentes del sistema).
- `aos.js` y `script.js` con `defer`.

### Fase 5 — SEO local y conversión (Sonnet + Haiku) ✅ (en main)
- Sin redes sociales: se eliminan los bloques de Facebook/Twitter/Instagram/LinkedIn y los meta `twitter:*`; en el footer queda un botón "Escríbanos por WhatsApp".
- Todos los botones de cotizar apuntan a `wa.me` con mensaje prellenado; las tarjetas de galería incluyen el título del proyecto (armado por JS, con href genérico de respaldo).
- Contacto con datos del Perfil de Google: Jorge González Bastías 4292, Macul; horario Lu-Vi 9:00-18:00 y Sá 9:00-13:00; teléfono clicable.
- Mapa de Google embebido (sin API key) y botones "Cómo llegar" y "Ver opiniones en Google".
- `<head>`: title y description con Macul/Santiago, meta geo, `og:locale` y `og:site_name`.
- JSON-LD `GeneralContractor` con nombre exacto del perfil, `@id`, dirección completa, `geo`, `hasMap`, `openingHoursSpecification`, `areaServed`, `knowsAbout` y `makesOffer` (sin `sameAs` ni `aggregateRating`).
- Sección "Preguntas frecuentes" (`#faq`) con `<details>` y JSON-LD `FAQPage`.
- `llms.txt` en la raíz con datos del negocio y enlaces a secciones.

### Fase 6 — Accesibilidad y pulido (Haiku) ✅ (en main)
- Footer: columna "Servicios" con los servicios reales (enlazados a `#projects` y `#services`) y "Preguntas frecuentes" (`#faq`) en "Enlaces Rápidos".
- Año del copyright dinámico (`#year`, con `new Date().getFullYear()` en `script.js`).
- Enlace "Saltar al contenido" (`.skip-link`), visible solo con foco; el contenido principal va en `<main id="contenido">`.
- Menú móvil como `<button>` con `aria-label`, `aria-expanded` (se actualiza al abrir y cerrar) y `aria-controls="menu-principal"`.
- Flechas del slider de testimonios como `<button>` con `aria-label`; slider antes/después con `role="img"` y nombre accesible.
- `aria-hidden="true"` en todos los iconos decorativos `<i class="fa...">`.
- Foco visible global (`a`, `button`, `summary`) con `--accent-color`, outline 3px y offset 2px.
- `@media (prefers-reduced-motion: reduce)` que desactiva animaciones, transiciones y el scroll suave.
- Pendiente: revisión en móvil real y Lighthouse ≥ 90 (no medidos en esta fase).

### Fase 7 — UI orientada a conversión ✅
- Hero rediseñado: subtítulo "Maestro constructor en Macul · Más de 30 años de oficio", H1 concreto, CTA grande verde "Pedir presupuesto por WhatsApp" + "Llamar", y 3 sellos de confianza (30 años de oficio, presupuesto sin compromiso, trato directo con el maestro). CTA a ancho completo y apilados en móvil.
- Franja de confianza bajo el hero (4 ítems, 2 columnas en móvil).
- Nosotros reescrito como historia de don Fabián Muñoz Andaur (empezó a los 18 años, 51 años hoy, más de 30 de oficio), con 4 puntos sin promesas de garantía, plazos ni cifras.
- Servicios reales (cocinas, techumbres y hojalatería, cercos y portones, revestimientos y pisos, eléctricas, mantenciones) con foto propia y botón "Cotizar este servicio" que abre WhatsApp con el servicio en el mensaje; se eliminan los servicios genéricos y los enlaces sin destino. Nota visible: los valores se cotizan tras evaluar el espacio, sin publicar precios.
- Nueva sección "Cómo trabajamos" (`#proceso`) con 4 pasos y CTA.
- Galería: 9 fotos iniciales por filtro y botón "Ver más trabajos"; al cambiar de filtro vuelve a 9; el lightbox recorre solo las tarjetas visibles. Orden intercalado por categoría para que las primeras 9 muestren variedad. Subtítulo "Fotos reales de trabajos hechos por nosotros."
- CTA final antes de las preguntas frecuentes (WhatsApp + llamar).
- Barra fija inferior en móvil (≤768px) con "Llamar" y "WhatsApp"; se oculta el botón flotante de WhatsApp en móvil y el body tiene espacio inferior.
- Menú: "Cómo trabajamos" y "Trabajos" (reemplaza "Proyectos" y "Antes/Después" en el menú); botón verde "Cotizar" en el header; menú hamburguesa ahora hasta 992px para que no se desborde.
- Fondos alternados entre secciones, títulos más grandes, botones táctiles de al menos 48px; un solo H1 (el logo pasa a `div`).
- Footer con línea "Macul, Santiago · Lu–Vi 9:00–18:00 · Sá 9:00–13:00" y texto actualizado.
- FAQ y FAQPage JSON-LD con la nota de valores; JSON-LD con `founder` (Fabián Muñoz Andaur); `llms.txt` actualizado.

## Pendientes en el Perfil de Google (los hace el dueño)
- Subir fotos de obras al perfil (las de `assets/images/obras/`).
- Agregar los servicios en el perfil.
- Pedir reseñas a clientes con el enlace "Solicitar opiniones".
- Verificar que el sitio web del perfil sea https://byfconstrucciones.cl.
