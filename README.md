# ByF Construcciones

Sitio web estático de ByF Construcciones, empresa de remodelaciones, construcción residencial y comercial en Chile.

Sitio: https://byfconstrucciones.cl

## Estructura

```
byf-construcciones/
├── index.html                  # Página principal
├── assets/
│   ├── css/styles.css          # Estilos
│   ├── js/script.js            # Interacciones
│   └── images/
│       └── obras/              # Fotos de obras, una carpeta por categoría
│           ├── cocinas/
│           ├── revestimientos/
│           ├── techumbres/
│           ├── cercos-portones/
│           ├── pisos/
│           ├── interiores/
│           ├── electricidad/
│           ├── fachadas/
│           └── comercial/
├── docs/PLAN-MEJORAS.md        # Plan de mejoras por fases
└── .github/workflows/deploy.yml # Despliegue automático
```

## Cómo agregar una foto de obra

1. Optimiza la foto: máximo 1600 px de ancho o alto, formato JPEG.
2. Guárdala en la carpeta de su categoría dentro de `assets/images/obras/`.
3. En `index.html`, copia una tarjeta `.project-card` existente y ajusta:
   - `src`: ruta de la nueva foto.
   - `alt`: descripción breve de la obra.
   - Título de la obra.
   - `data-category`: `remodeling`, `construction`, `interior` o `commercial`.
4. Haz commit y push a `main`.

## Despliegue

Cada push a `main` despliega el sitio en GitHub Pages mediante GitHub Actions (`.github/workflows/deploy.yml`).

Para configurarlo por primera vez: en el repositorio, ve a Settings > Pages y elige "GitHub Actions" como fuente.
